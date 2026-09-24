import React from 'react';
import StandarMenuClient from '@/components/StandarMenuClient';
import { getStandarMenu, getKategoriPenerima, getAKGList } from '@/app/actions/standarMenu';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Katalog Menu Harian | Admin MBG',
};

export default async function StandarMenuPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';
  const userSppgId = session?.user?.sppgId ? Number(session.user.sppgId) : undefined;

  const dataMenu = await getStandarMenu(isAdmin ? undefined : userSppgId);
  const kategoriList = await getKategoriPenerima();
  const akgList = await getAKGList();

  return (
    <div className="animate-fade-in p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Katalog Menu Harian</h1>
          <p className="text-slate-500 mt-1">
            Kelola referensi menu makanan bergizi, lengkap dengan takaran kalori dan makronutrien.
          </p>
        </div>
      </div>

      <StandarMenuClient initialData={dataMenu} kategoriList={kategoriList} akgList={akgList} isAdmin={isAdmin} />
    </div>
  );
}
