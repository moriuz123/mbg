import React from 'react';
import PosyanduClient from './PosyanduClient';
import PageHeader from '@/components/PageHeader';
import { getPublicPosyanduPenerima, getFilterOptions } from '@/app/actions/publicPosyandu';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Daftar Posyandu Penerima MBG | MBG Kab. Lebak',
  description: 'Daftar Posyandu penerima manfaat Makan Bergizi Gratis di Kabupaten Lebak',
};

export default async function PosyanduPage() {
  const [posyanduData, filterOptions] = await Promise.all([
    getPublicPosyanduPenerima(),
    getFilterOptions(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Posyandu Penerima Manfaat" 
        description="Daftar Posyandu yang menerima program Makan Bergizi Gratis (MBG) di wilayah Kabupaten Lebak."
        breadcrumbs={[{ label: 'Posyandu' }]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
      <PosyanduClient initialData={posyanduData} filterOptions={filterOptions} />
      </div>
    </div>
  );
}
