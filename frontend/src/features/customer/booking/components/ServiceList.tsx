'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingApi } from '../api';
import { DichVu } from '../types';

export default function ServiceList() {
  const [services, setServices] = useState<DichVu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingApi.getServices()
      .then(setServices)
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Đang tải dịch vụ...</div>;

  // Nhóm dịch vụ theo loại
  const grouped: Record<string, DichVu[]> = {};
  for (const dv of services) {
    const key = dv.loai_dich_vu?.ten_loai_dich_vu ?? 'Khác';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(dv);
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Dịch vụ của chúng tôi</h1>
      <p className="text-gray-600 mb-8">Đặt dịch vụ nhanh chóng, kỹ thuật viên có mặt trong 15-30 phút</p>

      {Object.entries(grouped).map(([loai, danhSach]) => (
        <div key={loai} className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-green-500 rounded"></span>
            {loai}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {danhSach.map((dv) => (
              <Link
                key={dv.ma_dich_vu}
                href={`/dich-vu/${dv.ma_dich_vu}`}
                className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{dv.ten_dich_vu}</h3>
                <p className="text-sm text-gray-500 mb-3">⏱ Thời gian: {dv.thoi_gian_xu_ly_du_kien}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {dv.loai_dich_vu?.ten_loai_dich_vu}
                  </span>
                  <span className="text-green-600 text-sm font-medium">Đặt ngay →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}