import { IsOptional, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/utils/pagination.dto';

export class ListStudentsDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  @Type(() => String)
  classId?: string;

  @IsOptional()
  @IsUUID()
  @Type(() => String)
  sectionId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
