'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn } from 'lucide-react';

export default function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPath = pathname === '/login';

  if (isLoginPath) return null;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'center', padding: '1rem',
      pointerEvents: 'none'
    }}>
      <div style={{
        pointerEvents: 'auto',
        display: 'flex', alignItems: 'center', gap: '2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '0.75rem 1.5rem',
        borderRadius: '1.5rem',
        boxShadow: '0 4px 24px rgba(15,23,42,0.04), inset 1px 1px 1px rgba(255,255,255,1)',
        border: '1px solid rgba(0,0,0,0.05)',
        width: 'fit-content',
        maxWidth: '100%',
        position: 'relative'
      }} className="mobile-w-full">
        
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <img src="/LOGO-LEBAK.png" alt="Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9375rem' }}>MBG Kab. Lebak</span>
        </Link>
        
        <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }} className="mobile-menu-btn-container">
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'none' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ color: '#225e1e', fontWeight: 600, fontSize: '0.875rem' }}>Beranda</Link>
          <Link href="/sekolah" style={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }} className="hover-text-primary">Sekolah</Link>
          <Link href="/sppg" style={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }} className="hover-text-primary">SPPG</Link>
          <Link href="/rantai-pasok" style={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }} className="hover-text-primary">Rantai Pasok</Link>
          <Link href="/tentang" style={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }} className="hover-text-primary">Tentang</Link>
          <Link href="#kontak" style={{ color: '#475569', fontWeight: 500, fontSize: '0.875rem' }} className="hover-text-primary">Kontak</Link>
        </nav>

        <Link href="/login" className="hide-on-mobile" style={{
          backgroundColor: '#306d29', color: '#ffffff',
          padding: '0.5rem 1rem', borderRadius: '0.75rem',
          fontWeight: 600, fontSize: '0.8125rem', textDecoration: 'none',
          transition: 'background 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
        }}>
          Masuk
        </Link>

        {isMobileMenuOpen && (
          <div style={{ position: 'absolute', top: '100%', left: '0', right: '0', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginTop: '0.5rem', pointerEvents: 'auto' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0f172a', fontWeight: 600, textDecoration: 'none' }}>Beranda</Link>
              <Link href="/sekolah" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', fontWeight: 500, textDecoration: 'none' }}>Sekolah</Link>
              <Link href="/sppg" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', fontWeight: 500, textDecoration: 'none' }}>Data SPPG</Link>
              <Link href="/rantai-pasok" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', fontWeight: 500, textDecoration: 'none' }}>Rantai Pasok</Link>
              <Link href="/tentang" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#475569', fontWeight: 500, textDecoration: 'none' }}>Tentang</Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#306d29', fontWeight: 600, textDecoration: 'none', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>Login Portal Admin</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
