import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { AdminService } from './admin.service.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';
import { CreateNhanVienDto } from './dto/create-nhan-vien.dto.js';
import { QueryUserDto } from './dto/query-user.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleInfoDto } from './dto/update-role-info.dto.js';
import { AssignPermissionDto } from './dto/assign-permission.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ===== USERS =====
  @Get('users')
  @Permissions('user:read')
  findAll(@Query() query: QueryUserDto) {
    return this.adminService.findAll(query);
  }

  @Get('users/:id')
  @Permissions('user:read')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Post('users/nhan-vien')
  @Permissions('user:create')
  createNhanVien(@Body() dto: CreateNhanVienDto) {
    return this.adminService.createNhanVien(dto);
  }

  @Patch('users/:id/role')
  @Permissions('user:assign-role')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
    @Req() req: any,
  ) {
    return this.adminService.updateRole(id, dto.ma_vai_tro, Number(req.user.sub));
  }

  @Patch('users/:id/status')
  @Permissions('user:delete')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @Req() req: any,
  ) {
    return this.adminService.updateStatus(id, dto.trang_thai, Number(req.user.sub));
  }

  @Post('users/:id/reset-password')
  @Permissions('user:update')
  resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.adminService.resetPassword(id, dto.mat_khau_moi);
  }

  // ===== ROLES =====
  @Get('roles')
  @Permissions('role:read')
  findAllRoles() {
    return this.adminService.findAllRoles();
  }

  @Post('roles')
  @Permissions('role:create')
  createRole(@Body() dto: CreateRoleDto) {
    return this.adminService.createRole(dto);
  }

  @Patch('roles/:id')
  @Permissions('role:update')
  updateRoleInfo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleInfoDto,
  ) {
    return this.adminService.updateRoleInfo(id, dto);
  }

  @Delete('roles/:id')
  @Permissions('role:update')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteRole(id);
  }

  @Post('roles/:id/permissions')
  @Permissions('role:assign-permission')
  assignPermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPermissionDto,
  ) {
    return this.adminService.assignPermissions(id, dto.ma_quyen);
  }

  @Get('roles/:id/permissions')
  @Permissions('role:read')
  getPermissionsOfRole(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getPermissionsOfRole(id);
  }

  // ===== PERMISSIONS =====
  @Get('permissions')
  @Permissions('permission:read')
  findAllPermissions() {
    return this.adminService.findAllPermissions();
  }

  // ===== STATS =====
  @Get('stats')
  @Permissions('report:view')
  getStats() {
    return this.adminService.getStats();
  }
}