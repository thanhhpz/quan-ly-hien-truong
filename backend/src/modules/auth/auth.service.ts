import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.nguoi_dung.findFirst({
      where: {
        OR: [
          { ten_dang_nhap: dto.ten_dang_nhap },
          ...(dto.email ? [{ email: dto.email }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Tên đăng nhập hoặc email đã tồn tại',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.mat_khau, 10);

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.nguoi_dung.create({
        data: {
          ten_dang_nhap: dto.ten_dang_nhap,
          mat_khau: hashedPassword,
          ho_ten: dto.ho_ten,
          so_dien_thoai: dto.so_dien_thoai,
          email: dto.email,
        },
      });

      await tx.khach_hang.create({
        data: {
          ma_nguoi_dung: user.ma_nguoi_dung,
        },
      });

      return user;
    });

    return {
      message: 'Đăng ký thành công',
      user: {
        ma_nguoi_dung: result.ma_nguoi_dung.toString(),
        ten_dang_nhap: result.ten_dang_nhap,
        ho_ten: result.ho_ten,
        email: result.email,
        vai_tro: 'KHACH_HANG',
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.nguoi_dung.findUnique({
      where: {
        ten_dang_nhap: dto.ten_dang_nhap,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Tên đăng nhập hoặc mật khẩu không đúng',
      );
    }

    const passwordValid = await bcrypt.compare(
      dto.mat_khau,
      user.mat_khau,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Tên đăng nhập hoặc mật khẩu không đúng',
      );
    }

    const authorization = await this.getUserAuthorization(
      user.ma_nguoi_dung,
    );

    const payload = {
      sub: user.ma_nguoi_dung.toString(),
      ten_dang_nhap: user.ten_dang_nhap,
      vai_tro: authorization.vai_tro,
      quyen: authorization.quyen,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      access_token: accessToken,
      user: {
        ma_nguoi_dung: user.ma_nguoi_dung.toString(),
        ten_dang_nhap: user.ten_dang_nhap,
        ho_ten: user.ho_ten,
        vai_tro: authorization.vai_tro,
        quyen: authorization.quyen,
      },
    };
  }

  private async getUserRole(userId: bigint) {
    const employee = await this.prisma.nhan_vien.findUnique({
      where: {
        ma_nguoi_dung: userId,
      },
      include: {
        vai_tro: true,
      },
    });

    if (employee) {
      return employee.vai_tro.ten_vai_tro;
    }

    const customer = await this.prisma.khach_hang.findUnique({
      where: {
        ma_nguoi_dung: userId,
      },
    });

    if (customer) {
      return 'KHACH_HANG';
    }

    return null;
  }
  private async getUserAuthorization(userId: bigint) {
    const employee = await this.prisma.nhan_vien.findUnique({
      where: {
        ma_nguoi_dung: userId,
      },
      include: {
        vai_tro: {
          include: {
            vai_tro_quyen: {
              include: {
                quyen: true,
              },
            },
          },
        },
      },
    });

    if (employee) {
      return {
        vai_tro: employee.vai_tro.ten_vai_tro,
        quyen: employee.vai_tro.vai_tro_quyen.map(
          (item) => item.quyen.ten_quyen,
        ),
      };
    }

    const customer = await this.prisma.khach_hang.findUnique({
      where: {
        ma_nguoi_dung: userId,
      },
    });

    if (customer) {
      return {
        vai_tro: 'KHACH_HANG',
        quyen: [
          'XEM_PHIEU',
          'TAO_PHIEU',
          'CAP_NHAT_PHIEU',
        ],
      };
    }

    return {
      vai_tro: null,
      quyen: [],
    };
  }
}