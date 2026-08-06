import React from 'react';
import PengaduanClient from '@/components/PengaduanClient';
import { getPengaduanList } from '@/app/actions/pengaduan';

export const metadata = {
  title: 'Pengaduan Masyarakat | Admin MBG',
};

export default async function PengaduanPage() {
  const data = await getPengaduanList();

  return (
    <div className="animate-fade-in max-w-7xl mx-auto space-y-6">
      <PengaduanClient data={data} />
    </div>
  );
}
