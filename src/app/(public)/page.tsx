import React from 'react';
import { 
  ArrowRight, Utensils, ShieldCheck, MapPin, CheckCircle2, 
  ChevronRight, Phone, Mail, Clock, Activity, Users, Home as HomeIcon, 
  Search, Facebook, Twitter, Instagram, Youtube, MessageSquare, Truck, Package, HeartPulse, Leaf, BarChart2, Star, TrendingUp 
} from 'lucide-react';
import Link from 'next/link';
import { getPublicStats, getPublicLaporanHarian } from '@/app/actions/publicStats';
import { getSiteSettings, getPengumumanAktif } from '@/app/actions/frontend';
import LaporanHarianClient from '@/components/LaporanHarianClient';
import AnimatedStats from '@/components/AnimatedStats';
import PengumumanTicker from '@/components/PengumumanTicker';

export default async function Public() {
  const stats = await getPublicStats();
  const laporanHarian = await getPublicLaporanHarian();
  const settings = await getSiteSettings();
  const pengumumanList = await getPengumumanAktif();
  
  const heroBgImage = settings.hero_bg_image || null;
  const heroStyle = heroBgImage 
    ? { backgroundImage: `linear-gradient(to bottom, rgba(5, 15, 40, 0.98) 0%, rgba(5, 15, 40, 0.96) 100%), url(${heroBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg,#071840_0%,#0a2463_45%,#1e5ca8_100%)' };
  
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-accent-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Pengumuman Ticker */}
      <div className="pt-[104px] lg:pt-[76px] bg-[#071840]">
        <PengumumanTicker pengumumanList={pengumumanList} />
      </div>
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
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              <div className="w-6 h-6 rounded-full bg-accent-500 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-[#071840] fill-current" />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide">Program Prioritas Nasional 2026</span>
            </div>
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
              Makan Bergizi Gratis
              <span className="text-accent-500 block mt-3 text-4xl md:text-5xl lg:text-6xl">Kabupaten Lebak</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
              Sistem informasi terpadu yang memantau kualitas gizi, rantai pasok lokal, dan distribusi real-time dari <span className="text-accent-500 font-bold">Dapur SPPG</span> ke seluruh pelosok sekolah.
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
              <Link href="/rantai-pasok" className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 rounded-xl font-bold transition-all backdrop-blur-md shadow-lg flex items-center justify-center gap-3">
                <Truck className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> Rantai Pasok Lokal
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom wave SVG for smooth transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#f8fafc"></path>
          </svg>
        </div>
      </section>

      {/* TIGA PILAR PROGRAM - Modern Corporate Cards */}
      <section className="py-20 bg-[#f8fafc] relative z-20">
        <div className="container mx-auto px-4 max-w-7xl -mt-32 relative z-30">
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(7,24,64,0.12)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <HeartPulse size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#071840] mb-4">Gizi Optimal & Terukur</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Menu seimbang yang disusun ketat oleh ahli gizi bersertifikat, memastikan asupan protein dan kalori harian tercukupi untuk kecerdasan anak bangsa.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(7,24,64,0.12)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Leaf size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#071840] mb-4">Ekonomi Kerakyatan</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Serapan bahan baku segar 100% diprioritaskan dari petani dan peternak lokal Kabupaten Lebak untuk mendorong perputaran roda ekonomi daerah.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(7,24,64,0.12)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
              <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent-500 group-hover:text-white transition-colors duration-500 shadow-sm">
                <Activity size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-[#071840] mb-4">Pemantauan Presisi</h3>
              <p className="text-slate-500 leading-relaxed font-medium">Platform digital yang merekam setiap langkah logistik, memastikan transparansi dari dapur produksi hingga sampai di atas meja sekolah dan posyandu.</p>
            </div>
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
            <Link href="/login" className="shrink-0 px-6 py-3 bg-white text-primary-600 border border-slate-200 hover:border-primary-300 hover:shadow-md rounded-xl font-bold transition-all flex items-center gap-2">
              Masuk Sistem Admin <ChevronRight size={18} />
            </Link>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <LaporanHarianClient data={laporanHarian} />
          </div>
        </div>
      </section>

    </div>
  );
}
