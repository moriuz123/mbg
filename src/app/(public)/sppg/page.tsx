import React from 'react';
import SppgClient from './SppgClient';
import PageHeader from '@/components/PageHeader';
import { getPublicSppg, getPublicLaporanAktifitas } from '@/app/actions/publicSppg';
import { getFilterOptions } from '@/app/actions/publicSekolah';

export const metadata = {
  title: 'Direktori Titik Layanan (SPPG) | MBG Kab. Lebak',
  description: 'Data lokasi Satuan Pelayanan Pemenuhan Gizi di wilayah Kabupaten Lebak',
};

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function SppgPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const [sppgData, filterOptions, laporanData] = await Promise.all([
    getPublicSppg(),
    getFilterOptions(),
    getPublicLaporanAktifitas()
  ]);

  const currentTab = searchParams.tab || 'directory';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Titik Layanan (SPPG)" 
        description="Direktori Satuan Pelayanan Program Gizi (SPPG), Data Statistik, dan Laporan Aktifitas Pendistribusian di wilayah Kabupaten Lebak."
        breadcrumbs={[{ label: 'SPPG' }]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
      <SppgClient 
        initialData={sppgData} 
        filterOptions={{ kecamatans: filterOptions.kecamatans, desas: filterOptions.desas }} 
        laporanData={laporanData}
        currentTab={currentTab}
      />
      </div>
    </div>
  );
}
