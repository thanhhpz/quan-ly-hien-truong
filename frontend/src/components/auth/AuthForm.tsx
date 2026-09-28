'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import './auth.css';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({
  mode: initialMode,
}: AuthFormProps) {
  const router = useRouter();

  const [mode, setMode] =
    useState<AuthMode>(initialMode);

  const [loginForm, setLoginForm] = useState({
    ten_dang_nhap: '',
    mat_khau: '',
  });

  const [registerForm, setRegisterForm] = useState({
    ho_ten: '',
    ten_dang_nhap: '',
    email: '',
    so_dien_thoai: '',
    mat_khau: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ==============================
     CHANGE MODE
  ============================== */

  function changeMode(newMode: AuthMode) {
    setError('');
    setMode(newMode);
  }

  /* ==============================
     LOGIN
  ============================== */

  async function handleLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3005/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(loginForm),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Đăng nhập thất bại',
        );

        return;
      }

      localStorage.setItem(
        'access_token',
        data.access_token,
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user),
      );

      /*
       * Cho Header biết user đã đăng nhập
       */
      window.dispatchEvent(
        new Event('auth-change'),
      );

      router.push('/');
    } catch {
      setError(
        'Không thể kết nối đến server',
      );
    } finally {
      setLoading(false);
    }
  }

  /* ==============================
     REGISTER
  ============================== */

  async function handleRegister(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3005/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(registerForm),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message ||
                'Đăng ký thất bại',
        );

        return;
      }

      /*
       * Đăng ký thành công
       * chuyển sang Login
       */

      setLoginForm({
        ten_dang_nhap:
          registerForm.ten_dang_nhap,

        mat_khau: '',
      });

      setRegisterForm({
        ho_ten: '',
        ten_dang_nhap: '',
        email: '',
        so_dien_thoai: '',
        mat_khau: '',
      });

      setMode('login');
      setError('');
    } catch {
      setError(
        'Không thể kết nối đến server',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">

      {/* =================================
          BACKGROUND
      ================================= */}

      <div className="auth-background" />

      <div className="auth-background-overlay" />


      {/* =================================
          AUTH CONTAINER
      ================================= */}

      <div className="auth-container">


        {/* =================================
            LOGIN
            BÊN TRÁI
        ================================= */}

        <section
          className={`
            auth-form
            login-form

            ${
              mode === 'login'
                ? 'form-active'
                : 'form-hidden-left'
            }
          `}
        >

          <div className="form-content">

            <h1>
              Đăng nhập
            </h1>

            <p className="form-subtitle">
              Đăng nhập vào hệ thống quản lý
              hiện trường
            </p>


            {error &&
              mode === 'login' && (
                <div className="error-box">
                  {error}
                </div>
              )}


            <form
              onSubmit={handleLogin}
            >

              {/* USERNAME */}

              <div className="input-group">

                <label>
                  Tên đăng nhập
                </label>

                <input
                  type="text"
                  value={
                    loginForm.ten_dang_nhap
                  }
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,

                      ten_dang_nhap:
                        event.target.value,
                    })
                  }
                  placeholder="Nhập tên đăng nhập"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label>
                  Mật khẩu
                </label>

                <input
                  type="password"
                  value={
                    loginForm.mat_khau
                  }
                  onChange={(event) =>
                    setLoginForm({
                      ...loginForm,

                      mat_khau:
                        event.target.value,
                    })
                  }
                  placeholder="Nhập mật khẩu"
                  required
                />

              </div>


              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? 'Đang đăng nhập...'
                  : 'Đăng nhập'}
              </button>

            </form>


            <p className="switch-text">

              Chưa có tài khoản?{' '}

              <button
                type="button"
                onClick={() =>
                  changeMode('register')
                }
              >
                Đăng ký
              </button>

            </p>

          </div>

        </section>


        {/* =================================
            REGISTER
            BÊN PHẢI
        ================================= */}

        <section
          className={`
            auth-form
            register-form

            ${
              mode === 'register'
                ? 'form-active'
                : 'form-hidden-right'
            }
          `}
        >

          <div className="form-content register-content">

            <h1>
              Đăng ký
            </h1>

            <p className="form-subtitle">
              Tạo tài khoản khách hàng
            </p>


            {error &&
              mode === 'register' && (
                <div className="error-box">
                  {error}
                </div>
              )}


            <form
              onSubmit={handleRegister}
            >

              {/* =================================
                  HỌ TÊN + USERNAME
              ================================= */}

              <div className="register-row">

                <div className="input-group">

                  <label>
                    Họ tên
                  </label>

                  <input
                    type="text"
                    value={
                      registerForm.ho_ten
                    }
                    onChange={(event) =>
                      setRegisterForm({
                        ...registerForm,

                        ho_ten:
                          event.target.value,
                      })
                    }
                    placeholder="Họ tên"
                    required
                  />

                </div>


                <div className="input-group">

                  <label>
                    Tên đăng nhập
                  </label>

                  <input
                    type="text"
                    value={
                      registerForm.ten_dang_nhap
                    }
                    onChange={(event) =>
                      setRegisterForm({
                        ...registerForm,

                        ten_dang_nhap:
                          event.target.value,
                      })
                    }
                    placeholder="Tên đăng nhập"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="input-group">

                <label>
                  Email
                </label>

                <input
                  type="email"
                  value={
                    registerForm.email
                  }
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,

                      email:
                        event.target.value,
                    })
                  }
                  placeholder="Nhập email"
                />

              </div>


              {/* PHONE */}

              <div className="input-group">

                <label>
                  Số điện thoại
                </label>

                <input
                  type="tel"
                  value={
                    registerForm.so_dien_thoai
                  }
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,

                      so_dien_thoai:
                        event.target.value,
                    })
                  }
                  placeholder="Nhập số điện thoại"
                />

              </div>


              {/* PASSWORD */}

              <div className="input-group">

                <label>
                  Mật khẩu
                </label>

                <input
                  type="password"
                  value={
                    registerForm.mat_khau
                  }
                  onChange={(event) =>
                    setRegisterForm({
                      ...registerForm,

                      mat_khau:
                        event.target.value,
                    })
                  }
                  placeholder="Nhập mật khẩu"
                  required
                />

              </div>


              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? 'Đang đăng ký...'
                  : 'Đăng ký'}
              </button>

            </form>


            <p className="switch-text">

              Đã có tài khoản?{' '}

              <button
                type="button"
                onClick={() =>
                  changeMode('login')
                }
              >
                Đăng nhập
              </button>

            </p>

          </div>

        </section>


        {/* =================================
            HÌNH XÉO
        ================================= */}

        <div
          className={`
            auth-diagonal

            ${
              mode === 'login'
                ? 'diagonal-login'
                : 'diagonal-register'
            }
          `}
        >

          <div className="diagonal-inner">

            {mode === 'login' ? (
              <>

                <h2>
                  CHÀO MỪNG
                  <br />
                  TRỞ LẠI!
                </h2>

                <p>
                  Bạn chưa có tài khoản?
                </p>

                <button
                  type="button"
                  onClick={() =>
                    changeMode('register')
                  }
                >
                  Đăng ký
                </button>

              </>
            ) : (
              <>

                <h2>
                  XIN CHÀO!
                </h2>

                <p>
                  Bạn đã có tài khoản?
                </p>

                <button
                  type="button"
                  onClick={() =>
                    changeMode('login')
                  }
                >
                  Đăng nhập
                </button>

              </>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}