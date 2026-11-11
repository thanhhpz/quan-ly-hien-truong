'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push('/login');
  };

  // ==========================================
  // CẤU HÌNH MENU CHO TỪNG VAI TRÒ
  // ==========================================
  
  // Menu cho khách (chưa đăng nhập)
  const guestMenu = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Dịch vụ', href: '/dich-vu' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];

  // Menu cho Khách hàng
  const khachHangMenu = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Dịch vụ', href: '/dich-vu' },
    { label: 'Yêu cầu của tôi', href: '/khach-hang' },
    { label: 'Lịch sử hóa đơn', href: '/khach-hang/hoa-don' },
  ];

  // Menu cho Kỹ thuật viên
  const kyThuatMenu = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Công việc được giao', href: '/ky-thuat' },
    { label: 'Lịch làm việc', href: '/ky-thuat/lich' },
    { label: 'Tra cứu vật tư', href: '/ky-thuat/vat-tu' },
  ];

  // Menu cho Điều phối viên
  const dieuPhoiMenu = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Bảng điều phối', href: '/dieu-phoi' },
    { label: 'Quản lý khu vực', href: '/dieu-phoi/khu-vuc' },
    { label: 'Danh sách KTV', href: '/dieu-phoi/ky-thuat-vien' },
  ];

  // Menu cho Admin
  const adminMenu = [
    // { label: 'Trang chủ', href: '/' },
    { label: 'Tổng quan', href: '/admin' },
    { label: 'Quản lý người dùng', href: '/admin/quan-ly-nguoi-dung' },
    { label: 'Quản lý dịch vụ', href: '/admin/dich-vu' },
    { label: 'Báo cáo doanh thu', href: '/admin/bao-cao' },
  ];

  // Hàm chọn menu dựa vào vai trò
  const getMenuByRole = () => {
    if (!user) return guestMenu;
    switch (user.vai_tro) {
      case 'ADMIN': return adminMenu;
      case 'DIEU_PHOI_VIEN': return dieuPhoiMenu;
      case 'KY_THUAT_VIEN': return kyThuatMenu;
      case 'KHACH_HANG': return khachHangMenu;
      default: return guestMenu;
    }
  };

  const currentMenu = getMenuByRole();

  // Hàm lấy link trang cá nhân
  const getProfileLink = (role: string) => {
    switch (role) {
      case 'ADMIN': return '/admin';
      case 'DIEU_PHOI_VIEN': return '/dieu-phoi';
      case 'KY_THUAT_VIEN': return '/ky-thuat';
      case 'KHACH_HANG': return '/khach-hang';
      default: return '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-[92%] max-w-[1400px] h-[80px] mx-auto flex justify-between items-center gap-6">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 no-underline shrink-0">
          <span className="w-[38px] h-[38px] bg-red-500 rounded-full"></span>
          <span className="text-[22px] font-semibold text-gray-900 tracking-tight">
            dịch vụ 24h
          </span>
        </Link>

        {/* NAV + SEARCH */}
        <div className="flex-1 flex justify-center items-center gap-7">
          <nav className="flex gap-1 items-center">
            {/* Render menu động dựa theo currentMenu */}
            {currentMenu.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-[15px] font-normal px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-gray-100 text-gray-900' // Style cho menu đang chọn
                      : 'text-gray-600 hover:text-white hover:bg-[#d9651d] hover:shadow-lg'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* SEARCH (Có thể ẩn với một số vai trò nếu muốn) */}
          <form
            className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 w-[200px] focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-200 transition-all"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="text-sm text-gray-400">Tìm kiếm</span>
            <input
              type="text"
              placeholder="..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400 min-w-0"
            />
          </form>
        </div>

        {/* AUTH BUTTON */}
        {user ? (
          <div className="flex gap-4 items-center shrink-0">
            <Link 
              href={getProfileLink(user.vai_tro)}
              className="text-right leading-tight hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Vào trang cá nhân"
            >
              <div className="font-medium text-sm text-gray-800 hover:text-gray-900">
                {user.ho_ten}
              </div>
              <div className="text-[11px] text-gray-400 tracking-wide uppercase">
                {user.vai_tro.replace(/_/g, ' ')}
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full text-[14px] font-normal hover:bg-red-600 hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-[14px] font-normal hover:bg-gray-800 hover:-translate-y-0.5 transition-all shrink-0 whitespace-nowrap"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}