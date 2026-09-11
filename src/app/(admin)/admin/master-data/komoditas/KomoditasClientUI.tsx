'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, Trash2, ShoppingCart, Edit2, Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { createKomoditas, deleteKomoditas, updateKomoditas } from '@/app/actions/masterData';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function KomoditasClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSatuan, setSelectedSatuan] = useState('ALL');

  const categories = [
    'Karbohidrat/ Padi- Padian',
    'Bumbu/ Rempah',
    'Protein Hewani',
    'Protein Nabati',
    'Sayur',
    'Buah',
    'Susu',
  ];

  const satuanList = [
    'Kilogram',
    'Liter',
    'Gram',
    'Pcs',
    'Ikat',
    'Karton',
  ];

  // Filtered Data Computation
  const filteredData = useMemo(() => {
    return initialData.filter((item) => {
      // Search filter (Nama Komoditas or Kategori)
      const matchesSearch = 
        !searchQuery ||
        item.namaBahan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategori?.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory = 
        selectedCategory === 'ALL' || item.kategori === selectedCategory;

      // Satuan filter
      const matchesSatuan = 
        selectedSatuan === 'ALL' || item.satuanDefault === selectedSatuan;

      return matchesSearch && matchesCategory && matchesSatuan;
    });
  }, [initialData, searchQuery, selectedCategory, selectedSatuan]);

  const isFiltered = searchQuery !== '' || selectedCategory !== 'ALL' || selectedSatuan !== 'ALL';

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSatuan]);

  function handleResetFilters() {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedSatuan('ALL');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaBahan: formData.get('namaBahan') as string,
      kategori: formData.get('kategori') as string,
      satuanDefault: formData.get('satuanDefault') as string || 'Kilogram',
      batasKritis: formData.get('batasKritis') as string || '5.00',
    };

    let res;
    if (editingId) {
      res = await updateKomoditas(editingId, data);
    } else {
      res = await createKomoditas(data);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditingId(null);
      setEditData(null);
      setToastType('success');
      setToastMessage(editingId ? 'Berhasil mengubah data Komoditas!' : 'Berhasil menambahkan data Komoditas!');
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
    const res = await deleteKomoditas(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Komoditas berhasil dihapus!');
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
        title="Hapus Data Komoditas" 
        message="Apakah Anda yakin ingin menghapus data Komoditas ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Control Bar: Filters & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative min-w-[240px] flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama komoditas..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Satuan Default Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedSatuan}
              onChange={(e) => setSelectedSatuan(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all cursor-pointer"
            >
              <option value="ALL">Semua Satuan</option>
              {satuanList.map((sat) => (
                <option key={sat} value={sat}>
                  {sat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
              title="Reset Filter"
            >
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>

        {/* Add Komoditas Button */}
        <button 
          onClick={() => {
            setEditingId(null);
            setEditData(null);
            setIsOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Plus size={18} /> Tambah Komoditas
        </button>
      </div>

      {/* Filter Info / Results Count */}
      <div className="flex items-center justify-between mb-3 text-xs font-medium text-slate-500 px-1">
        <div>
          Menampilkan <span className="font-bold text-slate-800">{filteredData.length}</span> dari <span className="font-bold text-slate-800">{initialData.length}</span> komoditas
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">{editingId ? 'Edit Komoditas' : 'Tambah Komoditas'}</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Komoditas *</label>
                <input required name="namaBahan" type="text" defaultValue={editData?.namaBahan || ''} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: Beras Premium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kategori</label>
                  <select name="kategori" defaultValue={editData?.kategori || categories[0]} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Satuan Default</label>
                  <select name="satuanDefault" defaultValue={editData?.satuanDefault || 'Kilogram'} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all">
                    <option value="Kilogram">Kilogram (kg)</option>
                    <option value="Liter">Liter (L)</option>
                    <option value="Gram">Gram (g)</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Ikat">Ikat</option>
                    <option value="Karton">Karton</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Batas Kritis Stok (Minimum Aman)</label>
                <div className="relative">
                  <input required name="batasKritis" type="number" step="0.01" min="0" defaultValue={editData?.batasKritis || '5.00'} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: 5.00" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">Satuan</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">Sistem akan memunculkan peringatan kritis jika sisa stok gudang berada di bawah angka ini.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan Komoditas'}
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
                <th className="p-5">Nama Komoditas</th>
                <th className="p-5">Kategori</th>
                <th className="p-5">Satuan Default</th>
                <th className="p-5 text-center">Batas Kritis Stok</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 font-bold text-slate-900 text-base">{item.namaBahan}</td>
                  <td className="p-5 font-medium text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                      {item.kategori || '-'}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold">
                      {item.satuanDefault}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold">
                      &lt; {item.batasKritis || '5.00'} {item.satuanDefault}
                    </span>
                  </td>
                  <td className="p-5 text-right flex justify-end gap-2">
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
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">
                      {isFiltered ? 'Tidak ada komoditas yang cocok dengan filter' : 'Belum ada data Komoditas'}
                    </p>
                    {isFiltered && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <RotateCcw size={14} /> Reset Filter
                      </button>
                    )}
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
