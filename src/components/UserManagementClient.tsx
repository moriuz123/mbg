'use client';

import React, { useState, useMemo } from 'react';
import {
  Users, Edit2, Shield, X, Save, Search, Filter,
  CheckCircle2, ShieldAlert, UserPlus, Mail, Lock, User,
  Building2, GraduationCap, HeartPulse, Factory, Utensils,
  ShieldCheck, ChevronDown, Eye, EyeOff
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
  admin_dinas:           { label: 'Admin Dinas',          color: 'text-violet-700', bg: 'bg-violet-100',  icon: <ShieldCheck size={12} /> },
  operator_sppg:         { label: 'Operator SPPG',        color: 'text-sky-700',    bg: 'bg-sky-100',     icon: <Utensils size={12} /> },
  operator_sekolah:      { label: 'Operator Sekolah',     color: 'text-emerald-700',bg: 'bg-emerald-100', icon: <GraduationCap size={12} /> },
  operator_posyandu:     { label: 'Operator Posyandu',    color: 'text-rose-700',   bg: 'bg-rose-100',    icon: <HeartPulse size={12} /> },
  operator_penggilingan: { label: 'Operator Penggilingan',color: 'text-amber-700',  bg: 'bg-amber-100',   icon: <Factory size={12} /> },
  publik:                { label: 'Publik',                color: 'text-slate-600',  bg: 'bg-slate-100',   icon: <User size={12} /> },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.publik;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color} ${cfg.bg}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─── Shared input/select styles as inline styles to beat globals.css ─── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  color: '#1e293b',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: 600,
  outline: 'none',
  fontFamily: 'inherit',
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#475569',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

/* ─── Modal overlay + card ─── */
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15,23,42,0.55)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  padding: '16px',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  width: '100%',
  maxWidth: '520px',
  maxHeight: '92vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

