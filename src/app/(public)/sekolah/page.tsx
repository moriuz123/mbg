import React from 'react';
import SekolahClient from './SekolahClient';
import { getPublicSekolahPenerima, getFilterOptions } from '@/app/actions/publicSekolah';

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
    <div className="container" style={{ marginTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Sekolah Penerima Manfaat
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px' }}>
          Daftar sekolah yang menerima program Makan Bergizi Gratis (MBG) di wilayah Kabupaten Lebak.
        </p>
      </div>
      
      <SekolahClient initialData={sekolahData} filterOptions={filterOptions} />
    </div>
  );
}
