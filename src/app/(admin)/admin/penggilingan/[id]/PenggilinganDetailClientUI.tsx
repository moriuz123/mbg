'use client';

import React, { useState } from 'react';
import { ArrowLeft, Wheat, Factory, Truck, Plus, X, Trash2, Edit3 } from 'lucide-react';
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
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PenggilinganDetailClientUI({ 
  penggilingan, 
  sumberGabahList,
  produksiList,
  distribusiList,
  sppgList,
  isAdmin = false
}: { 
  penggilingan: any;
  sumberGabahList: any[];
  produksiList: any[];
  distribusiList: any[];
  sppgList: any[];
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
    const res = await addSumberGabah({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      sumberGabah: formData.get('sumberGabah') as string,
      volumeKg: formData.get('volumeKg') as string,
      hargaBeliPerKg: formData.get('hargaBeliPerKg') as string,
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
      kapasitasRealisasiKg: formData.get('kapasitasRealisasiKg') as string,
      rendemenPersen: formData.get('rendemenPersen') as string,
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
                  <th className="p-4 pl-6">Periode (Mingguan)</th>
                  <th className="p-4">Sumber / Asal Gabah</th>
                  <th className="p-4 text-right">Volume Gabah (Kg)</th>
                  <th className="p-4 text-right">Harga Beli (Rp/Kg)</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sumberGabahList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 pl-6 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4 font-bold text-slate-800">{item.sumberGabah}</td>
                    <td className="p-4 text-right font-black text-amber-700">{parseFloat(item.volumeKg).toLocaleString('id-ID')} kg</td>
                    <td className="p-4 text-right font-semibold text-slate-700">
                      {item.hargaBeliPerKg ? `Rp ${parseFloat(item.hargaBeliPerKg).toLocaleString('id-ID')}` : '-'}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleDeleteClick(item.id, 'sumber')}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Sumber Gabah"
                      >
                        <Trash2 size={16} />
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
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Periode (Mingguan)</th>
                  <th className="p-4 text-right">Realisasi Produksi (Kg)</th>
                  <th className="p-4 text-right">Rendemen (%)</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {produksiList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 pl-6 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4 text-right font-black text-slate-900">{parseFloat(item.kapasitasRealisasiKg).toLocaleString('id-ID')} kg</td>
                    <td className="p-4 text-right font-bold text-emerald-600">{item.rendemenPersen ? `${item.rendemenPersen}%` : '-'}</td>
                    <td className="p-4 text-right pr-6">
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
                  <tr><td colSpan={4} className="p-8 text-center text-slate-500">Belum ada data realisasi produksi.</td></tr>
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
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsSumberOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="mt-0 mb-6 text-lg font-bold text-slate-800">Catat Sumber Gabah Masuk</h2>
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
                <input required name="sumberGabah" type="text" placeholder="Misal: Gapoktan Tani Makmur / Petani Desa Maja" className="w-full p-3 border rounded-xl text-xs font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Volume Gabah (Kg) *</label>
                  <input required name="volumeKg" type="number" step="0.01" placeholder="Misal: 5000" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Harga Beli (Rp/Kg)</label>
                  <input name="hargaBeliPerKg" type="number" min="0" placeholder="Misal: 6500" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Catatan / Varietas</label>
                <input name="catatan" type="text" placeholder="Misal: Gabah Kering Giling (GKG) Ciherang" className="w-full p-3 border rounded-xl text-xs font-medium" />
              </div>

              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-xl font-bold text-xs shadow-md">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Sumber Gabah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REALISASI PRODUKSI */}
      {isProduksiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsProduksiOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={20} /></button>
            <h2 className="mt-0 mb-6 text-lg font-bold text-slate-800">Catat Realisasi Produksi Giling</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Realisasi Giling (Kg) *</label>
                  <input required name="kapasitasRealisasiKg" type="number" step="0.01" placeholder="Misal: 3500" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-bold text-slate-700">Rendemen Beras (%)</label>
                  <input name="rendemenPersen" type="number" step="0.1" placeholder="Misal: 62.5" className="w-full p-3 border rounded-xl text-xs font-medium" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-xs font-bold text-slate-700">Catatan Mutu / Hasil Sampingan</label>
                <textarea name="catatan" rows={2} placeholder="Catatan mutu beras, dedak, sekam..." className="w-full p-3 border rounded-xl text-xs font-medium" />
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
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
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
