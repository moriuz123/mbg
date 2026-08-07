import React from 'react';
import PengaduanPublicForm from '@/components/PengaduanPublicForm';
import PageHeader from '@/components/PageHeader';
import { getPublicTargets } from '@/app/actions/pengaduan';

export const metadata = {
  title: 'Layanan Pengaduan | MBG Kab. Lebak',
  description: 'Formulir pengaduan masyarakat untuk program Makan Bergizi Gratis',
};

export default async function PengaduanPublicPage() {
  const targets = await getPublicTargets();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Layanan Pengaduan" 
        description="Sistem pelaporan terpadu. Bantu kami menjaga kualitas program MBG dengan melaporkan masalah yang Anda temukan di lapangan."
        breadcrumbs={[{ label: 'Pengaduan' }]}
      />
      <div className="container mx-auto px-4 max-w-7xl">

      <PengaduanPublicForm targets={targets} />
      </div>
    </div>
  );
}
