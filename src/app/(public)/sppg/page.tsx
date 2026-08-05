import React from 'react';
import SppgClient from './SppgClient';
import { getPublicSppg, getPublicLaporanAktifitas } from '@/app/actions/publicSppg';
import { getFilterOptions } from '@/app/actions/publicSekolah';

export const metadata = {
  title: 'Direktori Titik Layanan (SPPG) | MBG Kab. Lebak',
  description: 'Data lokasi Satuan Pelayanan Pemenuhan Gizi di wilayah Kabupaten Lebak',
};

export default async function SppgPage({ searchParams }: { searchParams: { tab?: string } }) {
  const [sppgData, filterOptions, laporanData] = await Promise.all([
    getPublicSppg(),
    getFilterOptions(),
    getPublicLaporanAktifitas()
  ]);

  const currentTab = searchParams.tab || 'directory';

  return (
    <div className="container" style={{ marginTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Titik Layanan (SPPG)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px' }}>
          Direktori Satuan Pelayanan Program Gizi (SPPG), Data Statistik, dan Laporan Aktifitas Pendistribusian di wilayah Kabupaten Lebak.
        </p>
      </div>
      
      <SppgClient 
        initialData={sppgData} 
        filterOptions={{ kecamatans: filterOptions.kecamatans, desas: filterOptions.desas }} 
        laporanData={laporanData}
        currentTab={currentTab}
      />
    </div>
  );
}
