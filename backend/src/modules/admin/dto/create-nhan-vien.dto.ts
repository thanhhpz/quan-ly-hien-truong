import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateNhanVienDto {
  @IsString()
  @IsNotEmpty()
  ten_dang_nhap: string;

  @IsString()
  @MinLength(6)
  mat_khau: string;

  @IsString()
  @IsNotEmpty()
  ho_ten: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  so_dien_thoai?: string;

  @IsInt()
  ma_vai_tro: number;
}