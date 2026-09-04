'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Trash2, 
  Package, 
  Calendar, 
  MapPin, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ArrowRight,
  Layers,
  Truck,
  ShoppingCart,
  Phone,
  Building2
} from 'lucide-react';
import { createSupplyChain, deleteSupplyChain } from '@/app/actions/supplyChain';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';

interface SupplyChainClientUIProps {
  initialData: any[];
  sppgList: any[];
  jenisPanganList: any[];
  pemasokList: any[];
  inventorySummary: {
    inventoryList: Array<{
      jenisPanganId: number;
      namaBahan: string;
      kategori: string;
      satuan: string;
      kebutuhanBulan: number;
      totalMasuk: number;
      totalKeluar: number;
      sisaStok: number;
      totalBiaya: number;
      statusStok: 'Aman' | 'Waspada' | 'Kritis';
    }>;
    totalBahanKritis: number;
    totalBahanWaspada: number;
    totalJenisBahan: number;
    totalPengeluaranNominal: number;
  };
  pembelianList: any[];
  activeSuppliers?: any[];
}

export default function SupplyChainClientUI({ 
  initialData, 
  sppgList,
  jenisPanganList,
  pemasokList,
  inventorySummary,
  pembelianList,
  activeSuppliers = []
}: SupplyChainClientUIProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'planning' | 'inbound' | 'suppliers'>('inventory');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sumberPasokan, setSumberPasokan] = useState('Pembelian Lokal');
  const [searchTerm, setSearchTerm] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter Data Perencanaan Kebutuhan
  const filteredPlanningData = initialData.filter(item => {
    return (
      item.sppg?.namaSppg?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisPangan?.namaBahan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemasok?.namaPemasok?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter Data Inventory Realtime
  const filteredInventoryData = inventorySummary.inventoryList.filter(item => {
    return (
      item.namaBahan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter Data Pembelian
  const filteredPembelianData = pembelianList.filter(item => {
    return (
      item.jenisPanganNama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemasokNama?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter Data Pemasok Aktif
  const filteredSuppliersData = activeSuppliers.filter(item => {
    return (
      item.namaPemasok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipePemasok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.picNama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamatPemasok?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sppgId: parseInt(formData.get('sppgId') as string, 10),
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string, 10),
      pemasokId: formData.get('pemasokId') ? parseInt(formData.get('pemasokId') as string, 10) : undefined,
      kebutuhanPerBulan: formData.get('kebutuhanPerBulan') as string,
      satuan: formData.get('satuan') as string || 'Kilogram',
      periode: formData.get('periode') as string,
    };

    const res = await createSupplyChain(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setToastType('success');
      setToastMessage('Berhasil menambahkan rantai pasok!');
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
    const res = await deleteSupplyChain(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage('Data Supply Chain berhasil dihapus!');
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
        title="Hapus Data Rantai Pasok" 
        message="Apakah Anda yakin ingin menghapus data rantai pasok ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* ALERT PENSI: STOK KRITIS WARN BANNER */}
      {inventorySummary.totalBahanKritis > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-rose-950 text-base">
                PERHATIAN: ADA {inventorySummary.totalBahanKritis} BAHAN BAKU DALAM STATUS KRITIS!
              </h3>
              <p className="text-rose-800 text-xs mt-0.5">
                Stok di gudang dapur berada di bawah 20% kebutuhan bulanan. Segera lakukan pemesanan ke pemasok.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/pengawasan" 
            className="whitespace-nowrap px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            <ShoppingCart size={16} /> Input Pembelian →
          </Link>
        </div>
      )}

      {/* KPI METRIC CARDS LOGISTIK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Komoditas</div>
            <div className="text-2xl font-black text-slate-800">{inventorySummary.totalJenisBahan} Komoditas</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-rose-50/40">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider">Stok Kritis (&lt;20%)</div>
            <div className="text-2xl font-black text-rose-700">{inventorySummary.totalBahanKritis} Bahan Baku</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm flex items-center gap-4 bg-gradient-to-br from-white to-amber-50/40">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Stok Waspada (&le;50%)</div>
            <div className="text-2xl font-black text-amber-700">{inventorySummary.totalBahanWaspada} Bahan Baku</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Belanja Pangan</div>
            <div className="text-2xl font-black text-slate-800">
              Rp {(inventorySummary.totalPengeluaranNominal / 1000000).toFixed(1)} Jt
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'inventory' 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package size={16} /> Stok Gudang ({inventorySummary.totalJenisBahan})
          </button>
          
          <button 
            onClick={() => setActiveTab('planning')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'planning' 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar size={16} /> Perencanaan ({initialData.length})
          </button>

          <button 
            onClick={() => setActiveTab('inbound')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'inbound' 
                ? 'bg-white text-primary-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck size={16} /> Riwayat Masuk ({pembelianList.length})
          </button>

          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              activeTab === 'suppliers' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 size={16} /> Mitra Pemasok ({activeSuppliers.length})
          </button>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full lg:w-64">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
              placeholder="Cari komoditas/pemasok..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'planning' && (
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-bold text-xs shadow-md"
            >
              <Plus size={16} /> Tambah Pasok
            </button>
          )}

          <Link 
            href="/admin/pengawasan" 
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all font-bold text-xs shadow-md whitespace-nowrap"
          >
            <ShoppingCart size={16} /> Catat Pembelian
          </Link>
        </div>
      </div>

      {/* TAB 1: REAL-TIME INVENTORY BALANCE */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-800">Kalkulasi Otomatis Sisa Stok Gudang</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sisa Stok = Total Pembelian Masuk - Total Pemakaian Dapur</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-400 text-[11px] font-extrabold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Komoditas Bahan</th>
                  <th className="p-4 text-right">Kebutuhan Bulanan</th>
                  <th className="p-4 text-right">Pembelian Masuk</th>
                  <th className="p-4 text-right">Pemakaian Dapur</th>
                  <th className="p-4 text-right">Sisa Stok Gudang</th>
                  <th className="p-4 text-center">Status Stok</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredInventoryData.map((item) => {
                  const percentLeft = item.kebutuhanBulan > 0 
                    ? Math.min(Math.max((item.sisaStok / item.kebutuhanBulan) * 100, 0), 100) 
                    : (item.sisaStok > 0 ? 100 : 0);

                  return (
                    <tr key={item.jenisPanganId} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="font-bold text-slate-800">{item.namaBahan}</div>
                        <div className="text-xs text-slate-400 font-medium">{item.kategori}</div>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-600">
                        {item.kebutuhanBulan.toLocaleString('id-ID')} {item.satuan}
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-600">
                        +{item.totalMasuk.toLocaleString('id-ID')} {item.satuan}
                      </td>
                      <td className="p-4 text-right font-bold text-rose-600">
                        -{item.totalKeluar.toLocaleString('id-ID')} {item.satuan}
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-black text-slate-900 text-base">
                          {item.sisaStok.toLocaleString('id-ID')} {item.satuan}
                        </div>
                        {item.kebutuhanBulan > 0 && (
                          <div className="w-24 ml-auto bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.statusStok === 'Kritis' ? 'bg-rose-500' :
                                item.statusStok === 'Waspada' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${percentLeft}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black ${
                          item.statusStok === 'Kritis' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          item.statusStok === 'Waspada' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.statusStok === 'Kritis' ? '🛑 Kritis' : item.statusStok === 'Waspada' ? '⚠️ Waspada' : '✅ Aman'}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <Link 
                          href="/admin/pengawasan"
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          Catat Masuk <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredInventoryData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Belum ada data stok bahan baku yang tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DEMAND PLANNING */}
      {activeTab === 'planning' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-800">Perencanaan Kebutuhan Bulanan (Demand Planning)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Daftar pemetaan estimasi kebutuhan bahan baku per Dapur SPPG</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Dapur SPPG</th>
                  <th className="p-4">Bahan Pangan</th>
                  <th className="p-4 text-right">Kebutuhan / Bulan</th>
                  <th className="p-4">Pemasok / Vendor</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPlanningData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-slate-900 text-base">{item.sppg?.namaSppg || 'Tidak Diketahui'}</div>
                      <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar size={12} /> Periode: {new Date(item.periode).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-700">{item.jenisPangan?.namaBahan || 'Tidak Diketahui'}</td>
                    <td className="p-4 text-right">
                      <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                        {item.kebutuhanPerBulan} {item.satuan}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.pemasok ? (
                        <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <MapPin size={14} className="text-slate-400" /> {item.pemasok.namaPemasok}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Belum Ada Pemasok</span>
                      )}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button 
                        onClick={() => handleDeleteClick(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                        title="Hapus Data"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPlanningData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Belum ada data perencanaan rantai pasok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INBOUND PURCHASES */}
      {activeTab === 'inbound' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-800">Riwayat Pembelian & Bahan Masuk (Inbound Procurement)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Catatan pengiriman dari vendor ke gudang dapur SPPG</p>
            </div>
            <Link 
              href="/admin/pengawasan" 
              className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors"
            >
              Tambah Catatan Pembelian →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 pl-6">Tanggal Masuk</th>
                  <th className="p-4">Bahan Pangan</th>
                  <th className="p-4">Pemasok</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-right pr-6">Harga Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPembelianData.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-700">
                      {item.tanggalPembelian ? new Date(item.tanggalPembelian).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{item.jenisPanganNama || 'Bahan Pangan'}</td>
                    <td className="p-4 font-semibold text-slate-600">{item.pemasokNama || 'Vendor/Pemasok'}</td>
                    <td className="p-4 text-right font-black text-emerald-600">
                      +{item.volume} {item.satuan}
                    </td>
                    <td className="p-4 text-right pr-6 font-bold text-slate-800">
                      {item.hargaTotal ? `Rp ${parseFloat(item.hargaTotal).toLocaleString('id-ID')}` : '-'}
                    </td>
                  </tr>
                ))}
                {filteredPembelianData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Belum ada riwayat pembelian bahan baku yang dicatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MITRA PEMASOK / VENDORS DIRECTORY */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-800">Direktori Mitra Pemasok / Vendor Aktif Dapur</h2>
              <p className="text-xs text-slate-500 mt-1">Daftar BUMDes, Koperasi, dan Petani Lokal mitra penyuplai bahan baku ke SPPG.</p>
            </div>
            <Link 
              href="/admin/master-data/pemasok"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus size={16} /> Kelola Pemasok Master
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliersData.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold">
                      {p.tipePemasok}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 size={14} className="text-emerald-500" /> {p.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    {p.namaPemasok}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-4">
                    <MapPin size={14} className="text-slate-400 shrink-0" /> {p.alamatPemasok}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                    <div className="text-xs flex items-center justify-between">
                      <span className="text-slate-400 font-medium">PIC Vendor:</span>
                      <span className="font-bold text-slate-700">{p.picNama}</span>
                    </div>
                    {p.picKontak && p.picKontak !== '-' && (
                      <div className="text-xs flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Kontak HP/WA:</span>
                        <a href={`https://wa.me/${p.picKontak.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="font-bold text-emerald-600 hover:underline flex items-center gap-1">
                          <Phone size={12} /> {p.picKontak}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{p.totalPembelian} Transaksi Pasokan</span>
                  <span className="font-extrabold text-slate-800">
                    {p.totalNominal > 0 ? `Rp ${(p.totalNominal / 1000000).toFixed(1)} Jt` : '-'}
                  </span>
                </div>
              </div>
            ))}
            {filteredSuppliersData.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-500">
                <Building2 size={48} className="mx-auto mb-3 text-slate-300" />
                <p className="font-bold text-base text-slate-700">Belum Ada Pemasok Terdaftar</p>
                <p className="text-xs text-slate-400 mt-1">Tambahkan data BUMDes atau Koperasi mitra di Master Pemasok.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FORM TAMBAH PERENCANAAN PASOK */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Data Rantai Pasok</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {sppgList.length === 1 ? (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Dapur SPPG *</label>
                  <input type="hidden" name="sppgId" value={sppgList[0].id} />
                  <div className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium">
                    {sppgList[0].namaSppg}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Dapur SPPG *</label>
                  <select required name="sppgId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="">-- Pilih SPPG --</option>
                    {sppgList.map(item => (
                      <option key={item.id} value={item.id}>{item.namaSppg}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Komoditas *</label>
                <select required name="jenisPanganId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                  <option value="">-- Pilih Komoditas --</option>
                  {jenisPanganList.map(item => (
                    <option key={item.id} value={item.id}>{item.namaBahan} ({item.satuanDefault})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Sumber Pasokan</label>
                <select 
                  name="sumberPasokan" 
                  value={sumberPasokan}
                  onChange={(e) => setSumberPasokan(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                >
                  <option value="Pembelian Lokal">Pembelian Pangan Lokal (Dana Banper)</option>
                  <option value="Dropping Pusat">Bantuan / Dropping Pusat (Non-pembelian)</option>
                </select>
              </div>

              {sumberPasokan === 'Pembelian Lokal' && (
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Pemasok Lokal (Opsional)</label>
                  <select name="pemasokId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="">-- Tidak Ada / Beli Langsung --</option>
                    {pemasokList.map(item => (
                      <option key={item.id} value={item.id}>{item.namaPemasok}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kebutuhan/Bulan</label>
                  <input required name="kebutuhanPerBulan" type="number" step="0.01" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 50.5" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Satuan</label>
                  <select name="satuan" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
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
                <label className="block mb-2 text-sm font-semibold text-slate-700">Periode (Bulan/Tahun)</label>
                <input required name="periode" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
