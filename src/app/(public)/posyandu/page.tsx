import React from 'react';
import PosyanduClient from './PosyanduClient';
import { getPublicPosyanduPenerima, getFilterOptions } from '@/app/actions/publicPosyandu';

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
    <div className="container" style={{ marginTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Posyandu Penerima Manfaat
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px' }}>
          Daftar Posyandu yang menerima program Makan Bergizi Gratis (MBG) di wilayah Kabupaten Lebak.
        </p>
      </div>
      
      <PosyanduClient initialData={posyanduData} filterOptions={filterOptions} />
    </div>
  );
}
