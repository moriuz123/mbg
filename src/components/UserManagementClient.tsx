'use client';

import React, { useState } from 'react';
import { Users, Edit2, Shield, X, Save } from 'lucide-react';
import { updateUserRole } from '@/app/actions/userManagement';

type UserData = {
  id: string;
  name: string;
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
      case 'admin_dinas': return 'bg-purple-100 text-purple-700';
      case 'operator_sekolah': return 'bg-emerald-100 text-emerald-700';
      case 'operator_posyandu': return 'bg-rose-100 text-rose-700';
      case 'operator_penggilingan': return 'bg-amber-100 text-amber-700';
      case 'operator_sppg': return 'bg-sky-100 text-sky-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin_dinas': return 'Admin';
      case 'operator_sekolah': return 'Sekolah';
      case 'operator_posyandu': return 'Posyandu';
      case 'operator_penggilingan': return 'Penggilingan';
      case 'operator_sppg': return 'SPPG';
      default: return 'Publik';
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className={`p-4 rounded-xl shadow-sm border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="font-medium flex items-center gap-2">
            {notification.type === 'success' ? <Shield size={18}/> : <X size={18}/>}
            {notification.msg}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Hak Akses</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola role dan kewenangan akun pengguna di sistem MBG
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Pengguna</th>
                <th className="p-4">Hak Akses (Role)</th>
                <th className="p-4">Lingkup Penugasan</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Terdaftar: {new Date(user.createdAt).toLocaleDateString('id-ID')}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-4">
                    {user.role === 'operator_sekolah' && user.sekolahName ? (
                      <div className="text-xs font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                        Sekolah: {user.sekolahName}
                      </div>
                    ) : user.role === 'operator_posyandu' && user.posyanduName ? (
                      <div className="text-xs font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                        Posyandu: {user.posyanduName}
                      </div>
                    ) : user.role === 'operator_penggilingan' && user.penggilinganName ? (
                      <div className="text-xs font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                        Penggilingan: {user.penggilinganName}
                      </div>
                    ) : user.role === 'operator_sppg' && user.sppgName ? (
                      <div className="text-xs font-medium text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">
                        SPPG: {user.sppgName}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Global / Tidak terikat</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex"
                      title="Ubah Hak Akses"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Belum ada data pengguna yang terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Shield size={20} className="text-indigo-600"/> Penugasan Hak Akses
              </h3>
              <button onClick={() => setActiveUser(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Pengguna Terpilih</p>
                <p className="font-bold text-slate-800 text-lg">{activeUser.name}</p>
                <p className="text-sm text-slate-600">{activeUser.email}</p>
              </div>

              <form id="roleForm" onSubmit={handleSubmit} className="space-y-5">
                <input type="hidden" name="id" value={activeUser.id} />
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Pilih Hak Akses (Role)</label>
                  <select 
                    name="role" 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                  >
                    <option value="admin_dinas">Admin</option>
                    <option value="operator_sekolah">Sekolah</option>
                    <option value="operator_posyandu">Posyandu</option>
                    <option value="operator_penggilingan">Penggilingan</option>
                    <option value="operator_sppg">SPPG</option>
                  </select>
                </div>

                {/* Conditional Fields based on Role */}
                {selectedRole === 'operator_sekolah' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-semibold text-emerald-700">Penugasan Sekolah</label>
                    <select name="sekolahId" required defaultValue={activeUser.sekolahId || ''} className="w-full p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30">
                      <option value="">-- Pilih Sekolah --</option>
                      {referenceData.sekolahList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_posyandu' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-semibold text-rose-700">Penugasan Posyandu</label>
                    <select name="posyanduId" required defaultValue={activeUser.posyanduId || ''} className="w-full p-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-500 outline-none bg-rose-50/30">
                      <option value="">-- Pilih Posyandu --</option>
                      {referenceData.posyanduList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_penggilingan' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-semibold text-amber-700">Penugasan Penggilingan</label>
                    <select name="penggilinganId" required defaultValue={activeUser.penggilinganId || ''} className="w-full p-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none bg-amber-50/30">
                      <option value="">-- Pilih Penggilingan --</option>
                      {referenceData.penggilinganList.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                    </select>
                  </div>
                )}

                {selectedRole === 'operator_sppg' && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-sm font-semibold text-sky-700">Penugasan SPPG</label>
                    <select name="sppgId" required defaultValue={activeUser.sppgId || ''} className="w-full p-3 rounded-xl border border-sky-200 focus:ring-2 focus:ring-sky-500 outline-none bg-sky-50/30">
                      <option value="">-- Pilih SPPG --</option>
                      {referenceData.sppgList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
                    </select>
                  </div>
                )}

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setActiveUser(null)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="roleForm" disabled={isSubmitting} className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-indigo-600/30">
                <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Hak Akses'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
