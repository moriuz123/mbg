import React from 'react';
import { db } from '@/db';
import { masterSekolah } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { GraduationCap, MapPin, Users } from 'lucide-react';
import SekolahClientUI from './SekolahClientUI';

export const dynamic = 'force-dynamic';

export default async function DataSekolahPage() {
  const dataSekolah = await db.query.masterSekolah.findMany({
    orderBy: [desc(masterSekolah.createdAt)]
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0', letterSpacing: '-0.02em' }}>
            Data Sekolah (Penerima Manfaat)
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>Kelola data sekolah berjenjang yang menjadi target distribusi SPPG.</p>
        </div>
        <SekolahClientUI initialData={dataSekolah} />
      </div>
    </div>
  );
}
