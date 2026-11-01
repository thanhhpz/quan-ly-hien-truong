// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, User } from '@/shared/lib/auth';

const GREETING: Record<string, string> = {
  ADMIN: 'Bảng điều khiển Quản trị viên',
  NHAN_VIEN: 'Bảng điều khiển Nhân viên',
};

const QUICK_LINKS: Record<string, { label: string; href: string; desc: string }[]> = {
  ADMIN: [
    {
      label: 'Quản lý người dùng',
      href: '/dashboard/users',
      desc: 'Xem, thêm, khóa tài khoản và đổi vai trò',
    },
    {
      label: 'Phân quyền hệ thống',
      href: '/dashboard/roles',
      desc: 'Quản lý vai trò và gán quyền',
    },
    {
      label: 'Quản lý phiếu dịch vụ',
      href: '/dashboard/requests',
      desc: 'Theo dõi và xử lý phiếu dịch vụ',
    },
    {
      label: 'Báo cáo thống kê',
      href: '/dashboard/reports',
      desc: 'Xem báo cáo hoạt động hệ thống',
    },
  ],
  NHAN_VIEN: [
    {
      label: 'Phiếu dịch vụ',
      href: '/dashboard/requests',
      desc: 'Danh sách phiếu dịch vụ được giao',
    },
    {
      label: 'Công việc của tôi',
      href: '/dashboard/my-jobs',
      desc: 'Các công việc đang thực hiện',
    },
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
    return <div className="py-10 text-gray-600">Đang tải...</div>;
  }

  const links = QUICK_LINKS[user.vai_tro] ?? [];

  return (
    <div>
      {/* Lời chào */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          {GREETING[user.vai_tro] ?? 'Dashboard'}
        </h1>
        <p className="text-gray-700">
          Xin chào,{' '}
          <span className="font-semibold">{user.ho_ten || user.ten_dang_nhap}</span> — Vai trò:{' '}
          <span className="font-mono">{user.vai_tro}</span>
        </p>
      </div>

      {/* Thống kê nhanh (placeholder — nối API sau) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="border border-gray-300 p-5">
          <p className="text-sm text-gray-600 mb-1">Tổng người dùng</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="border border-gray-300 p-5">
          <p className="text-sm text-gray-600 mb-1">Phiếu đang xử lý</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="border border-gray-300 p-5">
          <p className="text-sm text-gray-600 mb-1">Phiếu hoàn thành</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      {/* Lối tắt chức năng */}
      <div>
        <h2 className="text-lg font-bold mb-3">Chức năng</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border border-gray-300 p-5 hover:border-orange-500 hover:bg-orange-50/40 transition-colors"
            >
              <p className="font-semibold text-base">{link.label}</p>
              <p className="text-sm text-gray-600 mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}