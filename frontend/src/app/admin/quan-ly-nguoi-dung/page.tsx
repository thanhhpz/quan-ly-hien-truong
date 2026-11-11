'use client';

import { useEffect, useState, useCallback } from 'react';
import { API_BASE, getToken, getUser } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Lấy thông tin admin đang đăng nhập
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState('ALL'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Lấy user hiện tại khi component mount
  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const query = new URLSearchParams();
      if (searchTerm) query.append('search', searchTerm);
      
      if (activeTab === 'KHOA') {
        query.append('trang_thai', 'KHOA');
      } else if (activeTab !== 'ALL') {
        query.append('vai_tro', activeTab);
      }

      const res = await fetch(`${API_BASE}/users?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không thể tải danh sách người dùng');

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeTab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const confirmMsg = currentStatus === 'HOAT_DONG' 
      ? 'Bạn có chắc muốn KHÓA tài khoản này?' 
      : 'Bạn có chắc muốn MỞ KHÓA tài khoản này?';
      
    if (!window.confirm(confirmMsg)) return;

    setActionLoading(id);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Đọc lỗi chi tiết từ Backend
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lỗi khi cập nhật trạng thái');
      }

      // Cập nhật state ngay lập tức
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.ma_nguoi_dung === id
            ? { ...u, trang_thai: u.trang_thai === 'HOAT_DONG' ? 'KHOA' : 'HOAT_DONG' }
            : u
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'KHACH_HANG', label: 'Khách hàng' },
    { id: 'KY_THUAT_VIEN', label: 'Kỹ thuật viên' },
    { id: 'DIEU_PHOI_VIEN', label: 'Điều phối viên' },
    { id: 'ADMIN', label: 'Quản trị viên' },
    { id: 'KHOA', label: 'Tài khoản bị khóa' },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600';
      case 'DIEU_PHOI_VIEN': return 'text-orange-600';
      case 'KY_THUAT_VIEN': return 'text-blue-600';
      case 'KHACH_HANG': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HOAT_DONG': return 'text-green-700';
      case 'KHOA': return 'text-red-700';
      case 'TAM_KHOA': return 'text-yellow-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="w-[92%] max-w-[1400px] mx-auto py-8">
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo Tên, Tên ĐN, hoặc Mã ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-orange-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Mã ID</th>
                <th className="p-4 font-medium">Họ Tên</th>
                <th className="p-4 font-medium">Tên Đăng Nhập</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Số Điện Thoại</th>
                <th className="p-4 font-medium">Vai Trò</th>
                <th className="p-4 font-medium">Trạng Thái</th>
                <th className="p-4 font-medium text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-500">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.ma_nguoi_dung} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-mono">#{user.ma_nguoi_dung}</td>
                    <td className="p-4 text-sm text-gray-900 font-medium">{user.ho_ten}</td>
                    <td className="p-4 text-sm text-gray-600">{user.ten_dang_nhap}</td>
                    <td className="p-4 text-sm text-gray-600">{user.email || 'null'}</td>
                    <td className="p-4 text-sm text-gray-600">{user.so_dien_thoai || 'null'}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.vai_tro)}`}>
                        {user.vai_tro.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.trang_thai)}`}>
                        {user.trang_thai === 'HOAT_DONG' ? 'Hoạt động' : user.trang_thai === 'KHOA' ? 'Đã khóa' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {/* Ẩn nút khóa nếu là chính mình */}
                      {user.ma_nguoi_dung === currentUser?.id ? (
                        <span className="text-xs text-gray-400 italic px-3 py-1.5">Bạn</span>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.ma_nguoi_dung, user.trang_thai)}
                          disabled={actionLoading === user.ma_nguoi_dung}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            user.trang_thai === 'HOAT_DONG'
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-green-200 text-green-600 hover:bg-green-50'
                          } disabled:opacity-50`}
                        >
                          {actionLoading === user.ma_nguoi_dung
                            ? 'Đang xử lý...'
                            : user.trang_thai === 'HOAT_DONG'
                            ? 'Khóa'
                            : 'Mở khóa'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}