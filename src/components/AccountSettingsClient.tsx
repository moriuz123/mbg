'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { KeyRound, CheckCircle2, ShieldAlert, Save } from 'lucide-react';

export default function AccountSettingsClient() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error', msg: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (newPassword.length < 8) {
      setNotification({ type: 'error', msg: 'Password baru minimal 8 karakter' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setNotification({ type: 'error', msg: 'Konfirmasi password tidak cocok' });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await authClient.changePassword({
        newPassword,
        currentPassword,
        revokeOtherSessions: true
      });

      if (error) {
        setNotification({ type: 'error', msg: error.message || 'Gagal mengubah password. Pastikan password lama benar.' });
      } else {
        setNotification({ type: 'success', msg: 'Password berhasil diubah!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setNotification({ type: 'error', msg: 'Terjadi kesalahan sistem' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          <KeyRound size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pengaturan Akun</h1>
          <p className="text-slate-500 text-sm mt-1">Ubah kata sandi dan amankan akun Anda</p>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        } animate-fade-in`}>
          {notification.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5 text-emerald-600" size={18} /> : <ShieldAlert className="shrink-0 mt-0.5 text-rose-600" size={18} />}
          <div className="text-sm font-semibold">{notification.msg}</div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Ubah Kata Sandi</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-w-md">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Kata Sandi Saat Ini</label>
            <input 
              type="password" 
              required 
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama" 
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none bg-slate-50 focus:bg-white text-sm" 
            />
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700">Kata Sandi Baru</label>
            <input 
              type="password" 
              required 
              minLength={8}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter" 
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none bg-slate-50 focus:bg-white text-sm" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Konfirmasi Kata Sandi Baru</label>
            <input 
              type="password" 
              required 
              minLength={8}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang kata sandi baru" 
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/50 outline-none bg-slate-50 focus:bg-white text-sm" 
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-3 bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 rounded-xl transition-all flex items-center gap-2 shadow-md shadow-indigo-600/30 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
