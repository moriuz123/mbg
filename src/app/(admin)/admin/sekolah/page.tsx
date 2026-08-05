import React from 'react';
import { db } from '@/db';
import { sekolah, kategoriPenerima } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { GraduationCap, MapPin, Users } from 'lucide-react';
import SekolahClientUI from './SekolahClientUI';

export const dynamic = 'force-dynamic';

export default async function DataSekolahPage() {
  const dataSekolahRaw = await db.query.sekolah.findMany({
    orderBy: [desc(sekolah.createdAt)],
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
      <SekolahClientUI initialData={dataSekolah} categories={categories} />
    </div>
  );
}
