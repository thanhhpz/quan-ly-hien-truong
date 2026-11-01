import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleInfoDto {
  @IsOptional()
  @IsString()
  ten_vai_tro?: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;
}