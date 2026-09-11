'use client';

import React, { useState } from 'react';
import { PackagePlus, PackageMinus, TestTube2, AlertCircle, Plus, Check, X, Trash2 } from 'lucide-react';
import { 
  createPembelianBahan, 
  createPemakaianBahan, 
  createUjiRapidTest,
  deletePembelianBahan,
  deletePemakaianBahan,
  deleteUjiRapidTest
} from '@/app/actions/sppgPengawasan';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SearchableSelect from '@/components/ui/SearchableSelect';

interface PengawasanClientProps {
  initialPembelian?: any;
  initialPemakaian?: any;
  initialUjiRapid?: any;
  initialKartuStok?: any;
  masterParameterList?: any[];
  pemasokList?: any[];
  penggilinganList?: any[];
  jenisPanganList?: any[];
  standarMenuList?: any[];
  sppgList?: any[];
  isAdmin?: boolean;
  userSppgId?: any;
  analyticsData?: any;
}

export default function PengawasanClient({
  initialPembelian,
  initialPemakaian,
  initialUjiRapid,
  initialKartuStok,
  masterParameterList,
  pemasokList,
  penggilinganList,
  jenisPanganList,
  standarMenuList,
  sppgList,
  isAdmin,
  userSppgId,
  analyticsData
}: any) {
  const [activeTab, setActiveTab] = useState<'stok' | 'pembelian' | 'pemakaian' | 'uji' | 'analitik'>(isAdmin ? 'analitik' : 'stok');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sumberPasokan, setSumberPasokan] = useState('Pembelian Lokal');
  const [selectedParameterId, setSelectedParameterId] = useState<string>('');
  const [selectedSppgFilter, setSelectedSppgFilter] = useState<string>('all');
  
  const [selectedJenisPanganId, setSelectedJenisPanganId] = useState<string>('');
  const [tipeSumberBeras, setTipeSumberBeras] = useState<'Pemasok' | 'Penggilingan'>('Pemasok');

  // Safe Array Checks
  const safePembelian = Array.isArray(initialPembelian) ? initialPembelian : [];
  const safePemakaian = Array.isArray(initialPemakaian) ? initialPemakaian : [];
  const safeUjiRapid = Array.isArray(initialUjiRapid) ? initialUjiRapid : [];
  const safeKartuStok = Array.isArray(initialKartuStok) ? initialKartuStok : [];
  const safeMasterParameterList = Array.isArray(masterParameterList) ? masterParameterList : [];

  const filteredPembelian = selectedSppgFilter === 'all' ? safePembelian : safePembelian.filter((p: any) => p.sppgId?.toString() === selectedSppgFilter);
  const filteredPemakaian = selectedSppgFilter === 'all' ? safePemakaian : safePemakaian.filter((p: any) => p.sppgId?.toString() === selectedSppgFilter);
  const filteredUjiRapid = selectedSppgFilter === 'all' ? safeUjiRapid : safeUjiRapid.filter((p: any) => p.sppgId?.toString() === selectedSppgFilter);
  const filteredKartuStok = selectedSppgFilter === 'all' ? safeKartuStok : safeKartuStok.filter((p: any) => p.sppgId?.toString() === selectedSppgFilter);
  const safePemasokList = Array.isArray(pemasokList) ? pemasokList : [];
  const safePenggilinganList = Array.isArray(penggilinganList) ? penggilinganList : [];
  const safeJenisPanganList = Array.isArray(jenisPanganList) ? jenisPanganList : [];
  const safeStandarMenuList = Array.isArray(standarMenuList) ? standarMenuList : [];
  const safeSppgList = Array.isArray(sppgList) ? sppgList : [];

  const selectedBahanObj = safeJenisPanganList.find((j: any) => j.id.toString() === selectedJenisPanganId);
  const isBeras = selectedBahanObj?.namaBahan?.toLowerCase().includes('beras');

  // Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: 'pembelian' | 'pemakaian' | 'uji' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (activeTab === 'pembelian') {
      res = await createPembelianBahan(formData);
    } else if (activeTab === 'pemakaian') {
      res = await createPemakaianBahan(formData);
    } else {
      res = await createUjiRapidTest(formData);
    }

    setIsSubmitting(false);
    if (res.success) {
      toast.success(res.message);
      setIsModalOpen(false);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteClick = (id: number, type: 'pembelian' | 'pemakaian' | 'uji') => {
    setDeleteTarget({ id, type });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    let res;
    if (deleteTarget.type === 'pembelian') {
      res = await deletePembelianBahan(deleteTarget.id);
    } else if (deleteTarget.type === 'pemakaian') {
      res = await deletePemakaianBahan(deleteTarget.id);
    } else {
      res = await deleteUjiRapidTest(deleteTarget.id);
    }
    setIsDeleting(false);
    setConfirmOpen(false);

    if (res.success) {
      toast.success(res.message);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <ConfirmModal 
        isOpen={confirmOpen}
        title="Hapus Catatan Pengawasan"
        message="Apakah Anda yakin ingin menghapus data ini? Data yang dihapus akan memperbarui sisa stok gudang otomatis."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* KPI COUNTERS */}
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Bahan Masuk</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">{filteredPembelian.length}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Transaksi</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Bahan pangan diakuisisi</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Bahan Terpakai</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">{filteredPemakaian.length}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Transaksi</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Bahan dikeluarkan ke Dapur</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Peringatan Stok Kritis</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-rose-600">{filteredKartuStok.filter((s: any) => s.sisa < (s.batasKritis || 5)).length}</span>
              <span className="text-sm font-medium text-slate-500 mb-1">Komoditas</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Sisa stok di bawah batas kritis</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Tingkat Keamanan (Rapid)</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-slate-800">
                {filteredUjiRapid.length > 0 
                  ? Math.round((filteredUjiRapid.filter((u: any) => u.hasilUji.toLowerCase().includes('aman') && !u.hasilUji.toLowerCase().includes('tidak')).length / filteredUjiRapid.length) * 100) 
                  : 0}%
              </span>
              <span className="text-sm font-medium text-slate-500 mb-1">Aman</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Dari {filteredUjiRapid.length} sampel uji klinis</p>
          </div>
        </div>
      )}

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex-wrap sm:flex-nowrap gap-1">
        {isAdmin && (
          <button
            onClick={() => setActiveTab('analitik')}
            className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'analitik' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            Laporan Analitik SPPG
          </button>
        )}

        
        <button
          onClick={() => setActiveTab('stok')}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'stok' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          Kartu Stok Gudang
        </button>

        <button
          onClick={() => setActiveTab('pembelian')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'pembelian'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PackagePlus size={18} />
          Pembelian Bahan ({filteredPembelian.length})
        </button>
        <button
          onClick={() => setActiveTab('pemakaian')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'pemakaian'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PackageMinus size={18} />
          Pemakaian Harian ({filteredPemakaian.length})
        </button>
        <button
          onClick={() => setActiveTab('uji')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'uji'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TestTube2 size={18} />
          Uji Rapid Test ({filteredUjiRapid.length})
        </button>
      </div>

      {/* TAB: ANALITIK - Rendered OUTSIDE of the table */}
      {activeTab === 'analitik' && isAdmin && analyticsData && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-primary-100 text-primary-600 rounded-xl">📊</span>
              Analitik Kapasitas &amp; Pemetaan Sumber Pangan
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-sm font-bold text-slate-500 mb-1">Total Volume Pembelian</div>
                <div className="text-3xl font-black text-emerald-700">{analyticsData.totalPembelianVolume?.toLocaleString('id-ID')} <span className="text-sm font-medium">Kg</span></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <div className="text-sm font-bold text-slate-500 mb-1">Total Realisasi Pemakaian</div>
                <div className="text-3xl font-black text-amber-600">{analyticsData.totalPemakaianVolume?.toLocaleString('id-ID')} <span className="text-sm font-medium">Kg</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">📍 Serapan Pemasok Dalam Lebak</h3>
                <div className="text-4xl font-black text-primary-600 mb-2">{analyticsData.volumeDalamLebak?.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-500">Kg</span></div>
                <div className="text-sm font-bold text-slate-500 mb-3">{analyticsData.persentaseLokal}% dari total pembelian</div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <div className="font-bold mb-2">Daftar Pemasok Lokal:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {analyticsData.pemasokDalamLebak?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    {(!analyticsData.pemasokDalamLebak || analyticsData.pemasokDalamLebak.length === 0) && <li>Belum ada data</li>}
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">🚛 Pasokan Luar Lebak</h3>
                <div className="text-4xl font-black text-slate-700 mb-2">{analyticsData.volumeLuarLebak?.toLocaleString('id-ID')} <span className="text-lg font-medium text-slate-500">Kg</span></div>
                <div className="text-sm font-bold text-slate-500 mb-3">{(100 - Number(analyticsData.persentaseLokal)).toFixed(1)}% dari total pembelian</div>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                  <div className="font-bold mb-2">Daftar Pemasok Luar Daerah:</div>
                  <ul className="list-disc pl-4 space-y-1">
                    {analyticsData.pemasokLuarLebak?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    {(!analyticsData.pemasokLuarLebak || analyticsData.pemasokLuarLebak.length === 0) && <li>Belum ada data</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">🚨</span>
                Tracking Hasil Uji Rapid Bermasalah
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="p-3">Tanggal Uji</th>
                      <th className="p-3">Dapur SPPG</th>
                      <th className="p-3">Bahan / Pemasok</th>
                      <th className="p-3">Parameter / Hasil</th>
                      <th className="p-3 text-red-600">Tindakan Lanjut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.ujiBermasalah?.map((uji: any) => (
                      <tr key={uji.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium">{new Date(uji.tanggalUji).toLocaleDateString('id-ID')}</td>
                        <td className="p-3">{uji.sppgNama}</td>
                        <td className="p-3">
                          <div className="font-bold">{uji.bahan}</div>
                          <div className="text-xs text-slate-500">{uji.pemasok}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-700">{uji.parameter}</div>
                          <div className="text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-0.5 rounded">{uji.hasil}</div>
                        </td>
                        <td className="p-3 font-bold text-red-700">{uji.tindakan}</td>
                      </tr>
                    ))}
                    {(!analyticsData.ujiBermasalah || analyticsData.ujiBermasalah.length === 0) && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500 font-medium bg-emerald-50/30">
                          🎉 Luar biasa! Tidak ada laporan bahan berbahaya atau diretur. Semua hasil uji aman.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTER BAR - Only on data tabs for Admin */}
      {isAdmin && activeTab !== 'analitik' && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-3">
          <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <span className="text-primary-600">🔎</span> Filter Data Dapur:
          </div>
          <select 
            value={selectedSppgFilter}
            onChange={(e) => setSelectedSppgFilter(e.target.value)}
            className="p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:max-w-xs font-medium text-slate-700"
          >
            <option value="all">Tampilkan Semua Dapur SPPG</option>
            {sppgList?.map((sppg: any) => (
              <option key={sppg.id} value={sppg.id}>{sppg.namaSppg}</option>
            ))}
          </select>
        </div>
      )}

      {/* DATA TABLES - Only on non-analitik tabs */}
      {activeTab !== 'analitik' && (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {activeTab === 'stok' && 'Kartu Stok Gudang Bahan Pangan'}
              {activeTab === 'pembelian' && 'Riwayat Pembelian & Logistik Masuk'}
              {activeTab === 'pemakaian' && 'Catatan Pemakaian Bahan Dapur (Keluar)'}
              {activeTab === 'uji' && 'Hasil Pengujian Rapid Test Keamanan Pangan'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {activeTab === 'stok' && 'Saldo real-time bahan baku di gudang dapur.'}
              {activeTab === 'pembelian' && 'Transparansi sumber pangan dari mitra pemasok lokal.'}
              {activeTab === 'pemakaian' && 'Volume bahan baku yang diolah untuk menu MBG.'}
              {activeTab === 'uji' && 'Hasil sampel pengujian bebas bahan kimia berbahaya & mikrobiologi.'}
            </p>
          </div>
          {activeTab !== 'stok' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-700 transition-all shadow-sm shrink-0"
            >
              <Plus size={18} />
              Catat {activeTab === 'pembelian' ? 'Pembelian' : activeTab === 'pemakaian' ? 'Pemakaian' : 'Hasil Uji'}
            </button>
          )}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
             <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
              {activeTab === 'stok' && (
                <>
                  {isAdmin && <th className="px-6 py-4">Dapur SPPG</th>}
                  <th className="px-6 py-4">Bahan Pangan</th>
                  <th className="px-6 py-4 text-center">Total Masuk</th>
                  <th className="px-6 py-4 text-center">Total Keluar</th>
                  <th className="px-6 py-4 text-center">Saldo Akhir</th>
                  <th className="px-6 py-4 text-center">Batas Kritis</th>
                  <th className="px-6 py-4">Status</th>
                </>
              )}
              {activeTab === 'pembelian' && (
                <>
                  {isAdmin && <th className="px-6 py-4">Dapur SPPG</th>}
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Bahan Pangan</th>
                  <th className="px-6 py-4">Volume</th>
                  <th className="px-6 py-4">Sumber Penyedia</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </>
              )}
              {activeTab === 'pemakaian' && (
                <>
                  {isAdmin && <th className="px-6 py-4">Dapur SPPG</th>}
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Bahan Pangan</th>
                  <th className="px-6 py-4">Volume Digunakan</th>
                  <th className="px-6 py-4">Menu Terkait</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </>
              )}
              {activeTab === 'uji' && (
                <>
                  {isAdmin && <th className="px-6 py-4">Dapur SPPG</th>}
                  <th className="px-6 py-4">Tanggal Uji</th>
                  <th className="px-6 py-4">Bahan Pangan</th>
                  <th className="px-6 py-4">Parameter Uji</th>
                  <th className="px-6 py-4">Hasil Uji</th>
                  <th className="px-6 py-4">Tindakan Lanjut</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </>
              )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">

              {activeTab === 'stok' && filteredKartuStok.length === 0 && (
                <tr><td colSpan={isAdmin ? 7 : 6} className="text-center py-8 text-slate-400">Belum ada data stok</td></tr>
              )}
              {activeTab === 'stok' && filteredKartuStok.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/50">
                  {isAdmin && <td className="px-6 py-4 text-xs font-semibold text-slate-600">{s.sppgNama}</td>}
                  <td className="px-6 py-4 font-bold text-slate-800">{s.nama}</td>
                  <td className="px-6 py-4 text-center font-medium text-emerald-600">+{s.totalIn} {s.satuan}</td>
                  <td className="px-6 py-4 text-center font-medium text-amber-600">-{s.totalOut} {s.satuan}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800 text-lg">{s.sisa} <span className="text-sm text-slate-500">{s.satuan}</span></td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold text-slate-500">&lt; {s.batasKritis || 5} {s.satuan}</span>
                  </td>
                  <td className="px-6 py-4">
                    {s.sisa <= 0 ? <span className="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold">Habis</span> : 
                     s.sisa < (s.batasKritis || 5) ? <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">Menipis</span> : 
                     <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">Aman</span>}
                  </td>
                </tr>
              ))}

              {activeTab === 'pembelian' && filteredPembelian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  {isAdmin && <td className="px-6 py-4 text-xs font-semibold text-slate-600">{d.sppgNama}</td>}
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalPembelian}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Pangan'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{d.volume} {d.satuan}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {d.tipeSumber === 'Penggilingan' ? (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 mb-1 border border-emerald-200">🌾 PENGGILINGAN</span>
                        <div className="text-sm font-bold text-slate-800">{d.penggilinganNama || '-'}</div>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 mb-1 border border-slate-200">🏢 PEMASOK</span>
                        <div className="text-sm font-bold text-slate-800">{d.pemasokNama || '-'}</div>
                      </div>
                    )}
                    {d.fotoNota && <a href={d.fotoNota} target="_blank" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Bukti Nota</a>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'pembelian')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Pembelian"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'pemakaian' && filteredPemakaian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  {isAdmin && <td className="px-6 py-4 text-xs font-semibold text-slate-600">{d.sppgNama}</td>}
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalPemakaian}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Pangan'}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">{d.volume} {d.satuan}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.menuNama || 'Umum / Dapur'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'pemakaian')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Pemakaian"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'uji' && filteredUjiRapid.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  {isAdmin && <td className="px-6 py-4 text-xs font-semibold text-slate-600">{d.sppgNama}</td>}
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalUji}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Segar'}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{d.parameterMaster?.namaParameter || d.parameterUji}</div>
                    {d.parameterMaster?.ambangBatas && (
                      <div className="text-[11px] text-slate-400">Batas: {d.parameterMaster.ambangBatas}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${d.hasilUji.toLowerCase().includes('aman') && !d.hasilUji.toLowerCase().includes('tidak aman') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {d.hasilUji}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.tindakanLanjut || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'uji')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Uji Rapid"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {((activeTab === 'pembelian' && filteredPembelian.length === 0) ||
                (activeTab === 'pemakaian' && filteredPemakaian.length === 0) ||
                (activeTab === 'uji' && filteredUjiRapid.length === 0)) && (
                <tr>
                  <td colSpan={isAdmin ? 11 : 10} className="p-8 text-center text-slate-500">
                    Belum ada catatan data {activeTab}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* POPUP MODAL TAMBAH DATA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            aria-hidden="true"
          />

          {/* Modal Container Box */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-200">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {activeTab === 'pembelian' && 'Input Pembelian Bahan Segar'}
                {activeTab === 'pemakaian' && 'Input Pemakaian Bahan Harian'}
                {activeTab === 'uji' && 'Input Hasil Uji Rapid Test'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-130px)]">
              {isAdmin && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">SPPG (Unit Layanan) <span className="text-red-500">*</span></label>
                  <SearchableSelect
                    name="sppgId"
                    required
                    options={safeSppgList.map((s: any) => ({
                      value: s.id,
                      label: s.namaSppg
                    }))}
                    placeholder="-- Cari SPPG --"
                  />
                </div>
              )}

              {activeTab === 'pembelian' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Pembelian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPembelian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Sumber Pasokan <span className="text-red-500">*</span></label>
                    <select 
                      name="sumberPasokan" 
                      value={sumberPasokan}
                      onChange={(e) => setSumberPasokan(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                    >
                      <option value="Pembelian Lokal">Pembelian Pangan Lokal (Dana Banper)</option>
                      <option value="Dropping Pusat">Bantuan / Dropping Pusat (Non-pembelian)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan <span className="text-red-500">*</span></label>
                    <SearchableSelect
                      name="jenisPanganId"
                      required
                      value={selectedJenisPanganId}
                      onChange={setSelectedJenisPanganId}
                      options={safeJenisPanganList.map((j: any) => ({
                        value: j.id,
                        label: `${j.namaBahan} (${j.kategoriPangan})`
                      }))}
                      placeholder="-- Cari & Pilih Komoditas --"
                    />
                  </div>

                  {sumberPasokan === 'Pembelian Lokal' && (
                    <>
                      {isBeras ? (
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Sumber Pengadaan Beras <span className="text-red-500">*</span></label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <button
                              type="button"
                              onClick={() => setTipeSumberBeras('Pemasok')}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                tipeSumberBeras === 'Pemasok'
                                  ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20 shadow-sm'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              🏢 Mitra Pemasok Umum
                            </button>
                            <button
                              type="button"
                              onClick={() => setTipeSumberBeras('Penggilingan')}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                tipeSumberBeras === 'Penggilingan'
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 shadow-sm'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              🌾 Penggilingan Padi Lokal (RMU)
                            </button>
                          </div>
                          <input type="hidden" name="tipeSumber" value={tipeSumberBeras} />

                          {tipeSumberBeras === 'Penggilingan' ? (
                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Pilih Penggilingan Padi <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="penggilinganId"
                                required
                                options={safePenggilinganList.map((p: any) => ({
                                  value: p.id,
                                  label: p.namaPenggilingan
                                }))}
                                placeholder="-- Cari Penggilingan --"
                              />
                            </div>
                          ) : (
                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Mitra Pemasok Beras <span className="text-red-500">*</span></label>
                              <SearchableSelect
                                name="pemasokId"
                                required
                                options={safePemasokList.map((p: any) => ({
                                  value: p.id,
                                  label: `${p.namaPemasok} (${p.kategoriSupply || 'Pemasok'})`
                                }))}
                                placeholder="-- Cari Pemasok --"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Pemasok Lokal <span className="text-red-500">*</span></label>
                          <SearchableSelect
                            name="pemasokId"
                            required
                            options={safePemasokList.map((p: any) => ({
                              value: p.id,
                              label: `${p.namaPemasok} (${p.kategoriSupply || 'Pemasok'})`
                            }))}
                            placeholder="-- Cari Pemasok --"
                          />
                          <input type="hidden" name="tipeSumber" value="Pemasok" />
                        </div>
                      )}
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Volume Total <span className="text-red-500">*</span></label>
                      <input type="number" step="0.01" min="0" name="volume" required placeholder="Misal: 150" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter / Ikat" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Catatan / No. Kuitansi</label>
                    <input type="text" name="catatan" placeholder="Misal: Nota #10293, Pembelian Beras Medium Super" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Bukti Nota / Surat Jalan (URL/File) <span className="text-slate-400 font-normal">(Opsional)</span></label>
                    <input type="text" name="fotoNota" placeholder="URL gambar nota/faktur..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>

                </>
              )}

              {activeTab === 'pemakaian' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Pemakaian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPemakaian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan <span className="text-red-500">*</span></label>
                    <SearchableSelect
                      name="jenisPanganId"
                      required
                      options={safeJenisPanganList.map((j: any) => ({
                        value: j.id,
                        label: `${j.namaBahan} (${j.kategoriPangan})`
                      }))}
                      placeholder="-- Cari & Pilih Komoditas --"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Volume Digunakan <span className="text-red-500">*</span></label>
                      <input type="number" step="0.01" min="0" name="volume" required placeholder="Misal: 50" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'uji' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Uji <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalUji" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan Diuji <span className="text-red-500">*</span></label>
                    <SearchableSelect
                      name="jenisPanganId"
                      required
                      options={safeJenisPanganList.map((j: any) => ({
                        value: j.id,
                        label: `${j.namaBahan} (${j.kategoriPangan})`
                      }))}
                      placeholder="-- Cari & Pilih Komoditas --"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Master Parameter Uji <span className="text-red-500">*</span>
                    </label>
                    {safeMasterParameterList.length > 0 ? (
                      <SearchableSelect
                        name="parameterUjiId"
                        required
                        value={selectedParameterId}
                        onChange={setSelectedParameterId}
                        options={safeMasterParameterList.map((m: any) => ({
                          value: m.id,
                          label: `${m.namaParameter} (${m.kategori || 'Umum'}${m.ambangBatas ? ` - Batas: ${m.ambangBatas}` : ''})`
                        }))}
                        placeholder="-- Cari Parameter Uji --"
                      />
                    ) : (
                      <input type="text" name="parameterUji" required placeholder="Ketik nama parameter (Misal: Formalin, Boraks)" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Hasil Uji <span className="text-red-500">*</span></label>
                      <select name="hasilUji" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                        <option value="Aman">Aman / Bebas</option>
                        <option value="Tidak Aman">Tidak Aman / Positif</option>
                        <option value="Peringatan">Peringatan / Mendekati Batas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Petugas Penguji <span className="text-red-500">*</span></label>
                      <input type="text" name="petugasPenguji" required placeholder="Nama Petugas" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tindakan Lanjut</label>
                    <input type="text" name="tindakanLanjut" placeholder="Misal: Dibuang, Retur ke pemasok, Lanjut Olah" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 text-sm">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
