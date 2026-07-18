'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Factory, LogIn, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPath = pathname === '/login';

  if (isLoginPath) return null;

  return (
    <header className="public-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', width: '100%', padding: '1rem 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <div className="container flex items-center justify-between public-header-container" style={{ position: 'relative' }}>
        <div className="branding-container flex items-center gap-4">
          <img src="/LOGO-LEBAK.png" alt="Logo Lebak" className="branding-logo" style={{ height: '40px', width: 'auto' }} />
          <div className="hide-on-mobile" style={{ height: '28px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
          <div className="branding-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pemerintah Kabupaten Lebak</p>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2' }}>Portal MBG</h1>
          </div>
        </div>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'none' }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        
        <div className="desktop-nav-wrapper hide-on-mobile" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <nav className="public-nav flex gap-8 items-center">
            <Link href="/" className="nav-link-effect">Beranda</Link>
            <Link href="/#tentang" className="nav-link-effect">Tentang MBG</Link>
            <Link href="/data-penggilingan" className="nav-link-effect">Pre Market</Link>
            <Link href="/data-sppg" className="nav-link-effect">Post Market</Link>
            <Link href="/#pengaduan" className="nav-link-effect">Pengaduan</Link>
          </nav>
        </div>

        <div className="hide-on-mobile">
          <Link href="/login" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)' }}>
            <LogIn size={18} /> Login
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav-dropdown">
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem' }}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
              <Home size={20} color="#3b82f6" /> Beranda
            </Link>
            <Link href="/#tentang" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
              <LayoutDashboard size={20} color="#3b82f6" /> Tentang MBG
            </Link>
            <Link href="/data-penggilingan" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
              <Factory size={20} color="#3b82f6" /> Pre Market
            </Link>
            <Link href="/data-sppg" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
              <LayoutDashboard size={20} color="#3b82f6" /> Post Market
            </Link>
            <Link href="/#pengaduan" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
              <Menu size={20} color="#3b82f6" /> Pengaduan
            </Link>
            
            <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem', borderRadius: '0.75rem' }}>
                <LogIn size={20} /> Login ke Portal Admin
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
