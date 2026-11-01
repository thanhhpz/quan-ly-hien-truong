// features/admin/users/api.ts
/**
 * Các hàm gọi API cho feature Admin quản lý người dùng
 */

import { fetchApi } from '@/shared/lib/api';
import {
  DuLieuCapNhatNguoiDung,
  DuLieuTaoNhanVien,
  NguoiDung,
  VaiTro,
} from './types';

export const adminUsersApi = {
  danhSach: (query: string = '') => fetchApi(`/admin/users${query}`),

  chiTiet: (id: string): Promise<NguoiDung> => fetchApi(`/admin/users/${id}`),

  taoNhanVien: (duLieu: DuLieuTaoNhanVien) =>
    fetchApi('/admin/users/nhan-vien', {
      method: 'POST',
      body: JSON.stringify(duLieu),
    }),

  capNhat: (id: string, duLieu: DuLieuCapNhatNguoiDung) =>
    fetchApi(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(duLieu),
    }),

  doiVaiTro: (id: string, ma_vai_tro: number) =>
    fetchApi(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ ma_vai_tro }),
    }),

  doiTrangThai: (id: string, trang_thai: string) =>
    fetchApi(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ trang_thai }),
    }),

  datLaiMatKhau: (id: string) =>
    fetchApi(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  danhSachVaiTro: (): Promise<VaiTro[]> => fetchApi('/admin/roles'),
};