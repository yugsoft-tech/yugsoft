import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { PaginatedResult } from '../../common/utils/pagination.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send message
   * SCHOOL_ADMIN/TEACHER can send messages
   * Basic message storage (ready for Message model integration)
   */
  async sendMessage(
    sendMessageDto: SendMessageDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can send messages',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const { receiverId, message, type } = sendMessageDto;

    // Verify receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException(`Receiver with ID ${receiverId} not found`);
    }

    // Verify receiver belongs to same school (if they have a school)
    if (receiver.schoolId && receiver.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException(
        'Access denied. You can only send messages to users in your school',
      );
    }

    const savedMessage = await this.prisma.message.create({
      data: {
        senderId: currentUser.userId,
        receiverId,
        message,
        type: type || 'text',
        schoolId: currentUser.schoolId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return savedMessage;
  }

  /**
   * List messages
   * Users can view messages they sent or received
   */
  async findAll(
    listMessagesDto: ListMessagesDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, receiverId } = listMessagesDto;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { senderId: currentUser.userId },
        { receiverId: currentUser.userId },
      ],
      schoolId: currentUser.schoolId,
    };

    if (receiverId) {
      where.AND = [
        {
          OR: [
            {
              senderId: currentUser.userId,
              receiverId,
            },
            {
              senderId: receiverId,
              receiverId: currentUser.userId,
            },
          ],
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        skip,
        take: limit,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get conversation between two users
   */
  async getConversation(
    otherUserId: string,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    // Verify other user exists
    const otherUser = await this.prisma.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      throw new NotFoundException(`User with ID ${otherUserId} not found`);
    }

    // Verify other user belongs to same school (if they have a school)
    if (otherUser.schoolId && otherUser.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException(
        'Access denied. You can only view conversations with users in your school',
      );
    }

    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUser.userId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: currentUser.userId,
          },
        ],
        schoolId: currentUser.schoolId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      otherUser: {
        id: otherUser.id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        email: otherUser.email,
        role: otherUser.role,
      },
      messages,
      total: messages.length,
    };
  }
}
