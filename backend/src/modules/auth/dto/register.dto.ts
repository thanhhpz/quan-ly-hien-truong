import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    ten_dang_nhap: string;

    @IsString()
    @IsNotEmpty()
    mat_khau: string;

    @IsString()
    @IsNotEmpty()
    ho_ten: string;

    @IsOptional()
    @IsString()
    so_dien_thoai?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}