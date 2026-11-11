'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === '1') {
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      ten_dang_nhap: formData.get('ten_dang_nhap'),
      mat_khau: formData.get('mat_khau'),
    };

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Container bao ngoài: căn giữa màn hình, nền xám nhạt
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 p-5">
      
      {/* Khung form: nền trắng, bo góc, đổ bóng */}
      <div className="bg-white p-10 shadow-sm w-full max-w-[400px]">
        <h2 className="text-center mb-6 text-2xl font-semibold text-gray-900">
          Đăng Nhập
        </h2>
        
        {/* Thông báo thành công / lỗi */}
        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            name="ten_dang_nhap" 
            placeholder="Tên đăng nhập" 
            required 
            className="w-full px-4 py-3 border border-gray-200  text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          <input 
            name="mat_khau" 
            type="password" 
            placeholder="Mật khẩu" 
            required 
            className="w-full px-4 py-3 border border-gray-200  text-[15px] outline-none focus:border-gray-900 transition-colors"
          />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-full text-[15px] font-medium hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-orange-600 font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>
        <p className="text-center mt-5 text-sm text-gray-500">
          <Link href="/" className="text-orange-600 font-medium hover:underline">
            Quay lai
          </Link>
        </p>
      </div>
    </div>
  );
}