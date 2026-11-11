import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, vai_tro?: string, trang_thai?: string) {
    const where: any = {};

    if (vai_tro && vai_tro !== 'ALL') {
      where.vai_tro = vai_tro;
    }

    if (trang_thai && trang_thai !== 'ALL') {
      where.trang_thai = trang_thai;
    }

    if (search) {
      where.OR = [
        { ho_ten: { contains: search, mode: 'insensitive' } },
        { ten_dang_nhap: { contains: search, mode: 'insensitive' } },
      ];
      const searchId = parseInt(search, 10);
      if (!isNaN(searchId)) {
        where.OR.push({ ma_nguoi_dung: searchId });
      }
    }

    return this.prisma.nguoi_dung.findMany({
      where,
      select: {
        ma_nguoi_dung: true,
        ten_dang_nhap: true,
        ho_ten: true,
        email: true,
        so_dien_thoai: true,
        vai_tro: true,
        trang_thai: true,
      },
      orderBy: {
        ma_nguoi_dung: 'asc',
      },
    });
  }

  async toggleStatus(id: number, currentUserId: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: id },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Chặn Admin tự khóa chính mình
    if (user.ma_nguoi_dung === currentUserId) {
      throw new BadRequestException('Bạn không thể tự khóa tài khoản của chính mình!');
    }

    const newStatus = user.trang_thai === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG';

    return this.prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: id },
      data: { trang_thai: newStatus },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        trang_thai: true,
      },
    });
  }
}