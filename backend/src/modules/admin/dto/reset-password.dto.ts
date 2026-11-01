import { IsOptional, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  mat_khau_moi?: string; // nếu không truyền → tự sinh
}