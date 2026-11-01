import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['HOAT_DONG', 'BI_KHOA'])
  trang_thai: string;
}