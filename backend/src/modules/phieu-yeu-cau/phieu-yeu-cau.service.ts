import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePhieuDto } from './dto/create-phieu.dto.js';

@Injectable()
export class PhieuYeuCauService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // TẠO PHIẾU MỚI (Khách hàng)
  // ============================================
  async create(dto: CreatePhieuDto, khachHangId: number) {
  // 1. Kiểm tra khách hàng
  const khachHang = await this.prisma.khach_hang.findUnique({
    where: { ma_nguoi_dung: khachHangId },
  });
  if (!khachHang) {
    throw new BadRequestException('Chỉ khách hàng mới được tạo phiếu yêu cầu');
  }

  // 2. Kiểm tra dịch vụ
  const dichVu = await this.prisma.dich_vu.findUnique({
    where: { ma_dich_vu: dto.ma_dich_vu },
  });
  if (!dichVu) throw new NotFoundException('Dịch vụ không tồn tại');

  // ⬇️ 3. TỰ ĐỘNG TẠO ĐỊA CHỈ MỚI TỪ TEXT
  const diaChi = await this.prisma.dia_chi.create({
    data: {
      so_nha: dto.so_nha,
      // Tạm thời gán cứng ma_duong = 1 (sẽ nâng cấp sau khi làm module địa chỉ)
      dc_da: 1, 
    },
  });

  // 4. Tạo phiếu
  const phieu = await this.prisma.phieu_yeu_cau.create({
    data: {
      mo_ta_su_co: dto.mo_ta_su_co,
      anh_su_co: dto.anh_su_co,
      khung_gio_mong_muon: dto.khung_gio_mong_muon,
      trang_thai_phieu: 'CHO_XU_LY',
      thoi_gian_tao_phieu: new Date(),
      ma_khach_hang: khachHangId,
      ma_dia_chi: diaChi.ma_dia_chi, // ⬅️ Dùng địa chỉ vừa tạo
      ma_dich_vu: dto.ma_dich_vu,
    },
    include: {
      dich_vu: true,
      dia_chi: true,
    },
  });

  return {
    message: 'Đặt dịch vụ thành công!',
    phieu,
  };
}
  // ============================================
  // LẤY DANH SÁCH PHIẾU CỦA KHÁCH HÀNG (Của tôi)
  // ============================================
  async findByKhachHang(khachHangId: number) {
    return this.prisma.phieu_yeu_cau.findMany({
      where: { ma_khach_hang: khachHangId },
      include: {
        dich_vu: true,
        dia_chi: {
          include: {
            duong: true,
          },
        },
      },
      orderBy: { thoi_gian_tao_phieu: 'desc' },
    });
  }

  // ============================================
  // XEM CHI TIẾT PHIẾU
  // ============================================
  async findOne(maPhieu: number, khachHangId: number) {
    const phieu = await this.prisma.phieu_yeu_cau.findFirst({
      where: {
        ma_phieu_yeu_cau: maPhieu,
        ma_khach_hang: khachHangId, // Đảm bảo khách chỉ xem phiếu của mình
      },
      include: {
        dich_vu: true,
        dia_chi: {
          include: {
            duong: {
              include: {
                phuong_xa: {
                  include: {
                    quan_huyen_tp: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!phieu) {
      throw new NotFoundException('Không tìm thấy phiếu yêu cầu');
    }

    return phieu;
  }
}