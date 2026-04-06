import { Module } from '@nestjs/common';
import { NoticesModule } from './notices/notices.module';
import { SmsModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { ChatModule } from './chat/chat.module';
import { AnnouncementsModule } from './announcements/announcements.module';

@Module({
  imports: [NoticesModule, SmsModule, EmailModule, ChatModule, AnnouncementsModule],
})
export class CommunicationModule {}

