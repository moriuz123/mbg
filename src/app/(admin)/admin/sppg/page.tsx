import { getSppg } from "@/app/actions/sppg";
import React from 'react';
import { MapPin } from 'lucide-react';
import SppgClientUI from './SppgClientUI';

export const dynamic = 'force-dynamic';

export default async function SPPGPage() {
  const sppgList = await getSppg();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data SPPG</h1>
          <p className="text-slate-500 text-sm">Manajemen Satuan Pelayanan Pemenuhan Gizi</p>
        </div>
        <SppgClientUI initialData={sppgList} />
      </div>
    </div>
  );
}
