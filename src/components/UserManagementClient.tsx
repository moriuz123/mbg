'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Edit2, Shield, X, Save, Search, Filter,
  CheckCircle2, ShieldAlert, UserPlus, Mail, Lock, User,
  Building2, GraduationCap, HeartPulse, Factory, Utensils,
  ShieldCheck, ChevronDown, Eye, EyeOff, Trash2
} from 'lucide-react';
import { updateUserRole, createUserByAdmin } from '@/app/actions/userManagement';

type UserData = {
  id: string;
  name: string;
  username: string | null;
  displayUsername: string | null;
  email: string;
  role: string;
  createdAt: Date;
  sekolahId: number | null;
  posyanduId: number | null;
  penggilinganId: number | null;
  sppgId: number | null;
  sekolahName: string | null;
  posyanduName: string | null;
  penggilinganName: string | null;
  sppgName: string | null;
};

type ReferenceData = {
  sekolahList: { id: number; nama: string }[];
  posyanduList: { id: number; nama: string }[];
  penggilinganList: { id: number; nama: string }[];
  sppgList: { id: number; nama: string }[];
};

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  admin_dinas: { label: 'Admin Dinas', color: 'text-violet-700', bg: 'bg-violet-100', icon: <ShieldCheck size={12} /> },
  operator_sppg: { label: 'Operator SPPG', color: 'text-sky-700', bg: 'bg-sky-100', icon: <Utensils size={12} /> },
  operator_sekolah: { label: 'Operator Sekolah', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: <GraduationCap size={12} /> },
  operator_posyandu: { label: 'Operator Posyandu', color: 'text-rose-700', bg: 'bg-rose-100', icon: <HeartPulse size={12} /> },
  operator_penggilingan: { label: 'Operator Penggilingan', color: 'text-amber-700', bg: 'bg-amber-100', icon: <Factory size={12} /> },
  publik: { label: 'Publik', color: 'text-slate-600', bg: 'bg-slate-100', icon: <User size={12} /> },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.publik;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function AssignmentBadge({ user }: { user: UserData }) {
  const name = user.sppgName ?? user.sekolahName ?? user.posyanduName ?? user.penggilinganName;
  if (!name) return <span className="text-xs text-slate-400 italic">Global</span>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
      <Building2 size={11} className="text-slate-500" /> {name}
    </span>
  );
}

