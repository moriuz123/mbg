import React from 'react';
import AkgClientUI from '@/components/AkgClientUI';
import { getAKGData, getKategoriList } from '@/app/actions/akg';

export const metadata = {
  title: 'Master Standar AKG | Admin MBG',
};

export default async function AkgPage() {
  const initialData = await getAKGData();
  const kategoriList = await getKategoriList();

  return (
    <div className="animate-fade-in p-6 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Master Standar Kecukupan Gizi (AKG)</h1>
        <p className="text-slate-500 mt-1">
          Kelola batas minimum dan maksimum angka kecukupan gizi untuk berbagai kategori penerima manfaat. Data ini digunakan untuk memvalidasi menu yang dibuat oleh dapur (SPPG).
        </p>
      </div>
      <AkgClientUI initialData={initialData} kategoriList={kategoriList} />
    </div>
  );
}
