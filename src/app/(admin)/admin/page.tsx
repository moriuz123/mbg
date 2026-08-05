import React from 'react';
import { ArrowRight, Utensils, LayoutDashboard, TrendingUp, Activity, Package, GraduationCap, AlertCircle, PieChart } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats } from '@/app/actions/dashboard';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* HEADER HERO */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 text-white shadow-xl shadow-primary-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <PieChart size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Activity size={14} /> LIVE DASHBOARD
          </div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Pantau Distribusi MBG</h1>
          <p className="text-primary-100 max-w-2xl text-lg mb-8 leading-relaxed">
            Monitor cakupan sekolah, jumlah siswa penerima manfaat, dan operasional Dapur SPPG secara terpusat untuk program Makan Bergizi Gratis di Kabupaten Lebak.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/admin/sppg" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              <Utensils size={18} /> Kelola SPPG
            </Link>
            <Link href="/admin/sekolah" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700/50 backdrop-blur border border-primary-500/50 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md hover:-translate-y-0.5">
              <GraduationCap size={18} /> Data Sekolah
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
              <div className="p-2.5 bg-emerald-100 rounded-xl"><TrendingUp size={20} /></div>
              Penerima Manfaat
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalSiswa.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Total siswa L/P aktif</div>
          </div>
        </div>
        
        {/* CARD 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-primary-50 opacity-50 group-hover:scale-110 transition-transform">
            <LayoutDashboard size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-primary-600 font-bold text-sm">
              <div className="p-2.5 bg-primary-100 rounded-xl"><Utensils size={20} /></div>
              Dapur SPPG Aktif
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.sppgCount}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Titik distribusi MBG</div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
            <GraduationCap size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold text-sm">
              <div className="p-2.5 bg-indigo-100 rounded-xl"><GraduationCap size={20} /></div>
              Sekolah Tercover
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black text-slate-800">{stats.sekolahTercover}</div>
              <div className="text-lg font-bold text-indigo-500">({stats.coveragePercent}%)</div>
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">Menerima rutin setiap hari</div>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-gradient-to-b from-white to-rose-50/30">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <AlertCircle size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 rounded-xl"><AlertCircle size={20} /></div>
              Belum Tercover
            </div>
            <div className="text-4xl font-black text-rose-700">{stats.sekolahBelumTercover}</div>
            <div className="text-sm font-medium text-rose-500/80 mt-1">Sekolah dalam daftar tunggu</div>
          </div>
        </div>
      </div>

      {/* TOP SPPG TABLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Top 5 SPPG Melayani Siswa Terbanyak</h2>
              <p className="text-xs text-slate-500 mt-0.5">Dapur dengan beban distribusi terbesar saat ini</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-slate-100">
                  <th className="p-4 pl-6">Nama SPPG</th>
                  <th className="p-4 text-center">Jml Sekolah</th>
                  <th className="p-4 text-right pr-6">Total Siswa Terlayani</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.statsPerSppg.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-black">{idx + 1}</div>
                      {item.namaSppg}
                    </td>
                    <td className="p-4 text-center font-semibold text-slate-600">
                      {item.jumlahSekolah} Sekolah
                    </td>
                    <td className="p-4 pr-6 text-right font-black text-primary-700">
                      {item.totalSiswa.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
                {stats.statsPerSppg.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 text-sm">
                      Belum ada pemetaan penerima manfaat di SPPG manapun.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <Package size={200} />
          </div>
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <Package size={24} className="text-primary-300" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Rantai Pasok</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              Dapur SPPG sangat bergantung pada logistik pangan (Beras, Lauk, Sayur). Pastikan rantai pasok lokal dan distributor tercatat dengan baik agar operasional tidak terhambat.
            </p>
            <Link href="/admin/supply-chain" className="inline-flex items-center gap-2 text-sm font-bold text-primary-300 hover:text-white transition-colors">
              Buka Manajemen Rantai Pasok <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
