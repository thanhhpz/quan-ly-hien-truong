import { UserRole } from '@/lib/auth';

export interface MenuItem {
  label: string;
  href: string;
  roles: UserRole[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: 'Tổng quan',
    href: '/dashboard',
    roles: [
      'KY_THUAT_VIEN',
      'TO_TRUONG',
      'DIEU_PHOI_VIEN',
      'QUAN_LY_KHU_VUC',
      'GIAM_DOC_THANH_PHO',
      'TONG_DAI_VIEN',
      'KE_TOAN',
      'QUAN_LY_KHO',
      'QUAN_TRI_VIEN',
      'KHACH_HANG',
    ],
  },

  {
    label: 'Phiếu dịch vụ',
    href: '/dashboard/requests',
    roles: [
      'QUAN_TRI_VIEN',
      'GIAM_DOC_THANH_PHO',
      'QUAN_LY_KHU_VUC',
      'DIEU_PHOI_VIEN',
      'TONG_DAI_VIEN',
      'KHACH_HANG',
    ],
  },

  {
    label: 'Điều phối',
    href: '/dashboard/dispatch',
    roles: [
      'QUAN_TRI_VIEN',
      'GIAM_DOC_THANH_PHO',
      'QUAN_LY_KHU_VUC',
      'DIEU_PHOI_VIEN',
    ],
  },

  {
    label: 'Công việc của tôi',
    href: '/dashboard/my-jobs',
    roles: [
      'KY_THUAT_VIEN',
      'TO_TRUONG',
    ],
  },

  {
    label: 'Nhân viên',
    href: '/dashboard/employees',
    roles: [
      'QUAN_TRI_VIEN',
      'GIAM_DOC_THANH_PHO',
      'QUAN_LY_KHU_VUC',
      'TO_TRUONG',
    ],
  },

  {
    label: 'Khách hàng',
    href: '/dashboard/customers',
    roles: [
      'QUAN_TRI_VIEN',
      'GIAM_DOC_THANH_PHO',
      'QUAN_LY_KHU_VUC',
      'TONG_DAI_VIEN',
    ],
  },

  {
    label: 'Kho',
    href: '/dashboard/warehouse',
    roles: [
      'QUAN_TRI_VIEN',
      'QUAN_LY_KHO',
    ],
  },

  {
    label: 'Tài chính',
    href: '/dashboard/finance',
    roles: [
      'QUAN_TRI_VIEN',
      'KE_TOAN',
    ],
  },

  {
    label: 'Báo cáo',
    href: '/dashboard/reports',
    roles: [
      'QUAN_TRI_VIEN',
      'GIAM_DOC_THANH_PHO',
      'QUAN_LY_KHU_VUC',
      'KE_TOAN',
    ],
  },

  {
    label: 'Quản trị hệ thống',
    href: '/dashboard/system',
    roles: [
      'QUAN_TRI_VIEN',
    ],
  },
];