'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getCurrentUser, User } from '@/lib/auth';
import { MENU_ITEMS } from './menu';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const menus = MENU_ITEMS.filter((item) =>
    user?.vai_tro
      ? item.roles.includes(user.vai_tro)
      : false,
  );

  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    window.location.href = '/login';
  }

  return (
    <header className="">
      <span>
        Hello, {user?.ho_ten || user?.ten_dang_nhap}
      </span>

      <nav className="flex items-center gap-6">
        {menus.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}

        <button onClick={handleLogout}>
          Đăng xuất
        </button>
      </nav>
    </header>
  );
}