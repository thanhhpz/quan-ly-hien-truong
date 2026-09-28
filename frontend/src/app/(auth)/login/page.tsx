// 'use client';

// import { FormEvent, useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   async function handleLogin(event: FormEvent) {
//     event.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:3005/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ten_dang_nhap: username,
//           mat_khau: password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || 'Đăng nhập thất bại');
//         return;
//       }

//       // localStorage.setItem('access_token', data.access_token);

//       // router.push('/dashboard');
//       localStorage.setItem('access_token', data.access_token);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       window.dispatchEvent(new Event('auth-change'));
//       router.push('/');
//     } catch {
//       setError('Không thể kết nối đến server');
//     }
//   }

//   return (
//     <main className="">
//       <form onSubmit={handleLogin} className="">
//         <h1 className="">Đăng nhập</h1>
//         {error && (
//           <div className="">{error}</div>
//         )}
//         <div className="mb-4">
//             <label className="">Tên đăng nhập</label>
//              <input
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className=""
//                 placeholder="Nhập tên đăng nhập"
//             />
//         </div>

//         <div className="mb-6">
//           <label className="">Mật khẩu</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className=""
//             placeholder="Nhập mật khẩu"
//           />
//         </div>

//         <button type="submit" className="">Đăng nhập</button>
//         <p className="">
//           Chưa có tài khoản thì tự biết đăng ký đi cha?{' '}
//           <a href="/register" className=""> Đăng ký</a>
//         </p>
//       </form>
//     </main>
//   );
// }


import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return <AuthForm mode="login" />;
}