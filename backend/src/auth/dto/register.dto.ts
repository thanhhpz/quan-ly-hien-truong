import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  ho_ten: string;

  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  ten_dang_nhap: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  so_dien_thoai?: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  mat_khau: string;

  @IsOptional()
  @IsIn(['KHACH_HANG', 'KY_THUAT_VIEN', 'DIEU_PHOI_VIEN', 'ADMIN'], {
    message: 'Vai trò không hợp lệ',
  })
  vai_tro?: string;
}