'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/shared/lib/api';

interface Permission {
  ma_quyen: number;
  ten_quyen: string;
  mo_ta?: string;
}

interface Role {
  ma_vai_tro: number;
  ten_vai_tro: string;
  vai_tro_quyen: { ma_quyen: number; quyen: Permission }[];
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [creating, setCreating] = useState(false);

  // Format vai trò sang tiếng Việt
  function formatVaiTro(vaiTro: string) {
    if (!vaiTro) return '';
    const upper = vaiTro.toUpperCase();
    if (upper === 'ADMIN') return 'Quản trị viên';
    if (upper === 'KHACH_HANG') return 'Khách hàng';
    if (upper === 'NHAN_VIEN') return 'Nhân viên';
    return vaiTro;
  }

  async function loadRoles() {
    setLoading(true);
    try {
      const data = await adminApi.getRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  async function handleCreateRole() {
    if (!newRoleName.trim()) return;
    setCreating(true);
    try {
      await adminApi.createRole({ ten_vai_tro: newRoleName.trim().toUpperCase() });
      setNewRoleName('');
      setShowCreate(false);
      loadRoles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteRole(role: Role) {
    if (!confirm(`Xóa vai trò "${formatVaiTro(role.ten_vai_tro)}"?`)) return;
    try {
      await adminApi.deleteRole(role.ma_vai_tro);
      loadRoles();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px' }}>Đang tải...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Vai trò & Phân quyền</h2>
      <p style={{ color: '#666' }}>Quản lý vai trò và gán quyền cho từng vai trò trong hệ thống</p>

      <button onClick={() => setShowCreate(true)} style={{ padding: '6px 12px', cursor: 'pointer', marginBottom: '15px' }}>
        + Thêm vai trò
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showCreate && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
          <h3>Tạo vai trò mới</h3>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="VD: KE_TOAN"
            style={{ padding: '6px', marginRight: '5px' }}
          />
          <button
            onClick={() => {
              setShowCreate(false);
              setNewRoleName('');
            }}
            style={{ padding: '6px 10px', marginRight: '5px', cursor: 'pointer' }}
          >
            Hủy
          </button>
          <button
            onClick={handleCreateRole}
            disabled={creating || !newRoleName.trim()}
            style={{ padding: '6px 10px', cursor: 'pointer' }}
          >
            {creating ? 'Đang tạo...' : 'Tạo'}
          </button>
        </div>
      )}

      <div>
        {roles.map((role) => {
          const isAdmin = role.ten_vai_tro === 'ADMIN';
          return (
            <div key={role.ma_vai_tro} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>
                {formatVaiTro(role.ten_vai_tro)} (ID: {role.ma_vai_tro})
              </h3>

              <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
                Quyền ({isAdmin ? 'Toàn bộ' : role.vai_tro_quyen?.length || 0}):
              </p>

              <div style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                {isAdmin ? (
                  <span>Toàn bộ quyền hệ thống</span>
                ) : role.vai_tro_quyen && role.vai_tro_quyen.length > 0 ? (
                  role.vai_tro_quyen.map((vtq) => (
                    <span key={vtq.ma_quyen} style={{ marginRight: '8px' }}>
                      - {vtq.quyen?.ten_quyen}
                    </span>
                  ))
                ) : (
                  <span>Chưa có quyền nào</span>
                )}
              </div>

              <div>
                <Link href={`/dashboard/roles/${role.ma_vai_tro}`} style={{ marginRight: '10px' }}>
                  {isAdmin ? 'Xem' : 'Sửa quyền'}
                </Link>
                {!isAdmin && (
                  <button onClick={() => handleDeleteRole(role)} style={{ cursor: 'pointer' }}>
                    Xóa
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}