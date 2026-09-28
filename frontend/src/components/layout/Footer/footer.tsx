// components/Footer.tsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-accent">MERMAID</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Thời trang cao cấp dành cho mọi người. Chúng tôi mang đến phong cách đẳng cấp và chất lượng tốt nhất.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-accent">DANH MỤC</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/danh-muc/thoi-trang-nam" className="hover:text-accent transition">Thời trang nam</Link></li>
              <li><Link href="/danh-muc/thoi-trang-nu" className="hover:text-accent transition">Thời trang nữ</Link></li>
              <li><Link href="/giay-dep" className="hover:text-accent transition">Giày dép</Link></li>
              <li><Link href="/phu-kien" className="hover:text-accent transition">Phụ kiện</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-accent">HỖ TRỢ</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/huong-dan" className="hover:text-accent transition">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/thanh-toan" className="hover:text-accent transition">Thanh toán</Link></li>
              <li><Link href="/van-chuyen" className="hover:text-accent transition">Vận chuyển</Link></li>
              <li><Link href="/doi-tra" className="hover:text-accent transition">Đổi trả</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-accent">LIÊN HỆ</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>123 Đường Nguyễn Huệ, Q1, TP.HCM</li>
              <li>1900 1234</li>
              <li>contact@mermaid.com</li>
              <li>8:00 - 21:00 (T2 - CN)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-xs text-white/40">
          <p>&copy; 2025 MERMAID COLLECTION. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}