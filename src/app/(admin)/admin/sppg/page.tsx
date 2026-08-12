import { getSppg } from "@/app/actions/sppg";
import { getYayasans } from "@/app/actions/yayasan";
import { getKecamatan } from "@/app/actions/wilayah";
import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import SppgClientUI from './SppgClientUI';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SPPGPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const userRole = session?.user?.role || 'publik';
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  if (!isAdmin && (userRole === 'sppg' || userRole === 'operator_sppg')) {
    const sppgId = session?.user?.sppgId;
    if (sppgId) {
      redirect(`/admin/sppg/${sppgId}`);
    } else {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <AlertCircle size={48} className="text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Belum Terhubung dengan Dapur SPPG</h2>
          <p>Akun Anda belum dikaitkan dengan profil SPPG manapun. Silakan hubungi Admin Dinas.</p>
        </div>
      );
    }
  }

  const sppgList = await getSppg();
  const yayasanList = await getYayasans();
  const kecamatanList = await getKecamatan();

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data SPPG</h1>
          <p className="text-slate-500 text-sm">Manajemen Satuan Pelayanan Pemenuhan Gizi</p>
        </div>
      </div>
      <SppgClientUI initialData={sppgList} yayasanData={yayasanList} kecamatanData={kecamatanList} />
    </div>
  );
}
