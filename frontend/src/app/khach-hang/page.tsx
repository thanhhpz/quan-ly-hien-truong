'use client';

import RoleGuard from "@/components/RoleGuard";

export default function KhachHangPage() {
  return (
    <RoleGuard allowedRoles={['KHACH_HANG']}>
      <p>Khách hàng là thượng đế</p>
    </RoleGuard>
  );
}