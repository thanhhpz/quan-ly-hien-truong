import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { ho_ten, ten_dang_nhap, email, so_dien_thoai, mat_khau, vai_tro } = dto;

    // Sửa thành prisma.nguoi_dung
    const existing = await this.prisma.nguoi_dung.findFirst({
      where: {
        OR: [
          { ten_dang_nhap },
          ...(email ? [{ email }] : []),
          ...(so_dien_thoai ? [{ so_dien_thoai }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.ten_dang_nhap === ten_dang_nhap)
        throw new BadRequestException('Tên đăng nhập đã tồn tại');
      if (email && existing.email === email)
        throw new BadRequestException('Email đã được sử dụng');
      if (so_dien_thoai && existing.so_dien_thoai === so_dien_thoai)
        throw new BadRequestException('Số điện thoại đã được sử dụng');
    }

    const role = vai_tro || 'KHACH_HANG';
    
    // Dùng raw query để dùng pgcrypto crypt()
    const inserted = await this.prisma.$queryRaw<{ ma_nguoi_dung: number }[]>`
      INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau, ho_ten, so_dien_thoai, email, vai_tro)
      VALUES (
        ${ten_dang_nhap},
        crypt(${mat_khau}, gen_salt('bf')),
        ${ho_ten},
        ${so_dien_thoai ?? null},
        ${email ?? null},
        ${role}
      )
      RETURNING ma_nguoi_dung;
    `;

    const newId = inserted[0].ma_nguoi_dung;

    // Sửa thành prisma.khach_hang và prisma.nhan_vien
    if (role === 'KHACH_HANG') {
      await this.prisma.khach_hang.create({
        data: { ma_nguoi_dung: newId, diem_tich_luy: 0 },
      });
    } else if (role === 'KY_THUAT_VIEN' || role === 'DIEU_PHOI_VIEN') {
      await this.prisma.nhan_vien.create({
        data: { ma_nguoi_dung: newId },
      });
    }

    return {
      message: 'Đăng ký thành công',
      user: { id: newId, ho_ten, ten_dang_nhap, email, vai_tro: role },
    };
  }

  async login(dto: LoginDto) {
    const { ten_dang_nhap, mat_khau } = dto;

    // So sánh mật khẩu bằng pgcrypto
    const rows = await this.prisma.$queryRaw<any[]>`
      SELECT ma_nguoi_dung, ten_dang_nhap, ho_ten, email, so_dien_thoai,
             vai_tro, trang_thai
      FROM nguoi_dung
      WHERE ten_dang_nhap = ${ten_dang_nhap}
        AND mat_khau = crypt(${mat_khau}, mat_khau)
      LIMIT 1;
    `;

    if (rows.length === 0) {
      throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    const user = rows[0];

    if (user.trang_thai === 'KHOA' || user.trang_thai === 'TAM_KHOA') {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    const payload = {
      sub: user.ma_nguoi_dung,
      username: user.ten_dang_nhap,
      vai_tro: user.vai_tro,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.ma_nguoi_dung,
        ho_ten: user.ho_ten,
        ten_dang_nhap: user.ten_dang_nhap,
        email: user.email,
        so_dien_thoai: user.so_dien_thoai,
        vai_tro: user.vai_tro,
      },
    };
  }

  async getProfile(userId: number) {
    // Sửa thành prisma.nguoi_dung
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: userId },
      select: {
        ma_nguoi_dung: true,
        ho_ten: true,
        ten_dang_nhap: true,
        email: true,
        so_dien_thoai: true,
        vai_tro: true,
        trang_thai: true,
      },
    });

    if (!user) throw new UnauthorizedException('Người dùng không tồn tại');
    return user;
  }
}