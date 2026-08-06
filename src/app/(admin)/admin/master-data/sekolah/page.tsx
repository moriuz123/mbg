import React from 'react';
import { db } from '@/db';
import { sekolah, kategoriPenerima, kecamatan, desa } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { GraduationCap, MapPin, Users } from 'lucide-react';
import SekolahClientUI from './SekolahClientUI';

export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function DataSekolahPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role || '';
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  const dataSekolahRaw = await db.query.sekolah.findMany({
    orderBy: [desc(sekolah.createdAt)],
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

  const categories = await db.query.kategoriPenerima.findMany({
    orderBy: [kategoriPenerima.urutan],
  });
  
  // Create a map for easy lookup in the UI, or we can just join it in DB query
  const dataSekolah = dataSekolahRaw.map(s => {
    const cat = categories.find(c => c.id === s.kategoriId);
    return {
      ...s,
      kategori: cat ? cat.namaKategori : 'Lainnya'
    }
  });

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Data Sekolah (Penerima Manfaat)
          </h1>
          <p className="text-slate-500 m-0">Kelola data sekolah berjenjang yang menjadi target distribusi SPPG.</p>
        </div>
      </div>
      <SekolahClientUI initialData={dataSekolah} categories={categories} isAdmin={isAdmin} kecamatanList={kecamatanList} desaList={desaList} />
    </div>
  );
}
