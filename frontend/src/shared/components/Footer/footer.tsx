// components/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* CỘT 1 — GIỚI THIỆU */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-black">
              QUẢN LÝ HIỆN TRƯỜNG
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Hệ thống quản lý dịch vụ hiện trường, điều phối kỹ thuật viên
              và theo dõi phiếu dịch vụ chuyên nghiệp.
            </p>
          </div>

          {/* CỘT 2 — DỊCH VỤ */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-black">
              DỊCH VỤ
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/dashboard/requests"
                  className="hover:text-green-600 transition"
                >
                  Phiếu dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/dispatch"
                  className="hover:text-green-600 transition"
                >
                  Điều phối
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/reports"
                  className="hover:text-green-600 transition"
                >
                  Báo cáo
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/warehouse"
                  className="hover:text-green-600 transition"
                >
                  Kho vật tư
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 3 — HỖ TRỢ */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-black">
              HỖ TRỢ
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/huong-dan"
                  className="hover:text-green-600 transition"
                >
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/cau-hoi-thuong-gap"
                  className="hover:text-green-600 transition"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach"
                  className="hover:text-green-600 transition"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-green-600 transition"
                >
                  Liên hệ hỗ trợ
                </Link>
              </li>
            </ul>
          </div>

          {/* CỘT 4 — LIÊN HỆ */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider mb-4 text-black">
              LIÊN HỆ
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>can tho</li>
              <li>0779484012</li>
              <li>thanhb2303780@student.ctu.edu.vn</li>
              <li>8:00 - 21:00 (T2 - CN)</li>
            </ul>
          </div>

        </div>

        {/* DÒNG COPYRIGHT */}
        <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
          <p>&copy; 2026 QUẢN LÝ HIỆN TRƯỜNG. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}