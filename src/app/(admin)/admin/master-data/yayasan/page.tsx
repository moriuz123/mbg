import React from 'react';
import { getYayasans } from '@/app/actions/yayasan';
import { getKecamatan, getDesa } from '@/app/actions/wilayah';
import YayasanClientUI from './YayasanClientUI';

export const dynamic = 'force-dynamic';

export default async function YayasanPage() {
  const data = await getYayasans();
  const kecamatanList = await getKecamatan();
  const desaList = await getDesa();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Data Yayasan</h1>
        <p className="text-slate-500 text-sm">Manajemen Master Data Yayasan / Instansi Menaungi SPPG</p>
      </div>
      <YayasanClientUI initialData={data} kecamatanList={kecamatanList} desaList={desaList} />
    </div>
  );
}
