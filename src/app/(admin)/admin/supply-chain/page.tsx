import { getSupplyChain, getSppg } from "@/app/actions/sppg";
import { getMasterPemasok } from "@/app/actions/masterData";
import React from 'react';
import SupplyChainClientUI from './SupplyChainClientUI';

export const dynamic = 'force-dynamic';

export default async function SupplyChainPage() {
  const supplyChainList = await getSupplyChain();
  const sppgList = await getSppg();
  const pemasokList = await getMasterPemasok();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rantai Pasok</h1>
          <p className="text-slate-500 text-sm">Manajemen Kebutuhan Bahan Baku Pangan Segar SPPG</p>
        </div>
        <SupplyChainClientUI initialData={supplyChainList} sppgList={sppgList} pemasokList={pemasokList} />
      </div>
    </div>
  );
}
