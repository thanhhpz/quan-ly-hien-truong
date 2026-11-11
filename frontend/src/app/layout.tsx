// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';
// import Header from '@/components/Header';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Dịch vụ 24h',
//   description: 'Hệ thống quản lý dịch vụ sửa chữa',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="vi">
//       <body className={inter.className}>
//         <Header />
//         <main style={{ minHeight: '80vh' }}>{children}</main>
//       </body>
//     </html>
//   );
// }

'use client'; // Bắt buộc phải có để dùng usePathname

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

// Lưu ý: Vì file này có 'use client', bạn không thể export metadata ở đây nữa.
// Nếu muốn giữ metadata, hãy chuyển nó sang file layout của từng page, hoặc bỏ qua vì nó không ảnh hưởng giao diện.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Kiểm tra xem URL hiện tại có phải là trang login hoặc register không
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="vi">
      <body className={inter.className}>
        
        {/* Chỉ hiển thị Header nếu KHÔNG PHẢI trang login/register */}
        {!isAuthPage && <Header />}

        <main className={isAuthPage ? '' : 'min-h-[80vh]'}>
          {children}
        </main>
        
      </body>
    </html>
  );
}