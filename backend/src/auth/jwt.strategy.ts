import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    // Sửa thành prisma.nguoi_dung
    const user = await this.prisma.nguoi_dung.findUnique({
      where: { ma_nguoi_dung: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
    if (user.trang_thai !== 'HOAT_DONG') {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    return {
      userId: user.ma_nguoi_dung,
      username: user.ten_dang_nhap,
      vai_tro: user.vai_tro,
    };
  }
}