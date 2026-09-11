'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Factory, Phone, Settings, Edit3, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { createPenggilingan, updatePenggilingan, deletePenggilingan } from '@/app/actions/penggilingan';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PenggilinganClientUI({ 
  initialData, 
  kecamatanList, 
  desaList,
  isAdmin = false 
}: { 
  initialData: any[]; 
  kecamatanList: any[]; 
  desaList: any[];
  isAdmin?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<string>('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterDesa, setFilterDesa] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Apply filters
  const filteredData = initialData.filter(item => {
    const matchSearch = item.namaPenggilingan.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.namaDagang && item.namaDagang.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (item.penanggungJawab && item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchKecamatan = filterKecamatan ? item.kecamatanId?.toString() === filterKecamatan : true;
    const matchDesa = filterDesa ? item.desaId?.toString() === filterDesa : true;
    const matchStatus = filterStatus ? item.status === filterStatus : true;
    return matchSearch && matchKecamatan && matchDesa && matchStatus;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterKecamatan, filterDesa, filterStatus]);



  function handleOpenAdd() {
    setEditItem(null);
    setSelectedKecamatanId('');
    setIsOpen(true);
  }

  function handleOpenEdit(item: any) {
    setEditItem(item);
    setSelectedKecamatanId(item.kecamatanId?.toString() || '');
    setIsOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaPenggilingan: formData.get('namaPenggilingan') as string,
      alamat: formData.get('alamat') as string,
      kecamatanId: parseInt(formData.get('kecamatanId') as string) || undefined,
      desaId: parseInt(formData.get('desaId') as string) || undefined,
      penanggungJawab: formData.get('penanggungJawab') as string,
      noHp: formData.get('noHp') as string,
      kapasitasTerpasangKgMinggu: formData.get('kapasitasTerpasangKgMinggu') as string,
      status: formData.get('status') as string || 'Aktif',
    };

    let res;
    if (editItem) {
      res = await updatePenggilingan(editItem.id, data);
    } else {
      res = await createPenggilingan(data);
    }

    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setEditItem(null);
      setToastType('success');
      setToastMessage(editItem ? 'Berhasil memperbarui data penggilingan!' : 'Berhasil menambahkan penggilingan!');
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
        title="Hapus Penggilingan"
        message="Apakah Anda yakin ingin menghapus data mitra penggilingan ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Mitra Terdaftar</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">{initialData.length}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Unit</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Mitra penggilingan di database</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Mitra Berstatus Aktif</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">{initialData.filter((d: any) => d.status === 'Aktif').length}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Unit</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Siap beroperasi dan suplai SPPG</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Kapasitas Suplai</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">
                {(initialData.filter((d: any) => d.status === 'Aktif').reduce((sum, curr) => sum + (parseFloat(curr.kapasitasTerpasangKgMinggu) || 0), 0) / 1000).toFixed(1)}
              </span>
              <span className="text-sm font-medium text-slate-500 mb-1">Ton / Minggu</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Dari seluruh penggilingan aktif</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Sebaran Wilayah</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">
                {new Set(initialData.filter((d: any) => d.status === 'Aktif' && d.kecamatanId).map((d: any) => d.kecamatanId)).size}
              </span>
              <span className="text-sm font-medium text-slate-500 mb-1">Kecamatan</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Titik distribusi penggilingan aktif</p>
          </div>
        </div>
      )}
      
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
          >
            <Plus size={20} /> Tambah Penggilingan
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">
              {editItem ? 'Edit Data Penggilingan' : 'Tambah Penggilingan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 md:col-span-3">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Penggilingan <span className="text-red-500">*</span></label>
                  <input name="namaPenggilingan" defaultValue={editItem?.namaPenggilingan || ''} type="text" required className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nama Pabrik/Penggilingan" />
                </div>
                
                {/* Form Lanjutan */}
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Penanggung Jawab / Pelaku Usaha</label>
                  <input name="penanggungJawab" defaultValue={editItem?.penanggungJawab || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nama Pemilik/PJ" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP / Telp</label>
                  <input name="noHp" defaultValue={editItem?.noHp || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="08..." />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">NIB</label>
                  <input name="nib" defaultValue={editItem?.nib || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="NIB" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nomor UMKU</label>
                  <input name="nomorUmku" defaultValue={editItem?.nomorUmku || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nomor UMKU" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">KBLI</label>
                  <input name="kbli" defaultValue={editItem?.kbli || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="KBLI" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Dagang</label>
                  <input name="namaDagang" defaultValue={editItem?.namaDagang || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nama Dagang" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nomor Registrasi PDUK</label>
                  <input name="nomorRegistrasiPduk" defaultValue={editItem?.nomorRegistrasiPduk || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nomor Reg. PDUK" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Status PDUK</label>
                  <select name="statusPduk" defaultValue={editItem?.statusPduk || ''} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="">-- Pilih Status --</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tanggal Dikeluarkan</label>
                  <input name="tanggalDikeluarkanPduk" defaultValue={editItem?.tanggalDikeluarkanPduk || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 18 Oktober 2024" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Berlaku Sampai Dengan</label>
                  <input name="berlakuSampaiPduk" defaultValue={editItem?.berlakuSampaiPduk || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 17 Oktober 2029" />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Unit Produksi</label>
                  <input name="namaUnitProduksi" defaultValue={editItem?.namaUnitProduksi || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Nama Unit Produksi" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No Permohonan OSS-RBA</label>
                  <input name="noPermohonanOss" defaultValue={editItem?.noPermohonanOss || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="No OSS-RBA" />
                </div>

                <div className="col-span-1 md:col-span-3">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Lengkap</label>
                  <textarea name="alamat" defaultValue={editItem?.alamat || ''} rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Alamat Detail" />
                </div>

                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kecamatan</label>
                  <select 
                    name="kecamatanId" 
                    value={selectedKecamatanId}
                    onChange={(e) => setSelectedKecamatanId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  >
                    <option value="">-- Pilih Kecamatan --</option>
                    {kecamatanList?.map(kec => (
                      <option key={kec.id} value={kec.id}>{kec.namaKecamatan}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Desa/Kelurahan</label>
                  <select 
                    name="desaId" 
                    defaultValue={editItem?.desaId || ''} 
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    disabled={!selectedKecamatanId}
                  >
                    <option value="">-- Pilih Desa --</option>
                    {desaList?.filter(d => d.kecamatanId?.toString() === selectedKecamatanId).map(desa => (
                      <option key={desa.id} value={desa.id}>{desa.namaDesa}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kapasitas Maksimal Mesin (Kg/Minggu)</label>
                  <input name="kapasitasTerpasangKgMinggu" defaultValue={editItem?.kapasitasTerpasangKgMinggu || ''} type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 15000" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Status Operasional</label>
                  <select name="status" defaultValue={editItem?.status || 'Aktif'} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
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
                {isSubmitting ? 'Menyimpan...' : (editItem ? 'Simpan Perubahan' : 'Simpan Penggilingan')}
              </button>
            </form>
          </div>
        </div>
      )}

            {/* FILTER & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari penggilingan, unit, pj..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        <div className="flex w-full md:w-auto gap-3 flex-col md:flex-row">
          <select 
            value={filterKecamatan} 
            onChange={(e) => { setFilterKecamatan(e.target.value); setFilterDesa(''); }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanList?.map(kec => (
              <option key={kec.id} value={kec.id}>{kec.namaKecamatan}</option>
            ))}
          </select>
          <select 
            value={filterDesa} 
            onChange={(e) => setFilterDesa(e.target.value)}
            disabled={!filterKecamatan}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">Semua Desa</option>
            {desaList?.filter(d => d.kecamatanId?.toString() === filterKecamatan).map(desa => (
              <option key={desa.id} value={desa.id}>{desa.namaDesa}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* RENDER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Unit / Nama Dagang</th>
                <th className="p-5">Pelaku Usaha & Kontak</th>
                <th className="p-5">Reg. PDUK & NIB</th>
                <th className="p-5">Kapasitas Maks (Kg/Mg)</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>

            </thead>
            <tbody className="text-sm">
              {currentData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <Factory size={18} className="text-primary-600" /> {item.namaPenggilingan}
                    </div>
                    {item.namaDagang && <div className="text-xs text-slate-600 mt-1">Dagang: {item.namaDagang}</div>}
                    <div className="text-xs text-primary-600 mt-1 font-medium">
                      {item.desa?.namaDesa ? `Desa ${item.desa.namaDesa}, ` : ''}
                      {item.kecamatan?.namaKecamatan ? `Kec. ${item.kecamatan.namaKecamatan}` : ''}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-semibold text-slate-800">{item.penanggungJawab || '-'}</div>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                      <Phone size={12} /> {item.noHp || '-'}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-semibold text-slate-700 text-xs">PDUK: {item.nomorRegistrasiPduk || '-'}</div>
                    <div className="text-slate-500 text-xs mt-1">NIB: {item.nib || '-'}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-black text-slate-800">{item.kapasitasTerpasangKgMinggu ? Number(item.kapasitasTerpasangKgMinggu).toLocaleString('id-ID') : '-'}</div>
                    <div className="text-slate-500 text-xs">Kg/Minggu</div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                        {item.status}
                      </span>
                      {item.statusPduk && (
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${(item.statusPduk.toLowerCase() === 'aktif' || item.statusPduk.toLowerCase() === 'hijau') ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-600 border border-slate-300'}`}>
                          PDUK: {item.statusPduk}
                        </span>
                      )}
                    </div>
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
                        <>
                          <button 
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-amber-200 shadow-sm"
                            title="Edit Data Penggilingan"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> dari <span className="font-semibold text-slate-700">{filteredData.length}</span> data
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                      currentPage === page 
                        ? 'bg-primary-600 text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
