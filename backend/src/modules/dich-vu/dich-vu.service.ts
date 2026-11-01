import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DichVuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.dich_vu.findMany({
      include: { loai_dich_vu: true },
      orderBy: { ma_dich_vu: 'asc' },
    });
  }

  async findOne(id: number) {
    const dichVu = await this.prisma.dich_vu.findUnique({
      where: { ma_dich_vu: id },
      include: { loai_dich_vu: true },
    });
    if (!dichVu) throw new NotFoundException('Dịch vụ không tồn tại');
    return dichVu;
  }
}