import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { ListNoticesDto } from './dto/list-notices.dto';
import { PaginatedResult } from '../../common/utils/pagination.dto';
import { Role, NoticeAudience } from '@prisma/client';

@Injectable()
export class NoticesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create notice
   * SCHOOL_ADMIN/TEACHER can send notices
   * Target by role or class
   */
  async create(
    createNoticeDto: CreateNoticeDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can create notices',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const { title, message, audience, classId } = createNoticeDto;

    // If classId is provided, verify it belongs to school
    if (classId) {
      const classEntity = await this.prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${classId} not found`);
      }

      if (classEntity.schoolId !== currentUser.schoolId) {
        throw new ForbiddenException(
          'Access denied. You can only create notices for classes in your school',
        );
      }
    }

    // Create notice
    const notice = await this.prisma.notice.create({
      data: {
        title,
        message,
        audience,
        schoolId: currentUser.schoolId,
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return notice;
  }

  /**
   * List notices
   * Users can view notices based on their role and class
   */
  async findAll(
    listNoticesDto: ListNoticesDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10, audience, classId } = listNoticesDto;
    const skip = (page - 1) * limit;

    const where: any = {
      schoolId: currentUser.schoolId,
    };

    // Filter by audience
    if (audience) {
      where.audience = audience;
    } else {
      // Filter by user's role if no specific audience is requested
      if (currentUser.role === Role.STUDENT) {
        where.audience = { in: [NoticeAudience.ALL, NoticeAudience.STUDENTS] };
      } else if (currentUser.role === Role.TEACHER) {
        where.audience = { in: [NoticeAudience.ALL, NoticeAudience.TEACHERS] };
      } else if (currentUser.role === Role.PARENT) {
        where.audience = { in: [NoticeAudience.ALL, NoticeAudience.PARENTS] };
      }
    }

    // Filter by class if provided
    if (classId) {
      // Verify class belongs to school
      const classEntity = await this.prisma.class.findUnique({
        where: { id: classId },
      });

      if (!classEntity || classEntity.schoolId !== currentUser.schoolId) {
        throw new ForbiddenException(
          'Access denied. You can only view notices for classes in your school',
        );
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.notice.findMany({
        where,
        skip,
        take: limit,
        include: {
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notice.count({ where }),
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
   * Get notice by ID
   */
  async findOne(
    id: string,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    const notice = await this.prisma.notice.findUnique({
      where: { id },
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    // Verify notice belongs to user's school
    if (notice.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException(
        'Access denied. You can only view notices from your school',
      );
    }

    // Verify user has access based on audience
    if (notice.audience !== NoticeAudience.ALL) {
      if (
        (currentUser.role === Role.STUDENT &&
          notice.audience !== NoticeAudience.STUDENTS) ||
        (currentUser.role === Role.TEACHER &&
          notice.audience !== NoticeAudience.TEACHERS) ||
        (currentUser.role === Role.PARENT &&
          notice.audience !== NoticeAudience.PARENTS)
      ) {
        throw new ForbiddenException(
          'Access denied. This notice is not intended for your role',
        );
      }
    }

    return notice;
  }

  /**
   * Update notice
   * Only SCHOOL_ADMIN/TEACHER can update notices they created
   */
  async update(
    id: string,
    updateNoticeDto: UpdateNoticeDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can update notices',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const notice = await this.prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    // Verify notice belongs to user's school
    if (notice.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException(
        'Access denied. You can only update notices from your school',
      );
    }

    // If classId is being updated, verify it belongs to school
    if (updateNoticeDto.classId) {
      const classEntity = await this.prisma.class.findUnique({
        where: { id: updateNoticeDto.classId },
      });

      if (!classEntity || classEntity.schoolId !== currentUser.schoolId) {
        throw new ForbiddenException(
          'Access denied. You can only update notices for classes in your school',
        );
      }
    }

    const updatedNotice = await this.prisma.notice.update({
      where: { id },
      data: updateNoticeDto,
      include: {
        school: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updatedNotice;
  }

  /**
   * Delete notice
   * Only SCHOOL_ADMIN/TEACHER can delete notices
   */
  async remove(
    id: string,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can delete notices',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const notice = await this.prisma.notice.findUnique({
      where: { id },
    });

    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }

    // Verify notice belongs to user's school
    if (notice.schoolId !== currentUser.schoolId) {
      throw new ForbiddenException(
        'Access denied. You can only delete notices from your school',
      );
    }

    await this.prisma.notice.delete({
      where: { id },
    });

    return {
      message: 'Notice deleted successfully',
    };
  }
}
