'use client';

import React, { useState, useMemo } from 'react';
import { 
  Truck, Package, Users, MapPin, Factory, Activity, TrendingUp, 
  BarChart3, ShieldCheck, CheckCircle2, Search, X, ChevronRight, 
  Award, ArrowRight, Wheat, Calendar, Phone, Mail, Building, PieChart, Layers
} from 'lucide-react';

export type TopKomoditasItem = {
  id: number;
  nama: string;
  kategori: string | null;
  totalVolume: number;
  satuan: string;
  totalTransaksi: number;
  jumlahSppg: number;
  jumlahPemasok: number;
};

export type PemasokItem = {
  pemasokId: number;
  namaPemasok: string;
  tipePemasok: string | null;
  status: string | null;
  alamatPemasok: string | null;
  wilayah: string;
  picNama: string | null;
  picKontak: string | null;
  kontak: string | null;
  totalVolume: number;
  jumlahKomoditas: number;
  jumlahSppg: number;
};

export type WilayahStatItem = {
  wilayah: string;
  totalPemasok: number;
  totalVolume: number;
};

export type RantaiPasokStats = {
  pemasokDalam: number;
  penggilingan: number;
  pemasokLuar: number;
  komoditasUnik: number;
  komoditasDalam: number;
  komoditasLuar: number;
  totalKatalogKomoditas: number;
  sppg: number;
  transaksi: number;
  sisaStokBerasSppg: number;
};

interface RantaiPasokClientProps {
  stats: RantaiPasokStats;
  topKomoditas: TopKomoditasItem[];
  pemasokList: PemasokItem[];
  wilayahStats: WilayahStatItem[];
}

