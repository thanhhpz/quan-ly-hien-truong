'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { bookingApi } from '../api';
import { getCurrentUser } from '@/shared/lib/auth';

export default function BookingForm() {
  const params = useParams();
  const router = useRouter();
  const dichVuId = Number(params.id);
  const user = getCurrentUser();

  const [dichVu, setDichVu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // ⬇️ State form: Địa chỉ nhập tay (so_nha + ten_duong)
  const [form, setForm] = useState({
    mo_ta_su_co: '',
    khung_gio_mong_muon: '',
    so_nha: '',
    ten_duong: '',
  });

  // Kiểm tra đăng nhập và load dịch vụ
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.vai_tro !== 'KHACH_HANG') {
      router.push('/dashboard');
      return;
    }

    bookingApi.getServiceById(dichVuId)
      .then(setDichVu)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dichVuId, router, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await bookingApi.createRequest({
        mo_ta_su_co: form.mo_ta_su_co,
        khung_gio_mong_muon: form.khung_gio_mong_muon || undefined,
        so_nha: form.so_nha,
        ten_duong: form.ten_duong,
        ma_dich_vu: dichVuId,
      });
      alert('Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ trong 15 phút.');
      router.push('/phieu-cua-toi');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!dichVu) return <div className="p-8 text-center text-red-500">{error || 'Không tìm thấy dịch vụ'}</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link href="/dich-vu" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block">
        ← Quay lại danh sách dịch vụ
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{dichVu.ten_dich_vu}</h1>
          <p className="text-gray-500 mt-1">
            ⏱ Thời gian xử lý: {dichVu.thoi_gian_xu_ly_du_kien} — Loại: {dichVu.loai_dich_vu?.ten_loai_dich_vu}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Mô tả sự cố <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.mo_ta_su_co}
              onChange={(e) => setForm({ ...form, mo_ta_su_co: e.target.value })}
              required
              minLength={10}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="VD: Điều hòa chạy nhưng không lạnh, có tiếng ồn lớn..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Thời gian mong muốn
            </label>
            <input
              type="text"
              value={form.khung_gio_mong_muon}
              onChange={(e) => setForm({ ...form, khung_gio_mong_muon: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="VD: Trong hôm nay, buổi sáng"
            />
          </div>

          {/* ⬇️ ĐỊA CHỈ: NHẬP TAY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Số nhà <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.so_nha}
                onChange={(e) => setForm({ ...form, so_nha: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="VD: 123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tên đường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.ten_duong}
                onChange={(e) => setForm({ ...form, ten_duong: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="VD: Nguyễn Văn Cừ"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition"
          >
            {submitting ? 'Đang gửi yêu cầu...' : '📞 Gửi yêu cầu đặt dịch vụ'}
          </button>
        </form>
      </div>
    </div>
  );
}