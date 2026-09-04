import React from 'react';
import { 
  ArrowRight, Utensils, ShieldCheck, MapPin, CheckCircle2, 
  ChevronRight, Phone, Mail, Clock, Activity, Users, Home as HomeIcon, 
  Search, Facebook, Twitter, Instagram, Youtube, MessageSquare, Truck, Package, HeartPulse, Leaf, BarChart2, Star, TrendingUp, Info, Bell 
} from 'lucide-react';
import Link from 'next/link';
import { getPublicStats, getPublicLaporanHarian } from '@/app/actions/publicStats';
import { getSiteSettings, getPengumumanAktif } from '@/app/actions/frontend';
import LaporanHarianClient from '@/components/LaporanHarianClient';
import AnimatedStats from '@/components/AnimatedStats';
import PengumumanBadgeClient from '@/components/PengumumanBadgeClient';

export const dynamic = 'force-dynamic';

export default async function Public({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const dateStr = Array.isArray(searchParams?.date) ? searchParams.date[0] : searchParams?.date;
  
  const stats = await getPublicStats();
  const laporanHarian = await getPublicLaporanHarian(dateStr);
  const settings = await getSiteSettings();
  const pengumumanList = await getPengumumanAktif();
  
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
              Sistem informasi terpadu yang memantau kualitas gizi, rantai pasok lokal, dan distribusi real-time dari <span className="text-accent-500 font-semibold">Dapur SPPG</span> ke seluruh pelosok sekolah.
            </p>

            <form action="/sppg" method="GET" className="w-full max-w-2xl bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20 flex shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-10 transition-all focus-within:bg-white/15 focus-within:border-white/30">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-6 h-6 text-white/60" />
                <input 
                  type="text" 
                  name="q" 
                  placeholder="Cari direktori SPPG atau Posyandu..." 
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
              <Link href="/katalog-komoditas" className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 rounded-xl font-bold transition-all backdrop-blur-md shadow-lg flex items-center justify-center gap-3">
                <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Katalog Komoditas
              </Link>
            </div>
          </div>
        </div>
        
      </section>

      {/* QUICK ACCESS BADGES */}
      <section className="py-16 bg-white relative z-20 border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* CTA Tentang */}
            <div className="group flex flex-col items-center text-center justify-between p-8 aspect-square rounded-2xl bg-gradient-to-b from-indigo-50/50 to-white border border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
              <div className="w-20 h-20 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 mb-6 shrink-0">
                <Info size={36} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col flex-1 justify-center mb-6">
                <h3 className="font-heading font-extrabold text-slate-800 text-2xl mb-3 group-hover:text-indigo-700 transition-colors">Tentang Program</h3>
                <p className="text-slate-500 text-base font-medium leading-relaxed">Pelajari lebih dalam mengenai landasan, visi, dan misi utama MBG di Kabupaten Lebak.</p>
              </div>
              <Link href="/tentang" className="w-full py-4 rounded-xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-colors">
                Pelajari Lebih Lanjut
              </Link>
            </div>

            {/* CTA Aduan */}
            <div className="group flex flex-col items-center text-center justify-between p-8 aspect-square rounded-2xl bg-gradient-to-b from-rose-50/50 to-white border border-rose-100 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 transition-all duration-500">
              <div className="w-20 h-20 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 mb-6 shrink-0">
                <MessageSquare size={36} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col flex-1 justify-center mb-6">
                <h3 className="font-heading font-extrabold text-slate-800 text-2xl mb-3 group-hover:text-rose-700 transition-colors">Layanan Aduan</h3>
                <p className="text-slate-500 text-base font-medium leading-relaxed">Sampaikan keluhan atau masukan Anda terkait pelaksanaan program di lapangan.</p>
              </div>
              <Link href="/pengaduan" className="w-full py-4 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-600 hover:text-white transition-colors">
                Buat Laporan
              </Link>
            </div>

            {/* CTA Pengumuman */}
            <PengumumanBadgeClient pengumuman={pengumumanList && pengumumanList.length > 0 ? pengumumanList[0] : null} />

          </div>
        </div>
      </section>

      {/* STATISTIK DISTRIBUSI */}
      <section id="statistik" className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-[90rem] relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-accent-500 font-bold uppercase tracking-widest text-sm mb-3 block">Indikator Kinerja</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-[#071840] mb-6">Capaian Program Real-Time</h2>
            <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
          </div>
          <AnimatedStats stats={stats} />
        </div>
      </section>

      {/* LAPORAN HARIAN */}
      <section id="laporan-harian" className="py-32 bg-[#f8fafc] border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-accent-500 font-bold uppercase tracking-widest text-sm mb-3 block">Transparansi Logistik</span>
              <h2 className="font-heading text-4xl font-extrabold text-[#071840] mb-4 tracking-tight">Data Distribusi Harian</h2>
              <p className="text-lg text-slate-500 font-medium">
                Sistem pencatatan elektronik memvalidasi setiap titik pengiriman antara Dapur Satelit (SPPG) dan unit sekolah / posyandu.
              </p>
            </div>

          </div>

          <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <LaporanHarianClient data={laporanHarian} />
          </div>
        </div>
      </section>

    </div>
  );
}
