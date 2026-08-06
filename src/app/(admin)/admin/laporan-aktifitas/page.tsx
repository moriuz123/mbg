import React from 'react';
import { db } from '@/db';
import { sppgLaporanAktifitas } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import LaporanAktifitasClient from '@/components/LaporanAktifitasClient';
import { getDropdownData } from '@/app/actions/laporanAktifitas';

export const metadata = {
  title: 'Laporan Harian SPPG | Admin MBG',
};

export default async function LaporanAktifitasPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  const userSppgId = session?.user?.sppgId;

  // Fetch Laporan
  const rawLaporanData = await db.query.sppgLaporanAktifitas.findMany({
    where: isAdmin ? undefined : (
      userSppgId ? eq(sppgLaporanAktifitas.sppgId, userSppgId) : eq(sppgLaporanAktifitas.id, -1) // If no sppgId, return empty
    ),
    with: {
      sppg: true,
      sekolah: true,
      posyandu: true,
      standarMenuGizi: true,
      verifikasiSekolah: true,
      verifikasiPosyandu: true
    },
    orderBy: [desc(sppgLaporanAktifitas.tanggal), desc(sppgLaporanAktifitas.createdAt)],
    limit: 50
  });

  const laporanData = rawLaporanData.map((l: any) => ({
    id: l.id,
    tanggal: l.tanggal,
    sppgName: l.sppg?.namaSppg || '-',
    sekolahName: l.sekolah?.namaSekolah || l.posyandu?.namaPosyandu || '-',
    menu: l.standarMenuGizi ? `${l.standarMenuGizi.namaMenu} (${l.standarMenuGizi.kaloriKkal || 0} Kkal)` : '-',
    jumlahPorsi: l.jumlahPorsi,
    status: l.status,
    verifikasi: (l.verifikasiSekolah && l.verifikasiSekolah.length > 0) ? l.verifikasiSekolah[0] : 
                (l.verifikasiPosyandu && l.verifikasiPosyandu.length > 0) ? l.verifikasiPosyandu[0] : null
  }));

  const dropdownData = await getDropdownData();

  return (
    <LaporanAktifitasClient 
      laporanData={laporanData} 
      dropdownData={dropdownData} 
    />
  );
}
