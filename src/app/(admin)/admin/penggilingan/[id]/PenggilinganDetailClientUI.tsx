'use client';

import React, { useState } from 'react';
import { ArrowLeft, Wheat, Factory, Truck, Plus, X, Trash2, Edit3, Info } from 'lucide-react';
import Link from 'next/link';
import { 
  addSumberGabah, 
  deleteSumberGabah,
  addProduksi, 
  deleteProduksi,
  addDistribusi,
  deleteDistribusi,
  updatePenggilingan
} from '@/app/actions/penggilingan';
import { uploadFile } from '@/app/actions/upload';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PenggilinganDetailClientUI({ 
  penggilingan, 
  sumberGabahList,
  produksiList,
  distribusiList,
  sppgList,
  kecamatanList = [],
  desaList = [],
  isAdmin = false
}: { 
  penggilingan: any;
  sumberGabahList: any[];
  produksiList: any[];
  distribusiList: any[];
  sppgList: any[];
  kecamatanList?: any[];
  desaList?: any[];
  isAdmin?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<'sumber' | 'produksi' | 'distribusi'>('sumber');

  const totalGabah = sumberGabahList.reduce((acc, curr) => acc + Number(curr.volumeKg || 0), 0);
  const totalProduksi = produksiList.reduce((acc, curr) => acc + Number(curr.kapasitasRealisasiKg || 0), 0);
  const totalDistribusi = distribusiList.reduce((acc, curr) => acc + Number(curr.volumeKg || 0), 0);
  const sisaStok = totalProduksi - totalDistribusi;
  const avgRendemen = totalGabah > 0 ? ((totalProduksi / totalGabah) * 100).toFixed(2) : 0;

  
  // Modal states
  const [isSumberOpen, setIsSumberOpen] = useState(false);
  const [isProduksiOpen, setIsProduksiOpen] = useState(false);
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  const [isEditPenggilinganOpen, setIsEditPenggilinganOpen] = useState(false);
  
  const [lokasiWilayah, setLokasiWilayah] = useState('Dalam Lebak');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipeTujuan, setTipeTujuan] = useState('SPPG');

  async function handleEditPenggilinganSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await updatePenggilingan(penggilingan.id, {
      namaPenggilingan: formData.get('namaPenggilingan') as string,
      alamat: formData.get('alamat') as string,
      penanggungJawab: formData.get('penanggungJawab') as string,
      noHp: formData.get('noHp') as string,
      kapasitasTerpasangKgMinggu: formData.get('kapasitasTerpasangKgMinggu') as string,
      status: formData.get('status') as string || 'Aktif',
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Berhasil memperbarui data penggilingan!');
      setIsEditPenggilinganOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal memperbarui data penggilingan');
    }
  }

  // Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: 'sumber' | 'produksi' | 'distribusi' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Submit Sumber Gabah
  async function handleSumberSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let fotoNotaUrl = undefined;
    const file = formData.get('fotoNota') as File;
    if (file && file.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      try {
        const uploadRes = await uploadFile(uploadFormData);
        fotoNotaUrl = uploadRes.url;
      } catch (err) {
        toast.error('Gagal mengupload foto nota');
        setIsSubmitting(false);
        return;
      }
    }

    const res = await addSumberGabah({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      sumberGabah: formData.get('sumberGabah') as string,
      namaSumber: formData.get('namaSumber') as string,
      lokasiWilayah: lokasiWilayah,
      kecamatanId: lokasiWilayah === 'Dalam Lebak' ? Number(formData.get('kecamatanId')) : undefined,
      desaId: lokasiWilayah === 'Dalam Lebak' ? Number(formData.get('desaId')) : undefined,
      provinsiLuar: lokasiWilayah === 'Luar Lebak' ? (formData.get('provinsiLuar') as string) : undefined,
      kabupatenLuar: lokasiWilayah === 'Luar Lebak' ? (formData.get('kabupatenLuar') as string) : undefined,
      kecamatanLuar: lokasiWilayah === 'Luar Lebak' ? (formData.get('kecamatanLuar') as string) : undefined,
      desaLuar: lokasiWilayah === 'Luar Lebak' ? (formData.get('desaLuar') as string) : undefined,
      alamatSumber: formData.get('alamatSumber') as string,
      kontakPerson: formData.get('kontakPerson') as string,
      
      kondisiGabah: formData.get('kondisiGabah') as string,
      kadarAir: formData.get('kadarAir') as string,
      kadarHampa: formData.get('kadarHampa') as string,
      varietas: formData.get('varietas') as string,
      nomorPolisi: formData.get('nomorPolisi') as string,
      namaSupir: formData.get('namaSupir') as string,
      fotoNotaUrl,

      volumeKg: formData.get('volumeKg') as string,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Data sumber gabah berhasil ditambahkan!');
      setIsSumberOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal menyimpan sumber gabah');
    }
  }

  // Submit Produksi
  async function handleProduksiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addProduksi({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      gabahDigilingKg: formData.get('gabahDigilingKg') as string,
      berasDihasilkanKg: formData.get('berasDihasilkanKg') as string,
      mutuBeras: formData.get('mutuBeras') as string,
      dedakKg: formData.get('dedakKg') as string,
      menirKg: formData.get('menirKg') as string,
      sekamKg: formData.get('sekamKg') as string,
      biayaOperasional: formData.get('biayaOperasional') as string,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Data realisasi produksi berhasil dicatat!');
      setIsProduksiOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal mencatat produksi');
    }
  }

  // Submit Distribusi
  async function handleDistribusiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const sppgId = formData.get('sppgTujuanId') as string;
    
    const res = await addDistribusi({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      volumeKg: formData.get('volumeKg') as string,
      hargaPerKg: formData.get('hargaPerKg') as string,
      hargaTotal: formData.get('hargaTotal') as string,
      tujuanTipe: tipeTujuan,
      sppgTujuanId: tipeTujuan === 'SPPG' && sppgId ? parseInt(sppgId, 10) : undefined,
      lokasiLain: tipeTujuan !== 'SPPG' ? formData.get('lokasiLain') as string : undefined,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) {
      toast.success('Data penjualan & distribusi beras berhasil disimpan!');
      setIsDistribusiOpen(false);
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal menyimpan distribusi beras');
    }
  }

  // Delete Click Handler
  const handleDeleteClick = (id: number, type: 'sumber' | 'produksi' | 'distribusi') => {
    setDeleteTarget({ id, type });
    setConfirmOpen(true);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    let res;
    if (deleteTarget.type === 'sumber') {
      res = await deleteSumberGabah(deleteTarget.id, penggilingan.id);
    } else if (deleteTarget.type === 'produksi') {
      res = await deleteProduksi(deleteTarget.id, penggilingan.id);
    } else {
      res = await deleteDistribusi(deleteTarget.id, penggilingan.id);
    }

    setIsDeleting(false);
    setConfirmOpen(false);

    if (res.success) {
      toast.success(res.message || 'Data berhasil dihapus');
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal menghapus data');
    }
  };

  return (
    <>
      <ConfirmModal 
        isOpen={confirmOpen}
        title="Hapus Catatan Penggilingan"
        message="Apakah Anda yakin ingin menghapus catatan data ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="mb-6">
        <Link 
          href={isAdmin ? "/admin/penggilingan" : "/admin"} 
          className="text-slate-500 hover:text-primary-600 flex items-center gap-2 font-medium transition-colors w-fit text-sm"
        >
          <ArrowLeft size={18} /> {isAdmin ? "Kembali ke Daftar Penggilingan" : "Kembali ke Dasbor Utama"}
        </Link>
      </div>

      {/* HEADER CARD PENGGILINGAN */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold">
            <Factory size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black uppercase">
                {penggilingan.status || 'Aktif'}
              </span>
              <button 
                onClick={() => setIsEditPenggilinganOpen(true)} 
                className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold transition-colors"
                title="Edit Info Penggilingan"
              >
                <Edit3 size={13} /> Edit Profil
              </button>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">{penggilingan.namaPenggilingan}</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              PIC: {penggilingan.penanggungJawab || '-'} ({penggilingan.noHp || '-'}) • Alamat: {penggilingan.alamat || '-'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-right shrink-0">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kapasitas Mesin Giling</div>
          <div className="text-2xl font-black text-amber-700">
            {penggilingan.kapasitasTerpasangKgMinggu ? `${parseFloat(penggilingan.kapasitasTerpasangKgMinggu).toLocaleString('id-ID')} Kg/Minggu` : '-'}
          </div>
        </div>
      </div>

      {/* MODAL EDIT PENGGILINGAN */}
      {isEditPenggilinganOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsEditPenggilinganOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Edit Data Penggilingan</h2>
            
            <form onSubmit={handleEditPenggilinganSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Penggilingan *</label>
                <input required name="namaPenggilingan" defaultValue={penggilingan.namaPenggilingan || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat</label>
                <textarea name="alamat" defaultValue={penggilingan.alamat || ''} rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Penanggung Jawab</label>
                  <input name="penanggungJawab" defaultValue={penggilingan.penanggungJawab || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP</label>
                  <input name="noHp" defaultValue={penggilingan.noHp || ''} type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kapasitas (kg/minggu)</label>
                  <input name="kapasitasTerpasangKgMinggu" defaultValue={penggilingan.kapasitasTerpasangKgMinggu || ''} type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Status</label>
                  <select name="status" defaultValue={penggilingan.status || 'Aktif'} className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all">
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 w-full p-4 bg-amber-600 text-white rounded-xl font-bold transition-all shadow-md shadow-amber-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}

      
      {/* DASHBOARD STOK PENGGILINGAN */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Wheat size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Serapan Gabah</p>
            <p className="text-2xl font-black text-slate-800">{totalGabah.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Kg</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Factory size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Produksi Beras</p>
            <p className="text-2xl font-black text-slate-800">{totalProduksi.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Kg</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sisa Stok Beras</p>
            <p className="text-2xl font-black text-slate-800">{sisaStok.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Kg</span></p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Factory size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Rata-rata Rendemen</p>
            <p className="text-2xl font-black text-slate-800">{avgRendemen} <span className="text-sm font-medium text-slate-500">%</span></p>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('sumber')}
          className={`px-5 py-3 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'sumber' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Wheat size={18} /> 1. Sumber Gabah Masuk
        </button>
        <button 
          onClick={() => setActiveTab('produksi')}
          className={`px-5 py-3 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'produksi' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Factory size={18} /> 2. Kapasitas & Realisasi Produksi
        </button>
        <button 
          onClick={() => setActiveTab('distribusi')}
          className={`px-5 py-3 font-extrabold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === 'distribusi' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Truck size={18} /> 3. Penjualan Beras (Kg & Rp)
        </button>
      </div>

      {/* TAB 1: SUMBER GABAH */}
      {activeTab === 'sumber' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Inbound Logistics: Sumber Gabah Masuk</h2>
              <p className="text-xs text-slate-500">Pencatatan pembelian gabah dari petani, gapoktan, atau pengepul lokal.</p>
            </div>
            <button onClick={() => setIsSumberOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold text-xs shadow-md">
              <Plus size={16} /> Catat Sumber Gabah
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 text-left">Periode (Minggu)</th>
                  <th className="p-4 text-left">Klasifikasi Sumber</th>
                  <th className="p-4 text-left">Detail Sumber</th>
                  <th className="p-4 text-right">Volume Gabah</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sumberGabahList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 pl-6 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4 font-bold text-slate-800">
                      {item.sumberGabah}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {item.namaSumber && <div className="font-semibold text-slate-800">{item.namaSumber}</div>}
                      <div className="text-xs text-slate-500 mt-1">
                        <span className="font-semibold text-slate-600">{item.lokasiWilayah}</span>
                        {item.lokasiWilayah === 'Dalam Lebak' && (item.kecamatan || item.desa) && (
                          <span>: {item.desa?.namaDesa}, Kec. {item.kecamatan?.namaKecamatan}</span>
                        )}
                        {item.lokasiWilayah === 'Luar Lebak' && (item.provinsiLuar || item.kabupatenLuar) && (
                          <span>: {item.kabupatenLuar}, {item.provinsiLuar} {item.kecamatanLuar && `(Kec. ${item.kecamatanLuar})`} {item.desaLuar && `(Desa ${item.desaLuar})`}</span>
                        )}
                      </div>
                      {item.alamatSumber && <div className="text-xs text-slate-500 mt-0.5">{item.alamatSumber}</div>}
                      {item.kontakPerson && <div className="text-xs text-indigo-600 mt-0.5">{item.kontakPerson}</div>}
                      
                      {/* QC & Logistics Details */}
                      {(item.kondisiGabah || item.varietas || item.nomorPolisi) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.kondisiGabah && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">{item.kondisiGabah}</span>}
                          {item.varietas && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">{item.varietas}</span>}
                          {item.kadarAir && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Air: {item.kadarAir}%</span>}
                          {item.kadarHampa && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Kotor: {item.kadarHampa}%</span>}
                          {item.nomorPolisi && <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded uppercase flex items-center gap-1"><Truck size={10} /> {item.nomorPolisi}</span>}
                          {item.fotoNotaUrl && (
                            <a href={item.fotoNotaUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[10px] font-bold rounded cursor-pointer transition-colors">
                              Lihat Nota
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right font-black text-amber-700">{parseFloat(item.volumeKg).toLocaleString('id-ID')} kg</td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleDeleteClick(item.id, 'sumber')}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Sumber Gabah"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {sumberGabahList.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data sumber gabah.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUKSI */}
      {activeTab === 'produksi' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Proses Transformasi & Realisasi Produksi</h2>
              <p className="text-xs text-slate-500">Realisasi penggilingan gabah menjadi beras beserta perbandingan rendemen (%).</p>
            </div>
            <button onClick={() => setIsProduksiOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold text-xs shadow-md">
              <Plus size={16} /> Catat Realisasi Produksi
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3 pl-6">Periode</th>
                  <th className="p-3 text-right">Gabah Masuk (Kg)</th>
                  <th className="p-3 text-right">Beras Utama (Kg)</th>
                  <th className="p-3 text-center">Mutu Beras</th>
                  <th className="p-3 text-right">Produk Samping (Kg)</th>
                  <th className="p-3 text-right">Rendemen</th>
                  <th className="p-3 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {produksiList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-3 pl-6 font-medium text-slate-700 text-xs">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-3 text-right font-bold text-amber-700">{parseFloat(item.gabahDigilingKg).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right font-black text-slate-900">{parseFloat(item.berasDihasilkanKg).toLocaleString('id-ID')}</td>
                    <td className="p-3 text-center">
                      {item.mutuBeras ? (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">{item.mutuBeras}</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-xs">
                      {item.dedakKg && <div className="text-slate-600">Dedak: <span className="font-bold">{parseFloat(item.dedakKg).toLocaleString('id-ID')}</span></div>}
                      {item.menirKg && <div className="text-slate-600">Menir: <span className="font-bold">{parseFloat(item.menirKg).toLocaleString('id-ID')}</span></div>}
                      {!item.dedakKg && !item.menirKg && <span className="text-slate-400">-</span>}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600">{item.rendemenPersen ? `${item.rendemenPersen}%` : '-'}</td>
                    <td className="p-3 text-right pr-6">
                      <button 
                        onClick={() => handleDeleteClick(item.id, 'produksi')}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Produksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {produksiList.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">Belum ada data realisasi produksi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PENJUALAN & DISTRIBUSI BERAS (Kg & Rp) */}
      {activeTab === 'distribusi' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Outbound Logistics: Tujuan Penjualan Beras (Kg & Rp)</h2>
              <p className="text-xs text-slate-500">Pendistribusian & penjualan beras ke Dapur SPPG, BULOG, atau pasar lokal.</p>
            </div>
            <button onClick={() => setIsDistribusiOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-xs shadow-md">
              <Plus size={16} /> Catat Penjualan Beras
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Periode</th>
                  <th className="p-4">Tujuan Penjualan</th>
                  <th className="p-4 text-right">Volume Beras (Kg)</th>
                  <th className="p-4 text-right">Harga (Rp/Kg)</th>
                  <th className="p-4 text-right">Total Penjualan (Rp)</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {distribusiList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 pl-6 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-0.5 mr-2 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {item.tujuanTipe}
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.tujuanTipe === 'SPPG' ? item.sppgTujuan?.namaSppg : item.lokasiLain}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-slate-900">{parseFloat(item.volumeKg).toLocaleString('id-ID')} kg</td>
                    <td className="p-4 text-right font-semibold text-slate-600">
                      {item.hargaPerKg ? `Rp ${parseFloat(item.hargaPerKg).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="p-4 text-right font-black text-emerald-700">
                      {item.hargaTotal ? `Rp ${parseFloat(item.hargaTotal).toLocaleString('id-ID')}` : (
                        item.hargaPerKg ? `Rp ${(parseFloat(item.volumeKg) * parseFloat(item.hargaPerKg)).toLocaleString('id-ID')}` : '-'
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleDeleteClick(item.id, 'distribusi')}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Penjualan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {distribusiList.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada data penjualan beras.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: SUMBER GABAH */}
      {isSumberOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsSumberOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="mt-0 mb-4 text-lg font-bold text-slate-800">Catat Sumber Gabah Masuk</h2>
            
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl mb-6 flex gap-3 text-indigo-900 text-xs items-start">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
              <div>
                <strong className="text-indigo-800 text-[13px] block mb-1">Panduan Istilah Kualitas Gabah</strong>
                <ul className="list-disc pl-4 space-y-1 text-indigo-700/80">
                  <li><strong>GKP (Gabah Kering Panen):</strong> Gabah yang baru saja dipanen, masih basah (kadar air tinggi).</li>
                  <li><strong>GKG (Gabah Kering Giling):</strong> Gabah yang sudah dijemur/dikeringkan dan siap digiling (standar kadar air ~14%).</li>
                  <li><strong>Varietas:</strong> Jenis bibit padi (Ciherang, IR64, dll) yang menentukan standar kualitas beras yang akan dihasilkan.</li>
                  <li><strong>Kadar Kotor/Hampa:</strong> Persentase butir gabah yang kosong atau tercampur kotoran (jerami/kerikil).</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleSumberSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Mulai *</label>
                  <input required name="mingguMulai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Selesai *</label>
                  <input required name="mingguSelesai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Sumber / Asal Gabah *</label>
                <select required name="sumberGabah" className="w-full p-3 border rounded-xl text-xs font-medium bg-white">
                  <option value="" disabled selected>Pilih salah satu sumber...</option>
                  <option value="Petani Langsung">Petani Langsung (Pembelian individu dari petani lokal)</option>
                  <option value="Gapoktan / Poktan">Gapoktan / Poktan (Pembelian kolektif dari kelompok tani)</option>
                  <option value="Pengepul / Tengkulak">Pengepul / Tengkulak (Pembelian via perantara/agen keliling)</option>
                  <option value="Lahan Sendiri">Lahan Sendiri (Hasil panen dari sawah milik penggilingan sendiri)</option>
                  <option value="Kemitraan">Kemitraan (Dari petani binaan / contract farming)</option>
                  <option value="Penggilingan Kecil (Huller)">Penggilingan Kecil / Huller (Beli setengah giling dari desa)</option>
                  <option value="BUMDes / KUD">BUMDes / KUD (Suplai dari badan usaha milik desa/koperasi)</option>
                  <option value="Lumbung Pangan">Lumbung Pangan (Dari cadangan simpanan komunal masyarakat)</option>
                  <option value="Pemasok Luar Daerah">Pemasok Luar Daerah (Kiriman dari kabupaten/provinsi lain)</option>
                  <option value="Bulog / Pemerintah">Bulog / Pemerintah (Titipan giling / skema maklon negara)</option>
                  <option value="Lainnya">Lainnya (Sumber gabah lainnya)</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">Pilih klasifikasi asal gabah/beras yang masuk ke penggilingan.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Nama Sumber *</label>
                  <input required name="namaSumber" type="text" placeholder="Misal: Bp. Budi / Gapoktan Maju" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Kontak Person</label>
                  <input name="kontakPerson" type="text" placeholder="Misal: 0812xxxxxx" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Wilayah Asal Gabah</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="radio" name="lokasiWilayah" value="Dalam Lebak" checked={lokasiWilayah === 'Dalam Lebak'} onChange={(e) => setLokasiWilayah(e.target.value)} />
                    Dalam Kabupaten Lebak
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="radio" name="lokasiWilayah" value="Luar Lebak" checked={lokasiWilayah === 'Luar Lebak'} onChange={(e) => setLokasiWilayah(e.target.value)} />
                    Luar Kabupaten Lebak
                  </label>
                </div>
              </div>

              {lokasiWilayah === 'Dalam Lebak' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Kecamatan *</label>
                    <select required name="kecamatanId" value={selectedKecamatanId} onChange={(e) => setSelectedKecamatanId(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-medium bg-white">
                      <option value="">Pilih Kecamatan...</option>
                      {kecamatanList?.map(k => (
                        <option key={k.id} value={k.id}>{k.namaKecamatan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Desa *</label>
                    <select required name="desaId" className="w-full p-3 border rounded-xl text-xs font-medium bg-white">
                      <option value="">Pilih Desa...</option>
                      {desaList?.filter(d => String(d.kecamatanId) === String(selectedKecamatanId)).map(d => (
                        <option key={d.id} value={d.id}>{d.namaDesa}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Jalan / Detail Alamat</label>
                    <input name="alamatSumber" type="text" placeholder="Misal: Kp. Sawah RT 01" className="w-full p-3 border rounded-xl text-xs font-medium bg-white" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Provinsi *</label>
                    <input required name="provinsiLuar" type="text" placeholder="Misal: Jawa Barat" className="w-full p-3 border rounded-xl text-xs font-medium bg-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Kabupaten/Kota *</label>
                    <input required name="kabupatenLuar" type="text" placeholder="Misal: Sukabumi" className="w-full p-3 border rounded-xl text-xs font-medium bg-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Kecamatan</label>
                    <input name="kecamatanLuar" type="text" placeholder="Kecamatan..." className="w-full p-3 border rounded-xl text-xs font-medium bg-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Desa/Alamat</label>
                    <input name="desaLuar" type="text" placeholder="Desa/Alamat..." className="w-full p-3 border rounded-xl text-xs font-medium bg-white" />
                  </div>
                </div>
              )}

              <div className="mt-4 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Kondisi Gabah *</label>
                  <select required name="kondisiGabah" className="w-full p-3 border rounded-xl text-xs font-medium">
                    <option value="">Pilih...</option>
                    <option value="GKG">GKG (Kering Giling)</option>
                    <option value="GKP">GKP (Kering Panen)</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Varietas *</label>
                  <select required name="varietas" className="w-full p-3 border rounded-xl text-xs font-medium">
                    <option value="">Pilih Varietas...</option>
                    <option value="Ciherang">Ciherang</option>
                    <option value="IR64">IR64</option>
                    <option value="Inpari 32">Inpari 32</option>
                    <option value="Sintanur">Sintanur</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Kadar Air (%)</label>
                  <input name="kadarAir" type="number" step="0.01" max="100" placeholder="Misal: 14" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Kadar Kotor (%)</label>
                  <input name="kadarHampa" type="number" step="0.01" max="100" placeholder="Misal: 2" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">No. Polisi Kendaraan</label>
                  <input name="nomorPolisi" type="text" placeholder="Misal: A 1234 BC" className="w-full p-3 border rounded-xl text-xs font-medium uppercase" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Nama Supir</label>
                  <input name="namaSupir" type="text" placeholder="Nama Supir..." className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Upload Nota (Opsional)</label>
                  <input name="fotoNota" type="file" accept="image/*" className="w-full p-2 border rounded-xl text-xs font-medium file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                </div>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-4">
                <label className="block mb-1 text-xs font-bold text-slate-700">Volume Gabah (Kg) *</label>
                <input required name="volumeKg" type="number" step="0.01" placeholder="Misal: 5000" className="w-full p-3 border rounded-xl text-xs font-medium text-lg text-amber-700 bg-amber-50" />
              </div>

              <div className="mt-2">
                <label className="block mb-1 text-xs font-bold text-slate-700">Catatan Lainnya</label>
                <input name="catatan" type="text" placeholder="Catatan tambahan (Opsional)" className="w-full p-3 border rounded-xl text-xs font-medium" />
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-xl font-bold text-xs shadow-md">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Sumber Gabah'}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REALISASI PRODUKSI */}
      {isProduksiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsProduksiOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="mt-0 mb-4 text-lg font-bold text-slate-800">Catat Realisasi Produksi Giling</h2>
            
            <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl mb-6 flex gap-3 text-emerald-900 text-xs items-start">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <strong className="text-emerald-800 text-[13px] block mb-1">Kamus Istilah Produksi Penggilingan</strong>
                <ul className="list-disc pl-4 space-y-1 text-emerald-700/80">
                  <li><strong>Rendemen:</strong> Persentase beras utuh yang dihasilkan dari gabah yang digiling (Normalnya 60% - 65%). <i>Sistem akan menghitung ini secara otomatis.</i></li>
                  <li><strong>Dedak / Bekatul:</strong> Produk sampingan berupa serbuk halus kulit ari beras. Sangat bernilai untuk dijual sebagai pakan ternak.</li>
                  <li><strong>Menir:</strong> Pecahan beras berukuran sangat kecil (kurang dari seperempat butir). Laku dijual untuk pakan burung atau tepung.</li>
                  <li><strong>Mutu Premium/Medium:</strong> Kualitas beras berdasarkan persentase derajat sosoh, kadar air, dan beras patah.</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleProduksiSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Mulai *</label>
                  <input required name="mingguMulai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Selesai *</label>
                  <input required name="mingguSelesai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 border-t border-slate-100 pt-4">
                {/* Kolom 1: Input Gabah */}
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <h3 className="text-xs font-extrabold text-amber-800 mb-3 flex items-center gap-2"><Wheat size={14} /> Bahan Baku Masuk</h3>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-amber-900">Gabah Digiling (Kg) *</label>
                    <input required name="gabahDigilingKg" type="number" step="0.01" placeholder="Misal: 10000" className="w-full p-3 border border-amber-200 rounded-xl text-xs font-bold text-amber-900 bg-white" />
                  </div>
                </div>

                {/* Kolom 2: Output Beras */}
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <h3 className="text-xs font-extrabold text-emerald-800 mb-3 flex items-center gap-2"><Factory size={14} /> Hasil Beras Utama</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-xs font-bold text-emerald-900">Beras Dihasilkan (Kg) *</label>
                      <input required name="berasDihasilkanKg" type="number" step="0.01" placeholder="Misal: 6250" className="w-full p-3 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 bg-white" />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs font-bold text-emerald-900">Mutu Beras *</label>
                      <select required name="mutuBeras" className="w-full p-3 border border-emerald-200 rounded-xl text-xs font-medium bg-white">
                        <option value="">Pilih Mutu...</option>
                        <option value="Premium">Premium</option>
                        <option value="Medium">Medium</option>
                        <option value="Asalan">Asalan</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-extrabold text-slate-800 mb-3">Produk Sampingan & Operasional</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Dedak / Bekatul (Kg)</label>
                    <input name="dedakKg" type="number" step="0.01" placeholder="Misal: 800" className="w-full p-3 border rounded-xl text-xs font-medium" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Menir (Kg)</label>
                    <input name="menirKg" type="number" step="0.01" placeholder="Misal: 150" className="w-full p-3 border rounded-xl text-xs font-medium" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Sekam (Kg)</label>
                    <input name="sekamKg" type="number" step="0.01" placeholder="Misal: 2000" className="w-full p-3 border rounded-xl text-xs font-medium" />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-bold text-slate-700">Biaya Operasional (Rp)</label>
                    <input name="biayaOperasional" type="number" placeholder="Misal: 150000" className="w-full p-3 border rounded-xl text-xs font-medium" />
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <label className="block mb-1 text-xs font-bold text-slate-700">Catatan Tambahan</label>
                <input name="catatan" type="text" placeholder="Catatan mengenai proses giling (opsional)" className="w-full p-3 border rounded-xl text-xs font-medium" />
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-xl font-bold text-xs shadow-md">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Realisasi Produksi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PENJUALAN & DISTRIBUSI BERAS (Kg & Rp) */}
      {isDistribusiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsDistribusiOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="mt-0 mb-6 text-lg font-bold text-slate-800">Catat Penjualan Beras (Kg & Rp)</h2>
            <form onSubmit={handleDistribusiSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Mulai *</label>
                  <input required name="mingguMulai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Tgl Selesai *</label>
                  <input required name="mingguSelesai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Tipe Tujuan Penjualan *</label>
                <select value={tipeTujuan} onChange={(e) => setTipeTujuan(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-bold bg-white">
                  <option value="SPPG">Dapur SPPG (Satuan Pelayanan Gizi)</option>
                  <option value="BULOG">BULOG</option>
                  <option value="Pasar Tradisional">Pasar Tradisional</option>
                  <option value="Retail Modern">Retail Modern</option>
                  <option value="Agen Distributor">Agen / Distributor / Lainnya</option>
                </select>
              </div>

              {tipeTujuan === 'SPPG' ? (
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Pilih Dapur SPPG Tujuan *</label>
                  <select required name="sppgTujuanId" className="w-full p-3 border rounded-xl text-xs font-medium bg-white">
                    <option value="">-- Pilih SPPG Tujuan --</option>
                    {sppgList.map(s => <option key={s.id} value={s.id}>{s.namaSppg}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Lokasi / Nama Pembeli *</label>
                  <input required name="lokasiLain" type="text" className="w-full p-3 border rounded-xl text-xs font-medium" placeholder="Contoh: Gudang BULOG Sub-Divre / Pasar Rangkasbitung" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Volume Beras (Kg) *</label>
                  <input required name="volumeKg" type="number" step="0.01" placeholder="Misal: 2000" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Harga Beras (Rp/Kg)</label>
                  <input name="hargaPerKg" type="number" min="0" placeholder="Misal: 12500" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Total Penjualan Beras (Rp)</label>
                <input name="hargaTotal" type="number" min="0" placeholder="Misal: 25000000" className="w-full p-3 border rounded-xl text-xs font-medium font-bold text-emerald-700" />
                <p className="text-[10px] text-slate-400 mt-1">Kosongkan jika ingin dihitung otomatis dari (Volume × Harga per Kg).</p>
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Penjualan Beras'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
