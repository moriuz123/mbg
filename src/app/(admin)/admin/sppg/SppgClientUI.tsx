'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Building, ShieldCheck, Home, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { createSppg, deleteSppg, updateSppg } from '@/app/actions/sppg';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function SppgClientUI({ initialData, yayasanData = [] }: { initialData: any[], yayasanData?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSppg, setEditingSppg] = useState<any>(null);

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
      idSppgCode: formData.get('idSppgCode') as string,
      namaSppg: formData.get('namaSppg') as string,
      namaKaSppg: formData.get('namaKaSppg') as string,
      noHpKaSppg: formData.get('noHpKaSppg') as string,
      alamat: formData.get('alamat') as string,
      statusOperasional: formData.get('statusOperasional') as string || 'Belum Operasional',
      tanggalOperasional: formData.get('tanggalOperasional') as string,
      bpjsKesehatan: formData.get('bpjsKesehatan') === 'true',
      yayasanId: formData.get('yayasanId') ? parseInt(formData.get('yayasanId') as string) : undefined,
      jumlahPenjamahMakanan: parseInt(formData.get('jumlahPenjamahMakanan') as string) || 0,
      jumlahBpjsTk: parseInt(formData.get('jumlahBpjsTk') as string) || 0,
      chefBersertifikatBnsp: parseInt(formData.get('chefBersertifikatBnsp') as string) || 0,
      keterangan: formData.get('keterangan') as string,
    };

    let res;
    if (editingSppg) {
      res = await updateSppg(editingSppg.id, data);
    } else {
      res = await createSppg(data);
    }

    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditingSppg(null);
      setToastType('success');
      setToastMessage(editingSppg ? 'Berhasil mengubah data SPPG!' : 'Berhasil menambahkan data SPPG!');
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
    const res = await deleteSppg(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data SPPG berhasil dihapus!');
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
        title="Hapus Data SPPG" 
        message="Apakah Anda yakin ingin menghapus data SPPG ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => {
            setEditingSppg(null);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah SPPG
        </button>
      </div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => {
                setIsOpen(false);
                setEditingSppg(null);
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">{editingSppg ? 'Edit Data SPPG' : 'Tambah Data SPPG'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kode SPPG (Opsional)</label>
                  <input name="idSppgCode" type="text" defaultValue={editingSppg?.idSppgCode} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Contoh: SPPG-123" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama SPPG (Dapur) *</label>
                  <input required name="namaSppg" type="text" defaultValue={editingSppg?.namaSppg} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Contoh: Dapur Cibadak" />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Yayasan</label>
                  <select name="yayasanId" defaultValue={editingSppg?.yayasanId || ""} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                    <option value="">-- Pilih Yayasan (Opsional) --</option>
                    {yayasanData.map(y => (
                      <option key={y.id} value={y.id}>{y.namaYayasan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kepala SPPG</label>
                  <input name="namaKaSppg" type="text" defaultValue={editingSppg?.namaKaSppg} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Nama Kepala Dapur" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP Kepala SPPG</label>
                  <input name="noHpKaSppg" type="text" defaultValue={editingSppg?.noHpKaSppg} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="08..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat</label>
                  <textarea name="alamat" rows={2} defaultValue={editingSppg?.alamat} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Alamat Dapur..."></textarea>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Status Operasional</label>
                  <select name="statusOperasional" defaultValue={editingSppg?.statusOperasional || "Belum Operasional"} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                    <option value="Belum Operasional">Belum Operasional</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Tutup">Tutup Sementara</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tanggal Operasional</label>
                  <input name="tanggalOperasional" type="date" defaultValue={editingSppg?.tanggalOperasional?.split('T')[0]} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                
                <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Data SDM & Ketenagakerjaan</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-700">Jml Penjamah Makanan</label>
                      <input name="jumlahPenjamahMakanan" type="number" defaultValue={editingSppg?.jumlahPenjamahMakanan || "0"} min="0" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-700">Jml BPJS TK</label>
                      <input name="jumlahBpjsTk" type="number" defaultValue={editingSppg?.jumlahBpjsTk || "0"} min="0" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-700">Chef BNSP</label>
                      <input name="chefBersertifikatBnsp" type="number" defaultValue={editingSppg?.chefBersertifikatBnsp || "0"} min="0" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs font-semibold text-slate-700">Punya BPJS Kesehatan?</label>
                      <select name="bpjsKesehatan" defaultValue={editingSppg?.bpjsKesehatan === true ? "true" : "false"} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50">
                        <option value="false">Tidak</option>
                        <option value="true">Ya</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan Data...' : 'Simpan Data SPPG'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Kode & Nama SPPG</th>
                <th className="p-5">Kepala SPPG</th>
                <th className="p-5">Alamat</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Building size={16} className="text-primary-600" /> {item.namaSppg}
                    </div>
                    {item.yayasan && (
                      <div className="text-xs font-medium text-primary-600 mt-1 flex items-center gap-1">
                        <Home size={12} /> {item.yayasan.namaYayasan}
                      </div>
                    )}
                    {item.idSppgCode && (
                      <div className="text-xs font-medium text-slate-400 mt-1">Kode: {item.idSppgCode}</div>
                    )}
                  </td>
                  <td className="p-5 text-slate-700 font-medium">{item.namaKaSppg || '-'}</td>
                  <td className="p-5 text-slate-600 text-sm max-w-[200px] truncate">{item.alamat || '-'}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${item.statusOperasional === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {item.statusOperasional === 'Aktif' && <ShieldCheck size={14} />}
                      {item.statusOperasional || 'Belum Operasional'}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link 
                        href={`/admin/sppg/${item.id}`}
                        className="px-3 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-bold transition-colors border border-primary-200 shadow-sm"
                      >
                        Atur Penerima
                      </Link>
                      <button 
                        onClick={() => {
                          setEditingSppg(item);
                          setIsOpen(true);
                        }}
                        className="text-amber-500 hover:text-amber-700 hover:bg-amber-50 p-2 rounded-lg transition-colors border border-transparent hover:border-amber-100 inline-flex items-center"
                        title="Edit SPPG"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                        title="Hapus SPPG"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Building size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data SPPG</p>
                    <p className="text-sm text-slate-400 mt-1">Silakan tambahkan data dapur SPPG baru.</p>
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
