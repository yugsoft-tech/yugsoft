import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  driver: string;

  @IsString()
  @IsOptional()
  route?: string; // Route description/name
}
