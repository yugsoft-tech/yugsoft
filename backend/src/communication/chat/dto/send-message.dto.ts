import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsNotEmpty()
  receiverId: string; // User ID of the receiver

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  type?: string; // Optional: text, image, file, etc.
}
