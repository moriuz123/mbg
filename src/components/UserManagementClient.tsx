'use client';

import React, { useState } from 'react';
import { Users, Edit2, Shield, X, Save, Search, Filter, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { updateUserRole } from '@/app/actions/userManagement';

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
  sekolahList: { id: number, nama: string }[];
  posyanduList: { id: number, nama: string }[];
  penggilinganList: { id: number, nama: string }[];
  sppgList: { id: number, nama: string }[];
};

export default function UserManagementClient({ 
  users, 
  referenceData 
}: { 
  users: UserData[], 
  referenceData: ReferenceData 
}) {
  const [activeUser, setActiveUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Semua');

  const openEditModal = (user: UserData) => {
    setActiveUser(user);
    setSelectedRole(user.role);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await updateUserRole(formData);
    
    if (res.success) {
      setActiveUser(null);
      setNotification({ type: 'success', msg: res.message });
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setNotification({ type: 'error', msg: res.message });
    }
    setIsSubmitting(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin_dinas': 
      case 'super_admin':
      case 'admin': return 'bg-purple-100 text-purple-700 border border-purple-200';
      case 'operator_sekolah': 
      case 'sekolah': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'operator_posyandu': 
      case 'posyandu': return 'bg-rose-100 text-rose-700 border border-rose-200';
      case 'operator_penggilingan': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'operator_sppg': 
      case 'sppg': return 'bg-sky-100 text-sky-700 border border-sky-200';
      default: return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin_dinas':
      case 'super_admin':
      case 'admin': return 'Admin';
      case 'operator_sekolah':
      case 'sekolah': return 'Sekolah';
      case 'operator_posyandu':
      case 'posyandu': return 'Posyandu';
      case 'operator_penggilingan': return 'Penggilingan';
      case 'operator_sppg':
      case 'sppg': return 'SPPG';
      default: return 'Belum Ditugaskan';
    }
  };

  // Role Counts
  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin_dinas' || u.role === 'super_admin' || u.role === 'admin').length,
    sppg: users.filter(u => u.role === 'operator_sppg' || u.role === 'sppg').length,
    sekolah: users.filter(u => u.role === 'operator_sekolah' || u.role === 'sekolah').length,
    posyandu: users.filter(u => u.role === 'operator_posyandu' || u.role === 'posyandu').length,
    penggilingan: users.filter(u => u.role === 'operator_penggilingan').length,
    publik: users.filter(u => !u.role || u.role === 'publik').length,
  };

  // Filtering users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.sekolahName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.posyanduName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.sppgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.penggilinganName?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesRole = true;
    if (selectedRoleFilter !== 'Semua') {
      if (selectedRoleFilter === 'admin_dinas') {
        matchesRole = u.role === 'admin_dinas' || u.role === 'super_admin' || u.role === 'admin';
      } else if (selectedRoleFilter === 'operator_sppg') {
        matchesRole = u.role === 'operator_sppg' || u.role === 'sppg';
      } else if (selectedRoleFilter === 'operator_sekolah') {
        matchesRole = u.role === 'operator_sekolah' || u.role === 'sekolah';
      } else if (selectedRoleFilter === 'operator_posyandu') {
        matchesRole = u.role === 'operator_posyandu' || u.role === 'posyandu';
      } else if (selectedRoleFilter === 'operator_penggilingan') {
        matchesRole = u.role === 'operator_penggilingan';
      } else if (selectedRoleFilter === 'publik') {
        matchesRole = !u.role || u.role === 'publik';
      }
    }

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`p-4 rounded-2xl shadow-sm border ${notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
          <div className="font-semibold flex items-center gap-2">
            {notification.type === 'success' ? <Shield size={18}/> : <X size={18}/>}
            {notification.msg}
          </div>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Users size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manajemen Hak Akses & User</h1>
            <p className="text-slate-500 mt-0.5 text-xs font-medium">
              Kelola penugasan peran, username, dan wilayah kerja akun pengguna di sistem MBG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
          <div className="text-right px-2">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total User</div>
            <div className="text-lg font-black text-slate-800">{counts.all} Akun</div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari berdasarkan nama, @username, email, sekolah, posyandu, sppg..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* QUICK ROLE FILTER PILLS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
            {[
              { id: 'Semua', label: 'Semua', count: counts.all },
              { id: 'admin_dinas', label: 'Admin', count: counts.admin },
              { id: 'operator_sppg', label: 'SPPG', count: counts.sppg },
              { id: 'operator_sekolah', label: 'Sekolah', count: counts.sekolah },
              { id: 'operator_posyandu', label: 'Posyandu', count: counts.posyandu },
              { id: 'operator_penggilingan', label: 'Penggilingan', count: counts.penggilingan },
              { id: 'publik', label: 'Belum Ditugaskan', count: counts.publik },
            ].map((roleFilter) => (
              <button
                key={roleFilter.id}
                onClick={() => setSelectedRoleFilter(roleFilter.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  selectedRoleFilter === roleFilter.id 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{roleFilter.label}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                  selectedRoleFilter === roleFilter.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {roleFilter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE DATA USERS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Pengguna & @Username</th>
                <th className="p-4">Hak Akses (Role)</th>
                <th className="p-4">Lingkup Penugasan</th>
                <th className="p-4 text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>{user.email}</span>
                      {(user.displayUsername || user.username) && (
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md font-extrabold text-[11px]">
                          @{user.displayUsername || user.username}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1" suppressHydrationWarning>
                      Terdaftar: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role === 'operator_sekolah' && user.sekolahName ? (
                      <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 inline-block px-2.5 py-1 rounded-lg">
                        Sekolah: {user.sekolahName}
                      </div>
                    ) : user.role === 'operator_posyandu' && user.posyanduName ? (
                      <div className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 inline-block px-2.5 py-1 rounded-lg">
                        Posyandu: {user.posyanduName}
                      </div>
                    ) : user.role === 'operator_penggilingan' && user.penggilinganName ? (
                      <div className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 inline-block px-2.5 py-1 rounded-lg">
                        Penggilingan: {user.penggilinganName}
                      </div>
                    ) : (user.role === 'operator_sppg' || user.role === 'sppg') && user.sppgName ? (
                      <div className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 inline-block px-2.5 py-1 rounded-lg">
                        SPPG: {user.sppgName}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium">Global / Tidak terikat</span>
                    )}
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition-all font-bold text-xs inline-flex items-center gap-1 border border-indigo-100"
                      title="Ubah Hak Akses"
                    >
                      <Edit2 size={16} /> Edit Role
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Users size={48} className="mx-auto mb-3 text-slate-300" />
                    <p className="font-bold text-base text-slate-700">Tidak ada pengguna yang cocok</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter role.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {activeUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600"/> Penugasan Hak Akses
              </h3>
              <button onClick={() => setActiveUser(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Pengguna Terpilih</p>
                <p className="font-bold text-slate-800 text-lg">{activeUser.name}</p>
                <p className="text-sm font-medium text-slate-600">
                  {activeUser.email} {(activeUser.displayUsername || activeUser.username) ? `• @${activeUser.displayUsername || activeUser.username}` : ''}
                </p>
              </div>

              <form id="roleForm" onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="id" value={activeUser.id} />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Pilih Hak Akses (Role)</label>
                  <select 
                    name="role" 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none bg-white font-semibold text-sm"
                  >
                    <option value="admin_dinas">Admin Dinas (Super Admin)</option>
                    <option value="operator_sppg">Operator SPPG (Dapur Sentral)</option>
                    <option value="operator_sekolah">Operator Sekolah</option>
                    <option value="operator_posyandu">Operator Posyandu</option>
                    <option value="operator_penggilingan">Operator Penggilingan Gabah</option>
                  </select>
                </div>

                {/* Conditional Fields based on Role */}
                {selectedRole === 'operator_sekolah' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-emerald-700">Penugasan Sekolah</label>
                    <select name="sekolahId" required defaultValue={activeUser.sekolahId || ''} className="w-full p-3.5 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30 text-sm font-medium">
                      <option value="">-- Pilih Sekolah --</option>
                      {referenceData.sekolahList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_posyandu' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-rose-700">Penugasan Posyandu</label>
                    <select name="posyanduId" required defaultValue={activeUser.posyanduId || ''} className="w-full p-3.5 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30 text-sm font-medium">
                      <option value="">-- Pilih Posyandu --</option>
                      {referenceData.posyanduList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_penggilingan' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-amber-700">Penugasan Penggilingan</label>
                    <select name="penggilinganId" required defaultValue={activeUser.penggilinganId || ''} className="w-full p-3.5 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none bg-amber-50/30 text-sm font-medium">
                      <option value="">-- Pilih Penggilingan --</option>
                      {referenceData.penggilinganList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_sppg' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-sky-700">Penugasan SPPG</label>
                    <select name="sppgId" required defaultValue={activeUser.sppgId || ''} className="w-full p-3.5 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 outline-none bg-sky-50/30 text-sm font-medium">
                      <option value="">-- Pilih SPPG --</option>
                      {referenceData.sppgList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  </div>
                )}

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setActiveUser(null)} className="px-5 py-2.5 text-slate-600 font-semibold text-xs hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="roleForm" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/30">
                <Save size={16} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Hak Akses'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
