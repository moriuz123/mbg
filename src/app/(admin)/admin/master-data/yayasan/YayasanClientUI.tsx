'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, Trash2, Home, Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { createYayasan, deleteYayasan, updateYayasan } from '@/app/actions/yayasan';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function YayasanClientUI({ initialData, kecamatanList, desaList }: { initialData: any[], kecamatanList: any[], desaList: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [formKecamatanId, setFormKecamatanId] = useState<string>('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // States for pagination and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaYayasan: formData.get('namaYayasan') as string,
      alamat: formData.get('alamat') as string,
      kontak: formData.get('kontak') as string,
      kecamatanId: formData.get('kecamatanId') ? parseInt(formData.get('kecamatanId') as string) : undefined,
      desaId: formData.get('desaId') ? parseInt(formData.get('desaId') as string) : undefined,
    };

    let res;
    if (editingId) {
      res = await updateYayasan(editingId, data);
    } else {
      res = await createYayasan(data);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditingId(null);
      setEditData(null);
      setToastType('success');
      setToastMessage(editingId ? 'Berhasil mengubah data Yayasan!' : 'Berhasil menambahkan data Yayasan!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Terjadi kesalahan');
    }
  }

  function handleEditClick(item: any) {
    setEditingId(item.id);
    setEditData(item);
    setFormKecamatanId(item.kecamatanId ? item.kecamatanId.toString() : '');
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
    setEditingId(null);
    setEditData(null);
    setFormKecamatanId('');
  }

  function handleDeleteClick(id: number) {
    setConfirmId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmId) return;
    setIsDeleting(true);
    const res = await deleteYayasan(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Yayasan berhasil dihapus!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Gagal menghapus data');
    }
  }

  // Derived state for filtering and pagination
  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      return item.namaYayasan.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [initialData, searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle page change ensuring it stays within bounds
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      <ConfirmModal 
        isOpen={confirmOpen} 
        title="Hapus Data Yayasan" 
        message="Apakah Anda yakin ingin menghapus data Yayasan ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Search Box */}
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari yayasan..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
          />
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setEditData(null);
            setFormKecamatanId('');
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Tambah Yayasan
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-2xl">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">{editingId ? 'Edit Yayasan' : 'Tambah Yayasan'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Yayasan *</label>
                <input required name="namaYayasan" type="text" defaultValue={editData?.namaYayasan || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Contoh: Yayasan Bhakti 2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kecamatan</label>
                  <select 
                    name="kecamatanId" 
                    value={formKecamatanId}
                    onChange={(e) => setFormKecamatanId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatanList.map(kec => (
                      <option key={kec.id} value={kec.id}>{kec.namaKecamatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Desa/Kelurahan</label>
                  <select 
                    name="desaId" 
                    defaultValue={editData?.desaId || ''} 
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:bg-slate-100"
                    disabled={!formKecamatanId}
                  >
                    <option value="">-- Pilih Desa --</option>
                    {desaList.filter(d => d.kecamatanId?.toString() === formKecamatanId).map(desa => (
                      <option key={desa.id} value={desa.id}>{desa.namaDesa}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat</label>
                <textarea name="alamat" rows={2} defaultValue={editData?.alamat || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Alamat lengkap..."></textarea>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Kontak (No. HP / Telp)</label>
                <input name="kontak" type="text" defaultValue={editData?.kontak || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="08..." />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Yayasan'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Nama Yayasan</th>
                <th className="p-5">Alamat</th>
                <th className="p-5">Kontak</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 font-bold text-slate-900 flex items-center gap-2">
                    <Home size={16} className="text-primary-600" /> {item.namaYayasan}
                  </td>
                  <td className="p-5 text-slate-600">{item.alamat || '-'}</td>
                  <td className="p-5 text-slate-700 font-medium">{item.kontak || '-'}</td>
                  <td className="p-5 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(item)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-100 inline-flex items-center"
                      title="Edit Yayasan"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                      title="Hapus Yayasan"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Home size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Data Yayasan tidak ditemukan</p>
                    <p className="text-sm text-slate-400 mt-1">Silakan sesuaikan pencarian atau tambahkan data baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200 bg-slate-50/50">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-bold text-slate-900">{filteredData.length}</span> data
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${currentPage === pageNum ? 'bg-primary-600 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
