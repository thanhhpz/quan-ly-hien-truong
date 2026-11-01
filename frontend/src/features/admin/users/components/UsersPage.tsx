'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/shared/lib/api';
import CreateEmployeeModal from './CreateEmployeeModal';
interface Role {
  ma_vai_tro: number;
  ten_vai_tro: string;
}

interface User {
  ma_nguoi_dung: number;
  ten_dang_nhap: string;
  ho_ten: string;
  email: string | null;
  so_dien_thoai?: string | null;
  vai_tro: string;
  trang_thai: string;
}

type SortKey = 'ma_nguoi_dung' | 'ho_ten' | 'ten_dang_nhap';
type SortOrder = 'asc' | 'desc';

export default function UsersPage() {
  // ===== STATE =====
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Filter
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sort
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Edit modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ ho_ten: '', email: '', so_dien_thoai: '' });
  const [editLoading, setEditLoading] = useState(false);

  // Format Vai Trò Tiếng Việt
  function formatVaiTro(vaiTro: string) {
    if (!vaiTro) return '';
    const upper = vaiTro.toUpperCase();
    if (upper === 'ADMIN') return 'Quản trị viên';
    if (upper === 'KHACH_HANG') return 'Khách hàng';
    if (upper === 'NHAN_VIEN') return 'Nhân viên';
    return vaiTro;
  }

  // ===== LOAD DATA =====
  function loadUsers() {
    setLoading(true);
    let query = '?page=' + page + '&limit=10';
    if (search) query += '&q=' + search;
    if (roleFilter) query += '&vai_tro=' + roleFilter;
    if (statusFilter) query += '&trang_thai=' + statusFilter;

    adminApi.getUsers(query)
      .then((res) => {
        setUsers(res.data);
        setTotal(res.total);
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, [page, search, roleFilter, statusFilter]);

  useEffect(() => {
    adminApi.getRoles().then(setRoles).catch(() => {});
  }, []);

  // ===== ACTIONS =====
  async function toggleStatus(user: User) {
    const newStatus = user.trang_thai === 'HOAT_DONG' ? 'BI_KHOA' : 'HOAT_DONG';
    if (!confirm('Bạn có chắc muốn đổi trạng thái tài khoản này?')) return;

    try {
      await adminApi.updateStatus(String(user.ma_nguoi_dung), newStatus);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function changeRole(user: User, maVaiTro: number) {
    if (!confirm('Đổi vai trò của người dùng này?')) return;

    try {
      await adminApi.updateUserRole(String(user.ma_nguoi_dung), maVaiTro);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function resetPassword(user: User) {
    if (!confirm('Reset mật khẩu của người dùng này?')) return;

    try {
      const res = await adminApi.resetPassword(String(user.ma_nguoi_dung));
      alert('Mật khẩu mới: ' + res.mat_khau_moi);
    } catch (err: any) {
      alert(err.message);
    }
  }

  // ===== EDIT =====
  function openEdit(user: User) {
    setEditingUser(user);
    setEditForm({
      ho_ten: user.ho_ten || '',
      email: user.email || '',
      so_dien_thoai: user.so_dien_thoai || '',
    });
  }

  async function saveEdit() {
    if (!editingUser) return;
    setEditLoading(true);

    try {
      await adminApi.updateUser(String(editingUser.ma_nguoi_dung), {
        ho_ten: editForm.ho_ten,
        email: editForm.email || undefined,
        so_dien_thoai: editForm.so_dien_thoai || undefined,
      });
      setEditingUser(null);
      loadUsers();
      alert('Cập nhật thành công!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  }

  // ===== EXPORT CSV =====
  function exportCSV() {
    if (users.length === 0) {
      alert('Không có dữ liệu để xuất.');
      return;
    }

    const headers = ['ID', 'Tên đăng nhập', 'Họ tên', 'Email', 'Vai trò', 'Trạng thái'];
    const rows = users.map((u) => [
      u.ma_nguoi_dung,
      u.ten_dang_nhap,
      u.ho_ten || '',
      u.email || '',
      formatVaiTro(u.vai_tro),
      u.trang_thai === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ===== SORT =====
  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortKey(null);
      setSortOrder('asc');
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    let compare = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      compare = aVal - bVal;
    } else {
      compare = String(aVal).localeCompare(String(bVal), 'vi');
    }
    return sortOrder === 'asc' ? compare : -compare;
  });

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  }

  // ===== RENDER =====
  return (
    <div style={{ padding: '20px 30px', fontFamily: 'sans-serif', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ marginBottom: '5px' }}>Quản lý người dùng</h2>
      <p style={{ color: '#666', marginBottom: '15px' }}>Tổng: {total} tài khoản</p>

      {/* Thanh tìm kiếm, bộ lọc và nút thêm nhân viên nằm chung một hàng */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', width: '220px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button 
            onClick={() => setShowModal(true)}
            style={{ padding: '8px 16px', background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Thêm nhân viên
          </button>
          <button
            onClick={exportCSV}
            style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            Xuất CSV
          </button>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="KHACH_HANG">Khách hàng</option>
            {roles.map((r) => (
              <option key={r.ma_vai_tro} value={r.ten_vai_tro}>
                {formatVaiTro(r.ten_vai_tro)}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="HOAT_DONG">Hoạt động</option>
            <option value="BI_KHOA">Đã khóa</option>
          </select>
        </div>

 
      </div>

      {/* Bảng dữ liệu */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
              <th onClick={() => handleSort('ma_nguoi_dung')} style={{ padding: '10px', cursor: 'pointer', userSelect: 'none' }}>
                ID{sortIndicator('ma_nguoi_dung')}
              </th>
              <th onClick={() => handleSort('ten_dang_nhap')} style={{ padding: '10px', cursor: 'pointer', userSelect: 'none' }}>
                Tên đăng nhập{sortIndicator('ten_dang_nhap')}
              </th>
              <th onClick={() => handleSort('ho_ten')} style={{ padding: '10px', cursor: 'pointer', userSelect: 'none' }}>
                Họ tên{sortIndicator('ho_ten')}
              </th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Vai trò</th>
              <th style={{ padding: '10px' }}>Trạng thái</th>
              <th style={{ padding: '10px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.ma_nguoi_dung} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{user.ma_nguoi_dung}</td>
                <td style={{ padding: '10px' }}>{user.ten_dang_nhap}</td>
                <td style={{ padding: '10px' }}>{user.ho_ten}</td>
                <td style={{ padding: '10px' }}>{user.email || '-'}</td>
                <td style={{ padding: '10px' }}>
                  {user.vai_tro === 'ADMIN' || user.vai_tro === 'KHACH_HANG' ? (
                    formatVaiTro(user.vai_tro)
                  ) : (
                    <select
                      value={roles.find((r) => r.ten_vai_tro === user.vai_tro)?.ma_vai_tro || ''}
                      onChange={(e) => changeRole(user, Number(e.target.value))}
                      style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                      {roles
                        .filter((r) => r.ten_vai_tro !== 'ADMIN')
                        .map((r) => (
                          <option key={r.ma_vai_tro} value={r.ma_vai_tro}>
                            {formatVaiTro(r.ten_vai_tro)}
                          </option>
                        ))}
                    </select>
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  {user.trang_thai === 'HOAT_DONG' ? 'Hoạt động' : 'Đã khóa'}
                </td>
                <td style={{ padding: '10px' }}>
                  {user.vai_tro !== 'ADMIN' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        onClick={() => openEdit(user)}
                        style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => resetPassword(user)}
                        style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Đặt lại mật khẩu
                      </button>
                      <button 
                        onClick={() => toggleStatus(user)}
                        style={{ padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {user.trang_thai === 'HOAT_DONG' ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Phân trang */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
        <button 
          disabled={page <= 1} 
          onClick={() => setPage(page - 1)}
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          Trước
        </button>
        <span>Trang {page}</span>
        <button 
          disabled={page >= Math.ceil(total / 10)} 
          onClick={() => setPage(page + 1)}
          style={{ padding: '6px 12px', cursor: 'pointer' }}
        >
          Sau
        </button>
      </div>

      {/* Modal thêm nhân viên */}
      {showModal && (
        <CreateEmployeeModal
          roles={roles.map(r => ({ ...r, ten_vai_tro: formatVaiTro(r.ten_vai_tro) }))}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); loadUsers(); }}
        />
      )}

      {/* Modal sửa thông tin nhân viên */}
      {editingUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '6px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Sửa thông tin nhân viên</h3>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Họ tên</label>
              <input
                type="text"
                value={editForm.ho_ten}
                onChange={(e) => setEditForm({ ...editForm, ho_ten: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Số điện thoại</label>
              <input
                type="text"
                value={editForm.so_dien_thoai}
                onChange={(e) => setEditForm({ ...editForm, so_dien_thoai: e.target.value })}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setEditingUser(null)}
                style={{ padding: '6px 12px', border: '1px solid #ccc', background: '#fff', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                onClick={saveEdit}
                disabled={editLoading}
                style={{ padding: '6px 12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: editLoading ? 0.5 : 1 }}
              >
                {editLoading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}