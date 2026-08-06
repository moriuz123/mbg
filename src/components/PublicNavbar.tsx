'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MapPin, Mail, Globe, LogIn, ChevronDown } from 'lucide-react';

export default function PublicNavbar({ dynamicMenus = [] }: { dynamicMenus?: any[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLoginPath = pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoginPath) return null;

  const defaultNavLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Sekolah', path: '/sekolah' },
    { name: 'Posyandu', path: '/posyandu' },
    { name: 'SPPG', path: '/sppg' },
    { name: 'Rantai Pasok', path: '/rantai-pasok' },
    { name: 'Lapor / Aduan', path: '/pengaduan', className: 'text-red-600 hover:bg-red-50 hover:text-red-700' },
    { name: 'Tentang', path: '/tentang' },
  ];

  const navLinks = dynamicMenus.length > 0 
    ? dynamicMenus.map(m => ({
        name: m.name,
        path: m.url,
        className: m.url === '/pengaduan' ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : ''
      }))
    : defaultNavLinks;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300">
      {/* Top Bar - Hidden on scroll or mobile to save space */}
      <div className={`bg-[#071840] text-white/70 text-[0.8rem] transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100 hidden md:block'}`}>
        <div className="container mx-auto max-w-7xl px-4 h-full flex justify-between items-center">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5"><MapPin size={12} /> Rangkasbitung, Kabupaten Lebak</span>
            <span className="flex items-center gap-1.5"><Mail size={12} /> mbg@lebakkab.go.id</span>
          </div>
          <div className="flex gap-4">
            <a href="https://lebakkab.go.id" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Globe size={12} /> Portal Lebak
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`bg-white transition-all duration-300 ${scrolled ? 'shadow-[0_4px_20px_rgba(10,36,99,0.08)] py-2 border-b-2 border-accent-500' : 'shadow-sm py-3 border-b border-slate-100'}`}>
        <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Lebak Logo */}
            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center p-1 shrink-0">
              <img src="/LOGO-LEBAK.png" alt="Logo Lebak" className="w-full h-full object-contain" />
            </div>
            
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-[#0a2463] text-lg leading-tight group-hover:text-primary-500 transition-colors">
                MBG Lebak
              </span>
              <span className="text-[0.65rem] text-slate-500 font-semibold uppercase tracking-wider hidden sm:block">
                Makan Bergizi Gratis
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  className={`px-4 py-2 rounded-full font-semibold text-[0.875rem] transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#e8f0fb] text-[#1e5ca8]' 
                      : link.className || 'text-[#3a4567] hover:bg-[#e8f0fb] hover:text-[#1e5ca8]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="hidden sm:flex items-center gap-2 bg-accent-500 hover:bg-[#f5b030] text-[#071840] px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_4px_12px_rgba(232,160,32,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(232,160,32,0.3)]"
            >
              <LogIn size={16} /> Masuk Portal
            </Link>
            
            <button 
              className="lg:hidden p-2 text-[#0a2463] bg-slate-50 rounded-lg border border-slate-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen border-t border-slate-100 mt-3' : 'max-h-0'}`}>
          <nav className="flex flex-col px-4 py-4 gap-2 bg-white shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                    isActive 
                      ? 'bg-[#e8f0fb] text-[#1e5ca8]' 
                      : link.className || 'text-[#3a4567] hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="h-px bg-slate-100 my-2"></div>
            
            <Link 
              href="/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex justify-center items-center gap-2 bg-accent-500 text-[#071840] px-4 py-3.5 rounded-xl font-bold text-sm"
            >
              <LogIn size={18} /> Masuk Portal Admin
            </Link>
          </nav>
        </div>
      </header>
    </div>
  );
}
