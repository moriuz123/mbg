import { getDesa, getKecamatan } from "@/app/actions/wilayah";
import React from 'react';
import DesaClientUI from './DesaClientUI';

export const dynamic = 'force-dynamic';

export default async function DesaPage() {
  const desa = await getDesa();
  const kecamatan = await getKecamatan();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Master Data Desa</h1>
        <p className="text-slate-500 text-sm">Kelola daftar desa dan kelurahan di Kabupaten Lebak</p>
      </div>
      <DesaClientUI initialData={desa} kecamatanList={kecamatan} />
    </div>
  );
}