export default function UserManagementClient({
  users,
  referenceData,
}: {
  users: UserData[];
  referenceData: ReferenceData;
}) {
  const [activeUser, setActiveUser] = useState<UserData | null>(null);
  const [editRole, setEditRole] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createRole, setCreateRole] = useState('operator_sppg');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Semua');

  const notify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  /* ────────── CREATE USER ────────── */
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await createUserByAdmin(fd);
      if (result.success) {
        setShowCreateModal(false);
        notify('success', result.message ?? 'Pengguna berhasil dibuat!');
      } else {
        notify('error', result.message ?? 'Gagal membuat pengguna');
      }
    } catch {
      notify('error', 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────── EDIT ROLE ────────── */
  const openEdit = (u: UserData) => {
    setActiveUser(u);
    setEditRole(u.role);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const result = await updateUserRole(fd);
      if (result.success) {
        setActiveUser(null);
        notify('success', result.message ?? 'Hak akses diperbarui!');
      } else {
        notify('error', result.message ?? 'Gagal memperbarui');
      }
    } catch {
      notify('error', 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ────────── REUSABLE: ASSIGNMENT SELECT ────────── */
  const AssignmentSelect = ({
    role,
    user,
  }: {
    role: string;
    user?: UserData | null;
  }) => {
    if (role === 'operator_sekolah')
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-emerald-700">Penugasan Sekolah</label>
          <select
            name="sekolahId"
            required
            defaultValue={user?.sekolahId ?? ''}
            className="w-full p-3 rounded-xl border border-emerald-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">-- Pilih Sekolah --</option>
            {referenceData.sekolahList.map((s) => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        </div>
      );
    if (role === 'operator_posyandu')
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-rose-700">Penugasan Posyandu</label>
          <select
            name="posyanduId"
            required
            defaultValue={user?.posyanduId ?? ''}
            className="w-full p-3 rounded-xl border border-rose-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-rose-500 outline-none"
          >
            <option value="">-- Pilih Posyandu --</option>
            {referenceData.posyanduList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
      );
    if (role === 'operator_penggilingan')
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-700">Penugasan Penggilingan</label>
          <select
            name="penggilinganId"
            required
            defaultValue={user?.penggilinganId ?? ''}
            className="w-full p-3 rounded-xl border border-amber-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="">-- Pilih Penggilingan --</option>
            {referenceData.penggilinganList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama}</option>
            ))}
          </select>
        </div>
      );
    if (role === 'operator_sppg')
      return (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-sky-700">Penugasan SPPG</label>
          <select
            name="sppgId"
            required
            defaultValue={user?.sppgId ?? ''}
            className="w-full p-3 rounded-xl border border-sky-200 bg-white text-slate-900 text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="">-- Pilih SPPG --</option>
            {referenceData.sppgList.map((s) => (
              <option key={s.id} value={s.id}>{s.nama}</option>
            ))}
          </select>
        </div>
      );
    return null;
  };

  /* ────────── MODAL WRAPPER ────────── */
  const Modal = ({ onClose, title, icon, children }: {
    onClose: () => void;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            {icon} {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Hak Akses</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola pengguna sistem dan penugasan per wilayah · <span className="font-semibold text-slate-700">{users.length} pengguna terdaftar</span>
          </p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); setCreateRole('operator_sppg'); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <UserPlus size={17} /> Tambah Pengguna
        </button>
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold animate-fade-in ${
          notification.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            : <ShieldAlert size={18} className="text-rose-600 shrink-0" />}
          {notification.msg}
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email pengguna..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Pengguna</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5">Role</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">Penugasan</th>
                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">Bergabung</th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{u.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <AssignmentBadge user={u} />
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs border border-indigo-100 transition-all group-hover:shadow-sm"
                    >
                      <Edit2 size={13} /> Edit Role
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Users size={40} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-700">Tidak ada pengguna ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci atau filter role</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════ MODAL: TAMBAH PENGGUNA ══════════ */}
      {showCreateModal && (
        <Modal
          onClose={() => setShowCreateModal(false)}
          title="Tambah Pengguna Baru"
          icon={<UserPlus size={18} className="text-indigo-600" />}
        >
          <form onSubmit={handleCreate} className="p-6 space-y-4">
            {/* Nama */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Nama Lengkap</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Email Login</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="budi@lebak.go.id"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/40 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Password Sementara</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/40 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Pengguna dapat mengubah password mandiri melalui menu Pengaturan Akun</p>
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Hak Akses (Role)</label>
              <select
                name="role"
                value={createRole}
                onChange={(e) => setCreateRole(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/40 outline-none"
              >
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
              </select>
            </div>

            {/* Conditional Assignment */}
            <AssignmentSelect role={createRole} />

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 text-slate-600 font-semibold text-sm hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-60"
              >
                <Save size={15} /> {isSubmitting ? 'Memproses...' : 'Buat Pengguna'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════════ MODAL: EDIT ROLE ══════════ */}
      {activeUser && (
        <Modal
          onClose={() => setActiveUser(null)}
          title="Edit Hak Akses"
          icon={<Shield size={18} className="text-indigo-600" />}
        >
          <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
            <input type="hidden" name="id" value={activeUser.id} />

            {/* User Info Card */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-base shrink-0">
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{activeUser.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{activeUser.email}</p>
                <div className="mt-1">
                  <RoleBadge role={activeUser.role} />
                </div>
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Ganti Hak Akses</label>
              <select
                name="role"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/40 outline-none"
              >
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
                <option value="publik">Publik (Tanpa Akses Admin)</option>
              </select>
            </div>

            {/* Conditional Assignment */}
            <AssignmentSelect role={editRole} user={activeUser} />

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setActiveUser(null)}
                className="px-5 py-2.5 text-slate-600 font-semibold text-sm hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/20 disabled:opacity-60"
              >
                <Save size={15} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
