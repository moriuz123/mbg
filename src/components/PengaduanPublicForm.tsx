'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { submitPengaduanPublic } from '@/app/actions/pengaduan';

type TargetList = {
  sekolahList: { id: number; nama: string }[];
  sppgList: { id: number; nama: string }[];
};

export default function PengaduanPublicForm({ targets }: { targets: TargetList }) {
  const [targetType, setTargetType] = useState('umum');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    const formData = new FormData(e.currentTarget);
    
    const res = await submitPengaduanPublic(formData);
    
    if (res.success) {
      setSuccessMsg(res.message);
      (e.target as HTMLFormElement).reset();
      setTargetType('umum');
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  if (successMsg) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10 text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Laporan Terkirim!</h3>
        <p className="text-slate-600 mb-8">{successMsg}</p>
        <button 
          onClick={() => setSuccessMsg('')} 
          className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Kirim Laporan Lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
          <MessageSquare size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sampaikan Keluhan Anda</h2>
          <p className="text-slate-500 mt-1">
            Bantu kami memantau dan meningkatkan kualitas Makan Bergizi Gratis di Kabupaten Lebak.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nama Lengkap (Opsional)</label>
            <input 
              type="text" 
              name="namaPelapor" 
              placeholder="Biarkan kosong jika ingin anonim" 
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">No. HP / WhatsApp (Opsional)</label>
            <input 
              type="text" 
              name="kontak" 
              placeholder="Agar kami bisa menghubungi Anda kembali" 
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Laporan ini terkait dengan apa?</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="targetType" value="umum" checked={targetType === 'umum'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-700">Sistem / Umum</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="targetType" value="sekolah" checked={targetType === 'sekolah'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-700">Pelayanan di Sekolah</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="targetType" value="sppg" checked={targetType === 'sppg'} onChange={(e) => setTargetType(e.target.value)} className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-slate-700">Kualitas Makanan (Dapur SPPG)</span>
              </label>
            </div>
          </div>

          {targetType === 'sekolah' && (
            <div className="space-y-2 animate-fade-in mt-4">
              <label className="text-sm font-semibold text-blue-700">Pilih Nama Sekolah</label>
              <select name="targetId" required className="w-full p-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">-- Pilih Sekolah --</option>
                {targets.sekolahList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
              </select>
            </div>
          )}

          {targetType === 'sppg' && (
            <div className="space-y-2 animate-fade-in mt-4">
              <label className="text-sm font-semibold text-emerald-700">Pilih Nama Dapur (SPPG)</label>
              <select name="targetId" required className="w-full p-3 rounded-xl border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option value="">-- Pilih Dapur (SPPG) --</option>
                {targets.sppgList.map(s => <option key={s.id} value={s.id}>{s.nama}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Isi Pengaduan / Keluhan</label>
          <textarea 
            name="isiPengaduan" 
            required 
            rows={5}
            placeholder="Ceritakan detail keluhan atau masukan Anda di sini..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-y"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all flex justify-center items-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim Laporan...' : (
            <>
              Kirim Laporan Sekarang <Send size={20} />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
