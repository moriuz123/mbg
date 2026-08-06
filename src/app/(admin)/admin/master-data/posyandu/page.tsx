import React from 'react';
import { db } from '@/db';
import { posyandu, kecamatan, desa } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { HeartPulse, MapPin, Users } from 'lucide-react';
import PosyanduClientUI from './PosyanduClientUI';

export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function DataPosyanduPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role || '';
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  const dataPosyanduRaw = await db.query.posyandu.findMany({
    orderBy: [desc(posyandu.createdAt)],
    with: {
      kecamatan: true
    }
  });
  
  const kecamatanList = await db.query.kecamatan.findMany({
    orderBy: [kecamatan.namaKecamatan]
  });
  
  const desaList = await db.query.desa.findMany({
    orderBy: [desa.namaDesa]
  });

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Data Posyandu (Penerima Manfaat)
          </h1>
          <p className="text-slate-500 m-0">Kelola data posyandu yang menjadi target distribusi SPPG.</p>
        </div>
      </div>
      <PosyanduClientUI initialData={dataPosyanduRaw} isAdmin={isAdmin} kecamatanList={kecamatanList} desaList={desaList} />
    </div>
  );
}
