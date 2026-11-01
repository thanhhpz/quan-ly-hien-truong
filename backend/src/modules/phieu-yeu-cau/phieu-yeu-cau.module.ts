import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PhieuYeuCauController } from './phieu-yeu-cau.controller.js';
import { PhieuYeuCauService } from './phieu-yeu-cau.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [PhieuYeuCauController],
  providers: [PhieuYeuCauService],
})
export class PhieuYeuCauModule {}