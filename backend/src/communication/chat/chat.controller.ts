import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ListMessagesDto } from './dto/list-messages.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Role } from '@prisma/client';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  @Roles(Role.SCHOOL_ADMIN, Role.TEACHER)
  sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @CurrentUser() user: any,
  ) {
    return this.chatService.sendMessage(sendMessageDto, {
      userId: user.userId,
      role: user.role,
      schoolId: user.schoolId,
    });
  }

  @Get()
  findAll(@Query() listMessagesDto: ListMessagesDto, @CurrentUser() user: any) {
    return this.chatService.findAll(listMessagesDto, {
      userId: user.userId,
      role: user.role,
      schoolId: user.schoolId,
    });
  }

  @Get('conversation/:userId')
  getConversation(@Param('userId') userId: string, @CurrentUser() user: any) {
    return this.chatService.getConversation(userId, {
      userId: user.userId,
      role: user.role,
      schoolId: user.schoolId,
    });
  }
}
