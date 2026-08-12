import React from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  PieChart, 
  Activity, 
  Clock 
} from 'lucide-react';

interface PosyanduDashboardProps {
  posyanduId: number;
  stats: {
    namaPosyandu: string;
    totalSasaran: number;
    totalBumil: number;
    totalBusui: number;
    totalBalita: number;
    totalPorsiDiterima: number;
    menungguVerifikasi: number;
    recentVerifications: Array<{
      id: number;
      tanggal: string | Date;
      jumlah_porsi: number;
      status: string;
      sppg_name?: string;
      menu_name?: string;
    }>;
  };
}

export default function PosyanduDashboard({ posyanduId, stats }: PosyanduDashboardProps) {
  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* HERO BANNER - POSYANDU */}
      <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl shadow-rose-900/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <HeartPulse size={240} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <HeartPulse size={14} /> PORTAL POSYANDU MBG
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 tracking-tight">Posyandu: {stats.namaPosyandu}</h1>
          <p className="text-rose-100 max-w-2xl text-base lg:text-lg mb-8 leading-relaxed">
            Selamat datang di dashboard Posyandu Anda. Monitor sasaran Ibu Hamil, Ibu Menyusui, dan Balita serta verifikasi penerimaan paket makanan dari Dapur SPPG.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/admin/verifikasi" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShieldCheck size={18} /> Verifikasi Penerimaan Paket
            </Link>
          </div>
        </div>
      </div>

      {/* ALERT PENSI: MENUNGGU VERIFIKASI */}
      {stats.menungguVerifikasi > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-md">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-base">
                Perhatian: Ada {stats.menungguVerifikasi} Pengiriman Menunggu Verifikasi Posyandu!
              </h3>
              <p className="text-amber-800 text-xs mt-0.5">
                Silakan periksa fisik makanan yang tiba dan verifikasi rincian porsi untuk Balita / Ibu Hamil.
              </p>
            </div>
          </div>
          <Link 
            href="/admin/verifikasi" 
            className="whitespace-nowrap px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md"
          >
            Verifikasi Sekarang →
          </Link>
        </div>
      )}

      {/* BREAKDOWN SASARAN POSYANDU */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL SASARAN */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <Users size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 rounded-xl"><Users size={20} /></div>
              Total Sasaran Terdaftar
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalSasaran.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Keseluruhan sasaran posyandu</div>
          </div>
        </div>
        
        {/* IBU HAMIL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-pink-50 opacity-50 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-pink-600 font-bold text-sm">
              <div className="p-2.5 bg-pink-100 rounded-xl"><HeartPulse size={20} /></div>
              Ibu Hamil (Bumil)
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalBumil.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Penerima suplemen & gizi bumil</div>
          </div>
        </div>

        {/* IBU MENYUSUI */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-purple-50 opacity-50 group-hover:scale-110 transition-transform">
            <Activity size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-purple-600 font-bold text-sm">
              <div className="p-2.5 bg-purple-100 rounded-xl"><Activity size={20} /></div>
              Ibu Menyusui (Busui)
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalBusui.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Penerima paket nutrisi busui</div>
          </div>
        </div>

        {/* BALITA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
            <PieChart size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-orange-600 font-bold text-sm">
              <div className="p-2.5 bg-orange-100 rounded-xl"><PieChart size={20} /></div>
              Balita Terdaftar
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalBalita.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Balita penerima MBG</div>
          </div>
        </div>
      </div>

      {/* PORSI DITERIMA & PENDING */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
            <Package size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
              <div className="p-2.5 bg-sky-100 rounded-xl"><Package size={20} /></div>
              Total Porsi Terverifikasi
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPorsiDiterima.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Paket makanan diterima lengkap</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group bg-gradient-to-b from-white to-rose-50/30">
          <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <AlertCircle size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
              <div className="p-2.5 bg-rose-100 rounded-xl"><AlertCircle size={20} /></div>
              Menunggu Verifikasi
            </div>
            <div className="text-4xl font-black text-rose-700">{stats.menungguVerifikasi}</div>
            <div className="text-sm font-medium text-rose-500/80 mt-1">Pengiriman yang perlu diperiksa</div>
          </div>
        </div>
      </div>

      {/* RIWAYAT PENGIRIMAN TERBARU */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Riwayat Pengiriman Makanan ke Posyandu</h2>
            <p className="text-xs text-slate-500 mt-0.5">5 aktivitas distribusi terakhir dari SPPG</p>
          </div>
          <Link href="/admin/verifikasi" className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors">
            Lihat Semua Verifikasi →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Tanggal</th>
                <th className="p-4">Dapur SPPG</th>
                <th className="p-4">Menu & Porsi</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stats.recentVerifications?.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700">
                    {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="p-4 font-bold text-rose-700">
                    {item.sppg_name || 'Dapur SPPG'}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-800 font-medium">{item.menu_name || 'Menu Gizi Ibu & Balita'}</p>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block font-semibold">
                      {item.jumlah_porsi} Porsi
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Bermasalah' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status || 'Terkirim'}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    {item.status === 'Terkirim' ? (
                      <Link 
                        href="/admin/verifikasi" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                      >
                        <ShieldCheck size={14} /> Verifikasi
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 px-3 py-1.5 bg-slate-100 rounded-lg">
                        <CheckCircle2 size={14} className="text-emerald-500" /> Selesai
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {(!stats.recentVerifications || stats.recentVerifications.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada riwayat pengiriman makanan ke Posyandu ini.
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
