import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  ten_dang_nhap: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  mat_khau: string;
}