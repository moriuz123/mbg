import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PenggilinganClient from './PenggilinganClient';
import { db } from '@/db';
import { penggilingan, penggilinganSumberGabah, penggilinganDistribusi } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Data Penggilingan Beras | MBG Kab. Lebak',
  description: 'Transparansi serapan gabah dari petani lokal Kabupaten Lebak.',
};

export default async function PublicPenggilingan() {
  let sumbers: any[] = [];
  let distribusis: any[] = [];
  let pabriks: any[] = [];

  try {
    sumbers = await db.query.penggilinganSumberGabah.findMany({
      orderBy: [desc(penggilinganSumberGabah.mingguMulai)],
      limit: 20
    });
  } catch (e) {
    console.error('Error fetching penggilinganSumberGabah:', e);
  }

  try {
    distribusis = await db.query.penggilinganDistribusi.findMany({
      with: { sppgTujuan: true },
      orderBy: [desc(penggilinganDistribusi.mingguMulai)],
      limit: 20
    });
  } catch (e) {
    console.error('Error fetching penggilinganDistribusi:', e);
  }

  try {
    pabriks = await db.query.penggilingan.findMany();
  } catch (e) {
    console.error('Error fetching penggilingan:', e);
  }

  const totalKapasitas = pabriks.reduce((acc, curr) => acc + Number(curr.kapasitasTerpasangKgMinggu || 0), 0);

  const formatPeriode = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formattedGabah = sumbers.map(s => ({
    id: s.id,
    periode: formatPeriode(s.mingguMulai),
    sumber: s.sumberGabah,
    volume: Number(s.volumeKg)
  }));

  const formattedDistribusi = distribusis.map(d => ({
    id: d.id,
    periode: formatPeriode(d.mingguMulai),
    lokus: d.sppgTujuan?.namaSppg || d.lokasiLain || 'Lainnya',
    volume: Number(d.volumeKg)
  }));

  return (
    <div className="container py-8 animate-fade-in" style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Data Induk: Pre-Market</h2>
          <p className="text-muted">Transparansi serapan gabah dari petani lokal Kabupaten Lebak.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Akses Publik Terbuka
        </div>
      </div>

      <PenggilinganClient 
        gabahData={formattedGabah} 
        distribusiData={formattedDistribusi} 
        totalKapasitas={totalKapasitas} 
      />
    </div>
  );
}
