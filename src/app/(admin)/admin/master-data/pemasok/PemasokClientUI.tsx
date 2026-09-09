'use client';

import React, { useState, useMemo } from 'react';
import { Plus, X, Trash2, Truck, Edit2, Search, ChevronLeft, ChevronRight, MapPin, Building2 } from 'lucide-react';
import { createPemasok, deletePemasok, updatePemasok } from '@/app/actions/masterData';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PemasokClientUI({ initialData, kabupatenList = [] }: { initialData: any[], kabupatenList?: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('Semua'); // Semua, Dalam Lebak, Luar Lebak
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data: any = {
      namaPemasok: formData.get('namaPemasok') as string,
      tipePemasok: formData.get('tipePemasok') as string,
      npwp: formData.get('npwp') as string,
      picNama: formData.get('picNama') as string,
      picKontak: formData.get('picKontak') as string,
      email: formData.get('email') as string,
      alamatPemasok: formData.get('alamatPemasok') as string,
      status: formData.get('status') as string || 'Aktif',
      kontak: formData.get('kontak') as string,
    };
    
    if (formData.get('kabupatenId')) {
      data.kabupatenId = parseInt(formData.get('kabupatenId') as string, 10);
    }

    let res;
    if (editingId) {
      res = await updatePemasok(editingId, data);
    } else {
      res = await createPemasok(data);
    }
    
    setIsSubmitting(false);
    
    if (res.success) {
      setToastMessage(editingId ? 'Pemasok berhasil diupdate!' : 'Pemasok berhasil ditambahkan!');
      setToastType('success');
      setIsOpen(false);
    } else {
      setToastMessage(res.error || 'Terjadi kesalahan');
      setToastType('error');
    }
  }

  const handleEditClick = (item: any) => {
    setEditData(item);
    setEditingId(item.id);
    setIsOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    
    const res = await deletePemasok(confirmId);
    if (res.success) {
      setToastMessage('Pemasok berhasil dihapus!');
      setToastType('success');
    } else {
      setToastMessage(res.error || 'Terjadi kesalahan');
      setToastType('error');
    }
    
    setIsDeleting(false);
    setConfirmOpen(false);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) setIsOpen(false);
  };

  // Compute stats for Lebak vs Luar Lebak
  const stats = useMemo(() => {
    let dalamLebak = 0;
    let luarLebak = 0;
    const citiesLuar = new Set<string>();

    initialData.forEach(p => {
      // Logic for determining Lebak. If kabupatenId is 1 (Lebak) or not explicitly marked outside Banten/other regency
      if (p.kabupaten?.isLuarBanten || (p.kabupaten && p.kabupaten.namaKabupaten !== 'Kabupaten Lebak')) {
        luarLebak++;
        if (p.kabupaten.namaKabupaten) citiesLuar.add(p.kabupaten.namaKabupaten);
      } else {
        dalamLebak++;
      }
    });

    return { dalamLebak, luarLebak, citiesLuar: Array.from(citiesLuar).join(', ') };
  }, [initialData]);

  // Filtering
  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      // Text search
      const query = searchQuery.toLowerCase();
      const matchesSearch = item.namaPemasok?.toLowerCase().includes(query) || 
                            item.picNama?.toLowerCase().includes(query) ||
                            item.alamatPemasok?.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // Region Filter
      if (regionFilter === 'Dalam Lebak') {
        return !(item.kabupaten?.isLuarBanten || (item.kabupaten && item.kabupaten.namaKabupaten !== 'Kabupaten Lebak'));
      }
      if (regionFilter === 'Luar Lebak') {
        return !!(item.kabupaten?.isLuarBanten || (item.kabupaten && item.kabupaten.namaKabupaten !== 'Kabupaten Lebak'));
      }
      
      return true;
    });
  }, [initialData, searchQuery, regionFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />}
      <ConfirmModal 
        isOpen={confirmOpen} 
        title="Hapus Data Pemasok" 
        message="Apakah Anda yakin ingin menghapus data pemasok ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Pemasok Dalam Lebak</div>
            <div className="text-2xl font-bold text-slate-800">{stats.dalamLebak} <span className="text-sm font-normal text-slate-500">Pemasok Lokal</span></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <MapPin size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Pemasok Luar Lebak</div>
            <div className="text-2xl font-bold text-slate-800">{stats.luarLebak} <span className="text-sm font-normal text-slate-500">Pemasok</span></div>
            {stats.luarLebak > 0 && <div className="text-xs text-slate-400 mt-1 truncate max-w-[200px]" title={stats.citiesLuar}>Dari: {stats.citiesLuar}</div>}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, pic, atau alamat..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
            />
          </div>
          <select 
            value={regionFilter}
            onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
            className="w-full sm:w-auto p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-medium text-slate-700 bg-white"
          >
            <option value="Semua">Semua Wilayah</option>
            <option value="Dalam Lebak">Dalam Lebak</option>
            <option value="Luar Lebak">Luar Lebak</option>
          </select>
        </div>

        <button 
          onClick={() => {
            setEditingId(null);
            setEditData(null);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 whitespace-nowrap w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Tambah Pemasok
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 md:p-8 relative shadow-2xl my-8">
            <button 
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Truck className="text-primary-600" />
              {editingId ? 'Edit Data Pemasok' : 'Tambah Pemasok Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Seksi Profil & Kontak Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                    Profil Pemasok
                  </h3>
                  
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Pemasok *</label>
                    <input required name="namaPemasok" type="text" defaultValue={editData?.namaPemasok || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="UD. Subur Makmur" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">Tipe Pemasok</label>
                      <select name="tipePemasok" defaultValue={editData?.tipePemasok || 'Lokal'} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white text-slate-700">
                        <option value="Lokal">Lokal (Petani/KWT)</option>
                        <option value="Koperasi">Koperasi</option>
                        <option value="BUMDes">BUMDes</option>
                        <option value="Perusahaan">Perusahaan/PT/CV</option>
                        <option value="Individu">Individu/Mandiri</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-slate-700">Status</label>
                      <select name="status" defaultValue={editData?.status || 'Aktif'} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white text-slate-700">
                        <option value="Aktif">Aktif</option>
                        <option value="Diblacklist">Diblacklist</option>
                        <option value="Non-Aktif">Non-Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">NPWP (Opsional)</label>
                    <input name="npwp" type="text" defaultValue={editData?.npwp || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="12.345.678.9-000.000" />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Wilayah / Kabupaten</label>
                    <select name="kabupatenId" defaultValue={editData?.kabupatenId || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white text-slate-700">
                      <option value="">-- Pilih Wilayah (Default: Dalam Lebak) --</option>
                      {kabupatenList?.map((kab: any) => (
                        <option key={kab.id} value={kab.id}>{kab.namaKabupaten} {kab.isLuarBanten ? '(Luar Banten)' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                    <textarea name="alamatPemasok" defaultValue={editData?.alamatPemasok || ''} rows={2} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all resize-none" placeholder="Jl. Raya Desa..."></textarea>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-primary-500 rounded-full"></span>
                    Kontak & PIC
                  </h3>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Penanggung Jawab (PIC)</label>
                    <input name="picNama" type="text" defaultValue={editData?.picNama || ''} className="w-full p-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Bpk/Ibu..." />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-slate-700">Nomor HP/WA PIC</label>
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

              {
              
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
                <th className="p-5">Wilayah & Alamat</th>
                <th className="p-5">Kontak & PIC</th>
                
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 border-t border-slate-100">
                    <div className="font-bold text-slate-800 text-base">{item.namaPemasok}</div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{item.tipePemasok || 'Umum'}</span>
                      {item.npwp && <span>NPWP: {item.npwp}</span>}
                    </div>
                  </td>
                  <td className="p-5 border-t border-slate-100">
                    <div className="font-medium text-slate-700 flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary-500" />
                      {item.kabupaten?.namaKabupaten || 'Kabupaten Lebak'}
                      {item.kabupaten?.isLuarBanten && <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-bold">LUAR BANTEN</span>}
                    </div>
                    {item.alamatPemasok && <div className="text-xs text-slate-500 mt-1 pl-5">{item.alamatPemasok}</div>}
                  </td>
                  <td className="p-5 border-t border-slate-100">
                    <div className="text-sm text-slate-700 font-medium">{item.picNama || '-'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.picKontak || item.kontak || '-'}</div>
                    {item.email && <div className="text-xs text-slate-500 mt-0.5">{item.email}</div>}
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
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Truck size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Data Pemasok tidak ditemukan</p>
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
