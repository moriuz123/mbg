import { getMasterDataSafe } from "@/app/actions/master";
import React from 'react';
import DistributorClientUI from './DistributorClientUI';

export const dynamic = 'force-dynamic';

export default async function MasterDataDistributorPage() {
  const data = await getMasterDataSafe('distributor');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Master Data - Distributor</h1>
          <p className="text-slate-500 text-sm">Kelola daftar ekspedisi dan logistik distribusi pangan</p>
        </div>
        <DistributorClientUI initialData={data} />
      </div>
    </div>
  );
}
