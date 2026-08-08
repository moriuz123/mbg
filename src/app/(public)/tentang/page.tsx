import React from 'react';
import PageHeader from '@/components/PageHeader';
import TentangClient from './TentangClient';

export const metadata = {
  title: 'Tentang Program | Makan Bergizi Gratis (MBG) Kab. Lebak',
  description: 'Informasi lengkap visi, misi, landasan hukum, 4 pilar ekosistem, dan pengawasan mutu Program Makan Bergizi Gratis di Kabupaten Lebak.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Tentang Program MBG" 
        description="Pelajari lebih dalam mengenai landasan, visi, misi, dan 4 pilar pengawasan hulu ke hilir Program Makan Bergizi Gratis di Kabupaten Lebak."
        breadcrumbs={[{ label: 'Tentang' }]}
      />
      
      <main className="container mx-auto px-4 max-w-7xl">
        <TentangClient />
      </main>
    </div>
  );
}
