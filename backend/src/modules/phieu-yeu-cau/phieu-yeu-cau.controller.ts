import { Body, Controller, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { PhieuYeuCauService } from './phieu-yeu-cau.service.js';
import { CreatePhieuDto } from './dto/create-phieu.dto.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

@Controller('phieu-yeu-cau')
export class PhieuYeuCauController {
  constructor(private readonly service: PhieuYeuCauService) {}

  // Khách hàng tạo phiếu (cần đăng nhập)
  @Post()
  @Permissions('request:create')
  create(@Body() dto: CreatePhieuDto, @Req() req: any) {
    const userId = Number(req.user.sub);
    return this.service.create(dto, userId);
  }

  // Khách hàng xem danh sách phiếu của mình
  @Get('cua-toi')
  @Permissions('request:read')
  findMyRequests(@Req() req: any) {
    const userId = Number(req.user.sub);
    return this.service.findByKhachHang(userId);
  }

  // Khách hàng xem chi tiết 1 phiếu
  @Get(':id')
  @Permissions('request:read')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = Number(req.user.sub);
    return this.service.findOne(id, userId);
  }
}