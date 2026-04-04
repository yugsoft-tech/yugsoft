import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SendEmailDto } from './dto/send-email.dto';
import { Role } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Send Email
   * SCHOOL_ADMIN/TEACHER can send emails
   * Target by role or class
   */
  async sendEmail(
    sendEmailDto: SendEmailDto,
    currentUser: { userId: string; role: Role; schoolId?: string },
  ) {
    if (
      currentUser.role !== Role.SCHOOL_ADMIN &&
      currentUser.role !== Role.TEACHER
    ) {
      throw new ForbiddenException(
        'Only SCHOOL_ADMIN and TEACHER can send emails',
      );
    }

    if (!currentUser.schoolId) {
      throw new ForbiddenException('User must be associated with a school');
    }

    const { subject, body, htmlBody, targetRoles, classId, emailAddresses } =
      sendEmailDto;

    // Validate at least one targeting method is provided
    if (!targetRoles && !classId && !emailAddresses) {
      throw new BadRequestException(
        'Please provide targetRoles, classId, or emailAddresses',
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
        },
        select: {
          email: true,
        },
      });

      recipients.push(...users.map((u) => u.email));
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
          'Access denied. You can only send emails to classes in your school',
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
              email: true,
            },
          },
          parents: {
            select: {
              id: true,
            },
          },
        },
      });

      const studentEmails = students.map((s) => s.user.email);
      recipients.push(...studentEmails);

      // Also get parent emails for students in the class
      const parentIds = students
        .flatMap((s) => s.parents.map((p) => p.id))
        .filter(Boolean);

      if (parentIds.length > 0) {
        const parents = await this.prisma.parent.findMany({
          where: {
            id: { in: parentIds },
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });

        const parentEmails = parents.map((p) => p.user.email);
        recipients.push(...parentEmails);
      }
    }

    // Add direct email addresses
    if (emailAddresses && emailAddresses.length > 0) {
      recipients.push(...emailAddresses);
    }

    // Remove duplicates
    recipients = [...new Set(recipients)];

    if (recipients.length === 0) {
      throw new BadRequestException('No recipients found');
    }

    // TODO: Integrate with email provider (SendGrid, AWS SES, Nodemailer, etc.)
    // For now, return the structure ready for provider integration
    const emailResult = {
      subject,
      body,
      htmlBody: htmlBody || null,
      recipients: recipients.length,
      emailAddresses: recipients,
      status: 'pending', // Will be updated by email provider
      provider: 'ready', // Indicates provider integration is ready
    };

    // In production, you would call your email provider here:
    // await this.emailProvider.send(recipients, subject, body, htmlBody);

    return {
      ...emailResult,
      note: 'Email provider integration ready. Implement email provider service to send actual emails.',
    };
  }
}
