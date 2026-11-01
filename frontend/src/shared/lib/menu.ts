// shared/lib/menu.ts
import { UserRole } from './auth';

export interface MenuItem {
  label: string;
  href: string;
  roles: UserRole[];
  permission?: string;
}

// ==========================================
// MENU DÀNH RIÊNG CHO KHÁCH HÀNG
// ==========================================
export const CUSTOMER_MENU: MenuItem[] = [
  {
    label: 'Trang chủ',
    href: '/',
    roles: ['KHACH_HANG'],
  },
  {
    label: 'Dịch vụ',
    href: '/dich-vu',
    roles: ['KHACH_HANG'],
  },
  {
    label: 'Phiếu của tôi',
    href: '/phieu-cua-toi',
    roles: ['KHACH_HANG'],
  },
];

// ==========================================
// MENU DÀNH CHO NỘI BỘ (ADMIN / NHÂN VIÊN)
// ==========================================
export const INTERNAL_MENU: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['ADMIN', 'NHAN_VIEN'],
  },
  {
    label: 'Quản lý người dùng',
    href: '/dashboard/users',
    roles: ['ADMIN'],
    permission: 'user:read',
  },
  {
    label: 'Phân quyền',
    href: '/dashboard/roles',
    roles: ['ADMIN'],
    permission: 'role:read',
  },
  {
    label: 'Phiếu dịch vụ',
    href: '/dashboard/requests',
    roles: ['ADMIN', 'NHAN_VIEN'],
    permission: 'request:read',
  },
  {
    label: 'Báo cáo',
    href: '/dashboard/reports',
    roles: ['ADMIN'],
    permission: 'report:read',
  },
];