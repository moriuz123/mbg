import { getMasterDataSafe } from "@/app/actions/master";
import React from 'react';
import JenisPanganClientUI from './JenisPanganClientUI';

export const dynamic = 'force-dynamic';

export default async function MasterDataJenisPanganPage() {
  const data = await getMasterDataSafe('jenis-pangan');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Data - Jenis Pangan</h1>
          <p className="text-slate-500 text-sm">Kelola referensi komoditas pangan untuk sistem rantai pasok</p>
        </div>
        <JenisPanganClientUI initialData={data} />
      </div>
    </div>
  );
}
