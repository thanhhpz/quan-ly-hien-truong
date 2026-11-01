// src/lib/auth.ts
export type UserRole = 'ADMIN' | 'NHAN_VIEN' | 'KHACH_HANG';

export interface User {
  id?: number | string;
  ma_nguoi_dung?: string;
  ho_ten?: string;
  ten_dang_nhap: string;
  email?: string;
  so_dien_thoai?: string;
  vai_tro: UserRole;
  quyen?: string[]; // Mảng quyền từ Backend
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.vai_tro) return null;
    return parsed as User;
  } catch {
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

// Hàm kiểm tra quyền (dùng cho Frontend ẩn/hiện UI)
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user || !user.quyen) return false;
  return user.quyen.includes(permission);
}