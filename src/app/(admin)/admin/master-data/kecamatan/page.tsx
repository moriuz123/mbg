import { getKecamatan } from "@/app/actions/wilayah";
import React from 'react';
import KecamatanClientUI from './KecamatanClientUI';

export const dynamic = 'force-dynamic';

export default async function KecamatanPage() {
  const data = await getKecamatan();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Master Data Kecamatan</h1>
        <p className="text-slate-500 text-sm">Kelola daftar kecamatan di Kabupaten Lebak</p>
      </div>
      <KecamatanClientUI initialData={data} />
    </div>
  );
}
