import { getMasterPemasok } from "@/app/actions/masterData";
import React from 'react';
import PemasokClientUI from './PemasokClientUI';

export const dynamic = 'force-dynamic';

export default async function PemasokPage() {
  const pemasokList = await getMasterPemasok();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Pemasok</h1>
          <p className="text-slate-500 text-sm">Manajemen Data Pemasok Bahan Pangan SPPG</p>
        </div>
        <PemasokClientUI initialData={pemasokList} />
      </div>
    </div>
  );
}
