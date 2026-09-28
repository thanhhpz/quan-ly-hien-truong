// 'use client';

// import { FormEvent, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function RegisterPage() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     ho_ten: '',
//     ten_dang_nhap: '',
//     email: '',
//     so_dien_thoai: '',
//     mat_khau: '',
//   });

//   const [error, setError] = useState('');

//   function handleChange(name: string, value: string) {
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   }

//   async function handleRegister(event: FormEvent) {
//     event.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3005/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || 'Đăng ký thất bại');
//         return;
//       }

//       router.push('/login');
//     } catch {
//       setError('Không thể kết nối đến server');
//     }
//   }

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleRegister}
//         className="w-full max-w-md rounded-lg bg-white p-8 shadow"
//       >
//         <h1 className="mb-6 text-2xl font-bold">Đăng ký</h1>

//         {error && (
//           <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-600">
//             {error}
//           </div>
//         )}

//         {[
//           ['ho_ten', 'Họ tên'],
//           ['ten_dang_nhap', 'Tên đăng nhập'],
//           ['email', 'Email'],
//           ['so_dien_thoai', 'Số điện thoại'],
//           ['mat_khau', 'Mật khẩu'],
//         ].map(([name, label]) => (
//           <div className="mb-4" key={name}>
//             <label className="mb-1 block text-sm font-medium">{label}</label>

//             <input
//               type={name === 'mat_khau' ? 'password' : 'text'}
//               value={form[name as keyof typeof form]}
//               onChange={(e) => handleChange(name, e.target.value)}
//               className="w-full rounded border p-2"
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
//         >
//           Đăng ký
//         </button>

//         <p className="mt-4 text-center text-sm">
//           Đã có tài khoản?{' '}
//           <a href="/login" className="font-medium underline">
//             Đăng nhập
//           </a>
//         </p>
//       </form>
//     </main>
//   );
// }

import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}