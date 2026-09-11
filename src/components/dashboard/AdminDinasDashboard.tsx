'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  GraduationCap, 
  AlertCircle, 
  PieChart, 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  Factory,
  Truck,
  Building2
} from 'lucide-react';

interface AdminDinasDashboardProps {
  stats: {
    sppgCount: number;
    totalSiswa: number;
    totalSekolah: number;
    sekolahTercover: number;
    sekolahBelumTercover: number;
    coveragePercent: string | number;
    monthlyCommodityStats: Array<{
      bulan: string;
      namaBahan: string;
      volume: number;
    }>;
    totalPosyanduSasaran: number;
    totalBalita: number;
    totalBumil: number;
    totalBusui: number;
    posyanduTercover: number;
    totalPenggilingan: number;
    totalPemasokDalam: number;
    totalPemasokLuar: number;
    totalRapidTestBermasalah: number;
  };
}

export default function AdminDinasDashboard({ stats }: AdminDinasDashboardProps) {
  const [selectedCommodity, setSelectedCommodity] = useState('ALL');

  // Extract unique commodities for the dropdown
  const uniqueCommodities = useMemo(() => {
    const names = stats.monthlyCommodityStats.map(s => s.namaBahan);
    return Array.from(new Set(names)).sort();
  }, [stats.monthlyCommodityStats]);

  // Process data for the chart
  const chartData = useMemo(() => {
    // Group by month
    const grouped = stats.monthlyCommodityStats.reduce((acc, curr) => {
      if (selectedCommodity !== 'ALL' && curr.namaBahan !== selectedCommodity) return acc;
      
      if (!acc[curr.bulan]) {
        acc[curr.bulan] = 0;
      }
      acc[curr.bulan] += curr.volume;
      return acc;
    }, {} as Record<string, number>);

    // Convert back to array and sort by month
    const result = Object.entries(grouped)
      .map(([bulan, volume]) => ({ bulan, volume }))
      .sort((a, b) => a.bulan.localeCompare(b.bulan));

    return result;
  }, [stats.monthlyCommodityStats, selectedCommodity]);

  const maxVolume = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.max(...chartData.map(d => d.volume));
  }, [chartData]);

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* HERO BANNER - EXECUTIVE DASHBOARD */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-xl shadow-primary-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-10 pointer-events-none hidden sm:block">
          <PieChart size={240} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 border border-white/20">
            <Activity size={14} className="animate-pulse text-emerald-300" /> Executive Live Overview
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 tracking-tight leading-snug">
            Sistem Digitalisasi Supply Chain Pemkab Lebak
          </h1>
          <p className="text-primary-100 max-w-2xl text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
            Monitor cakupan sekolah, jumlah siswa penerima manfaat, sasaran posyandu, dan operasional Dapur SPPG secara terpusat untuk program Makan Bergizi Gratis di Kabupaten Lebak.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            <Link 
              href="/admin/sppg" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-primary-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md text-sm sm:text-base"
            >
              <Utensils size={18} /> Kelola SPPG
            </Link>
            <Link 
              href="/admin/master-data/sekolah" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-700/50 backdrop-blur border border-primary-500/50 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md text-sm sm:text-base"
            >
              <GraduationCap size={18} /> Data Sekolah
            </Link>
            <Link 
              href="/admin/manajemen-user" 
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary-800/40 backdrop-blur border border-primary-400/30 text-white rounded-xl font-bold hover:bg-primary-800/70 transition-all shadow-md text-sm sm:text-base"
            >
              <Users size={18} /> Manajemen User
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Jumlah SPPG Terdaftar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-primary-50 opacity-50 group-hover:scale-110 transition-transform">
            <LayoutDashboard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-primary-600 font-bold text-sm">
              <div className="p-2.5 bg-primary-100 rounded-xl"><Utensils size={20} /></div>
              Jumlah SPPG Terdaftar
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.sppgCount}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Titik Dapur MBG</div>
          </div>
        </div>

        {/* CARD 2: Sekolah & Siswa Penerima Manfaat */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold text-sm">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><GraduationCap size={20} /></div>
              Sekolah & Siswa
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-3xl font-black text-slate-800">{stats.totalSiswa?.toLocaleString('id-ID') || 0}</div>
                <div className="text-xs font-bold text-indigo-600 uppercase mt-1">Siswa Penerima</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-3xl font-black text-slate-800">{stats.totalSekolah || 0}</div>
                <div className="text-xs font-bold text-indigo-500 uppercase mt-1">Sekolah Terdaftar</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Sasaran Posyandu & Kategori */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 rounded-xl"><HeartPulse size={20} /></div>
              Sasaran Posyandu
            </div>
            <div className="text-3xl font-black text-slate-800 mb-2">{stats.posyanduTercover} <span className="text-sm font-semibold text-slate-500">Posyandu</span></div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-600">👶 Balita:</span>
              <span className="font-bold text-slate-800">{stats.totalBalita?.toLocaleString('id-ID') || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="font-semibold text-slate-600">🤰 Ibu Hamil:</span>
              <span className="font-bold text-slate-800">{stats.totalBumil?.toLocaleString('id-ID') || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="font-semibold text-slate-600">🤱 Ibu Menyusui:</span>
              <span className="font-bold text-slate-800">{stats.totalBusui?.toLocaleString('id-ID') || 0}</span>
            </div>
          </div>
        </div>

        {/* CARD 4: Pemasok Dalam Lebak & Luar Lebak */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-cyan-50 opacity-50 group-hover:scale-110 transition-transform">
            <Truck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-cyan-600 font-bold text-sm">
              <div className="p-2.5 bg-cyan-100 rounded-xl"><Truck size={20} /></div>
              Pemasok Logistik
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-3xl font-black text-slate-800">{stats.totalPemasokDalam || 0}</div>
                <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Dalam Lebak</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-3xl font-black text-slate-800">{stats.totalPemasokLuar || 0}</div>
                <div className="text-xs font-bold text-rose-600 uppercase mt-1">Luar Lebak</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: Penggilingan Terdaftar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
            <Factory size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-amber-600 font-bold text-sm">
              <div className="p-2.5 bg-amber-100 rounded-xl"><Factory size={20} /></div>
              Penggilingan Terdaftar
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPenggilingan}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">RMU & Mitra Beras</div>
          </div>
        </div>

        {/* CARD 6: Rapid Test Bermasalah */}
        <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-gradient-to-br from-white to-rose-50/50">
          <div className="absolute -right-4 -bottom-4 text-rose-100 opacity-50 group-hover:scale-110 transition-transform">
            <AlertCircle size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl"><AlertCircle size={20} /></div>
              Peringatan Rapid Test
            </div>
            <div className="text-4xl font-black text-rose-700">{stats.totalRapidTestBermasalah}</div>
            <div className="text-sm font-medium text-rose-500/80 mt-1">Bahan segar tidak aman</div>
          </div>
        </div>
      </div>

      {/* COMMODITY CHART SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 flex flex-col mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Tren Pembelian Komoditas Bulanan</h2>
            <p className="text-sm text-slate-500 mt-1">Pantau volume pengadaan bahan baku pangan dari seluruh SPPG (6 Bulan Terakhir)</p>
          </div>
          <div className="w-full sm:w-64">
            <select
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
            >
              <option value="ALL">Semua Komoditas (Gabungan)</option>
              {uniqueCommodities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CSS BAR CHART */}
        <div className="h-64 sm:h-80 flex items-end justify-between gap-2 sm:gap-4 pt-10">
          {chartData.length > 0 ? chartData.map((d, i) => {
            const height = maxVolume > 0 ? (d.volume / maxVolume) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                {/* TOOLTIP */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                  {d.volume.toLocaleString('id-ID')}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                </div>
                
                {/* BAR */}
                <div 
                  className="w-full bg-primary-500 rounded-t-lg group-hover:bg-primary-600 transition-colors"
                  style={{ height: `${Math.max(height, 1)}%` }}
                />
                
                {/* LABEL */}
                <div className="mt-3 text-xs sm:text-sm font-bold text-slate-500 text-center uppercase tracking-wider">
                  {d.bulan}
                </div>
              </div>
            );
          }) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
              Tidak ada data pembelian 6 bulan terakhir.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
