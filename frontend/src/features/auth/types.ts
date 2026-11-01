// features/auth/types.ts
/**
 * Định nghĩa kiểu dữ liệu cho feature Đăng nhập / Đăng ký
 */

export interface LoginPayload {
  ten_dang_nhap: string;
  mat_khau: string;
}

export interface RegisterPayload {
  ho_ten: string;
  ten_dang_nhap: string;
  email?: string;
  so_dien_thoai?: string;
  mat_khau: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    ma_nguoi_dung: string;
    ten_dang_nhap: string;
    ho_ten: string;
    vai_tro: string;
    quyen: string[];
  };
}