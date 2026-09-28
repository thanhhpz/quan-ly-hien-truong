// lib/auth.ts
export type UserRole =
  | 'KHACH_HANG'
  | 'KY_THUAT_VIEN'
  | 'TO_TRUONG'
  | 'DIEU_PHOI_VIEN'
  | 'QUAN_LY_KHU_VUC'
  | 'GIAM_DOC_THANH_PHO'
  | 'TONG_DAI_VIEN'
  | 'KE_TOAN'
  | 'QUAN_LY_KHO'
  | 'QUAN_TRI_VIEN';

export interface User {
  id?: number | string;
  ho_ten?: string;
  ten_dang_nhap: string;
  email?: string;
  so_dien_thoai?: string;
  vai_tro: UserRole;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!parsed.vai_tro) return null;
    return parsed as User;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setSession(user: User, accessToken: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('access_token', accessToken);
  document.cookie = `role=${user.vai_tro}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
  document.cookie = `access_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  document.cookie = 'role=; path=/; max-age=0';
  document.cookie = 'access_token=; path=/; max-age=0';
}