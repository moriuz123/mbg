import React from 'react';
import { db } from '@/db';
import { pemasok, jenisPangan, standarMenuGizi, sppg } from '@/db/schema';
import PengawasanClient from '@/components/PengawasanClient';
import { getPembelianBahan, getPemakaianBahan, getUjiRapidTest } from '@/app/actions/sppgPengawasan';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PengawasanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    redirect('/login');
  }

  const role = session.user.role;
  const sppgId = session.user.sppgId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';

  if (!isAdmin && role !== 'sppg' && role !== 'operator_sppg') {
    redirect('/admin');
  }

  const pembelian = await getPembelianBahan();
  const pemakaian = await getPemakaianBahan();
  const ujiRapid = await getUjiRapidTest();

  // Fetch lookups for forms
  const pemasokList = await db.select().from(pemasok);
  const jenisPanganList = await db.select().from(jenisPangan);
  const standarMenuList = await db.select().from(standarMenuGizi);
  const sppgList = isAdmin ? await db.select().from(sppg) : [];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Pengawasan Logistik & Mutu SPPG</h1>
        <p className="text-slate-500 mt-2">Mencatat pembelian bahan segar, pemakaian harian, dan hasil uji rapid test dapur.</p>
      </div>

      <PengawasanClient 
        initialPembelian={pembelian}
        initialPemakaian={pemakaian}
        initialUjiRapid={ujiRapid}
        pemasokList={pemasokList}
        jenisPanganList={jenisPanganList}
        standarMenuList={standarMenuList}
        sppgList={sppgList}
        isAdmin={isAdmin}
        userSppgId={sppgId}
      />
    </div>
  );
}
