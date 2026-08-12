import React from 'react';
import Link from 'next/link';
import { 
  Factory, 
  Package, 
  Truck, 
  TrendingUp, 
  Utensils, 
  ArrowRight,
  Database
} from 'lucide-react';

interface PenggilinganDashboardProps {
  penggilinganId: number;
  stats: {
    namaPenggilingan: string;
    kapasitasKGMinggu: number;
    totalSuplaiKg: number;
    totalProduksiKg: number;
    totalGabahKg: number;
    totalPenjualanRp?: number;
    jumlahSppgTerlayani: number;
    recentDistributions?: Array<{
      id: number;
      minggu_mulai: string | Date;
      minggu_selesai: string | Date;
      volume_kg: number;
      tujuan_tipe: string;
      sppg_name?: string;
      lokasi_lain?: string;
    }>;
  };
}

export default function PenggilinganDashboard({ penggilinganId, stats }: PenggilinganDashboardProps) {
  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* HERO BANNER - PENGGILINGAN */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl shadow-amber-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Factory size={240} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Factory size={14} /> MITRA PENGGILINGAN BERAS MBG
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 tracking-tight">Penggilingan: {stats.namaPenggilingan}</h1>
          <p className="text-amber-100 max-w-2xl text-base lg:text-lg mb-8 leading-relaxed">
            Manajemen pasokan beras, penerimaan gabah lokal, realisasi giling, dan suplai logistik beras ke Dapur SPPG Kabupaten Lebak.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/penggilingan" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Factory size={18} /> Kelola Stok & Distribusi
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: Total Suplai Beras */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
            <Truck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-amber-600 font-bold text-sm">
              <div className="p-2.5 bg-amber-100 rounded-xl"><Truck size={20} /></div>
              Total Suplai Beras
            </div>
            <div className="text-4xl font-black text-slate-800">
              {stats.totalSuplaiKg > 1000 ? `${(stats.totalSuplaiKg / 1000).toFixed(1)} Ton` : `${stats.totalSuplaiKg.toLocaleString('id-ID')} Kg`}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">Volume distribusi ke SPPG/Pasar</div>
          </div>
        </div>
        
        {/* CARD 2: Total Realisasi Produksi */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
            <Factory size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
              <div className="p-2.5 bg-emerald-100 rounded-xl"><Factory size={20} /></div>
              Total Realisasi Giling
            </div>
            <div className="text-4xl font-black text-slate-800">
              {stats.totalProduksiKg > 1000 ? `${(stats.totalProduksiKg / 1000).toFixed(1)} Ton` : `${stats.totalProduksiKg.toLocaleString('id-ID')} Kg`}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">Beras hasil produksi giling</div>
          </div>
        </div>

        {/* CARD 3: Total Gabah Masuk */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
            <Database size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-orange-600 font-bold text-sm">
              <div className="p-2.5 bg-orange-100 rounded-xl"><Database size={20} /></div>
              Total Gabah Diterima
            </div>
            <div className="text-4xl font-black text-slate-800">
              {stats.totalGabahKg > 1000 ? `${(stats.totalGabahKg / 1000).toFixed(1)} Ton` : `${stats.totalGabahKg.toLocaleString('id-ID')} Kg`}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">Gabah dari petani/pemasok</div>
          </div>
        </div>

        {/* CARD 4: Dapur SPPG Terlayani */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
            <Utensils size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold text-sm">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><Utensils size={20} /></div>
              Dapur SPPG Terlayani
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.jumlahSppgTerlayani}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Mitra Dapur SPPG aktif</div>
          </div>
        </div>
      </div>

      {/* RIWAYAT DISTRIBUSI BERAS TERBARU */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Riwayat Suplai Beras Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5">5 catatan distribusi beras terakhir dari penggilingan Anda</p>
          </div>
          <Link href="/admin/penggilingan" className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors">
            Kelola Keluar Masuk Beras →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Minggu Distribusi</th>
                <th className="p-4">Tujuan</th>
                <th className="p-4">Volume (Kg)</th>
                <th className="p-4 text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentDistributions?.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700">
                    {item.minggu_mulai ? new Date(item.minggu_mulai).toLocaleDateString('id-ID') : '-'} s/d {item.minggu_selesai ? new Date(item.minggu_selesai).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="p-4 font-bold text-amber-800">
                    {item.tujuan_tipe === 'SPPG' ? (item.sppg_name || 'Dapur SPPG') : (item.lokasi_lain || item.tujuan_tipe)}
                  </td>
                  <td className="p-4 font-black text-slate-800">
                    {item.volume_kg?.toLocaleString('id-ID')} Kg
                  </td>
                  <td className="p-4 text-right pr-6">
                    <Link 
                      href="/admin/penggilingan" 
                      className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800"
                    >
                      Detail <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
              {(!stats.recentDistributions || stats.recentDistributions.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Belum ada riwayat suplai beras yang dicatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
