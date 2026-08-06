'use client';

import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, X, Send } from 'lucide-react';
import { submitTanggapan } from '@/app/actions/pengaduan';

type Pengaduan = {
  id: number;
  namaPelapor: string | null;
  kontak: string | null;
  isiPengaduan: string;
  status: string | null;
  tanggal: Date | null;
  tanggapan: string | null;
  sppgName: string | null;
  sekolahName: string | null;
};

export default function PengaduanClient({ data }: { data: Pengaduan[] }) {
  const [activeItem, setActiveItem] = useState<Pengaduan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await submitTanggapan(formData);
    if (res.success) {
      setActiveItem(null);
      window.location.reload();
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Kotak Pengaduan Masyarakat</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kelola keluhan, masukan, dan pantau isu terkait program MBG
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Tanggal & Pelapor</th>
                <th className="p-4">Terkait Instalasi</th>
                <th className="p-4">Isi Pengaduan</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-semibold text-slate-800">{item.namaPelapor || 'Anonim'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}</div>
                    {item.kontak && <div className="text-xs text-slate-400 mt-0.5">{item.kontak}</div>}
                  </td>
                  <td className="p-4">
                    {item.sekolahName && <div className="text-xs font-medium text-blue-700 bg-blue-50 inline-block px-2 py-0.5 rounded mb-1">Sekolah: {item.sekolahName}</div>}
                    <br/>
                    {item.sppgName && <div className="text-xs font-medium text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded">SPPG: {item.sppgName}</div>}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 max-w-sm line-clamp-2">{item.isiPengaduan}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status === 'Selesai' && <CheckCircle size={12} />}
                      {item.status === 'Diproses' && <Clock size={12} />}
                      {item.status === 'Baru' && <AlertTriangle size={12} />}
                      {item.status || 'Baru'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setActiveItem(item)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Berespon
                    </button>
                  </td>
                </tr>
              ))}
              
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Tidak ada data pengaduan masuk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare size={20} className="text-primary-600"/> Detail Pengaduan
              </h3>
              <button onClick={() => setActiveItem(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-slate-800">
                <div className="flex justify-between mb-2 border-b border-amber-200/50 pb-2">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dari:</span>
                    <span className="ml-2 font-semibold">{activeItem.namaPelapor || 'Anonim'}</span>
                  </div>
                  <div className="text-xs text-amber-600 font-medium">
                    {activeItem.tanggal ? new Date(activeItem.tanggal).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : ''}
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{activeItem.isiPengaduan}</p>
              </div>

              <form id="tanggapanForm" onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" name="id" value={activeItem.id} />
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Tanggapan Admin (Resolusi)</label>
                  <textarea 
                    name="tanggapan" 
                    defaultValue={activeItem.tanggapan || ''} 
                    required 
                    rows={4} 
                    className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" 
                    placeholder="Tuliskan tindak lanjut atau resolusi dari aduan ini..."
                  ></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Ubah Status</label>
                  <select name="status" defaultValue={activeItem.status || 'Baru'} className="w-full p-3 rounded-xl border border-slate-300 outline-none bg-white font-medium">
                    <option value="Baru">Belum Diproses (Baru)</option>
                    <option value="Diproses">Sedang Diproses (Investigasi)</option>
                    <option value="Selesai">Selesai (Resolved)</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setActiveItem(null)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="tanggapanForm" disabled={isSubmitting} className="px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-primary-600/30">
                <Send size={18} /> {isSubmitting ? 'Menyimpan...' : 'Kirim Tanggapan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
