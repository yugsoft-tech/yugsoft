import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendSmsDto } from './dto/send-sms.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SmsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send SMS
   * SCHOOL_ADMIN/TEACHER can send SMS
   * Target by role or class
   */
  async sendSms(
    sendSmsDto: SendSmsDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can send SMS',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const { message, targetRoles, classId, phoneNumbers } = sendSmsDto;

    // Validate at least one targeting method is provided
    if (!targetRoles && !classId && !phoneNumbers) {
      throw new BadRequestException(
        'Please provide targetRoles, classId, or phoneNumbers',
      );
    }

    let recipients: string[] = [];

    // Get recipients by role
    if (targetRoles && targetRoles.length > 0) {
      const users = await this.prisma.user.findMany({
        where: {
          schoolId: currentUser.schoolId,
          role: { in: targetRoles },
          isActive: true,
          phone: { not: null },
        },
        select: {
          phone: true,
        },
      });

      recipients.push(...users.map((u) => u.phone).filter(Boolean));
    }

    // Get recipients by class
    if (classId) {
      const classEntity = await this.prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }

      if (classEntity.schoolId !== currentUser.schoolId) {
        throw new ForbiddenException(
          'Access denied. You can only send SMS to classes in your school',
        );
      }

      const students = await this.prisma.student.findMany({
        where: {
          classId,
          schoolId: currentUser.schoolId,
        },
        include: {
          user: {
            select: {
              phone: true,
            },
          },
          parents: {
            include: {
              user: {
                select: {
                  phone: true,
                },
              },
            },
          },
        },
      });

      const studentPhones = students.map((s) => s.user.phone).filter(Boolean);
      recipients.push(...studentPhones);

      // Also get parent phones for students in the class
      const parentPhones = students
        .flatMap((s) => s.parents.map((p) => p.user.phone))
        .filter(Boolean);
      recipients.push(...parentPhones);
    }

    // Add direct phone numbers
    if (phoneNumbers && phoneNumbers.length > 0) {
      recipients.push(...phoneNumbers);
    }

    // Remove duplicates
    recipients = [...new Set(recipients)];

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found with phone numbers');
    }

    // TODO: Integrate with SMS provider (Twilio, AWS SNS, etc.)
    // For now, return the structure ready for provider integration
    const smsResult = {
      message,
      recipients: recipients.length,
      phoneNumbers: recipients,
      status: 'pending', // Will be updated by SMS provider
      provider: 'ready', // Indicates provider integration is ready
    };

    // In production, you would call your SMS provider here:
    // await this.smsProvider.send(recipients, message);

    return {
      ...smsResult,
      note: 'SMS provider integration ready. Implement SMS provider service to send actual messages.',
    };
  }
}
