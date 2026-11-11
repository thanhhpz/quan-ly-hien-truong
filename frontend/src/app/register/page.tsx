'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      ho_ten: formData.get('ho_ten'),
      ten_dang_nhap: formData.get('ten_dang_nhap'),
      email: formData.get('email'),
      so_dien_thoai: formData.get('so_dien_thoai'),
      mat_khau: formData.get('mat_khau'),
      vai_tro: 'KHACH_HANG', // Mặc định đăng ký là khách
    };

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Xử lý mảng lỗi từ class-validator của NestJS (nếu có)
        const message = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(message || 'Đăng ký thất bại');
      }

      // Thành công chuyển sang login
      router.push('/login?registered=1');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container: căn giữa, nền xám
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-5 py-10">
      
      {/* Khung form */}
      <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-[400px]">
        <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">
          Đăng Ký Tài Khoản
        </h2>
        
        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="ho_ten" 
            placeholder="Họ và tên (*)" 
            required 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          <input 
            name="ten_dang_nhap" 
            placeholder="Tên đăng nhập (*)" 
            required 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          <input 
            name="so_dien_thoai" 
            placeholder="Số điện thoại" 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          <input 
            name="mat_khau" 
            type="password" 
            placeholder="Mật khẩu (*)" 
            required 
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full text-[15px] font-medium hover:bg-gray-800 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-500">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-orange-600 font-medium hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}