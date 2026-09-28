'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCurrentUser, User } from '@/lib/auth';
import { MENU_ITEMS } from '@/components/layout/menu';

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  setUser(getCurrentUser());

  function handleAuthChange() {
    setUser(getCurrentUser());
  }

  window.addEventListener('auth-change', handleAuthChange);

  return () => {
    window.removeEventListener('auth-change', handleAuthChange);
  };
}, []);

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    setUser(null);

    router.push('/');
  }

  const menuItems = user?.vai_tro
    ? MENU_ITEMS.filter((item) =>
        item.roles.includes(user.vai_tro!)
      )
    : [];

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="font-bold">
        Quản lý hiện trường
      </Link>

      <nav className="flex items-center gap-6">
        {!user ? (
          <>
            <Link href="/">Trang chủ</Link>

            <Link href="/login">Đăng nhập</Link>

            <Link href="/register">Đăng ký</Link>
          </>
        ) : (
          <>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm hover:underline"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm hover:underline"
            >
              Đăng xuất
            </button>
          </>
        )}
      </nav>
    </header>
  );
}