'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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

const ROLE_CONFIG: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
  admin_dinas:           { label: 'Admin Dinas',           badgeClass: 'bg-violet-100 text-violet-700', icon: <ShieldCheck size={11} /> },
  operator_sppg:         { label: 'Operator SPPG',         badgeClass: 'bg-sky-100 text-sky-700',       icon: <Utensils size={11} /> },
  operator_sekolah:      { label: 'Operator Sekolah',      badgeClass: 'bg-emerald-100 text-emerald-700', icon: <GraduationCap size={11} /> },
  operator_posyandu:     { label: 'Operator Posyandu',     badgeClass: 'bg-rose-100 text-rose-700',     icon: <HeartPulse size={11} /> },
  operator_penggilingan: { label: 'Operator Penggilingan', badgeClass: 'bg-amber-100 text-amber-700',   icon: <Factory size={11} /> },
  publik:                { label: 'Publik',                 badgeClass: 'bg-slate-100 text-slate-600',   icon: <User size={11} /> },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.publik;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.badgeClass}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

/* ─── Portal Modal ─── renders directly to document.body ─── */
function PortalModal({ onClose, title, children }: {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1e293b' }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8', lineHeight: 1 }}
          >
            <X size={20} />
          </button>
        </div>
        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
    </div>,
    document.body
  );
}

