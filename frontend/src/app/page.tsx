'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = getUser();
    // Nếu đã đăng nhập, đá về đúng trang của vai trò đó
    if (user?.vai_tro === 'ADMIN') router.push('/admin');
    else if (user?.vai_tro === 'DIEU_PHOI_VIEN') router.push('/dieu-phoi');
    else if (user?.vai_tro === 'KY_THUAT_VIEN') router.push('/ky-thuat');
    else if (user?.vai_tro === 'KHACH_HANG') router.push('/khach-hang');
  }, [router]);

  return (
    <div className="w-[92%] max-w-[1400px] mx-auto py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Chào mừng đến với Dịch vụ 24h
      </h1>
      <p className="text-gray-600">
        Vui lòng đăng nhập để sử dụng hệ thống.
      </p>
    </div>
  );
}