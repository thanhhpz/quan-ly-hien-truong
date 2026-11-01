'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminApi } from '@/shared/lib/api';

interface Permission {
  ma_quyen: number;
  ten_quyen: string;
  mo_ta?: string;
}

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = Number(params.id);

  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [roleName, setRoleName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Format vai trò sang tiếng Việt
  function formatVaiTro(vaiTro: string) {
    if (!vaiTro) return '';
    const upper = vaiTro.toUpperCase();
    if (upper === 'ADMIN') return 'Quản trị viên';
    if (upper === 'KHACH_HANG') return 'Khách hàng';
    if (upper === 'NHAN_VIEN') return 'Nhân viên';
    return vaiTro;
  }

  // Dịch và chuẩn hóa tên module sang tiếng Việt
  function formatModule(module: string) {
    const map: Record<string, string> = {
      user: 'Quản lý người dùng',
      role: 'Quản lý vai trò & quyền',
      permission: 'Quản lý quyền',
      category: 'Quản lý danh mục',
      request: 'Quản lý yêu cầu / phiếu dịch vụ',
      invoice: 'Quản lý hóa đơn',
      report: 'Báo cáo thống kê',
      product: 'Quản lý sản phẩm',
      order: 'Quản lý đơn hàng',
      setting: 'Cài đặt hệ thống',
    };
    return map[module.toLowerCase()] || module;
  }

  useEffect(() => {
    async function load() {
      try {
        const [perms, roleData] = await Promise.all([
          adminApi.getPermissions(),
          adminApi.getRolePermissions(roleId),
        ]);
        setAllPermissions(perms);
        setRoleName(roleData.ten_vai_tro);
        setIsAdmin(roleData.ten_vai_tro.toUpperCase() === 'ADMIN');
        setSelectedIds(roleData.quyen.map((q: Permission) => q.ma_quyen));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [roleId]);

  function togglePermission(ma_quyen: number) {
    setSelectedIds((prev) =>
      prev.includes(ma_quyen) ? prev.filter((id) => id !== ma_quyen) : [...prev, ma_quyen],
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminApi.assignPermissions(roleId, selectedIds);
      alert('Lưu thành công!');
      router.push('/dashboard/roles');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>Đang tải...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'red' }}>Lỗi: {error}</div>;
  }

  const grouped: Record<string, Permission[]> = {};
  for (const perm of allPermissions) {
    const module = perm.ten_quyen.split(':')[0] || 'khac';
    if (!grouped[module]) grouped[module] = [];
    grouped[module].push(perm);
  }

  return (
    <div style={{ padding: '20px 30px', fontFamily: 'sans-serif', width: '100%', boxSizing: 'border-box' }}>
      <button
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', color: '#0066cc', cursor: 'pointer', padding: '0', marginBottom: '15px' }}
      >
        ← Quay lại
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>
            Phân quyền: {formatVaiTro(roleName)}
          </h2>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            Đã chọn <strong>{selectedIds.length}</strong> / {allPermissions.length} quyền
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '6px 14px', cursor: 'pointer' }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        )}
      </div>

      {isAdmin && (
        <p style={{ padding: '8px', border: '1px solid #ccc', background: '#eee', fontSize: '14px', marginBottom: '20px' }}>
          Vai trò Quản trị viên có toàn bộ quyền hệ thống và không thể sửa.
        </p>
      )}

      {/* Bọc toàn bộ các nhóm trong một khung flex-wrap để các nhóm tự xếp ngang và xuống dòng */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
        {Object.entries(grouped).map(([module, perms]) => (
          <div key={module} style={{ flex: '1 1 300px', minWidth: '280px', marginBottom: '10px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 'bold' }}>
              {formatModule(module)}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {perms.map((perm) => {
                const isChecked = selectedIds.includes(perm.ma_quyen);
                return (
                  <label
                    key={perm.ma_quyen}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: isAdmin ? 'not-allowed' : 'pointer',
                      opacity: isAdmin ? 0.6 : 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => !isAdmin && togglePermission(perm.ma_quyen)}
                      disabled={isAdmin}
                      style={{ cursor: isAdmin ? 'not-allowed' : 'pointer' }}
                    />
                    <span style={{ fontSize: '14px' }}>{perm.mo_ta || perm.ten_quyen}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}