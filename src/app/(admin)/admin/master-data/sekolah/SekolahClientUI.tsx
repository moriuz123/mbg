'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, GraduationCap, MapPin, Users, Trash2, Edit2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { createSekolah, deleteSekolah, updateSekolah } from './actions';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function SekolahClientUI({ initialData, categories, isAdmin, kecamatanList, desaList }: { initialData: any[], categories: any[], isAdmin: boolean, kecamatanList: any[], desaList: any[] }) {
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
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaSekolah: formData.get('namaSekolah') as string,
      npsn: formData.get('npsn') as string,
      kategoriId: parseInt(formData.get('kategoriId') as string),
      alamatSekolah: formData.get('alamatSekolah') as string,
      namaKepalaSekolah: formData.get('namaKepalaSekolah') as string,
      noHpKepalaSekolah: formData.get('noHpKepalaSekolah') as string,
      jumlahSiswaTotal: parseInt(formData.get('jumlahSiswaTotal') as string) || 0,
      tahunAjaranLast: formData.get('tahunAjaranLast') as string,
      kecamatanId: formData.get('kecamatanId') ? parseInt(formData.get('kecamatanId') as string) : undefined,
      desaId: formData.get('desaId') ? parseInt(formData.get('desaId') as string) : undefined,
    };

    let res;
    if (editingId) {
      res = await updateSekolah(editingId, data);
    } else {
      res = await createSekolah(data);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditingId(null);
      setEditData(null);
      setToastType('success');
      setToastMessage(editingId ? 'Berhasil mengubah data Sekolah!' : 'Berhasil menambahkan data Sekolah!');
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
    const res = await deleteSekolah(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Sekolah berhasil dihapus!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Gagal menghapus data');
    }
  }

  // Derived state for filtering and pagination
  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchesSearch = item.namaSekolah.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesKecamatan = filterKecamatan === '' || item.kecamatanId?.toString() === filterKecamatan;
      return matchesSearch && matchesKecamatan;
    });
  }, [initialData, searchQuery, filterKecamatan]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle page change ensuring it stays within bounds
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterKecamatan]);

  return (
    <>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      <ConfirmModal 
        isOpen={confirmOpen} 
        title="Hapus Data Sekolah" 
        message="Apakah Anda yakin ingin menghapus data Sekolah ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari sekolah..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
            />
          </div>
          
          {/* Filter Kecamatan */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={filterKecamatan}
              onChange={(e) => setFilterKecamatan(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm appearance-none bg-white"
            >
              <option value="">Semua Kecamatan</option>
              {kecamatanList?.map(kec => (
                <option key={kec.id} value={kec.id.toString()}>{kec.namaKecamatan}</option>
              ))}
            </select>
          </div>
        </div>

        {isAdmin && (
          <button 
            onClick={() => {
              setEditingId(null);
              setEditData(null);
              setFormKecamatanId('');
              setIsOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold shadow-md shadow-primary-600/20 hover:bg-primary-700 transition-all hover:-translate-y-0.5 whitespace-nowrap w-full md:w-auto justify-center"
          >
            <Plus size={20} /> Tambah Sekolah
          </button>
        )}
      </div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl my-8">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">{editingId ? 'Edit Data Sekolah' : 'Tambah Data Sekolah'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Sekolah *</label>
                  <input required name="namaSekolah" defaultValue={editData?.namaSekolah || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: SDN 1 Rangkasbitung" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">NPSN</label>
                  <input name="npsn" type="text" defaultValue={editData?.npsn || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nomor Pokok Sekolah Nasional" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kecamatan</label>
                  <select 
                    name="kecamatanId" 
                    value={formKecamatanId}
                    onChange={(e) => setFormKecamatanId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  >
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatanList?.map(kec => (
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
                    {desaList?.filter(d => d.kecamatanId?.toString() === formKecamatanId).map(desa => (
                      <option key={desa.id} value={desa.id}>{desa.namaDesa}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kategori / Jenjang *</label>
                  <select required name="kategoriId" defaultValue={editData?.kategoriId || ''} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all">
                    <option value="">Pilih Kategori...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.namaKategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tahun Ajaran</label>
                  <input name="tahunAjaranLast" type="text" defaultValue={editData?.tahunAjaranLast || "2025/2026"} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="2025/2026" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Total Siswa *</label>
                  <input required name="jumlahSiswaTotal" defaultValue={editData?.jumlahSiswaTotal || ''} type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Kepala Sekolah</label>
                  <input name="namaKepalaSekolah" type="text" defaultValue={editData?.namaKepalaSekolah || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP Kepala Sekolah</label>
                  <input name="noHpKepalaSekolah" type="text" defaultValue={editData?.noHpKepalaSekolah || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="08..." />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Lengkap Sekolah</label>
                <textarea name="alamatSekolah" rows={3} defaultValue={editData?.alamatSekolah || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Alamat lengkap sekolah..."></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan Data...' : editingId ? 'Simpan Perubahan' : 'Simpan Data Sekolah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sekolah & Jenjang</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Sekolah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <GraduationCap size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Data sekolah tidak ditemukan</p>
                    <p className="text-sm text-slate-400 mt-1">Silakan sesuaikan pencarian atau tambahkan data baru.</p>
                  </td>
                </tr>
              ) : (
                currentData.map((sekolah) => (
                  <tr key={sekolah.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {sekolah.namaSekolah}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100">
                          {sekolah.kategori}
                        </span>
                        {sekolah.npsn && (
                          <span className="text-xs font-medium text-slate-400">NPSN: {sekolah.npsn}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-800 font-medium">{sekolah.namaKepalaSekolah || '-'}</div>
                      <div className="text-xs text-slate-500 mt-1">{sekolah.noHpKepalaSekolah || '-'}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                        <Users size={14} className="text-slate-500" /> {sekolah.jumlahSiswaTotal}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && (
                          <>
                            <button 
                              onClick={() => handleEditClick(sekolah)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                              title="Edit Sekolah"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(sekolah.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                              title="Hapus Sekolah"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
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
