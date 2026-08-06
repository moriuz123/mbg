import React from 'react';
import PengaduanPublicForm from '@/components/PengaduanPublicForm';
import { getPublicTargets } from '@/app/actions/pengaduan';

export const metadata = {
  title: 'Layanan Pengaduan | MBG Kab. Lebak',
  description: 'Formulir pengaduan masyarakat untuk program Makan Bergizi Gratis',
};

export default async function PengaduanPublicPage() {
  const targets = await getPublicTargets();

  return (
    <div className="container py-12 animate-fade-in" style={{ minHeight: '80vh', paddingTop: '6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
          Layanan Pengaduan
        </h1>
        <p style={{ color: '#64748b', mt: '0.75rem', maxWidth: '600px', margin: '0.75rem auto 0' }}>
          Sistem pelaporan terpadu. Bantu kami menjaga kualitas program MBG dengan melaporkan masalah yang Anda temukan di lapangan.
        </p>
      </div>

      <PengaduanPublicForm targets={targets} />
    </div>
  );
}
