import React from 'react';
import PageHeader from '@/components/PageHeader';
import TentangClient from './TentangClient';

export const metadata = {
  title: 'Tentang Rantai Pasok | Sistem Digitalisasi Supply Chain - Pemkab Lebak',
  description: 'Informasi lengkap mengenai ekosistem logistik hulu ke hilir Sistem Digitalisasi Supply Chain Pemerintah Kabupaten Lebak.',
};

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader 
        title="Tentang Digitalisasi Supply Chain" 
        description="Pelajari lebih dalam mengenai ekosistem logistik terintegrasi hulu ke hilir yang menopang Program Makan Bergizi Gratis di Kabupaten Lebak."
        breadcrumbs={[{ label: 'Tentang' }]}
      />
      
      <main className="container mx-auto px-4 max-w-7xl">
        <TentangClient />
      </main>
    </div>
  );
}
