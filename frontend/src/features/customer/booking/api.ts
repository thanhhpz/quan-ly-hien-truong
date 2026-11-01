import { fetchApi } from '@/shared/lib/api';
import { DichVu } from './types';

export const bookingApi = {
  // Lấy danh sách dịch vụ
  getServices: (): Promise<DichVu[]> => fetchApi('/dich-vu'),

  // Lấy chi tiết dịch vụ
  getServiceById: (id: number): Promise<DichVu> => fetchApi(`/dich-vu/${id}`),

  // ⬇️ SỬA LẠI PHẦN NÀY: Dùng so_nha, ten_duong thay vì ma_dia_chi
  createRequest: (data: {
    mo_ta_su_co: string;
    khung_gio_mong_muon?: string;
    so_nha: string;
    ten_duong: string;
    ma_dich_vu: number;
  }) =>
    fetchApi('/phieu-yeu-cau', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};