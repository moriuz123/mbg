import React from 'react';
import PengaduanPublicForm from '@/components/PengaduanPublicForm';
import PageHeader from '@/components/PageHeader';
import { getPublicTargets } from '@/app/actions/pengaduan';

export const metadata = {
  title: 'Layanan Pengaduan & Aspirasi | MBG Kab. Lebak',
  description: 'Sistem pelaporan terpadu Program Makan Bergizi Gratis (MBG) Kabupaten Lebak via Form Direct, WhatsApp Lapor Ruhay (+6281944114581), dan SPAN-LAPOR.go.id.',
};

export default async function PengaduanPublicPage() {
  const targets = await getPublicTargets();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Layanan Pengaduan & Aspirasi" 
        description="Sistem pelaporan terpadu untuk ekosistem Digitalisasi Supply Chain. Bantu kami menjaga kualitas nutrisi dan keamanan distribusi MBG."
        breadcrumbs={[{ label: 'Pengaduan' }]}
      />
      <main className="container mx-auto px-4 max-w-7xl">
        <PengaduanPublicForm targets={targets} />
      </main>
    </div>
  );
}
