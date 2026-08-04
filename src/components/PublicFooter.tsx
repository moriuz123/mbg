'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function PublicFooter() {
  const pathname = usePathname();
  if (pathname === '/login' || pathname.startsWith('/admin')) return null;

  return (
    <footer id="kontak" style={{ backgroundColor: '#f8fafc', padding: '4rem 1rem 2rem 1rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <img src="/LOGO-LEBAK.png" alt="Lebak" style={{ height: '40px' }} />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>MBG Lebak</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Pemerintah Kabupaten Lebak</span>
              </div>
            </div>
            <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Sistem informasi dan pengawasan distribusi program Makan Bergizi Gratis (MBG) di Kabupaten Lebak, bermitra dengan Badan Gizi Nasional.
            </p>
          </div>
          
          <div>
            <h4 style={{ color: '#0f172a', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>Tautan Cepat</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link href="/" style={{ color: '#475569', textDecoration: 'none' }}>Beranda</Link></li>
              <li><Link href="/sppg" style={{ color: '#475569', textDecoration: 'none' }}>Data SPPG</Link></li>
              <li><Link href="/rantai-pasok" style={{ color: '#475569', textDecoration: 'none' }}>Rantai Pasok</Link></li>
              <li><Link href="/login" style={{ color: '#306d29', fontWeight: 600, textDecoration: 'none' }}>Portal Login Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#0f172a', fontSize: '0.9375rem', fontWeight: 700, marginBottom: '1.25rem' }}>Kontak</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#475569' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} color="#306d29" /> Alun-Alun Rangkasbitung</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} color="#306d29" /> (0252) 1234567</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} color="#306d29" /> lapor@mbg.lebak.go.id</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#94a3b8' }}>
          &copy; 2026 Pemerintah Kabupaten Lebak. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}