export default function UserManagementClient({
  users,
  referenceData,
}: {
  users: UserData[];
  referenceData: ReferenceData;
}) {
  const [activeUser, setActiveUser]     = useState<UserData | null>(null);
  const [editRole, setEditRole]         = useState('');
  const [showCreate, setShowCreate]     = useState(false);
  const [createRole, setCreateRole]     = useState('operator_sppg');
  const [showPass, setShowPass]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [roleFilter, setRoleFilter]     = useState('Semua');

  const notify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredUsers = useMemo(() =>
    users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'Semua' || u.role === roleFilter;
      return matchSearch && matchRole;
    }),
    [users, searchTerm, roleFilter]
  );

  /* ── handlers ── */
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await createUserByAdmin(new FormData(e.currentTarget));
      if (result.success) { setShowCreate(false); notify('success', result.message ?? 'Pengguna berhasil dibuat!'); }
      else notify('error', result.message ?? 'Gagal membuat pengguna');
    } catch { notify('error', 'Terjadi kesalahan sistem'); }
    finally { setIsSubmitting(false); }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await updateUserRole(new FormData(e.currentTarget));
      if (result.success) { setActiveUser(null); notify('success', result.message ?? 'Hak akses diperbarui!'); }
      else notify('error', result.message ?? 'Gagal memperbarui');
    } catch { notify('error', 'Terjadi kesalahan sistem'); }
    finally { setIsSubmitting(false); }
  };

  /* ── assignment dropdown ── */
  const AssignmentField = ({ role, user }: { role: string; user?: UserData | null }) => {
    const map: Record<string, { name: string; label: string; list: { id: number; nama: string }[] }> = {
      operator_sekolah:      { name: 'sekolahId',      label: 'Penugasan Sekolah',      list: referenceData.sekolahList },
      operator_posyandu:     { name: 'posyanduId',     label: 'Penugasan Posyandu',     list: referenceData.posyanduList },
      operator_penggilingan: { name: 'penggilinganId', label: 'Penugasan Penggilingan', list: referenceData.penggilinganList },
      operator_sppg:         { name: 'sppgId',         label: 'Penugasan SPPG',         list: referenceData.sppgList },
    };
    const cfg = map[role];
    if (!cfg) return null;
    const defVal = user
      ? (cfg.name === 'sekolahId' ? user.sekolahId : cfg.name === 'posyanduId' ? user.posyanduId : cfg.name === 'penggilinganId' ? user.penggilinganId : user.sppgId) ?? ''
      : '';
    return (
      <div>
        <label style={labelStyle}>{cfg.label}</label>
        <select name={cfg.name} required defaultValue={defVal} style={selectStyle}>
          <option value="">-- Pilih {cfg.label.replace('Penugasan ', '')} --</option>
          {cfg.list.map((item) => (
            <option key={item.id} value={item.id}>{item.nama}</option>
          ))}
        </select>
      </div>
    );
  };

  /* ── modal shell ── */
  const Modal = ({ onClose, title, icon, children }: {
    onClose: () => void; title: string; icon: React.ReactNode; children: React.ReactNode;
  }) => (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <h3 style={{ fontSize:'17px', fontWeight:900, color:'#1e293b', display:'flex', alignItems:'center', gap:'8px', margin:0 }}>
            {icon} {title}
          </h3>
          <button type="button" onClick={onClose} style={{ padding:'6px', border:'none', background:'transparent', cursor:'pointer', color:'#94a3b8', borderRadius:'8px' }}>
            <X size={20} />
          </button>
        </div>
        {/* body – scrollable */}
        <div style={{ overflowY:'auto', flex:1 }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Hak Akses</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola pengguna sistem &amp; penugasan ·{' '}
            <span className="font-semibold text-slate-700">{users.length} pengguna terdaftar</span>
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateRole('operator_sppg'); }}
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
            : <ShieldAlert  size={18} className="text-rose-600 shrink-0" />}
          {notification.msg}
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-800 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none"
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-9 pr-9 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-6 py-3.5">Pengguna</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5">Role</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">Penugasan</th>
                <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">Bergabung</th>
                <th className="px-6 py-3.5 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{u.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {u.sppgName ?? u.sekolahName ?? u.posyanduName ?? u.penggilinganName
                      ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <Building2 size={11} className="text-slate-500" />
                          {u.sppgName ?? u.sekolahName ?? u.posyanduName ?? u.penggilinganName}
                        </span>
                      : <span className="text-xs text-slate-400 italic">Global</span>}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { setActiveUser(u); setEditRole(u.role); }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-bold text-xs border border-indigo-100 transition-all"
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Users size={40} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-slate-700">Tidak ada pengguna ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════ MODAL TAMBAH PENGGUNA ══════ */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="Tambah Pengguna Baru" icon={<UserPlus size={18} className="text-indigo-600" />}>
          <form onSubmit={handleCreate} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>

            <div>
              <label style={labelStyle}>Nama Lengkap</label>
              <div style={{ position:'relative' }}>
                <User size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }} />
                <input name="name" type="text" required placeholder="Contoh: Budi Santoso" style={{ ...inputStyle, paddingLeft:'38px' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Email Login</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }} />
                <input name="email" type="email" required placeholder="budi@lebak.go.id" style={{ ...inputStyle, paddingLeft:'38px' }} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Password Sementara</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }} />
                <input name="password" type={showPass ? 'text' : 'password'} required minLength={8} placeholder="Minimal 8 karakter" style={{ ...inputStyle, paddingLeft:'38px', paddingRight:'40px' }} />
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:'#94a3b8' }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>Pengguna dapat mengubah sendiri di menu Pengaturan Akun</p>
            </div>

            <div>
              <label style={labelStyle}>Hak Akses (Role)</label>
              <select name="role" value={createRole} onChange={(e) => setCreateRole(e.target.value)} style={selectStyle}>
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
              </select>
            </div>

            <AssignmentField role={createRole} />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'12px', borderTop:'1px solid #f1f5f9', marginTop:'4px' }}>
              <button type="button" onClick={() => setShowCreate(false)}
                style={{ padding:'10px 20px', border:'1px solid #e2e8f0', borderRadius:'10px', background:'#f8fafc', color:'#475569', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={isSubmitting}
                style={{ padding:'10px 24px', borderRadius:'10px', background: isSubmitting ? '#818cf8' : '#4f46e5', color:'#fff', fontWeight:700, fontSize:'13px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
                <Save size={14} /> {isSubmitting ? 'Memproses...' : 'Buat Pengguna'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ══════ MODAL EDIT ROLE ══════ */}
      {activeUser && (
        <Modal onClose={() => setActiveUser(null)} title="Edit Hak Akses" icon={<Shield size={18} className="text-indigo-600" />}>
          <form onSubmit={handleEditSubmit} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
            <input type="hidden" name="id" value={activeUser.id} />

            {/* User info */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px', backgroundColor:'#f8fafc', borderRadius:'14px', border:'1px solid #e2e8f0' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#38bdf8)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'18px', flexShrink:0 }}>
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight:700, color:'#1e293b', fontSize:'15px', margin:0 }}>{activeUser.name}</p>
                <p style={{ fontSize:'12px', color:'#64748b', margin:'2px 0 4px' }}>{activeUser.email}</p>
                <RoleBadge role={activeUser.role} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Ganti Hak Akses</label>
              <select name="role" value={editRole} onChange={(e) => setEditRole(e.target.value)} style={selectStyle}>
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
                <option value="publik">Publik (Tanpa Akses Admin)</option>
              </select>
            </div>

            <AssignmentField role={editRole} user={activeUser} />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'12px', borderTop:'1px solid #f1f5f9', marginTop:'4px' }}>
              <button type="button" onClick={() => setActiveUser(null)}
                style={{ padding:'10px 20px', border:'1px solid #e2e8f0', borderRadius:'10px', background:'#f8fafc', color:'#475569', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                Batal
              </button>
              <button type="submit" disabled={isSubmitting}
                style={{ padding:'10px 24px', borderRadius:'10px', background: isSubmitting ? '#818cf8' : '#4f46e5', color:'#fff', fontWeight:700, fontSize:'13px', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'8px' }}>
                <Save size={14} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
