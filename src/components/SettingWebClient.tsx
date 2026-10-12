'use client';

import React, { useState } from 'react';
import { Save, Globe, Image as ImageIcon, MapPin, Phone, Mail, UploadCloud, Loader2, Wrench, AlertTriangle, ShieldAlert, Power } from 'lucide-react';
import { updateSiteSettingsBulk, toggleMaintenanceMode } from '@/app/actions/adminSettings';
import { uploadFile } from '@/app/actions/upload';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingWebClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  const handleToggleMaintenance = async () => {
    const nextState = settings.maintenance_mode !== 'true';
    setIsTogglingMaintenance(true);
    const toastId = toast.loading(nextState ? 'Mengaktifkan mode pemeliharaan...' : 'Menonaktifkan mode pemeliharaan...');
    try {
      await toggleMaintenanceMode(nextState);
      setSettings(prev => ({ ...prev, maintenance_mode: nextState ? 'true' : 'false' }));
      toast.success(
        nextState 
          ? 'Mode pemeliharaan AKTIF! Publik sekarang melihat halaman pemeliharaan.' 
          : 'Mode pemeliharaan DINONAKTIFKAN. Website publik kembali normal!', 
        { id: toastId }
      );
    } catch (e: any) {
      toast.error('Gagal mengubah mode pemeliharaan: ' + (e.message || ''), { id: toastId });
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setSettings(prev => ({ ...prev, [key]: 'Mengunggah...' }));
      const toastId = toast.loading('Mengunggah gambar...');

      const res = await uploadFile(formData);
      setSettings(prev => ({ ...prev, [key]: res.url }));
      toast.success('Gambar berhasil diunggah', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengunggah gambar');
      setSettings(prev => ({ ...prev, [key]: initialSettings[key] || '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Menyimpan konfigurasi...');
    
    try {
      await updateSiteSettingsBulk(settings);
      toast.success('Konfigurasi web berhasil disimpan!', { id: toastId });
    } catch (error) {
      toast.error('Gagal menyimpan konfigurasi.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Toaster position="top-right" />

      {/* Mode Pemeliharaan (Maintenance Mode) */}
      <div className={`p-6 rounded-2xl shadow-sm border transition-all ${
        settings.maintenance_mode === 'true' 
          ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-300/50 shadow-amber-500/10' 
          : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              settings.maintenance_mode === 'true' 
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              <Wrench size={22} className={settings.maintenance_mode === 'true' ? 'animate-bounce' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-800">Mode Pemeliharaan (Maintenance Mode)</h2>
                {settings.maintenance_mode === 'true' && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-500 text-white animate-pulse">
                    LIVE AKTIF
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Alihkan seluruh pengunjung publik ke halaman perbaikan sistem. Petugas/Admin tetap dapat mengakses sistem setelah login.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleMaintenance}
              disabled={isTogglingMaintenance}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                settings.maintenance_mode === 'true'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <Power size={14} />
              {settings.maintenance_mode === 'true' ? 'Matikan Mode Pemeliharaan' : 'Aktifkan Mode Pemeliharaan'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Status Box */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            settings.maintenance_mode === 'true' 
              ? 'bg-amber-100/70 border-amber-300 text-amber-900' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle size={18} className={settings.maintenance_mode === 'true' ? 'text-amber-600 shrink-0 mt-0.5 sm:mt-0' : 'text-slate-400 shrink-0 mt-0.5 sm:mt-0'} />
              <div className="text-xs">
                <span className="font-bold block sm:inline">
                  {settings.maintenance_mode === 'true'
                    ? 'Mode Pemeliharaan Sedang Berjalan: '
                    : 'Sistem Berjalan Normal: '}
                </span>
                <span>
                  {settings.maintenance_mode === 'true'
                    ? 'Pengunjung non-admin melihat layar pemeliharaan resmi dengan pesan kustom di bawah ini.'
                    : 'Seluruh portal publik dan direktori terbuka untuk masyarakat umum.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                settings.maintenance_mode === 'true'
                  ? 'bg-amber-200 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {settings.maintenance_mode === 'true' ? '🔴 Status: PEMELIHARAAN' : '🟢 Status: TERBUKA'}
              </span>
            </div>
          </div>

          {/* Form Fields for Maintenance Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Judul Layar Pemeliharaan</label>
              <input 
                type="text" 
                name="maintenance_title" 
                value={settings.maintenance_title || ''} 
                onChange={handleChange} 
                placeholder="Contoh: Sistem Sedang Dalam Pemeliharaan Berkala" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Pesan / Penjelasan untuk Masyarakat</label>
              <textarea 
                name="maintenance_message" 
                value={settings.maintenance_message || ''} 
                onChange={handleChange} 
                rows={3} 
                placeholder="Contoh: Kami sedang melakukan peningkatan infrastruktur sistem Makan Bergizi Gratis..." 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none text-sm"
              ></textarea>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Estimasi Waktu Selesai (Opsional)</label>
              <input 
                type="text" 
                name="maintenance_end_time" 
                value={settings.maintenance_end_time || ''} 
                onChange={handleChange} 
                placeholder="Contoh: 12 Oktober 2026 pukul 18:00 WIB" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
              />
              <p className="text-[11px] text-gray-400">Kosongkan jika waktu selesai tidak ingin ditentukan secara spesifik.</p>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700">Kontak Narahubung / Helpdesk (Opsional)</label>
              <input 
                type="text" 
                name="maintenance_contact" 
                value={settings.maintenance_contact || ''} 
                onChange={handleChange} 
                placeholder="Contoh: mbg@lebakkab.go.id / (0252) 201113" 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm" 
              />
              <p className="text-[11px] text-gray-400">Ditampilkan di footer layar pemeliharaan jika masyarakat butuh konfirmasi darurat.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Identitas Utama */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <Globe className="text-primary-600" />
          <h2 className="text-xl font-bold">Identitas Utama</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Nama Situs (Site Name)</label>
            <input type="text" name="site_name" value={settings.site_name || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Tingkat Pemerintah (Gov Level)</label>
            <input type="text" name="gov_level" value={settings.gov_level || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Tagline (Slogan)</label>
            <input type="text" name="tagline" value={settings.tagline || ''} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Deskripsi Web (SEO Description)</label>
            <textarea name="site_description" value={settings.site_description || ''} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
          </div>
        </div>
      </div>

      {/* Identitas Visual */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <ImageIcon className="text-primary-600" />
          <h2 className="text-xl font-bold">Identitas Visual (Logo & Gambar)</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Upload Helper Component */}
          {[
            { key: 'logo', label: 'Logo Utama', desc: 'Rekomendasi PNG transparan' },
            { key: 'favicon', label: 'Favicon', desc: 'Rekomendasi ICO atau PNG (1:1)' },
            { key: 'tagline_logo', label: 'Logo Tagline / Mitra', desc: 'Ditampilkan di sebelah logo utama (opsional)' },
            { key: 'hero_bg_image', label: 'Background Hero', desc: 'Gambar besar untuk latar beranda publik' },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">{item.label}</label>
              <div className="flex items-center gap-4">
                {settings[item.key] && settings[item.key] !== 'Mengunggah...' ? (
                  <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={settings[item.key]} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
                    <ImageIcon size={24} />
                  </div>
                )}
                
                <div className="flex-1">
                  <input type="text" name={item.key} value={settings[item.key] || ''} onChange={handleChange} placeholder="URL Gambar / Path" className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none mb-2" />
                  <div className="relative overflow-hidden inline-block w-full">
                    <button type="button" className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 transition-colors">
                      <UploadCloud size={16} /> Unggah File Baru
                    </button>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, item.key)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kontak & Alamat */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
          <MapPin className="text-primary-600" />
          <h2 className="text-xl font-bold">Informasi Kontak Publik</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Email Utama</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input type="email" name="email" value={settings.email || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">Telepon / Call Center</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
              <input type="text" name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">Alamat Lengkap</label>
            <textarea name="address" value={settings.address || ''} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none"></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isLoading} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-500/20 flex items-center gap-2 transition-all disabled:opacity-70">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />} 
          {isLoading ? 'Menyimpan...' : 'Simpan Semua Konfigurasi'}
        </button>
      </div>
    </form>
  );
}