/* ─── Shared field styles ─── */
const S = {
  label: { display:'block', fontSize:'11px', fontWeight:700, color:'#64748b', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.05em' } as React.CSSProperties,
  input: { width:'100%', padding:'11px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#0f172a', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' } as React.CSSProperties,
  inputPL: { width:'100%', padding:'11px 14px 11px 38px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#f8fafc', color:'#0f172a', fontSize:'14px', outline:'none', boxSizing:'border-box', fontFamily:'inherit' } as React.CSSProperties,
  select: { width:'100%', padding:'11px 14px', borderRadius:'10px', border:'1px solid #e2e8f0', background:'#ffffff', color:'#0f172a', fontSize:'14px', fontWeight:600, outline:'none', boxSizing:'border-box', fontFamily:'inherit', cursor:'pointer' } as React.CSSProperties,
  row: { position:'relative' } as React.CSSProperties,
  icon: { position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' } as React.CSSProperties,
};

export default function UserManagementClient({
  users,
  referenceData,
}: {
  users: UserData[];
  referenceData: ReferenceData;
}) {
  const [activeUser, setActiveUser]   = useState<UserData | null>(null);
  const [editRole, setEditRole]       = useState('');
  const [showCreate, setShowCreate]   = useState(false);
  const [createRole, setCreateRole]   = useState('operator_sppg');
  const [showPass, setShowPass]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [roleFilter, setRoleFilter]   = useState('Semua');
  const createFormRef = useRef<HTMLFormElement>(null);

  const notify = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredUsers = useMemo(() =>
    users.filter((u) => {
      const q = searchTerm.toLowerCase();
      return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        && (roleFilter === 'Semua' || u.role === roleFilter);
    }),
    [users, searchTerm, roleFilter]
  );

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

  const AssignmentField = ({ role, user }: { role: string; user?: UserData | null }) => {
    const cfg: Record<string, { name: string; label: string; list: { id: number; nama: string }[] }> = {
      operator_sekolah:      { name:'sekolahId',      label:'Sekolah',      list:referenceData.sekolahList },
      operator_posyandu:     { name:'posyanduId',     label:'Posyandu',     list:referenceData.posyanduList },
      operator_penggilingan: { name:'penggilinganId', label:'Penggilingan', list:referenceData.penggilinganList },
      operator_sppg:         { name:'sppgId',         label:'SPPG',         list:referenceData.sppgList },
    };
    const c = cfg[role];
    if (!c) return null;
    const defVal = user ? (user as any)[c.name] ?? '' : '';
    return (
      <div>
        <label style={S.label}>Penugasan {c.label}</label>
        <select name={c.name} required defaultValue={defVal} style={S.select}>
          <option value="">-- Pilih {c.label} --</option>
          {c.list.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
        </select>
      </div>
    );
  };

  const btnPrimary: React.CSSProperties = {
    padding:'11px 24px', borderRadius:'10px', background:'#4f46e5', color:'#fff',
    fontWeight:700, fontSize:'13px', border:'none', cursor:'pointer',
    display:'flex', alignItems:'center', gap:'8px', opacity: isSubmitting ? 0.7 : 1,
  };
  const btnSecondary: React.CSSProperties = {
    padding:'11px 20px', borderRadius:'10px', background:'#f8fafc', color:'#475569',
    fontWeight:600, fontSize:'13px', border:'1px solid #e2e8f0', cursor:'pointer',
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Hak Akses</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola pengguna &amp; penugasan ·{' '}
            <span className="font-semibold text-slate-700">{users.length} pengguna</span>
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateRole('operator_sppg'); setShowPass(false); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <UserPlus size={16} /> Tambah Pengguna
        </button>
      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={17} className="shrink-0" /> : <ShieldAlert size={17} className="shrink-0" />}
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
            className="pl-9 pr-8 py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-indigo-500/30 outline-none appearance-none cursor-pointer"
          >
            <option value="Semua">Semua Role</option>
            {Object.entries(ROLE_CONFIG).map(([k, c]) => <option key={k} value={k}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {['Pengguna','Role','Penugasan','Bergabung',''].map((h, i) => (
                  <th key={i} className={`text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-${i === 0 || i === 4 ? '6' : '4'} py-3.5 ${i === 2 ? 'hidden md:table-cell' : ''} ${i === 3 ? 'hidden lg:table-cell' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {u.sppgName ?? u.sekolahName ?? u.posyanduName ?? u.penggilinganName
                      ? <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                          <Building2 size={11} />{u.sppgName ?? u.sekolahName ?? u.posyanduName ?? u.penggilinganName}
                        </span>
                      : <span className="text-xs text-slate-400 italic">Global</span>}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
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
                <tr><td colSpan={5} className="p-12 text-center">
                  <Users size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-bold text-slate-700">Tidak ada pengguna ditemukan</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══ PORTAL MODAL: TAMBAH PENGGUNA ═══ */}
      {showCreate && (
        <PortalModal onClose={() => setShowCreate(false)} title="Tambah Pengguna Baru">
          <form ref={createFormRef} onSubmit={handleCreate} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={S.row}>
              <label style={S.label}>Nama Lengkap</label>
              <div style={{ position:'relative' }}>
                <User size={14} style={S.icon} />
                <input name="name" type="text" required placeholder="Contoh: Budi Santoso" style={S.inputPL} />
              </div>
            </div>

            <div style={S.row}>
              <label style={S.label}>Email Login</label>
              <div style={{ position:'relative' }}>
                <Mail size={14} style={S.icon} />
                <input name="email" type="email" required placeholder="budi@lebak.go.id" style={S.inputPL} />
              </div>
            </div>

            <div style={S.row}>
              <label style={S.label}>Password Sementara</label>
              <div style={{ position:'relative' }}>
                <Lock size={14} style={S.icon} />
                <input name="password" type={showPass ? 'text' : 'password'} required minLength={8} placeholder="Minimal 8 karakter" style={{ ...S.inputPL, paddingRight:'40px' }} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:0 }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p style={{ fontSize:'11px', color:'#94a3b8', marginTop:'4px' }}>Pengguna dapat mengubah sendiri di Pengaturan Akun</p>
            </div>

            <div>
              <label style={S.label}>Hak Akses (Role)</label>
              <select name="role" value={createRole} onChange={(e) => setCreateRole(e.target.value)} style={S.select}>
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
              </select>
            </div>

            <AssignmentField role={createRole} />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'14px', borderTop:'1px solid #f1f5f9', marginTop:'4px' }}>
              <button type="button" onClick={() => setShowCreate(false)} style={btnSecondary}>Batal</button>
              <button type="submit" disabled={isSubmitting} style={btnPrimary}>
                <Save size={14} />{isSubmitting ? 'Memproses...' : 'Buat Pengguna'}
              </button>
            </div>
          </form>
        </PortalModal>
      )}

      {/* ═══ PORTAL MODAL: EDIT ROLE ═══ */}
      {activeUser && (
        <PortalModal onClose={() => setActiveUser(null)} title="Edit Hak Akses Pengguna">
          <form onSubmit={handleEditSubmit} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'14px' }}>
            <input type="hidden" name="id" value={activeUser.id} />

            {/* User card */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 16px', background:'#f8fafc', borderRadius:'14px', border:'1px solid #e2e8f0' }}>
              <div style={{ width:'44px', height:'44px', borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#38bdf8)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'18px', flexShrink:0 }}>
                {activeUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight:700, color:'#1e293b', fontSize:'15px', margin:'0 0 2px' }}>{activeUser.name}</p>
                <p style={{ fontSize:'12px', color:'#64748b', margin:'0 0 6px' }}>{activeUser.email}</p>
                <RoleBadge role={activeUser.role} />
              </div>
            </div>

            <div>
              <label style={S.label}>Ganti Hak Akses</label>
              <select name="role" value={editRole} onChange={(e) => setEditRole(e.target.value)} style={S.select}>
                <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                <option value="operator_sekolah">Operator Sekolah</option>
                <option value="operator_posyandu">Operator Posyandu</option>
                <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
                <option value="publik">Publik (Tanpa Akses Admin)</option>
              </select>
            </div>

            <AssignmentField role={editRole} user={activeUser} />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:'10px', paddingTop:'14px', borderTop:'1px solid #f1f5f9', marginTop:'4px' }}>
              <button type="button" onClick={() => setActiveUser(null)} style={btnSecondary}>Batal</button>
              <button type="submit" disabled={isSubmitting} style={btnPrimary}>
                <Save size={14} />{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </PortalModal>
      )}
    </div>
  );
}
