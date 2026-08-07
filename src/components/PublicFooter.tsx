'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PublicFooter() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname?.startsWith('/admin')) return null;

  return (
    <footer className="w-full bg-[#071840] text-white pt-16 pb-10 border-t-[6px] border-accent-500 relative overflow-hidden mt-auto">
      
      {/* SPBE Style Background Pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,0.03) 40px,rgba(255,255,255,0.03) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,0.03) 40px,rgba(255,255,255,0.03) 41px)'
      }}></div>
      
      {/* Decorative Glow */}
      <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -left-40 top-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Container to restrict content width */}
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        
        {/* Strictly 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 mb-16">
          
          {/* Column 1: Brand & Description */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-lg">
                <img src="/LOGO-LEBAK.png" alt="Lebak Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-white text-xl tracking-wide">
                  MBG Lebak
                </span>
                <span className="text-xs text-accent-500 font-semibold uppercase tracking-widest mt-0.5">
                  Pemerintah Kabupaten Lebak
                </span>
              </div>
            </div>
            
            <p className="text-white/80 leading-relaxed font-medium mb-8">
              Sistem informasi dan pengawasan distribusi program Makan Bergizi Gratis (MBG) di Kabupaten Lebak, bermitra dengan Badan Gizi Nasional untuk mewujudkan generasi yang sehat dan cerdas.
            </p>
            
            <div className="flex items-center gap-3">
              <a href="https://lebakkab.go.id" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center border border-white/20 text-white group">
                <Globe size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-500 block"></span> Tautan Cepat
            </h4>
            <ul className="flex flex-col gap-4 font-medium">
              <li>
                <Link href="/" className="text-white/70 hover:text-accent-500 transition-colors flex items-center gap-2 group w-max">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent-500" /> Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-white/70 hover:text-accent-500 transition-colors flex items-center gap-2 group w-max">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent-500" /> Tentang Program
                </Link>
              </li>
              <li>
                <Link href="/sppg" className="text-white/70 hover:text-accent-500 transition-colors flex items-center gap-2 group w-max">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent-500" /> Direktori SPPG
                </Link>
              </li>
              <li>
                <Link href="/rantai-pasok" className="text-white/70 hover:text-accent-500 transition-colors flex items-center gap-2 group w-max">
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent-500" /> Rantai Pasok Lokal
                </Link>
              </li>

            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-500 block"></span> Pusat Bantuan
            </h4>
            <ul className="flex flex-col gap-4 text-white/80 font-medium">
              <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <MapPin size={22} className="text-accent-500 shrink-0 mt-0.5" /> 
                <span className="leading-relaxed text-sm">
                  Pusat Pemerintahan Kabupaten Lebak<br />
                  Jl. Alun-Alun Rangkasbitung No.1
                </span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <Phone size={20} className="text-accent-500 shrink-0" /> 
                <span className="text-sm">(0252) 1234567</span>
              </li>
              <li className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
                <Mail size={20} className="text-accent-500 shrink-0" /> 
                <span className="text-sm">lapor@mbg.lebak.go.id</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50 font-medium">
          <p>&copy; 2026 Pemerintah Kabupaten Lebak. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
