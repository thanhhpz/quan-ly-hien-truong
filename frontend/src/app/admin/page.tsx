// 'use client';

// import RoleGuard from "@/components/RoleGuard";

// export default function AdminPage() {
//   return (
//     <RoleGuard allowedRoles={['ADMIN']}>
//       <p>Quản trị viên đẹp trai</p>
//     </RoleGuard>
//   );
// }

'use client';

import RoleGuard from '@/components/RoleGuard';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { title: 'Tổng doanh thu', value: '125.400.000 đ', color: 'text-green-600' },
    { title: 'Yêu cầu mới', value: '12', color: 'text-orange-600' },
    { title: 'Đang xử lý', value: '8', color: 'text-blue-600' },
    { title: 'Tổng khách hàng', value: '142', color: 'text-purple-600' },
  ];

  const quickLinks = [
    { label: 'Quản lý người dùng', href: '/admin/quan-ly-nguoi-dung', desc: 'Thêm, sửa, khóa tài khoản' },
    { label: 'Quản lý dịch vụ', href: '/admin/dich-vu', desc: 'Cập nhật bảng giá, loại dịch vụ' },
    { label: 'Báo cáo doanh thu', href: '/admin/bao-cao', desc: 'Xem biểu đồ, xuất hóa đơn' },
    { label: 'Cấu hình hệ thống', href: '/admin/cai-dat', desc: 'Thiết lập khu vực, vật tư' },
  ];

  return (
    <RoleGuard allowedRoles={['ADMIN']}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href}
              className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-center"
            >
              <h3 className="font-medium text-gray-900 mb-2 group-hover:text-orange-600 transition-colors text-lg">{link.label}</h3>
              <p className="text-sm text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
    </RoleGuard>
  );
}