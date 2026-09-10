import React from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  LayoutDashboard, 
  TrendingUp, 
  Activity, 
  Package, 
  GraduationCap, 
  AlertCircle, 
  PieChart, 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  Factory, 
  ArrowRight,
  Truck,
  Building2
} from 'lucide-react';

interface AdminDinasDashboardProps {
  stats: {
    sppgCount: number;
    totalSiswa: number;
    sekolahTercover: number;
    sekolahBelumTercover: number;
    coveragePercent: string | number;
    statsPerSppg: Array<{
      namaSppg: string;
      jumlahSekolah: number;
      totalSiswa: number;
    }>;
    totalPosyanduSasaran: number;
    posyanduTercover: number;
    posyanduBelumTercover: number;
    totalPenggilingan: number;
    totalPemasok: number;
  };
}

export default function AdminDinasDashboard({ stats }: AdminDinasDashboardProps) {
  const totalPosyandu = stats.posyanduTercover + stats.posyanduBelumTercover;
  const posyanduCoveragePercent = totalPosyandu > 0 ? ((stats.posyanduTercover / totalPosyandu) * 100).toFixed(1) : 0;

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

      {/* METRICS ROW 1 - UTAMA & SEKOLAH */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1: Penerima Manfaat Siswa */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-emerald-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-emerald-100 rounded-xl"><TrendingUp size={18} /></div>
              Siswa Penerima Manfaat
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight break-words">{stats.totalSiswa.toLocaleString('id-ID')}</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Total siswa L/P terdaftar</div>
          </div>
        </div>
        
        {/* CARD 2: Dapur SPPG Aktif */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-primary-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <LayoutDashboard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-primary-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-primary-100 rounded-xl"><Utensils size={18} /></div>
              Dapur SPPG Operasional
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stats.sppgCount}</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Titik dapur produksi MBG</div>
          </div>
        </div>

        {/* CARD 3: Sekolah Tercover */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-indigo-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-indigo-100 rounded-xl"><GraduationCap size={18} /></div>
              Sekolah Tercover
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stats.sekolahTercover}</div>
              <div className="text-base sm:text-lg font-bold text-indigo-500">({stats.coveragePercent}%)</div>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Sekolah aktif terlayani</div>
          </div>
        </div>

        {/* CARD 4: Sekolah Belum Tercover */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-gradient-to-b from-white to-rose-50/30">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <AlertCircle size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-rose-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-rose-100 rounded-xl"><AlertCircle size={18} /></div>
              Sekolah Belum Tercover
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-700 tracking-tight">{stats.sekolahBelumTercover}</div>
            <div className="text-xs sm:text-sm font-medium text-rose-500/80 mt-1">Dalam antrean pemetaan</div>
          </div>
        </div>
      </div>

      {/* METRICS ROW 2 - POSYANDU & EKOSISTEM LOGISTIK */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 5: Sasaran Posyandu */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-sky-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-sky-100 rounded-xl"><HeartPulse size={18} /></div>
              Sasaran Posyandu
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight break-words">{stats.totalPosyanduSasaran.toLocaleString('id-ID')}</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Bumil, Busui & Balita</div>
          </div>
        </div>

        {/* CARD 6: Posyandu Tercover */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-fuchsia-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <Building2 size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-fuchsia-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-fuchsia-100 rounded-xl"><Building2 size={18} /></div>
              Posyandu Tercover
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stats.posyanduTercover}</div>
              <div className="text-base sm:text-lg font-bold text-fuchsia-500">({posyanduCoveragePercent}%)</div>
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{stats.posyanduBelumTercover} belum tercover</div>
          </div>
        </div>

        {/* CARD 7: Penggilingan Aktif */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <Factory size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-amber-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-amber-100 rounded-xl"><Factory size={18} /></div>
              Penggilingan Aktif
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stats.totalPenggilingan}</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Mitra penyedia beras</div>
          </div>
        </div>

        {/* CARD 8: Pemasok Logistik */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-cyan-50 opacity-50 group-hover:scale-110 transition-transform hidden sm:block">
            <Truck size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 text-cyan-600 font-bold text-xs sm:text-sm">
              <div className="p-2 bg-cyan-100 rounded-xl"><Truck size={18} /></div>
              Pemasok Logistik
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">{stats.totalPemasok}</div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Mitra pangan & bahan baku</div>
          </div>
        </div>
      </div>

      {/* TOP SPPG TABLE & QUICK LOGISTICS LINK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-slate-50/50">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">Top SPPG Melayani Siswa Terbanyak</h2>
              <p className="text-xs text-slate-500 mt-0.5">Dapur dengan beban distribusi terbesar saat ini</p>
            </div>
            <Link href="/admin/sppg" className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors inline-flex items-center gap-1">
              Lihat Semua SPPG →
            </Link>
          </div>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-slate-100">
                  <th className="p-3 sm:p-4 pl-4 sm:pl-6">Nama SPPG</th>
                  <th className="p-3 sm:p-4 text-center">Jml Sekolah</th>
                  <th className="p-3 sm:p-4 text-right pr-4 sm:pr-6">Total Siswa Terlayani</th>
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm">
                {stats.statsPerSppg.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 sm:p-4 pl-4 sm:pl-6 font-bold text-slate-800 flex items-center gap-2 sm:gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0">
                        {idx + 1}
                      </div>
                      <span className="truncate max-w-[160px] sm:max-w-xs">{item.namaSppg}</span>
                    </td>
                    <td className="p-3 sm:p-4 text-center font-semibold text-slate-600">
                      {item.jumlahSekolah} Sekolah
                    </td>
                    <td className="p-3 sm:p-4 pr-4 sm:pr-6 text-right font-black text-primary-700">
                      {item.totalSiswa.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                {stats.statsPerSppg.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 text-xs sm:text-sm">
                      Belum ada pemetaan penerima manfaat di SPPG manapun.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10 hidden sm:block">
            <Package size={200} />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border border-white/10">
              <Package size={24} className="text-primary-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Rantai Pasok Logistik</h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
              Dapur SPPG sangat bergantung pada ketersediaan logistik pangan (Beras, Daging, Sayuran). Pantau alur dari mitra lokal ke dapur secara terpusat.
            </p>
            <Link 
              href="/admin/pengawasan" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-300 hover:text-white transition-colors"
            >
              Buka Manajemen Rantai Pasok <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
