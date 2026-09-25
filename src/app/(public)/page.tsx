import React from 'react';
import { 
  ArrowRight, Utensils, ShieldCheck, MapPin, CheckCircle2, 
  ChevronRight, Phone, Mail, Clock, Activity, Users, Home as HomeIcon, 
  Search, Facebook, Twitter, Instagram, Youtube, MessageSquare, Truck, Package, HeartPulse, Leaf, BarChart2, Star, TrendingUp, Info, Bell, Factory 
} from 'lucide-react';
import Link from 'next/link';
import { getPublicStats, getPublicLaporanHarian, getSupplyChainStats } from '@/app/actions/publicStats';
import PenggilinganClient from './data-penggilingan/PenggilinganClient';
import { db } from '@/db';
import { penggilingan, penggilinganSumberGabah, penggilinganDistribusi } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import { getSiteSettings, getPengumumanAktif } from '@/app/actions/frontend';
import LaporanHarianClient from '@/components/LaporanHarianClient';
import AnimatedStats from '@/components/AnimatedStats';
import PengumumanBadgeClient from '@/components/PengumumanBadgeClient';

export const dynamic = 'force-dynamic';

import { getFilterOptions } from '@/app/actions/publicSekolah';

export default async function Public({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const dateStr = Array.isArray(resolvedSearchParams?.date) ? resolvedSearchParams.date[0] : resolvedSearchParams?.date;
  
  const stats = await getPublicStats();
  const supplyChainStats = await getSupplyChainStats();
  
  // Data Penggilingan
  let sumbers: any[] = [];
  let produksis: any[] = [];
  let distribusis: any[] = [];
  let pabriks: any[] = [];
  let filterOptions: any = { kecamatans: [], desas: [], kategoris: [] };
  
  try {
    sumbers = await db.query.penggilinganSumberGabah.findMany();
    distribusis = await db.query.penggilinganDistribusi.findMany();
    produksis = await db.query.penggilinganProduksi.findMany();
    pabriks = await db.query.penggilingan.findMany({
      with: { kecamatan: true, desa: true }
    });
    filterOptions = await getFilterOptions();
  } catch (e) {}

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

  const formattedGabah = Object.entries(gabahBulanan).sort((a, b) => b[0].localeCompare(a[0])).map(([bulan, volume], index) => ({
    id: index,
    periode: bulan,
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
  const laporanHarian = await getPublicLaporanHarian(dateStr);
  const settings = await getSiteSettings();
  const activeBanners = await getPengumumanAktif();

  // Data Rantai Pasok (Preview)
  let rpStats = { pemasok: 0, komoditas: 0, transaksi: 0 };
  let rpFeed: any[] = [];
  try {
    const rpStatsRes = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM pemasok WHERE status = 'Aktif') + (SELECT COUNT(*) FROM penggilingan) as total_pemasok,
        (SELECT COUNT(DISTINCT jenis_pangan_id) FROM sppg_pembelian_bahan) as total_komoditas,
        (SELECT COUNT(*) FROM sppg_pembelian_bahan) as total_transaksi
    `);
    rpStats = {
      pemasok: parseInt(rpStatsRes[0]?.total_pemasok as string) || 0,
      komoditas: parseInt(rpStatsRes[0]?.total_komoditas as string) || 0,
      transaksi: parseInt(rpStatsRes[0]?.total_transaksi as string) || 0,
    };
    
    rpFeed = await db.execute(sql`
      SELECT 
        pb.id, pb.tanggal_pembelian, jp.nama_bahan, pb.volume, 
        COALESCE(pb.satuan, jp.satuan_default, 'Kg') as satuan, s.nama_sppg
      FROM sppg_pembelian_bahan pb
      JOIN jenis_pangan jp ON pb.jenis_pangan_id = jp.jenis_pangan_id
      JOIN sppg s ON pb.sppg_id = s.sppg_id
      ORDER BY pb.tanggal_pembelian DESC, pb.created_at DESC
      LIMIT 3
    `);
  } catch(e) {
    console.error("Error fetching rantai pasok preview:", e);
  }

  const heroBgImage = settings.hero_bg_image || null;
  const heroStyle = heroBgImage 
    ? { backgroundImage: `linear-gradient(to bottom, rgba(5, 15, 40, 0.98) 0%, rgba(5, 15, 40, 0.96) 100%), url(${heroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg,#071840_0%,#0a2463_45%,#1e5ca8_100%)' };
  
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-accent-500 selection:text-white font-sans overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden flex flex-col justify-center min-h-[90vh]" style={heroStyle}>
        {/* Pattern Overlay (Modern Dots) */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}></div>
        
        {/* Abstract Geometry Lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary-400/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen transform -translate-x-1/4 translate-y-1/4"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center">
                <Star className="w-3 h-3 text-[#071840] fill-current" />
              </div>
              <span className="text-xs font-medium text-white tracking-wide">Program Prioritas Nasional 2026</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.2] mb-5 drop-shadow-md">
              Sistem Digitalisasi Supply Chain
              <span className="text-accent-500 block mt-2 text-3xl md:text-4xl lg:text-5xl">Kabupaten Lebak</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto font-normal">
              Sistem ekosistem rantai pasok terintegrasi untuk memperkuat <span className="text-accent-500 font-semibold">Ketahanan Pangan Lokal</span> melalui pendataan serapan gabah petani, penggilingan, dan distribusi komoditas hilir ke Dapur SPPG.
            </p>

            <form action="/sppg" method="GET" className="w-full max-w-2xl bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 flex shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-10 transition-all focus-within:bg-white/15 focus-within:border-white/30">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-6 h-6 text-white/60" />
                <input 
                  type="text" 
                  name="q" 
                  placeholder="Cari Katalog Pemasok atau Pabrik Penggilingan..." 
                  className="w-full bg-transparent border-none text-white placeholder-white/60 px-4 py-3 focus:outline-none text-lg font-medium" 
                />
              </div>
              <button type="submit" className="bg-accent-500 hover:bg-[#f5b030] text-[#071840] px-8 py-3 rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(232,160,32,0.4)] flex items-center gap-2">
                Cari Data
              </button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#statistik" className="group w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold transition-all backdrop-blur-md shadow-lg flex items-center justify-center gap-3">
                Pantau Distribusi <TrendingUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link href="/rantai-pasok" className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 rounded-xl font-bold transition-all backdrop-blur-md shadow-lg flex items-center justify-center gap-3">
                <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Analitik Rantai Pasok
              </Link>
            </div>
          </div>
        </div>
        
      </section>



      {/* STATISTIK DISTRIBUSI */}
      <section id="statistik" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-accent-500 font-bold uppercase tracking-widest text-sm mb-3 block">Indikator Kinerja</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#071840] mb-6">Capaian Program Real-Time</h2>
            <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          <AnimatedStats stats={stats} supplyChainStats={supplyChainStats} />
        </div>
      </section>

      
      {/* SEKSI PENGGILINGAN */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-accent-500 font-bold uppercase tracking-widest text-sm mb-3 block">Transparansi Rantai Pasok Hulu</span>
            <h2 className="font-heading text-4xl font-extrabold text-[#071840] mb-4 tracking-tight">Data Pre-Market Penggilingan</h2>
            <p className="text-lg text-slate-500 font-medium">Pemantauan volume serapan gabah dari petani lokal ke penggilingan dan distribusi beras ke Dapur SPPG.</p>
          </div>
          <PenggilinganClient 
            gabahData={formattedGabah} 
            distribusiData={formattedDistribusi} 
            macroStats={macroStats} 
            pabrikList={pabriks}
            filterOptions={filterOptions}
            isHomepage={true}
          />
        </div>
      </section>

      {/* SEKSI RANTAI PASOK (PREVIEW) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-3 block">Mitra Pemasok & Komoditas</span>
            <h2 className="font-heading text-4xl font-extrabold text-[#071840] mb-4 tracking-tight">Live Tracking Rantai Pasok</h2>
            <p className="text-lg text-slate-500 font-medium">Pemantauan distribusi bahan pangan segar secara real-time dari mitra pemasok lokal ke seluruh Dapur SPPG.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-10">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-emerald-500 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pemasok Aktif</div>
                <div className="text-2xl font-black text-slate-800">{rpStats.pemasok} <span className="text-sm font-medium text-slate-500">Mitra</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-blue-500 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Package size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Komoditas Tersuplai</div>
                <div className="text-2xl font-black text-slate-800">{rpStats.komoditas} <span className="text-sm font-medium text-slate-500">Jenis</span></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 border-t-4 border-t-amber-500 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Aktivitas Transaksi</div>
                <div className="text-2xl font-black text-slate-800">{rpStats.transaksi.toLocaleString('id-ID')} <span className="text-sm font-medium text-slate-500">Data</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-10">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={18} className="text-emerald-600" /> Cuplikan Feed Pembelian Terbaru</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-white text-slate-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Komoditas</th>
                    <th className="px-6 py-4 text-right">Volume</th>
                    <th className="px-6 py-4">Tujuan SPPG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {rpFeed.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-semibold text-slate-500">{new Date(d.tanggal_pembelian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{d.nama_bahan}</td>
                      <td className="px-6 py-4 text-right"><span className="font-black text-slate-800">{parseFloat(d.volume as string).toLocaleString('id-ID')}</span> <span className="text-xs text-slate-500">{d.satuan}</span></td>
                      <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200"><Factory size={12} className="text-slate-400" /> {d.nama_sppg}</span></td>
                    </tr>
                  ))}
                  {rpFeed.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-400 text-sm font-medium">Belum ada transaksi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <a href="/rantai-pasok" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(5,150,105,0.2)] transition-all hover:-translate-y-1">
              Selengkapnya Buka Analitik Rantai Pasok <Truck size={20} />
            </a>
          </div>
        </div>
      </section>

      

    </div>
  );
}
