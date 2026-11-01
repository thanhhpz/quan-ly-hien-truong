import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DichVuService } from './dich-vu.service.js';
import { Public } from '../auth/decorators/public.decorator.js';

@Controller('dich-vu')
export class DichVuController {
  constructor(private readonly service: DichVuService) {}

  @Public()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }
}