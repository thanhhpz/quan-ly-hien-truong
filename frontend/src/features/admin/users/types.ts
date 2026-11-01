// features/admin/users/types.ts
/**
 * Định nghĩa kiểu dữ liệu cho feature Admin quản lý người dùng
 */

export interface NguoiDung {
  ma_nguoi_dung: number;
  ten_dang_nhap: string;
  ho_ten: string;
  email: string | null;
  so_dien_thoai?: string | null;
  vai_tro: string;
  trang_thai: string;
}

export interface VaiTro {
  ma_vai_tro: number;
  ten_vai_tro: string;
}

export interface DuLieuTaoNhanVien {
  ho_ten: string;
  ten_dang_nhap: string;
  mat_khau: string;
  email?: string;
  so_dien_thoai?: string;
  ma_vai_tro: number;
}

export interface DuLieuCapNhatNguoiDung {
  ho_ten?: string;
  email?: string;
  so_dien_thoai?: string;
}