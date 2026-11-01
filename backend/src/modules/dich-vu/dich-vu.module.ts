import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { DichVuController } from './dich-vu.controller.js';
import { DichVuService } from './dich-vu.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [DichVuController],
  providers: [DichVuService],
})
export class DichVuModule {}