import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleInfoDto } from './dto/update-role-info.dto.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // HELPER
  // ============================================
  private async getRoleOfUser(userId: number): Promise<string | null> {
    const employee = await this.prisma.nhan_vien.findUnique({
      where: { ma_nguoi_dung: userId },
      include: { vai_tro: true },
    });
    return employee?.vai_tro?.ten_vai_tro ?? null;
  }

  // ============================================
  // USERS
  // ============================================
  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 20, q, vai_tro, trang_thai } = query;

    const where: any = {};

    if (vai_tro === 'KHACH_HANG') {
      where.nhan_vien = null;
      where.khach_hang = { isNot: null };
    } else if (vai_tro) {
      where.nhan_vien = { vai_tro: { ten_vai_tro: vai_tro } };
    }

    if (trang_thai) where.trang_thai = trang_thai;

    if (q) {
      where.OR = [
        { ho_ten: { contains: q, mode: 'insensitive' } },
        { ten_dang_nhap: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.nguoi_dung.findMany({
        where,
        select: {
          ma_nguoi_dung: true,
          ten_dang_nhap: true,
          ho_ten: true,
          email: true,
          so_dien_thoai: true,
          trang_thai: true,
          nhan_vien: { include: { vai_tro: true } },
          khach_hang: true,
        },
        orderBy: { ma_nguoi_dung: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.nguoi_dung.count({ where }),
    ]);

    return {
      data: items.map((u) => ({
        ma_nguoi_dung: u.ma_nguoi_dung.toString(),
        ten_dang_nhap: u.ten_dang_nhap,
        ho_ten: u.ho_ten,
        email: u.email,
        so_dien_thoai: u.so_dien_thoai,
        trang_thai: u.trang_thai,
        vai_tro: u.nhan_vien?.vai_tro?.ten_vai_tro ?? 'KHACH_HANG',
        ma_vai_tro: u.nhan_vien?.ma_vai_tro ?? null,
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(userId: number) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: userId },
      include: {
        nhan_vien: { include: { vai_tro: true } },
        khach_hang: true,
      },
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    return {
      ma_nguoi_dung: user.ma_nguoi_dung.toString(),
      ten_dang_nhap: user.ten_dang_nhap,
      ho_ten: user.ho_ten,
      email: user.email,
      so_dien_thoai: user.so_dien_thoai,
      trang_thai: user.trang_thai,
      vai_tro: user.nhan_vien?.vai_tro?.ten_vai_tro ?? 'KHACH_HANG',
      ma_vai_tro: user.nhan_vien?.ma_vai_tro ?? null,
    };
  }

  async createNhanVien(dto: CreateNhanVienDto) {
    const existing = await this.prisma.nguoi_dung.findFirst({
      where: {
        OR: [
          { ten_dang_nhap: dto.ten_dang_nhap },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });
    if (existing) throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại');

    const role = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: dto.ma_vai_tro },
    });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    // ❌ Chặn tạo user với role ADMIN
    if (role.ten_vai_tro === 'ADMIN') {
      throw new ForbiddenException(
        'Không thể tạo tài khoản với vai trò ADMIN. Chỉ có 1 Admin duy nhất.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.mat_khau, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.nguoi_dung.create({
        data: {
          ten_dang_nhap: dto.ten_dang_nhap,
          mat_khau: hashedPassword,
          ho_ten: dto.ho_ten,
          email: dto.email,
          so_dien_thoai: dto.so_dien_thoai,
          trang_thai: 'HOAT_DONG',
        },
      });

      await tx.nhan_vien.create({
        data: {
          ma_nguoi_dung: user.ma_nguoi_dung,
          ma_vai_tro: dto.ma_vai_tro,
        },
      });

      return user;
    });

    return {
      message: 'Tạo nhân viên thành công',
      user: {
        ma_nguoi_dung: result.ma_nguoi_dung.toString(),
        ten_dang_nhap: result.ten_dang_nhap,
        ho_ten: result.ho_ten,
        vai_tro: role.ten_vai_tro,
      },
    };
  }

  async updateRole(userId: number, maVaiTro: number, currentUserId: number) {
    // 1. Không tự đổi role của chính mình
    if (userId === currentUserId) {
      throw new BadRequestException('Không thể tự đổi vai trò của chính mình');
    }

    // 2. Không đổi role của user đang có role ADMIN
    const currentRole = await this.getRoleOfUser(userId);
    if (currentRole === 'ADMIN') {
      throw new ForbiddenException('Không thể đổi vai trò của Admin');
    }

    // 3. Không gán role ADMIN cho bất kỳ ai
    const targetRole = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: maVaiTro },
    });
    if (!targetRole) throw new NotFoundException('Vai trò không tồn tại');
    if (targetRole.ten_vai_tro === 'ADMIN') {
      throw new ForbiddenException(
        'Không thể gán vai trò ADMIN. Chỉ có 1 Admin duy nhất.',
      );
    }

    // 4. Target phải là nhân viên
    const employee = await this.prisma.nhan_vien.findUnique({
      where: { ma_nguoi_dung: userId },
    });
    if (!employee) throw new NotFoundException('Người dùng không phải nhân viên');

    // 5. Thực hiện đổi role
    await this.prisma.nhan_vien.update({
      where: { ma_nguoi_dung: userId },
      data: { ma_vai_tro: maVaiTro },
    });

    return { message: 'Cập nhật vai trò thành công' };
  }

  async updateStatus(userId: number, trangThai: string, currentUserId: number) {
    // 1. Không tự khóa chính mình
    if (userId === currentUserId) {
      throw new BadRequestException('Không thể tự khóa chính mình');
    }

    // 2. Không khóa user có role ADMIN
    const targetRole = await this.getRoleOfUser(userId);
    if (targetRole === 'ADMIN') {
      throw new ForbiddenException('Không thể khóa tài khoản Admin');
    }

    // 3. Kiểm tra user tồn tại
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: userId },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    // 4. Cập nhật
    await this.prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: userId },
      data: { trang_thai: trangThai },
    });

    return { message: 'Cập nhật trạng thái thành công' };
  }

  async resetPassword(userId: number, matKhauMoi?: string) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: userId },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    // ❌ Chặn reset password của ADMIN
    const targetRole = await this.getRoleOfUser(userId);
    if (targetRole === 'ADMIN') {
      throw new ForbiddenException(
        'Không thể reset mật khẩu của Admin. Vui lòng liên hệ trực tiếp.',
      );
    }

    const newPassword = matKhauMoi ?? Math.random().toString(36).slice(-10);
    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.nguoi_dung.update({
      where: { ma_nguoi_dung: userId },
      data: { mat_khau: hashed },
    });

    return {
      message: 'Reset mật khẩu thành công',
      mat_khau_moi: matKhauMoi ? '(đã đặt theo yêu cầu)' : newPassword,
    };
  }

  // ============================================
  // ROLES
  // ============================================
  async findAllRoles() {
    return this.prisma.vai_tro.findMany({
      include: {
        vai_tro_quyen: { include: { quyen: true } },
      },
    });
  }

  async createRole(dto: CreateRoleDto) {
    const existing = await this.prisma.vai_tro.findUnique({
      where: { ten_vai_tro: dto.ten_vai_tro },
    });
    if (existing) throw new ConflictException('Vai trò đã tồn tại');

    // ❌ Không cho tạo role tên ADMIN (đã có)
    if (dto.ten_vai_tro.trim().toUpperCase() === 'ADMIN') {
      throw new ForbiddenException('Vai trò ADMIN đã tồn tại, không thể tạo mới.');
    }

    const role = await this.prisma.vai_tro.create({
      data: { ten_vai_tro: dto.ten_vai_tro },
    });

    return { message: 'Tạo vai trò thành công', vai_tro: role };
  }

  async updateRoleInfo(roleId: number, dto: UpdateRoleInfoDto) {
    const role = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: roleId },
    });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');
    if (role.ten_vai_tro === 'ADMIN') {
      throw new ForbiddenException('Không thể sửa vai trò ADMIN gốc');
    }

    const updated = await this.prisma.vai_tro.update({
      where: { ma_vai_tro: roleId },
      data: { ten_vai_tro: dto.ten_vai_tro ?? role.ten_vai_tro },
    });

    return { message: 'Cập nhật vai trò thành công', vai_tro: updated };
  }

  async deleteRole(roleId: number) {
    const role = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: roleId },
      include: { nhan_vien: true },
    });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');
    if (role.ten_vai_tro === 'ADMIN') {
      throw new ForbiddenException('Không thể xóa vai trò ADMIN gốc');
    }
    if (role.nhan_vien.length > 0) {
      throw new BadRequestException(
        `Không thể xóa vai trò đang có ${role.nhan_vien.length} nhân viên`,
      );
    }

    await this.prisma.vai_tro.delete({ where: { ma_vai_tro: roleId } });
    return { message: 'Xóa vai trò thành công' };
  }

  async assignPermissions(roleId: number, maQuyen: number[]) {
    const role = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: roleId },
    });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    // ❌ Chặn sửa quyền của ADMIN
    if (role.ten_vai_tro === 'ADMIN') {
      throw new ForbiddenException('Không thể sửa quyền của vai trò ADMIN');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.vai_tro_quyen.deleteMany({ where: { ma_vai_tro: roleId } });
      await tx.vai_tro_quyen.createMany({
        data: maQuyen.map((mq) => ({ ma_vai_tro: roleId, ma_quyen: mq })),
        skipDuplicates: true,
      });
    });

    return {
      message: `Đã gán ${maQuyen.length} quyền cho vai trò ${role.ten_vai_tro}`,
    };
  }

  async getPermissionsOfRole(roleId: number) {
    const role = await this.prisma.vai_tro.findUnique({
      where: { ma_vai_tro: roleId },
      include: { vai_tro_quyen: { include: { quyen: true } } },
    });
    if (!role) throw new NotFoundException('Vai trò không tồn tại');

    return {
      ma_vai_tro: role.ma_vai_tro,
      ten_vai_tro: role.ten_vai_tro,
      quyen: role.vai_tro_quyen.map((vtq) => ({
        ma_quyen: vtq.ma_quyen,
        ten_quyen: vtq.quyen.ten_quyen,
        mo_ta: vtq.quyen.mo_ta,
      })),
    };
  }

  // ============================================
  // PERMISSIONS
  // ============================================
  async findAllPermissions() {
    return this.prisma.quyen.findMany();
  }

  // ============================================
  // STATS
  // ============================================
  async getStats() {
    const [
      tongNguoiDung,
      tongNhanVien,
      tongKhachHang,
      tongVaiTro,
      tongQuyen,
      userHoatDong,
      userBiKhoa,
    ] = await Promise.all([
      this.prisma.nguoi_dung.count(),
      this.prisma.nhan_vien.count(),
      this.prisma.khach_hang.count(),
      this.prisma.vai_tro.count(),
      this.prisma.quyen.count(),
      this.prisma.nguoi_dung.count({ where: { trang_thai: 'HOAT_DONG' } }),
      this.prisma.nguoi_dung.count({ where: { trang_thai: 'BI_KHOA' } }),
    ]);

    return {
      tong_nguoi_dung: tongNguoiDung,
      tong_nhan_vien: tongNhanVien,
      tong_khach_hang: tongKhachHang,
      tong_vai_tro: tongVaiTro,
      tong_quyen: tongQuyen,
      user_hoat_dong: userHoatDong,
      user_bi_khoa: userBiKhoa,
    };
  }
}