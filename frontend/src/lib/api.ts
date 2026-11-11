// frontend/src/lib/api.ts
export const API_BASE = 'http://localhost:3005';

// Hàm lấy token
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Hàm lấy thông tin user
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Kiểm tra xem user có quyền truy cập không
export const hasRole = (allowedRoles: string[]) => {
  const user = getUser();
  if (!user || !user.vai_tro) return false;
  return allowedRoles.includes(user.vai_tro);
};