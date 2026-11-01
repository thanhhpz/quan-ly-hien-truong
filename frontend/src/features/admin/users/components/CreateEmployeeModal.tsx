// features/admin/users/components/CreateEmployeeModal.tsx
'use client';

import { useState } from 'react';
import { adminUsersApi } from '../api';
import { VaiTro } from '../types';

interface CreateEmployeeModalProps {
  roles: VaiTro[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEmployeeModal({
  roles,
  onClose,
  onSuccess,
}: CreateEmployeeModalProps) {
  const availableRoles = roles.filter((r) => r.ten_vai_tro !== 'ADMIN');

  const [form, setForm] = useState({
    ho_ten: '',
    ten_dang_nhap: '',
    mat_khau: '',
    email: '',
    so_dien_thoai: '',
    ma_vai_tro:
      availableRoles.find((r) => r.ten_vai_tro === 'NHAN_VIEN')?.ma_vai_tro ??
      availableRoles[0]?.ma_vai_tro ??
      2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminUsersApi.taoNhanVien({
        ...form,
        email: form.email || undefined,
        so_dien_thoai: form.so_dien_thoai || undefined,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
      <div className="bg-white border border-gray-300 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Tạo nhân viên mới</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-2xl leading-none px-1"
          >
            ×
          </button>
        </div>

        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Họ tên <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              value={form.ho_ten}
              onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
              required
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Tên đăng nhập <span className="text-orange-600">*</span>
            </label>
            <input
              type="text"
              value={form.ten_dang_nhap}
              onChange={(e) => setForm({ ...form, ten_dang_nhap: e.target.value })}
              required
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
              placeholder="nv001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Mật khẩu <span className="text-orange-600">*</span>
            </label>
            <input
              type="password"
              value={form.mat_khau}
              onChange={(e) => setForm({ ...form, mat_khau: e.target.value })}
              required
              minLength={6}
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Số điện thoại</label>
            <input
              type="text"
              value={form.so_dien_thoai}
              onChange={(e) => setForm({ ...form, so_dien_thoai: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
              placeholder="0901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Vai trò <span className="text-orange-600">*</span>
            </label>
            <select
              value={form.ma_vai_tro}
              onChange={(e) => setForm({ ...form, ma_vai_tro: Number(e.target.value) })}
              className="w-full border border-gray-300 px-3 py-2.5 focus:outline-none focus:border-orange-500"
            >
              {availableRoles.map((r) => (
                <option key={r.ma_vai_tro} value={r.ma_vai_tro}>
                  {r.ten_vai_tro}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Đang tạo...' : 'Tạo nhân viên'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}