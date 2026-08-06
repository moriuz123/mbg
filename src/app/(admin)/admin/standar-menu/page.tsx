import React from 'react';
import StandarMenuClient from '@/components/StandarMenuClient';
import { getStandarMenu, getKategoriPenerima } from '@/app/actions/standarMenu';

export const metadata = {
  title: 'Manajemen Standar Menu Gizi | Admin MBG',
};

export default async function StandarMenuPage() {
  const dataMenu = await getStandarMenu();
  const kategoriList = await getKategoriPenerima();

  return (
    <div className="animate-fade-in p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Manajemen Standar Menu Gizi</h1>
          <p className="text-slate-500 mt-1">
            Kelola referensi menu makanan bergizi, lengkap dengan takaran kalori dan makronutrien.
          </p>
        </div>
      </div>

      <StandarMenuClient initialData={dataMenu} kategoriList={kategoriList} />
    </div>
  );
}
