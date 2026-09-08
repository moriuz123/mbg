import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PenggilinganClient from './PenggilinganClient';
import { db } from '@/db';
import { penggilingan, penggilinganSumberGabah, penggilinganDistribusi, penggilinganProduksi } from '@/db/schema';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Rantai Pasok Hulu | MBG Kab. Lebak',
  description: 'Transparansi serapan gabah dan produksi beras lokal Kabupaten Lebak.',
};

export default async function PublicPenggilingan() {
  let sumbers: any[] = [];
  let distribusis: any[] = [];
  let produksis: any[] = [];
  let pabriks: any[] = [];

  try {
    sumbers = await db.query.penggilinganSumberGabah.findMany();
    distribusis = await db.query.penggilinganDistribusi.findMany();
    produksis = await db.query.penggilinganProduksi.findMany();
    pabriks = await db.query.penggilingan.findMany({
      with: { kecamatan: true, desa: true }
    });
  } catch (e) {
    console.error('Error fetching public data:', e);
  }

  // --- 1. Aggregation Metrics ---
  const totalKapasitas = pabriks.reduce((acc, curr) => acc + Number(curr.kapasitasTerpasangKgMinggu || 0), 0);
  
  let totalGabah = 0;
  let totalGabahLokal = 0;
  sumbers.forEach(s => {
    const vol = Number(s.volumeKg || 0);
    totalGabah += vol;
    if (s.lokasiWilayah === 'Dalam Lebak' || s.lokasiWilayah === 'Dalam Kabupaten Lebak') {
      totalGabahLokal += vol;
    }
  });
  const gabahLuarLebak = totalGabah - totalGabahLokal;

  let totalBerasUtama = 0;
  produksis.forEach(p => {
    totalBerasUtama += Number(p.berasDihasilkanKg || 0);
  });

  let totalDistribusi = 0;
  let distribusiSppg = 0;
  let distribusiLokalUmum = 0;
  let distribusiLuar = 0;
  distribusis.forEach(d => {
    const vol = Number(d.volumeKg || 0);
    totalDistribusi += vol;
    if (d.tujuanTipe === 'SPPG') {
      distribusiSppg += vol;
    } else if (d.wilayahDistribusi === 'Dalam Lebak' || d.wilayahDistribusi === 'Dalam Kabupaten Lebak') {
      distribusiLokalUmum += vol;
    } else {
      distribusiLuar += vol;
    }
  });

  const persenLokal = totalGabah > 0 ? ((totalGabahLokal / totalGabah) * 100).toFixed(1) : '0.0';
  const rataRendemen = totalGabah > 0 ? ((totalBerasUtama / totalGabah) * 100).toFixed(1) : '0.0';

  const uniqueWeeks = new Set(sumbers.map(s => s.mingguMulai).filter(Boolean));
  const weekCount = uniqueWeeks.size > 0 ? uniqueWeeks.size : 1;
  const avgGabahPerWeek = totalGabah / weekCount;
  const utilisasiMesin = totalKapasitas > 0 ? ((avgGabahPerWeek / totalKapasitas) * 100).toFixed(1) : '0.0';

  // --- 2. Monthly Aggregation (For Tables) ---
  const gabahBulanan: Record<string, number> = {};
  sumbers.forEach(s => {
    if (!s.mingguMulai) return;
    const month = s.mingguMulai.substring(0, 7);
    gabahBulanan[month] = (gabahBulanan[month] || 0) + Number(s.volumeKg || 0);
  });

  const distribusiBulanan: Record<string, number> = {};
  distribusis.forEach(d => {
    if (!d.mingguMulai) return;
    const month = d.mingguMulai.substring(0, 7);
    distribusiBulanan[month] = (distribusiBulanan[month] || 0) + Number(d.volumeKg || 0);
  });

  // Convert to array format for frontend
  const formattedGabah = Object.entries(gabahBulanan).sort((a, b) => b[0].localeCompare(a[0])).map(([bulan, volume], index) => ({
    id: index,
    periode: bulan, // e.g. "2026-09"
    volume: volume
  }));

  const formattedDistribusi = Object.entries(distribusiBulanan).sort((a, b) => b[0].localeCompare(a[0])).map(([bulan, volume], index) => ({
    id: index,
    periode: bulan,
    volume: volume
  }));

  const macroStats = {
    totalGabah,
    totalGabahLokal,
    gabahLuarLebak,
    totalDistribusi,
    distribusiSppg,
    distribusiLokalUmum,
    distribusiLuar,
    totalKapasitas,
    persenLokal,
    rataRendemen,
    utilisasiMesin
  };

  return (
    <div className="container py-8 animate-fade-in" style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2 font-black text-slate-800">Transparansi Rantai Pasok Hulu</h2>
          <p className="text-slate-500 font-medium">Laporan agregat serapan gabah dan produksi beras lokal untuk program Makan Bergizi Gratis.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem', fontWeight: 'bold' }}>
          Akses Publik Terbuka
        </div>
      </div>

      <PenggilinganClient 
        gabahData={formattedGabah} 
        distribusiData={formattedDistribusi} 
        macroStats={macroStats} 
        pabrikList={pabriks}
      />
    </div>
  );
}
