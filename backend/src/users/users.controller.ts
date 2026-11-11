import { Controller, Get, Query, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('vai_tro') vai_tro?: string,
    @Query('trang_thai') trang_thai?: string,
  ) {
    return this.usersService.findAll(search, vai_tro, trang_thai);
  }

  @Patch(':id/toggle-status')
  toggleStatus(@Param('id') id: string, @Req() req: any) {
    const currentUserId = req.user.userId; 
    return this.usersService.toggleStatus(Number(id), currentUserId);
  }
}