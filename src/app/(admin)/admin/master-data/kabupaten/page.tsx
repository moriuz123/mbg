import { getKabupaten } from "@/app/actions/wilayah";
import React from 'react';
import KabupatenClientUI from './KabupatenClientUI';

export const dynamic = 'force-dynamic';

export default async function KabupatenPage() {
  const data = await getKabupaten();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Master Data Kabupaten</h1>
        <p className="text-slate-500 text-sm">Kelola daftar kabupaten/kota</p>
      </div>
      <KabupatenClientUI initialData={data} />
    </div>
  );
}
