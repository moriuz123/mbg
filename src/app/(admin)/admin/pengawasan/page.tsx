import React from 'react';
import { db } from '@/db';
import { pemasok, jenisPangan, standarMenuGizi, sppg } from '@/db/schema';
import PengawasanClient from '@/components/PengawasanClient';
import { getPembelianBahan, getPemakaianBahan, getUjiRapidTest, getActiveMasterParameterUjiList, getKartuStok } from '@/app/actions/sppgPengawasan';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

  if (role !== 'sppg' && role !== 'operator_sppg') {
    redirect('/admin');
  }

  const pembelian = await getPembelianBahan();
  const pemakaian = await getPemakaianBahan();
  const ujiRapid = await getUjiRapidTest();
  const masterParameterList = await getActiveMasterParameterUjiList();
  const kartuStok = await getKartuStok();

  // Fetch lookups for forms with try-catch resilience
  let pemasokList: any[] = [];
  let jenisPanganList: any[] = [];
  let standarMenuList: any[] = [];
  let sppgList: any[] = [];

  try {
    pemasokList = await db.select().from(pemasok);
  } catch (e) {
    console.error('Error fetching pemasokList:', e);
  }

  try {
    jenisPanganList = await db.select().from(jenisPangan);
  } catch (e) {
    console.error('Error fetching jenisPanganList:', e);
  }

  try {
    standarMenuList = await db.select().from(standarMenuGizi);
  } catch (e) {
    console.error('Error fetching standarMenuList:', e);
  }

  if (isAdmin) {
    try {
      sppgList = await db.select().from(sppg);
    } catch (e) {
      console.error('Error fetching sppgList:', e);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full min-w-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Pengawasan Logistik & Mutu SPPG</h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1 sm:mt-2">Mencatat pembelian bahan segar, pemakaian harian, dan hasil uji rapid test dapur.</p>
      </div>

      <PengawasanClient 
        initialPembelian={pembelian}
        initialPemakaian={pemakaian}
        initialUjiRapid={ujiRapid}
        initialKartuStok={kartuStok}
        masterParameterList={masterParameterList}
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
