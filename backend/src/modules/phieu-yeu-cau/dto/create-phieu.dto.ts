import { IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePhieuDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mô tả sự cố' })
  @MinLength(10, { message: 'Mô tả sự cố phải có ít nhất 10 ký tự' })
  mo_ta_su_co: string;

  @IsOptional()
  @IsString()
  anh_su_co?: string;

  @IsOptional()
  @IsString()
  khung_gio_mong_muon?: string;

  // ⬇️ THAY ĐỔI: Nhập địa chỉ bằng text thay vì chọn ID
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ' })
  so_nha: string;          // Số nhà

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tên đường' })
  ten_duong: string;       // Tên đường

  @IsInt({ message: 'Vui lòng chọn dịch vụ' })
  ma_dich_vu: number;
}