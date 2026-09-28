export type UserRole =
  | 'KY_THUAT_VIEN'
  | 'TO_TRUONG'
  | 'DIEU_PHOI_VIEN'
  | 'QUAN_LY_KHU_VUC'
  | 'GIAM_DOC_THANH_PHO'
  | 'TONG_DAI_VIEN'
  | 'KE_TOAN'
  | 'QUAN_LY_KHO'
  | 'QUAN_TRI_VIEN'
  | 'KHACH_HANG';

export interface User {
  ma_nguoi_dung: string;
  ten_dang_nhap: string;
  ho_ten: string | null;
  vai_tro: UserRole | null;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const data = localStorage.getItem('user');

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}