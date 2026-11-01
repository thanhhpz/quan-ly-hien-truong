// features/auth/api.ts
/**
 * Các hàm gọi API cho feature Đăng nhập / Đăng ký
 */

import { fetchApi } from '@/shared/lib/api';
import { LoginPayload, LoginResponse, RegisterPayload } from './types';

export const authApi = {
  /**
   * Đăng nhập
   * @param data - Tên đăng nhập + mật khẩu
   * @returns Token + thông tin user
   */
  login: (data: LoginPayload): Promise<LoginResponse> =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Đăng ký tài khoản khách hàng mới
   * @param data - Họ tên, username, mật khẩu, email, sđt
   */
  register: (data: RegisterPayload) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};