import React from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  Activity, 
  Users, 
  GraduationCap, 
  HeartPulse, 
  ShieldCheck, 
  Package, 
  ArrowRight,
  Store
} from 'lucide-react';
import DailyFreshFoodWidget from './DailyFreshFoodWidget';

interface SppgDashboardProps {
  sppgId: number;
  stats: {
    namaSppg: string;
    statusOperasional: string;
    totalSiswa: number;
    totalPosyandu: number;
    totalPorsiTerkirim: number;
    jumlahSekolah: number;
    jumlahPosyandu: number;
    totalPenerimaManfaat: number;
    totalPemasokDalam?: number;
    totalPemasokLuar?: number;
    jenisKomoditasDalam?: number;
    jenisKomoditasLuar?: number;
    berasPenggilingan?: number;
    berasPemasokDalam?: number;
    berasPemasokLuar?: number;
  };
  dailyFreshFoodStats?: {
    tanggal: string;
    rawList: any[];
    commodityList: Array<{
      namaBahan: string;
      kategori: string;
      totalVolume: number;
      satuan: string;
      totalBiaya: number;
      suppliers: string[];
    }>;
    totalItemsPurchased: number;
    totalVolumeOverall: number;
  };
}

export default function SppgDashboard({ sppgId, stats, dailyFreshFoodStats }: SppgDashboardProps) {
  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* HERO BANNER - SPPG KITCHEN OPERATIONAL */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Utensils size={240} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Activity size={14} className="text-emerald-300 animate-pulse" /> STATUS OPERASIONAL: {stats.statusOperasional}
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 tracking-tight">Dapur: {stats.namaSppg}</h1>
          <p className="text-indigo-100 max-w-2xl text-base lg:text-lg mb-8 leading-relaxed">
            Ringkasan operasional dan target sasaran harian dapur Anda. Pastikan semua jadwal distribusi dan penerima manfaat telah sesuai.
          </p>
          <div className="flex flex-wrap gap-4">
            
            <Link 
              href={`/admin/sppg/${sppgId}`} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700/50 backdrop-blur border border-indigo-500/50 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5"
            >
              <Users size={18} /> Kelola Target Penerima
            </Link>
            <Link 
              href="/admin/pengawasan" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-800/40 backdrop-blur border border-indigo-400/30 text-white rounded-xl font-bold hover:bg-indigo-800/70 transition-all shadow-md hover:-translate-y-0.5"
            >
              <Package size={18} /> Pengawasan Logistik
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* CARD 1: Total Sasaran Penerima */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
              <div className="p-2.5 bg-emerald-100 rounded-xl"><Users size={20} /></div>
              Total Penerima Manfaat
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPenerimaManfaat?.toLocaleString('id-ID') || 0}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Siswa + Posyandu (Bumil/Balita)</div>
          </div>
        </div>
        
        {/* CARD 2: Siswa Sekolah */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold text-sm">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><GraduationCap size={20} /></div>
              Siswa Sekolah (Aktif)
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalSiswa?.toLocaleString('id-ID') || 0}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Dari {stats.jumlahSekolah} Sekolah Terdaftar</div>
          </div>
        </div>

        {/* CARD 3: Sasaran Posyandu */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 rounded-xl"><HeartPulse size={20} /></div>
              Sasaran Posyandu
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPosyandu?.toLocaleString('id-ID') || 0}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Dari {stats.jumlahPosyandu} Posyandu Terdaftar</div>
          </div>
        </div>

        {/* CARD 4: Pemasok & Penggilingan (Dalam vs Luar Lebak) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
            <Store size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-amber-600 font-bold text-sm">
              <div className="p-2.5 bg-amber-100 rounded-xl"><Store size={20} /></div>
              Mitra & Pemasok Digunakan
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

        {/* CARD 5: Jenis Komoditas (Dalam vs Luar Lebak) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
            <Package size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
              <div className="p-2.5 bg-sky-100 rounded-xl"><Package size={20} /></div>
              Jenis Komoditas Dibeli
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-3xl font-black text-slate-800">{stats.jenisKomoditasDalam || 0}</div>
                <div className="text-xs font-bold text-emerald-600 uppercase mt-1">Lokal Lebak</div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <div className="text-3xl font-black text-slate-800">{stats.jenisKomoditasLuar || 0}</div>
                <div className="text-xs font-bold text-rose-600 uppercase mt-1">Luar Daerah</div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: Volume Beras (Kg) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
            <Utensils size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-orange-600 font-bold text-sm">
              <div className="p-2.5 bg-orange-100 rounded-xl"><Utensils size={20} /></div>
              Volume Beras Dibeli (Kg)
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">🌾 Penggilingan</span>
                <span className="font-bold text-slate-800">{stats.berasPenggilingan?.toLocaleString('id-ID') || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">🏢 Pemasok Dalam</span>
                <span className="font-bold text-slate-800">{stats.berasPemasokDalam?.toLocaleString('id-ID') || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">🚛 Pemasok Luar</span>
                <span className="font-bold text-slate-800">{stats.berasPemasokLuar?.toLocaleString('id-ID') || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD PANGAN SEGAR DIBELI HARIAN WIDGET */}
      {dailyFreshFoodStats && (
        <DailyFreshFoodWidget stats={dailyFreshFoodStats} />
      )}

      {/* QUICK WORKFLOW NAVIGATION CARDS */}
      <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Package size={200} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <Package size={24} className="text-indigo-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Logistik & Rantai Pasok Dapur</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Manajemen bahan baku beras, lauk, dan sayur untuk dapur. Catat pesanan dan ketersediaan dari pemasok lokal agar produksi harian tidak terhambat.
            </p>
            <Link 
              href="/admin/pengawasan" 
              className="inline-flex items-center gap-2 text-sm font-bold text-indigo-300 hover:text-white transition-colors"
            >
              Kelola Logistik Dapur <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        
      </div>
    </div>
  );
}
