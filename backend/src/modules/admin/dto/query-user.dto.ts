import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryUserDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['ADMIN', 'NHAN_VIEN', 'KHACH_HANG'])
  vai_tro?: string;

  @IsOptional()
  @IsIn(['HOAT_DONG', 'BI_KHOA'])
  trang_thai?: string;
}