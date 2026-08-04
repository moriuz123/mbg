import { getRapidTest, getSppg } from "@/app/actions/sppg";
import React from 'react';
import RapidTestClientUI from './RapidTestClientUI';

export const dynamic = 'force-dynamic';

export default async function RapidTestPage() {
  const rapidTestList = await getRapidTest();
  const sppgList = await getSppg();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Uji Rapid Test</h1>
          <p className="text-slate-500 text-sm">Pemantauan Keamanan Pangan Segar SPPG</p>
        </div>
        <RapidTestClientUI initialData={rapidTestList} sppgList={sppgList} />
      </div>
    </div>
  );
}
