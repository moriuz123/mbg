'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Clock, Mail, Phone, RefreshCw, Lock, ShieldCheck, AlertCircle } from 'lucide-react';

interface MaintenanceViewProps {
  settings?: Record<string, string>;
}

export default function MaintenanceView({ settings = {} }: MaintenanceViewProps) {
  const siteName = settings.site_name || 'MBG Kab. Lebak';
  const logoUrl = settings.logo || '/LOGO-LEBAK.png';
  const title = settings.maintenance_title || 'Sistem Sedang Dalam Pemeliharaan Berkala';
  const message = settings.maintenance_message || 'Kami sedang melakukan pemeliharaan infrastruktur dan optimalisasi sistem Makan Bergizi Gratis (MBG) Kabupaten Lebak. Layanan publik akan segera aktif kembali.';
  const endTime = settings.maintenance_end_time || null;
  const contact = settings.maintenance_contact || settings.email || 'mbg@lebakkab.go.id';
  const phone = settings.phone || '(0252) 201113';

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#071840] to-slate-950 text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-accent-500 selection:text-white">
      {/* Decorative Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-600/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* TOP HEADER */}
      <header className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain drop-shadow" />
          <div>
            <h1 className="font-extrabold text-base sm:text-lg tracking-tight leading-tight">{siteName}</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">Pemerintah Kabupaten Lebak</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>Status: Pemeliharaan Sistem</span>
        </div>
      </header>

      {/* MAIN CONTENT HERO */}
      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col items-center justify-center text-center max-w-3xl">
        {/* Animated Badge Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400/20 to-primary-600/30 border border-amber-400/30 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-amber-500/20">
            <Wrench className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg">
            <Clock size={18} className="text-primary-400" />
          </div>
        </div>

        {/* Title & Message */}
        <span className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 text-amber-400 mb-4">
          Pemberitahuan Resmi Pemeliharaan
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
          {title}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
          {message}
        </p>

        {/* Information Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10 text-left">
          {/* Card 1: Estimasi Waktu */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimasi Selesai</h3>
            </div>
            <p className="font-bold text-slate-100 text-sm">
              {endTime ? endTime : 'Sedang dalam pengerjaan optimal'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Layanan publik akan aktif kembali secara otomatis.</p>
          </div>

          {/* Card 2: Keamanan Operasional */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Operasional</h3>
            </div>
            <p className="font-bold text-slate-100 text-sm">Distribusi & Rekap Tetap Terjaga</p>
            <p className="text-[11px] text-slate-400 mt-1">Seluruh data gizi, sekolah, dan SPPG tersimpan aman.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw size={16} /> Muat Ulang Halaman
          </button>
          
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Lock size={16} className="text-amber-400" /> Masuk Petugas / Admin
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 container mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <p>© {new Date().getFullYear()} Pemerintah Kabupaten Lebak. Sistem Digitalisasi Supply Chain MBG.</p>
        <div className="flex items-center gap-4">
          {contact && (
            <span className="flex items-center gap-1.5 hover:text-slate-200">
              <Mail size={13} className="text-slate-500" /> {contact}
            </span>
          )}
          {phone && (
            <span className="hidden md:flex items-center gap-1.5 hover:text-slate-200">
              <Phone size={13} className="text-slate-500" /> {phone}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