export default function RantaiPasokClient({
  stats,
  topKomoditas,
  pemasokList,
  wilayahStats
}: RantaiPasokClientProps) {
  const [activeTab, setActiveTab] = useState<'analitik' | 'pemasok'>('analitik');
  
  // Filters for Pemasok tab
  const [search, setSearch] = useState('');
  const [filterWilayah, setFilterWilayah] = useState('');
  const [filterTipe, setFilterTipe] = useState('');
  const [selectedPemasok, setSelectedPemasok] = useState<PemasokItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter options derived from data
  const wilayahOptions = useMemo(() => {
    const set = new Set(pemasokList.map(p => p.wilayah).filter(Boolean));
    return Array.from(set).sort();
  }, [pemasokList]);

  const tipeOptions = useMemo(() => {
    const set = new Set(pemasokList.map(p => p.tipePemasok).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [pemasokList]);

  // Filtered pemasok data
  const filteredPemasok = useMemo(() => {
    return pemasokList.filter(p => {
      const matchSearch = p.namaPemasok.toLowerCase().includes(search.toLowerCase()) ||
        (p.alamatPemasok && p.alamatPemasok.toLowerCase().includes(search.toLowerCase())) ||
        p.wilayah.toLowerCase().includes(search.toLowerCase());
      const matchWilayah = filterWilayah ? p.wilayah === filterWilayah : true;
      const matchTipe = filterTipe ? p.tipePemasok === filterTipe : true;
      return matchSearch && matchWilayah && matchTipe;
    });
  }, [pemasokList, search, filterWilayah, filterTipe]);

  // Pagination for pemasok tab
  const totalPages = Math.ceil(filteredPemasok.length / itemsPerPage) || 1;
  const paginatedPemasok = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPemasok.slice(start, start + itemsPerPage);
  }, [filteredPemasok, currentPage]);

  // Total volume calculation for percentages
  const totalVolumeKomoditas = useMemo(() => {
    return topKomoditas.reduce((acc, curr) => acc + curr.totalVolume, 0) || 1;
  }, [topKomoditas]);

  const totalMitraGabungan = stats.pemasokDalam + stats.pemasokLuar + stats.penggilingan;
  const persenLokal = totalMitraGabungan > 0 
    ? Math.round(((stats.pemasokDalam + stats.penggilingan) / totalMitraGabungan) * 100) 
    : 100;

  return (
    <div className="space-y-8">
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analitik')}
          className={`pb-4 px-6 text-sm md:text-base font-bold flex items-center gap-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'analitik'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 size={20} /> Analitik & Ekosistem Rantai Pasok
        </button>
        <button
          onClick={() => {
            setActiveTab('pemasok');
            setCurrentPage(1);
          }}
          className={`pb-4 px-6 text-sm md:text-base font-bold flex items-center gap-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'pemasok'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck size={20} /> Direktori Mitra Pemasok ({pemasokList.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: ANALITIK & EKOSISTEM */}
      {/* ========================================================= */}
      {activeTab === 'analitik' && (
        <div className="space-y-10 animate-fade-in">
          {/* KPI STATS (4 Cards) */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 border-t-4 border-t-emerald-500 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users size={24} />
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Mitra Terdaftar
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{totalMitraGabungan}</div>
              <div className="text-sm font-medium text-slate-500 mb-3">Total Pemasok & Penggilingan</div>
              
              <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Pemasok Lokal (Lebak)</span>
                  <span className="font-bold text-slate-700">{stats.pemasokDalam} Mitra</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Penggilingan Padi Lokal</span>
                  <span className="font-bold text-slate-700">{stats.penggilingan} Pabrik</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Pemasok Luar Daerah</span>
                  <span className="font-bold text-slate-700">{stats.pemasokLuar} Mitra</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 border-t-4 border-t-blue-500 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Package size={24} />
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  Variasi Pangan
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{stats.komoditasUnik}</div>
              <div className="text-sm font-medium text-slate-500 mb-3">Komoditas Telah Tersuplai</div>
              
              <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Total Katalog Pangan</span>
                  <span className="font-bold text-slate-700">{stats.totalKatalogKomoditas} Jenis</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Suplai Dari Dalam Lebak</span>
                  <span className="font-bold text-slate-700">{stats.komoditasDalam} Komoditas</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 border-t-4 border-t-amber-500 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Factory size={24} />
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  Dapur Terlayani
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">{stats.sppg}</div>
              <div className="text-sm font-medium text-slate-500 mb-3">Dapur SPPG Terdistribusi</div>
              
              <div className="mt-auto pt-3 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                  <span>Total Transaksi Pasokan</span>
                  <span className="font-bold text-amber-600">{stats.transaksi.toLocaleString('id-ID')} Kali</span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-slate-200 border-t-4 border-t-indigo-500 bg-white p-6 flex flex-col shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Wheat size={24} />
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Cadangan Stok
                </span>
              </div>
              <div className="text-3xl font-black text-slate-800 mb-1">
                {stats.sisaStokBerasSppg.toLocaleString('id-ID')} <span className="text-base font-semibold text-slate-500">Kg</span>
              </div>
              <div className="text-sm font-medium text-slate-500 mb-3">Sisa Stok Beras di SPPG</div>
              
              <div className="mt-auto pt-3 border-t border-slate-100">
                <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" /> Cadangan aman untuk produksi harian
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: TOP KOMODITAS PANGAN & KEMANDIRIAN PANGAN LOKAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Top Komoditas (Col 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Award className="text-amber-500" size={22} /> Top Komoditas Pangan
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Komoditas pangan dengan serapan volume pasokan tertinggi ke dapur sentral.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full w-max">
                  {topKomoditas.filter(k => k.totalVolume > 0).length} Komoditas Aktif
                </span>
              </div>

              <div className="space-y-4">
                {topKomoditas.slice(0, 6).map((item, index) => {
                  const percent = totalVolumeKomoditas > 0 
                    ? Math.round((item.totalVolume / totalVolumeKomoditas) * 100) 
                    : 0;
                  
                  return (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                            index === 0 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            index === 1 ? 'bg-slate-200 text-slate-700' :
                            index === 2 ? 'bg-amber-50 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            #{index + 1}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 text-sm md:text-base">
                              {item.nama}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-semibold text-slate-600">
                                {item.kategori || 'Bahan Segar'}
                              </span>
                              <span>• {item.jumlahSppg} Dapur SPPG</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-black text-slate-900 text-base md:text-lg">
                            {item.totalVolume.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">{item.satuan}</span>
                          </div>
                          <div className="text-xs font-bold text-primary-600">
                            {percent}% dari total
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mt-3">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(5, percent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Kemandirian Pangan & Sebaran Asal Pasokan (Col 5) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Card Rasio Kemandirian */}
              <div className="bg-gradient-to-br from-[#071840] via-[#0a235c] to-[#0e347e] text-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-400 bg-white/10 px-3 py-1 rounded-full">
                    Kedaulatan Pangan
                  </span>
                  <ShieldCheck size={20} className="text-accent-400" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">Tingkat Serapan Lokal</h3>
                <p className="text-xs text-white/75 leading-relaxed mb-6">
                  Persentase mitra penyedia bahan pangan yang berasal langsung dari Kabupaten Lebak untuk memberdayakan petani & UMKM daerah.
                </p>

                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-5xl font-black text-accent-400">{persenLokal}%</span>
                  <span className="text-sm font-semibold text-white/80">Mitra Lokal Lebak</span>
                </div>

                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-6">
                  <div 
                    className="bg-accent-400 h-3 rounded-full transition-all duration-700" 
                    style={{ width: `${persenLokal}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/15 text-xs">
                  <div>
                    <div className="text-white/60 mb-0.5">Mitra Dalam Lebak</div>
                    <div className="font-bold text-white text-base">{stats.pemasokDalam + stats.penggilingan} Entitas</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-0.5">Mitra Luar Daerah</div>
                    <div className="font-bold text-white text-base">{stats.pemasokLuar} Entitas</div>
                  </div>
                </div>
              </div>

              {/* Sebaran Wilayah Asal Pasokan */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-600" /> Sebaran Geografis Pemasok
                </h3>
                <div className="space-y-3">
                  {wilayahStats.map((w, idx) => {
                    const totalPemasokCount = pemasokList.length || 1;
                    const pct = Math.round((w.totalPemasok / totalPemasokCount) * 100);
                    return (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center text-sm font-semibold text-slate-800 mb-1">
                          <span>{w.wilayah}</span>
                          <span className="text-primary-600 font-bold">{w.totalPemasok} Mitra ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-primary-500 h-1.5 rounded-full" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: ALUR DIGITALISASI SUPPLY CHAIN (VISUAL STEPPER) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 inline-block">
                Arsitektur Ekosistem
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Alur Rantai Pasok MBG Terintegrasi</h2>
              <p className="text-sm text-slate-500 mt-2">
                Dari gabah dan bahan segar petani lokal hingga penyajian makanan bergizi tepat sasaran.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                  <Wheat size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Tahap 1: Hulu</span>
                <h4 className="font-bold text-slate-900 mb-2">Petani & Peternak Lokal</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pemberdayaan serapan panen gabah, sayur mayur, dan telur dari kelompok tani dan peternak di wilayah Lebak.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                  <Truck size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 mb-1">Tahap 2: Agregasi</span>
                <h4 className="font-bold text-slate-900 mb-2">Mitra Pemasok & Penggilingan</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pengolahan gabah menjadi beras standar premium dan penyediaan logistik bahan pangan segar terkurasi.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                  <Factory size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 mb-1">Tahap 3: Produksi</span>
                <h4 className="font-bold text-slate-900 mb-2">Dapur Sentral (SPPG)</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Verifikasi mutu bahan, rapid test keamanan pangan, dan pengolahan menu sesuai standar AKG gizi seimbang.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/70 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                  <CheckCircle2 size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">Tahap 4: Hilir</span>
                <h4 className="font-bold text-slate-900 mb-2">Siswa & Balita Penerima</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Distribusi tepat waktu ke sekolah dasar dan posyandu dengan konfirmasi penerimaan real-time via sistem.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DIREKTORI DATA MITRA PEMASOK */}
      {/* ========================================================= */}
      {activeTab === 'pemasok' && (
        <div className="space-y-6 animate-fade-in">
          {/* FILTERS PANEL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search */}
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Cari Nama Pemasok / Alamat
                </label>
                <div className="relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Contoh: Prima Niaga, Sayur Biang, Cibadak..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white"
                  />
                  {search && (
                    <button 
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Wilayah */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Wilayah / Kabupaten
                </label>
                <select
                  value={filterWilayah}
                  onChange={e => {
                    setFilterWilayah(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white"
                >
                  <option value="">Semua Wilayah</option>
                  {wilayahOptions.map((w, idx) => (
                    <option key={idx} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              {/* Filter Tipe */}
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Tipe Badan Usaha
                </label>
                <select
                  value={filterTipe}
                  onChange={e => {
                    setFilterTipe(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-white"
                >
                  <option value="">Semua Tipe</option>
                  {tipeOptions.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <span>Menampilkan <strong>{filteredPemasok.length}</strong> dari <strong>{pemasokList.length}</strong> mitra pemasok</span>
              {(search || filterWilayah || filterTipe) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setFilterWilayah('');
                    setFilterTipe('');
                    setCurrentPage(1);
                  }}
                  className="text-primary-600 font-bold hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* GRID DATA PEMASOK */}
          {filteredPemasok.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
              <Truck size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Mitra Pemasok Tidak Ditemukan</h3>
              <p className="text-sm text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter wilayah.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPemasok.map((pemasok, idx) => {
                const cardAccentThemes = [
                  { border: 'border-t-emerald-500', iconBg: 'group-hover:bg-emerald-50 group-hover:text-emerald-600', link: 'text-emerald-600' },
                  { border: 'border-t-blue-500', iconBg: 'group-hover:bg-blue-50 group-hover:text-blue-600', link: 'text-blue-600' },
                  { border: 'border-t-amber-500', iconBg: 'group-hover:bg-amber-50 group-hover:text-amber-600', link: 'text-amber-600' },
                  { border: 'border-t-indigo-500', iconBg: 'group-hover:bg-indigo-50 group-hover:text-indigo-600', link: 'text-indigo-600' },
                ];
                const theme = cardAccentThemes[idx % cardAccentThemes.length];

                return (
                  <div 
                    key={pemasok.pemasokId}
                    onClick={() => setSelectedPemasok(pemasok)}
                    className={`bg-white rounded-2xl border border-slate-200 border-t-4 ${theme.border} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group`}
                  >
                    <div>
                      {/* Header Card */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-slate-50 ${theme.iconBg} text-slate-500 flex items-center justify-center shrink-0 transition-colors`}>
                          <Truck size={24} />
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {pemasok.tipePemasok || 'Lokal'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {pemasok.status || 'Aktif'}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1 mb-1.5">
                        {pemasok.namaPemasok}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700">{pemasok.wilayah}</span>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-6">
                        {pemasok.alamatPemasok || 'Alamat operasional terdaftar di dinas.'}
                      </p>
                    </div>

                    {/* Footer Card */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Suplai</div>
                        <div className="font-black text-slate-800 text-sm">
                          {pemasok.totalVolume > 0 
                            ? `${pemasok.totalVolume.toLocaleString('id-ID')} Kg` 
                            : 'Mitra Siaga'}
                        </div>
                      </div>
                      
                      <span className={`text-xs font-bold ${theme.link} flex items-center gap-1 group-hover:translate-x-0.5 transition-transform`}>
                        Detail <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition"
              >
                Sebelumnya
              </button>
              <div className="text-sm font-bold text-slate-700 px-3">
                Halaman {currentPage} dari {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DETAIL PEMASOK */}
      {/* ========================================================= */}
      {selectedPemasok && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPemasok(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {selectedPemasok.tipePemasok || 'Lokal'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedPemasok.status || 'Aktif'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{selectedPemasok.namaPemasok}</h3>
              </div>
              <button 
                onClick={() => setSelectedPemasok(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Wilayah Administratif</div>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                    <MapPin size={16} className="text-primary-600" /> {selectedPemasok.wilayah}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Alamat Lengkap</div>
                  <div className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                    {selectedPemasok.alamatPemasok || 'Alamat tercatat di basis data dinas.'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
                  <div className="text-xs text-blue-800 font-semibold">Total Suplai Tersalurkan</div>
                  <div className="text-xl font-black text-blue-900 mt-1">
                    {selectedPemasok.totalVolume.toLocaleString('id-ID')} <span className="text-xs font-normal">Kg</span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                  <div className="text-xs text-emerald-800 font-semibold">Dapur SPPG Terlayani</div>
                  <div className="text-xl font-black text-emerald-900 mt-1">
                    {selectedPemasok.jumlahSppg} <span className="text-xs font-normal">Dapur</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Mitra ini telah terdaftar dalam sistem pengawasan rantai pasok terpadu Dinas Ketahanan Pangan Kabupaten Lebak untuk menjamin mutu dan kesegaran bahan baku.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPemasok(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition text-sm shadow-sm"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
