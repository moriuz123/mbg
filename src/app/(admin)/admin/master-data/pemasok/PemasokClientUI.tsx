'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Truck, Edit2 } from 'lucide-react';
import { createPemasok, deletePemasok, updatePemasok } from '@/app/actions/masterData';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PemasokClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

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
      namaPemasok: formData.get('namaPemasok') as string,
      tipePemasok: formData.get('tipePemasok') as string,
      npwp: formData.get('npwp') as string,
      picNama: formData.get('picNama') as string,
      picKontak: formData.get('picKontak') as string,
      email: formData.get('email') as string,
      alamatPemasok: formData.get('alamatPemasok') as string,
      status: formData.get('status') as string || 'Aktif',
      bankNama: formData.get('bankNama') as string,
      bankRekening: formData.get('bankRekening') as string,
      bankAtasNama: formData.get('bankAtasNama') as string,
      kontak: formData.get('kontak') as string,
    };

    let res;
    if (editingId) {
      res = await updatePemasok(editingId, data);
    } else {
      res = await createPemasok(data);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditingId(null);
      setEditData(null);
      setToastType('success');
      setToastMessage(editingId ? 'Berhasil mengubah data Pemasok!' : 'Berhasil menambahkan data Pemasok!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Terjadi kesalahan');
    }
  }

  function handleEditClick(item: any) {
    setEditingId(item.id);
    setEditData(item);
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
    setEditingId(null);
    setEditData(null);
  }

  function handleDeleteClick(id: number) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmId) return;
    setIsDeleting(true);
    const res = await deletePemasok(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Pemasok berhasil dihapus!');
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
        title="Hapus Data Pemasok" 
        message="Apakah Anda yakin ingin menghapus data Pemasok ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="flex justify-end mb-6">
        <button 
          onClick={() => {
            setEditingId(null);
            setEditData(null);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Pemasok
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">{editingId ? 'Edit Pemasok' : 'Tambah Pemasok'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Seksi Informasi Utama */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                  Informasi Perusahaan / Entitas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Pemasok *</label>
                    <input required name="namaPemasok" type="text" defaultValue={editData?.namaPemasok || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: PT Sumber Pangan" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Tipe Pemasok</label>
                    <select name="tipePemasok" defaultValue={editData?.tipePemasok || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all bg-white">
                      <option value="">-- Pilih Tipe --</option>
                      <option value="Perusahaan">Perusahaan (PT/CV)</option>
                      <option value="Koperasi">Koperasi</option>
                      <option value="BUMDes">BUMDes</option>
                      <option value="Individu/Petani">Individu / Kelompok Tani</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">NPWP</label>
                    <input name="npwp" type="text" defaultValue={editData?.npwp || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nomor NPWP..." />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Status Pemasok</label>
                    <select name="status" defaultValue={editData?.status || 'Aktif'} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all bg-white">
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                      <option value="Diblacklist">Di-blacklist</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Pemasok</label>
                    <textarea name="alamatPemasok" rows={2} defaultValue={editData?.alamatPemasok || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Alamat lengkap..."></textarea>
                  </div>
                </div>
              </div>

              {/* Seksi Kontak & PIC */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                  Informasi Kontak & PIC
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nama PIC (Penanggung Jawab)</label>
                    <input name="picNama" type="text" defaultValue={editData?.picNama || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nama lengkap PIC..." />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Kontak PIC / HP</label>
                    <input name="picKontak" type="text" defaultValue={editData?.picKontak || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="08..." />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Email Utama</label>
                    <input name="email" type="email" defaultValue={editData?.email || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Telp Kantor (Opsional)</label>
                    <input name="kontak" type="text" defaultValue={editData?.kontak || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="021-..." />
                  </div>
                </div>
              </div>

              {/* Seksi Rekening Bank */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                  Informasi Rekening Bank
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Bank</label>
                    <input name="bankNama" type="text" defaultValue={editData?.bankNama || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: Bank bjb" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nomor Rekening</label>
                    <input name="bankRekening" type="text" defaultValue={editData?.bankRekening || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="1234567890" />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Atas Nama</label>
                    <input name="bankAtasNama" type="text" defaultValue={editData?.bankAtasNama || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Atas nama di rekening..." />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Pemasok'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Nama Pemasok / Tipe</th>
                <th className="p-5">Kontak & PIC</th>
                <th className="p-5">Bank & Rekening</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 border-t border-slate-100">
                    <div className="font-bold text-slate-800 text-base">{item.namaPemasok}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{item.tipePemasok || 'Umum'}</span>
                      {item.npwp && <span>NPWP: {item.npwp}</span>}
                    </div>
                  </td>
                  <td className="p-5 border-t border-slate-100">
                    <div className="text-sm text-slate-700 font-medium">{item.picNama || '-'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.picKontak || item.kontak || '-'}</div>
                    {item.email && <div className="text-xs text-slate-500 mt-0.5">{item.email}</div>}
                  </td>
                  <td className="p-5 border-t border-slate-100">
                    {item.bankNama ? (
                      <div className="text-sm">
                        <div className="font-bold text-slate-700">{item.bankNama}</div>
                        <div className="text-xs text-slate-600">{item.bankRekening}</div>
                        <div className="text-xs text-slate-500">a.n {item.bankAtasNama}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Belum diatur</span>
                    )}
                  </td>
                  <td className="p-5 border-t border-slate-100 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      item.status === 'Diblacklist' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {item.status || 'Aktif'}
                    </span>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2 border-t border-slate-100">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Truck size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data Pemasok</p>
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
