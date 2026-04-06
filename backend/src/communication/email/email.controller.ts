import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('communication/email')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER)
  sendEmail(@Body() sendEmailDto: SendEmailDto, @CurrentUser() user: any) {
    return this.emailService.sendEmail(sendEmailDto, {
      userId: user.userId,
      role: user.role,
      schoolId: user.schoolId,
    });
  }
}
