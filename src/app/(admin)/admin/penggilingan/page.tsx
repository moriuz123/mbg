import { getPenggilingan } from "@/app/actions/penggilingan";
import React from 'react';
import PenggilinganClientUI from './PenggilinganClientUI';

export const dynamic = 'force-dynamic';

export default async function PenggilinganPage() {
  const penggilinganList = await getPenggilingan();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Penggilingan Gabah</h1>
          <p className="text-slate-500 text-sm">Manajemen Mitra Penggilingan Gabah Daerah</p>
        </div>
        <PenggilinganClientUI initialData={penggilinganList} />
      </div>
    </div>
  );
}
