'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/api';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();

    // 1. Nếu chưa đăng nhập -> Đá về trang login
    if (!user) {
      router.push('/login');
      return;
    }

    // 2. Nếu đăng nhập rồi nhưng SAI quyền -> Đá về trang chủ (hoặc trang báo lỗi 403)
    if (!allowedRoles.includes(user.vai_tro)) {
      router.push('/'); 
      return;
    }

    // 3. Nếu đúng quyền -> Cho phép hiển thị
    setIsAuthorized(true);
    setLoading(false);
  }, [router, allowedRoles]);

  // Trong lúc chờ kiểm tra, hiển thị màn hình loading (tránh chớp giao diện)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-500 font-medium">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}