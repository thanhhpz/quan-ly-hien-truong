'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    ho_ten: '',
    ten_dang_nhap: '',
    email: '',
    so_dien_thoai: '',
    mat_khau: '',
  });

  const [error, setError] = useState('');

  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3005/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Đăng ký thất bại');
        return;
      }

      router.push('/login');
    } catch {
      setError('Không thể kết nối đến server');
    }
  }

  return (
    <main className="">
      <form
        onSubmit={handleRegister}
        className=""
      >
        <h1 className="">Đăng ký</h1>

        {error && (
          <div className="">
            {error}
          </div>
        )}

        {[
          ['ho_ten', 'Họ tên'],
          ['ten_dang_nhap', 'Tên đăng nhập'],
          ['email', 'Email'],
          ['so_dien_thoai', 'Số điện thoại'],
          ['mat_khau', 'Mật khẩu'],
        ].map(([name, label]) => (
          <div className="mb-4" key={name}>
            <label className="">{label}</label>

            <input
              type={name === 'mat_khau' ? 'password' : 'text'}
              value={form[name as keyof typeof form]}
              onChange={(e) => handleChange(name, e.target.value)}
              className=""
            />
          </div>
        ))}

        <button
          type="submit"
          className=""
        >
          Đăng ký
        </button>

        <p className="">
          Đã có tài khoản?{' '}
          <a href="/login" className="">
            Đăng nhập
          </a>
        </p>
      </form>
    </main>
  );
}
