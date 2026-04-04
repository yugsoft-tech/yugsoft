import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;
}
