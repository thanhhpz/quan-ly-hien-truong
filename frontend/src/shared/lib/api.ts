const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export async function fetchApi(path: string, options: RequestInit = {}) {
  // Lấy token từ localStorage (chỉ chạy ở client)
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token hết hạn hoặc không hợp lệ -> đá về trang login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Lỗi HTTP ${res.status}`);
  }

  return res.json();
}

// Các hàm gọi API cụ thể cho Admin
// Các hàm gọi API cụ thể cho Admin
export const adminApi = {
  // ===== DASHBOARD =====
  getStats: () => fetchApi('/admin/stats'),

  // ===== USERS =====
  getUsers: (query: string) => fetchApi(`/admin/users${query}`),
  getUser: (id: string) => fetchApi(`/admin/users/${id}`),
  createNhanVien: (data: any) =>
    fetchApi('/admin/users/nhan-vien', { method: 'POST', body: JSON.stringify(data) }),
  updateUserRole: (id: string, ma_vai_tro: number) =>
    fetchApi(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ ma_vai_tro }),
    }),
  updateStatus: (id: string, trang_thai: string) =>
    fetchApi(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ trang_thai }),
    }),
  resetPassword: (id: string, mat_khau_moi?: string) =>
    fetchApi(`/admin/users/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify(mat_khau_moi ? { mat_khau_moi } : {}),
    }),

  // ===== ROLES =====
  getRoles: () => fetchApi('/admin/roles'),
  createRole: (data: { ten_vai_tro: string }) =>
    fetchApi('/admin/roles', { method: 'POST', body: JSON.stringify(data) }),
  updateRoleInfo: (id: number, data: { ten_vai_tro?: string }) =>
    fetchApi(`/admin/roles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteRole: (id: number) => fetchApi(`/admin/roles/${id}`, { method: 'DELETE' }),
  getRolePermissions: (id: number) => fetchApi(`/admin/roles/${id}/permissions`),
  assignPermissions: (id: number, ma_quyen: number[]) =>
    fetchApi(`/admin/roles/${id}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ ma_quyen }),
    }),
updateUser: (id: string, data: { ho_ten?: string; email?: string; so_dien_thoai?: string }) =>
  fetchApi(`/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  // ===== PERMISSIONS =====
  getPermissions: () => fetchApi('/admin/permissions'),
};