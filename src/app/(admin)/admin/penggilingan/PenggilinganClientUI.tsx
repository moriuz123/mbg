'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Factory, Phone, Settings } from 'lucide-react';
import { createPenggilingan, deletePenggilingan } from '@/app/actions/penggilingan';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PenggilinganClientUI({ initialData, kecamatanList, isAdmin = true }: { initialData: any[], kecamatanList: any[], isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaPenggilingan: formData.get('namaPenggilingan') as string,
      alamat: formData.get('alamat') as string,
      kecamatanId: parseInt(formData.get('kecamatanId') as string) || undefined,
      penanggungJawab: formData.get('penanggungJawab') as string,
      noHp: formData.get('noHp') as string,
      kapasitasTerpasangKgMinggu: formData.get('kapasitasTerpasangKgMinggu') as string,
      status: formData.get('status') as string || 'Aktif',
    };

    const res = await createPenggilingan(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setToastType('success');
      setToastMessage('Berhasil menambahkan penggilingan!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Terjadi kesalahan');
    }
  }

  function handleDeleteClick(id: number) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmId) return;
    setIsDeleting(true);
    const res = await deletePenggilingan(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Penggilingan berhasil dihapus!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Gagal menghapus data');
    }
  }

  return (
    <>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      <ConfirmModal 
        isOpen={confirmOpen} 
        title="Hapus Data Penggilingan" 
        message="Apakah Anda yakin ingin menghapus data penggilingan ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
          >
            <Plus size={20} /> Tambah Penggilingan
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Penggilingan</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Penggilingan *</label>
                <input required name="namaPenggilingan" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: Penggilingan Makmur Jaya" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat</label>
                <textarea name="alamat" rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Alamat lengkap..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kecamatan</label>
                  <select name="kecamatanId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatanList?.map(kec => (
                      <option key={kec.id} value={kec.id}>{kec.namaKecamatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Penanggung Jawab</label>
                  <input name="penanggungJawab" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nama Pemilik/PJ" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP</label>
                  <input name="noHp" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="08..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kapasitas (kg/minggu)</label>
                  <input name="kapasitasTerpasangKgMinggu" type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 1500" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Status</label>
                  <select name="status" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Penggilingan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Nama Penggilingan</th>
                <th className="p-5">Kontak & PJ</th>
                <th className="p-5">Kapasitas (kg/minggu)</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Factory size={18} className="text-primary-600" /> {item.namaPenggilingan}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">{item.alamat || '-'}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-semibold text-slate-800">{item.penanggungJawab || '-'}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <Phone size={12} /> {item.noHp || '-'}
                    </div>
                  </td>
                  <td className="p-5 font-bold text-slate-700">
                    {item.kapasitasTerpasangKgMinggu ? `${item.kapasitasTerpasangKgMinggu} kg` : '-'}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/penggilingan/${item.id}`}
                        className="px-3 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-bold transition-colors border border-primary-200 shadow-sm flex items-center gap-1.5"
                      >
                        <Settings size={14} /> Kelola
                      </Link>
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Factory size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data Penggilingan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
