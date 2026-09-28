// 'use client';

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// import { getCurrentUser, User } from '@/lib/auth';
// import { MENU_ITEMS } from '@/components/layout/menu';

// export default function Header() {
//   const router = useRouter();

//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     setUser(getCurrentUser());

//     function handleAuthChange() {
//       setUser(getCurrentUser());
//     }

//     window.addEventListener('auth-change', handleAuthChange);

//     return () => {
//       window.removeEventListener('auth-change', handleAuthChange);
//     };
//   }, []);

//   function handleLogout() {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('user');

//     setUser(null);
//     window.dispatchEvent(new Event('auth-change'));
//     router.push('/');
//   }

//   const menuItems = user?.vai_tro
//     ? MENU_ITEMS.filter((item) =>
//       item.roles.includes(user.vai_tro!)
//     )
//     : [];

//   return (
//     <header className="flex items-center justify-between bg-white text-black px-6 py-4 shadow-sm">
//       <Link href="/" className=" text-lg text-black hover:text-green-600 transition">Quản lý hiện trường hihi</Link>
//       <nav className="flex items-center gap-6">
//         {!user ? (
//           <>
//             <Link href="/" className="text-sm text-black hover:text-green-600 transition">Trang chủ</Link>
//             <Link href="/login" className="text-sm text-black hover:text-green-600 transition">Đăng nhập</Link>
//             <Link href="/register"className="text-sm text-black hover:text-green-600 transition">Đăng ký</Link>
//           </>
//         ) : (
//           <>
//             {menuItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="text-sm text-black hover:text-green-600 transition"
//               >
//                 {item.label}
//               </Link>
//             ))}

//             <span className="text-sm text-gray-600">
//               {user.ho_ten || user.ten_dang_nhap}
//             </span>

//             <button type="button" onClick={handleLogout} className="text-sm text-black hover:text-green-600 transition">Đăng xuất</button>
//           </>
//         )}
//       </nav>
//     </header>
//   );
// }


// components/layout/Header/header.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCurrentUser, clearSession, User } from '@/lib/auth';
import { MENU_ITEMS } from '@/components/layout/menu';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    function sync() {
      try {
        setUser(getCurrentUser());
      } catch {
        setUser(null);
      }
    }
    sync();
    window.addEventListener('auth-change', sync);
    return () => window.removeEventListener('auth-change', sync);
  }, []);

  function handleLogout() {
    clearSession();
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/');
    router.refresh();
  }

  const isCustomer = !user || user.vai_tro === 'KHACH_HANG';

  const menuItems = user?.vai_tro
    ? MENU_ITEMS.filter((item) => item.roles.includes(user.vai_tro!))
    : [];

  return (
    <header className="flex items-center justify-between bg-white text-black px-6 py-4 shadow-sm">
      <Link
        href={isCustomer ? '/' : '/dashboard'}
        className="text-lg text-black hover:text-green-600 transition"
      >
        Quản lý hiện trường
      </Link>

      <nav className="flex items-center gap-6">
        {!user ? (
          <>
            <Link href="/" className="text-sm text-black hover:text-green-600 transition">
              Trang chủ
            </Link>
            <Link href="/login" className="text-sm text-black hover:text-green-600 transition">
              Đăng nhập
            </Link>
            <Link href="/register" className="text-sm text-black hover:text-green-600 transition">
              Đăng ký
            </Link>
          </>
        ) : (
          <>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-black hover:text-green-600 transition"
              >
                {item.label}
              </Link>
            ))}

            <span className="text-sm text-gray-600">
              {user.ho_ten || user.ten_dang_nhap}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-black hover:text-green-600 transition"
            >
              Đăng xuất
            </button>
          </>
        )}
      </nav>
    </header>
  );
}