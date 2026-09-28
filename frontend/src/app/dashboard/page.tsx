// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/lib/auth';

const GREETING: Record<string, string> = {
  QUAN_TRI_VIEN: 'Bảng điều khiển quản trị viên',
  GIAM_DOC_THANH_PHO: 'Bảng điều khiển giám đốc',
  QUAN_LY_KHU_VUC: 'Bảng điều khiển quản lý khu vực',
  DIEU_PHOI_VIEN: 'Bảng điều phối',
  TONG_DAI_VIEN: 'Bảng tổng đài',
  KE_TOAN: 'Bảng tài chính',
  QUAN_LY_KHO: 'Bảng kho vật tư',
  KY_THUAT_VIEN: 'Công việc của tôi',
  TO_TRUONG: 'Công việc tổ',
};

const QUICK_LINKS: Record<string, { label: string; href: string }[]> = {
  QUAN_TRI_VIEN: [
    { label: 'Quản trị hệ thống', href: '/dashboard/system' },
    { label: 'Nhân viên', href: '/dashboard/employees' },
    { label: 'Báo cáo', href: '/dashboard/reports' },
    { label: 'Tài chính', href: '/dashboard/finance' },
    { label: 'Kho', href: '/dashboard/warehouse' },
  ],
  GIAM_DOC_THANH_PHO: [
    { label: 'Phiếu dịch vụ', href: '/dashboard/requests' },
    { label: 'Điều phối', href: '/dashboard/dispatch' },
    { label: 'Báo cáo', href: '/dashboard/reports' },
    { label: 'Nhân viên', href: '/dashboard/employees' },
  ],
  QUAN_LY_KHU_VUC: [
    { label: 'Phiếu dịch vụ', href: '/dashboard/requests' },
    { label: 'Điều phối', href: '/dashboard/dispatch' },
    { label: 'Nhân viên', href: '/dashboard/employees' },
    { label: 'Báo cáo', href: '/dashboard/reports' },
  ],
  DIEU_PHOI_VIEN: [
    { label: 'Phiếu dịch vụ', href: '/dashboard/requests' },
    { label: 'Điều phối', href: '/dashboard/dispatch' },
  ],
  TONG_DAI_VIEN: [
    { label: 'Phiếu dịch vụ', href: '/dashboard/requests' },
    { label: 'Khách hàng', href: '/dashboard/customers' },
  ],
  KE_TOAN: [
    { label: 'Tài chính', href: '/dashboard/finance' },
    { label: 'Báo cáo', href: '/dashboard/reports' },
  ],
  QUAN_LY_KHO: [
    { label: 'Kho vật tư', href: '/dashboard/warehouse' },
  ],
  KY_THUAT_VIEN: [
    { label: 'Công việc của tôi', href: '/dashboard/my-jobs' },
  ],
  TO_TRUONG: [
    { label: 'Công việc của tôi', href: '/dashboard/my-jobs' },
    { label: 'Nhân viên', href: '/dashboard/employees' },
  ],
};

export default function DashboardHome() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    if (u.vai_tro === 'KHACH_HANG') {
      router.replace('/');
      return;
    }
    setUser(u);
  }, [router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        Đang tải...
      </div>
    );
  }

  const links = QUICK_LINKS[user.vai_tro] ?? [];

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        {GREETING[user.vai_tro] ?? 'Dashboard'}
      </h1>
      <p className="text-gray-600 mb-8">
        Xin chào, <span className="font-semibold">{user.ho_ten || user.ten_dang_nhap}</span>
        {' '}— Vai trò: <span className="font-mono text-green-700">{user.vai_tro}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
          >
            <p className="text-lg font-semibold text-gray-900">{link.label}</p>
            <p className="text-sm text-gray-500 mt-1">{link.href}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}