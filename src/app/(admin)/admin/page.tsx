import React from 'react';
import { ArrowRight, Utensils, LayoutDashboard, TrendingUp, Activity, Package, GraduationCap, AlertCircle, PieChart, HeartPulse, ShieldCheck, Users, Factory } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getSppgDashboardStats } from '@/app/actions/dashboard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = session?.user?.role || 'publik';
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  if (userRole === 'sppg' || userRole === 'operator_sppg') {
    const sppgId = session?.user?.sppgId;
    if (!sppgId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Dapur SPPG</h2>
          <p>Akun Anda belum dikaitkan dengan profil SPPG manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const sppgStats = await getSppgDashboardStats(sppgId);

    return (
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-10 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Utensils size={200} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              <Activity size={14} /> STATUS: {sppgStats.statusOperasional}
            </div>
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Dapur: {sppgStats.namaSppg}</h1>
            <p className="text-indigo-100 max-w-2xl text-lg mb-8 leading-relaxed">
              Ringkasan operasional dan target sasaran harian dapur Anda. Pastikan semua jadwal distribusi dan penerima manfaat telah sesuai.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/laporan-aktifitas" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Activity size={18} /> Laporan Distribusi
              </Link>
              <Link href={`/admin/sppg/${sppgId}`} className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700/50 backdrop-blur border border-indigo-500/50 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md hover:-translate-y-0.5">
                <Users size={18} /> Atur Penerima Manfaat
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
                <div className="p-2.5 bg-emerald-100 rounded-xl"><Users size={20} /></div>
                Total Penerima (Sasaran)
              </div>
              <div className="text-4xl font-black text-slate-800">{sppgStats.totalPenerimaManfaat.toLocaleString('id-ID')}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Siswa + Balita/Bumil/Busui</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-indigo-50 opacity-50 group-hover:scale-110 transition-transform">
              <GraduationCap size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-indigo-600 font-bold text-sm">
                <div className="p-2.5 bg-indigo-100 rounded-xl"><GraduationCap size={20} /></div>
                Siswa Sekolah (Aktif)
              </div>
              <div className="text-4xl font-black text-slate-800">{sppgStats.totalSiswa.toLocaleString('id-ID')}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Dari {sppgStats.jumlahSekolah} Sekolah Terdaftar</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
              <HeartPulse size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
                <div className="p-2.5 bg-rose-100 rounded-xl"><HeartPulse size={20} /></div>
                Sasaran Posyandu
              </div>
              <div className="text-4xl font-black text-slate-800">{sppgStats.totalPosyandu.toLocaleString('id-ID')}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Dari {sppgStats.jumlahPosyandu} Posyandu Terdaftar</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
              <ShieldCheck size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
                <div className="p-2.5 bg-sky-100 rounded-xl"><ShieldCheck size={20} /></div>
                Total Porsi Terverifikasi
              </div>
              <div className="text-4xl font-black text-slate-800">{sppgStats.totalPorsiTerkirim.toLocaleString('id-ID')}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">Porsi sukses didistribusikan</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-800 shadow-xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <Package size={200} />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                <Package size={24} className="text-primary-300" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Rantai Pasok (Logistik)</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Manajemen bahan baku beras, lauk, dan sayur untuk dapur. Catat pesanan dan ketersediaan dari pemasok lokal agar produksi harian tidak terhambat.
              </p>
              <Link href="/admin/supply-chain" className="inline-flex items-center gap-2 text-sm font-bold text-primary-300 hover:text-white transition-colors">
                Kelola Logistik Dapur <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200">
                <Activity size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Laporan Aktifitas Harian</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Pastikan Anda selalu melaporkan keberangkatan armada distribusi makanan setiap harinya. Laporan yang dibuat akan langsung diverifikasi oleh pihak Sekolah / Posyandu secara real-time.
              </p>
              <Link href="/admin/laporan-aktifitas" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Kirim Laporan Hari Ini <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'operator_sekolah') {
    const sekolahId = session?.user?.sekolahId;
    if (!sekolahId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Sekolah</h2>
          <p>Akun Anda belum dikaitkan dengan profil Sekolah manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const { getSekolahDashboardStats } = await import('@/app/actions/dashboard');
    const sekolahStats = await getSekolahDashboardStats(sekolahId);

    return (
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-10 text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <GraduationCap size={200} />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Sekolah: {sekolahStats.namaSekolah}</h1>
            <p className="text-emerald-100 max-w-2xl text-lg mb-8 leading-relaxed">
              Selamat datang di dashboard Sekolah Anda. Di sini Anda dapat memverifikasi penerimaan makanan bergizi gratis yang telah dikirimkan oleh pihak SPPG.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/verifikasi" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <ShieldCheck size={18} /> Verifikasi Penerimaan
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
                <div className="p-2.5 bg-emerald-100 rounded-xl"><Users size={20} /></div>
                Total Siswa
              </div>
              <div className="text-4xl font-black text-slate-800">{sekolahStats.totalSiswa.toLocaleString('id-ID')}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
              <Package size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
                <div className="p-2.5 bg-sky-100 rounded-xl"><Package size={20} /></div>
                Porsi Diterima
              </div>
              <div className="text-4xl font-black text-slate-800">{sekolahStats.totalPorsiDiterima.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
              <AlertCircle size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
                <div className="p-2.5 bg-rose-100 rounded-xl"><AlertCircle size={20} /></div>
                Menunggu Verifikasi
              </div>
              <div className="text-4xl font-black text-rose-700">{sekolahStats.menungguVerifikasi}</div>
              <div className="text-sm font-medium text-rose-500/80 mt-1">Kiriman yang perlu Anda periksa</div>
            </div>
          </div>
        </div>

        {/* Histori Verifikasi / Pengiriman Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Riwayat Pengiriman Terbaru</h2>
              <p className="text-xs text-slate-500 mt-0.5">5 aktivitas distribusi terakhir ke sekolah Anda</p>
            </div>
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
                {sekolahStats.recentVerifications?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-700">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 font-bold text-primary-700">
                      {item.sppg_name || 'Tidak diketahui'}
                    </td>
                    <td className="p-4">
                      <p className="text-slate-800 font-medium">{item.menu_name || 'Menu Custom'}</p>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
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
                        <Link href="/admin/verifikasi" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                          <ShieldCheck size={14} /> Verifikasi Sekarang
                        </Link>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 px-3 py-1.5 bg-slate-100 rounded-lg">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!sekolahStats.recentVerifications || sekolahStats.recentVerifications.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Belum ada riwayat pengiriman makanan.
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

  if (userRole === 'operator_posyandu') {
    const posyanduId = session?.user?.posyanduId;
    if (!posyanduId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Posyandu</h2>
          <p>Akun Anda belum dikaitkan dengan profil Posyandu manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const { getPosyanduDashboardStats } = await import('@/app/actions/dashboard');
    const posyanduStats = await getPosyanduDashboardStats(posyanduId);

    return (
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-rose-600 to-rose-800 rounded-3xl p-10 text-white shadow-xl shadow-rose-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <HeartPulse size={200} />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Posyandu: {posyanduStats.namaPosyandu}</h1>
            <p className="text-rose-100 max-w-2xl text-lg mb-8 leading-relaxed">
              Selamat datang di dashboard Posyandu Anda. Di sini Anda dapat memverifikasi penerimaan makanan bergizi gratis yang telah dikirimkan oleh pihak SPPG.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/verifikasi" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <ShieldCheck size={18} /> Verifikasi Penerimaan
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
                <div className="p-2.5 bg-rose-100 rounded-xl"><Users size={20} /></div>
                Total Keseluruhan
              </div>
              <div className="text-4xl font-black text-slate-800">{posyanduStats.totalSasaran.toLocaleString('id-ID')}</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-pink-50 opacity-50 group-hover:scale-110 transition-transform">
              <HeartPulse size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-pink-600 font-bold text-sm">
                <div className="p-2.5 bg-pink-100 rounded-xl"><HeartPulse size={20} /></div>
                Ibu Hamil (Bumil)
              </div>
              <div className="text-4xl font-black text-slate-800">{posyanduStats.totalBumil.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-purple-50 opacity-50 group-hover:scale-110 transition-transform">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-purple-600 font-bold text-sm">
                <div className="p-2.5 bg-purple-100 rounded-xl"><Activity size={20} /></div>
                Ibu Menyusui (Busui)
              </div>
              <div className="text-4xl font-black text-slate-800">{posyanduStats.totalBusui.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50 group-hover:scale-110 transition-transform">
              <PieChart size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-orange-600 font-bold text-sm">
                <div className="p-2.5 bg-orange-100 rounded-xl"><PieChart size={20} /></div>
                Balita
              </div>
              <div className="text-4xl font-black text-slate-800">{posyanduStats.totalBalita.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>

        {/* Laporan Status */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
              <Package size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
                <div className="p-2.5 bg-sky-100 rounded-xl"><Package size={20} /></div>
                Porsi Diterima
              </div>
              <div className="text-4xl font-black text-slate-800">{posyanduStats.totalPorsiDiterima.toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
              <AlertCircle size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4 text-rose-600 font-bold text-sm">
                <div className="p-2.5 bg-rose-100 rounded-xl"><AlertCircle size={20} /></div>
                Menunggu Verifikasi
              </div>
              <div className="text-4xl font-black text-rose-700">{posyanduStats.menungguVerifikasi}</div>
              <div className="text-sm font-medium text-rose-500/80 mt-1">Kiriman yang perlu Anda periksa</div>
            </div>
          </div>
        </div>

        {/* Histori Verifikasi / Pengiriman Terbaru */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Riwayat Pengiriman Terbaru</h2>
              <p className="text-xs text-slate-500 mt-0.5">5 aktivitas distribusi terakhir ke Posyandu Anda</p>
            </div>
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
                {posyanduStats.recentVerifications?.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-slate-700">
                      {item.tanggal ? new Date(item.tanggal).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="p-4 font-bold text-primary-700">
                      {item.sppg_name || 'Tidak diketahui'}
                    </td>
                    <td className="p-4">
                      <p className="text-slate-800 font-medium">{item.menu_name || 'Menu Custom'}</p>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">
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
                        <Link href="/admin/verifikasi" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm">
                          <ShieldCheck size={14} /> Verifikasi Sekarang
                        </Link>
                      ) : (
                        <span className="text-xs font-medium text-slate-400 px-3 py-1.5 bg-slate-100 rounded-lg">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))}
                {(!posyanduStats.recentVerifications || posyanduStats.recentVerifications.length === 0) && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      Belum ada riwayat pengiriman makanan.
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

  if (userRole === 'operator_penggilingan') {
    const penggilinganId = session?.user?.penggilinganId;
    if (!penggilinganId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Penggilingan</h2>
          <p>Akun Anda belum dikaitkan dengan profil Penggilingan manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const { getPenggilinganDashboardStats } = await import('@/app/actions/dashboard');
    const penggilinganStats = await getPenggilinganDashboardStats(penggilinganId);

    return (
      <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-3xl p-10 text-white shadow-xl shadow-amber-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Factory size={200} />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Penggilingan: {penggilinganStats.namaPenggilingan}</h1>
            <p className="text-amber-100 max-w-2xl text-lg mb-8 leading-relaxed">
              Manajemen suplai beras ke Dapur SPPG.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/penggilingan" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-800 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Factory size={18} /> Kelola Stok & Distribusi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DEFAULT ADMIN DASHBOARD
  const stats = await getDashboardStats();

  const totalPosyandu = stats.posyanduTercover + stats.posyanduBelumTercover;
  const posyanduCoveragePercent = totalPosyandu > 0 ? ((stats.posyanduTercover / totalPosyandu) * 100).toFixed(1) : 0;

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
            <Link href="/admin/master-data/sekolah" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700/50 backdrop-blur border border-primary-500/50 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md hover:-translate-y-0.5">
              <GraduationCap size={18} /> Data Sekolah
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS - ROW 1 (Sekolah & SPPG) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold text-sm">
              <div className="p-2.5 bg-emerald-100 rounded-xl"><TrendingUp size={20} /></div>
              Penerima Manfaat (Siswa)
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
              Sekolah Belum Tercover
            </div>
            <div className="text-4xl font-black text-rose-700">{stats.sekolahBelumTercover}</div>
            <div className="text-sm font-medium text-rose-500/80 mt-1">Sekolah dalam daftar tunggu</div>
          </div>
        </div>
      </div>

      {/* METRICS CARDS - ROW 2 (Posyandu, Penggilingan, Pemasok) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* CARD 5 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-sky-50 opacity-50 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-sky-600 font-bold text-sm">
              <div className="p-2.5 bg-sky-100 rounded-xl"><HeartPulse size={20} /></div>
              Sasaran Posyandu
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPosyanduSasaran.toLocaleString('id-ID')}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Bumil, Busui, Balita</div>
          </div>
        </div>

        {/* CARD 6 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-fuchsia-50 opacity-50 group-hover:scale-110 transition-transform">
            <HeartPulse size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-fuchsia-600 font-bold text-sm">
              <div className="p-2.5 bg-fuchsia-100 rounded-xl"><HeartPulse size={20} /></div>
              Posyandu Tercover
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-black text-slate-800">{stats.posyanduTercover}</div>
              <div className="text-lg font-bold text-fuchsia-500">({posyanduCoveragePercent}%)</div>
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1">{stats.posyanduBelumTercover} belum tercover</div>
          </div>
        </div>

        {/* CARD 7 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
            <Factory size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-amber-600 font-bold text-sm">
              <div className="p-2.5 bg-amber-100 rounded-xl"><Factory size={20} /></div>
              Penggilingan Aktif
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPenggilingan}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Mitra penggilingan gabah</div>
          </div>
        </div>

        {/* CARD 8 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-cyan-50 opacity-50 group-hover:scale-110 transition-transform">
            <Package size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 text-cyan-600 font-bold text-sm">
              <div className="p-2.5 bg-cyan-100 rounded-xl"><Package size={20} /></div>
              Pemasok Logistik
            </div>
            <div className="text-4xl font-black text-slate-800">{stats.totalPemasok}</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Mitra pemasok bahan pangan</div>
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
