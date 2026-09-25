import React from 'react';
import { AlertCircle } from 'lucide-react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { 
  getDashboardStats, 
  getSppgDashboardStats,
  getSekolahDashboardStats,
  getPosyanduDashboardStats,
  getPenggilinganDashboardStats
} from '@/app/actions/dashboard';
import { getDailyFreshFoodPurchasesStats } from '@/app/actions/sppgPengawasan';

// Modular Role-Based Dashboard Components
import AdminDinasDashboard from '@/components/dashboard/AdminDinasDashboard';
import SppgDashboard from '@/components/dashboard/SppgDashboard';
import SekolahDashboard from '@/components/dashboard/SekolahDashboard';
import PosyanduDashboard from '@/components/dashboard/PosyanduDashboard';
import PenggilinganDashboard from '@/components/dashboard/PenggilinganDashboard';

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const userRole = session?.user?.role || 'publik';

  // 1. DASHBOARD SPPG (OPERATOR DAPUR SENTRAL)
  if (userRole === 'sppg' || userRole === 'operator_sppg') {
    const sppgId = session?.user?.sppgId;
    if (!sppgId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Dapur SPPG</h2>
          <p className="text-slate-500 text-center max-w-md">Akun Anda belum dikaitkan dengan profil SPPG manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const sppgStats = await getSppgDashboardStats(sppgId);
    const dailyFreshFoodStats = await getDailyFreshFoodPurchasesStats(sppgId);
    return <SppgDashboard sppgId={sppgId} stats={sppgStats} dailyFreshFoodStats={dailyFreshFoodStats} />;
  }

  // 2. DASHBOARD SEKOLAH (OPERATOR SEKOLAH)
  if (userRole === 'operator_sekolah') {
    const sekolahId = session?.user?.sekolahId;
    if (!sekolahId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Sekolah</h2>
          <p className="text-slate-500 text-center max-w-md">Akun Anda belum dikaitkan dengan profil Sekolah manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const sekolahStats = await getSekolahDashboardStats(sekolahId);
    return <SekolahDashboard sekolahId={sekolahId} stats={sekolahStats} />;
  }

  // 3. DASHBOARD POSYANDU (OPERATOR POSYANDU)
  if (userRole === 'operator_posyandu') {
    const posyanduId = session?.user?.posyanduId;
    if (!posyanduId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Posyandu</h2>
          <p className="text-slate-500 text-center max-w-md">Akun Anda belum dikaitkan dengan profil Posyandu manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const posyanduStats = await getPosyanduDashboardStats(posyanduId);
    return <PosyanduDashboard posyanduId={posyanduId} stats={posyanduStats} />;
  }

  // 4. DASHBOARD PENGGILINGAN (OPERATOR PENGGILINGAN GABAH)
  if (userRole === 'operator_penggilingan') {
    const penggilinganId = session?.user?.penggilinganId;
    if (!penggilinganId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Penggilingan</h2>
          <p className="text-slate-500 text-center max-w-md">Akun Anda belum dikaitkan dengan profil Penggilingan manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }

    const penggilinganStats = await getPenggilinganDashboardStats(penggilinganId);
    return <PenggilinganDashboard penggilinganId={penggilinganId} stats={penggilinganStats} />;
  }

  // 5. EXECUTIVE DASHBOARD (DEFAULT ADMIN DINAS / SUPER ADMIN)
  const stats = await getDashboardStats();
  return <AdminDinasDashboard stats={stats} />;
}
