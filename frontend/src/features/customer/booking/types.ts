export interface LoaiDichVu {
  ma_loai_dich_vu: number;
  ten_loai_dich_vu: string;
  mo_ta_ldv?: string;
}

export interface DichVu {
  ma_dich_vu: number;
  ten_dich_vu: string;
  thoi_gian_xu_ly_du_kien: string;
  ma_loai_dich_vu: number;
  loai_dich_vu?: LoaiDichVu;
}