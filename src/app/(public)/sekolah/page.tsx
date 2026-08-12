import React from 'react';
import SekolahClient from './SekolahClient';
import PageHeader from '@/components/PageHeader';
import { getPublicSekolahPenerima, getFilterOptions } from '@/app/actions/publicSekolah';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Daftar Sekolah Penerima MBG | MBG Kab. Lebak',
  description: 'Daftar sekolah penerima manfaat Makan Bergizi Gratis di Kabupaten Lebak',
};

export default async function SekolahPage() {
  const [sekolahData, filterOptions] = await Promise.all([
    getPublicSekolahPenerima(),
    getFilterOptions(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Sekolah Penerima Manfaat" 
        description="Daftar sekolah yang menerima program Makan Bergizi Gratis (MBG) di wilayah Kabupaten Lebak."
        breadcrumbs={[{ label: 'Sekolah' }]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
      <SekolahClient initialData={sekolahData} filterOptions={filterOptions} />
      </div>
    </div>
  );
}
