'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Factory, LayoutDashboard, LogOut, Database, ChevronDown, ChevronRight, Wheat, MapPin, ShoppingCart, Truck, FlaskConical } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(pathname.startsWith('/master-data'));

  return (
    <aside className="admin-sidebar" style={{ width: '280px', flexShrink: 0, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '1.5rem', position: 'fixed', height: '100vh', zIndex: 50, backgroundColor: '#ffffff', boxShadow: '2px 0 10px rgba(0,0,0,0.02)' }}>
      <div className="flex items-center gap-4 mb-10 px-2 mt-2">
        <img src="/LOGO-LEBAK.png" alt="Logo Lebak" style={{ height: '40px', width: 'auto' }} />
        <div style={{ height: '28px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pemerintah Kabupaten Lebak</p>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2' }}>Portal MBG</h1>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem', padding: '0 0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu Utama</div>
        
        <Link href="/admin" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname === '/admin' ? 600 : 500, backgroundColor: pathname === '/admin' ? 'var(--primary-50)' : 'transparent', color: pathname === '/admin' ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <Home size={20} /> Dasbor Utama
        </Link>
        <Link href="/penggilingan" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname === '/penggilingan' ? 600 : 500, backgroundColor: pathname === '/penggilingan' ? 'var(--primary-50)' : 'transparent', color: pathname === '/penggilingan' ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <Factory size={20} /> Penggilingan (Pre)
        </Link>
        <Link href="/sppg" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname === '/sppg' ? 600 : 500, backgroundColor: pathname === '/sppg' ? 'var(--primary-50)' : 'transparent', color: pathname === '/sppg' ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <LayoutDashboard size={20} /> SPPG (Post)
        </Link>
        
        <button 
          onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
          style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontFamily: 'inherit', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', cursor: 'pointer', background: 'none', border: 'none', width: '100%', outline: 'none' }}
          className="hover:bg-slate-50 transition-colors"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Database size={20} /> Master Data
          </div>
          {isMasterDataOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        
        <div style={{ 
          display: isMasterDataOpen ? 'flex' : 'none', 
          flexDirection: 'column', 
          gap: '0.25rem', 
          paddingLeft: '1.5rem', 
          marginTop: '0.25rem' 
        }}>
          <Link href="/master-data/sumber-gabah" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('sumber-gabah') ? 600 : 500, backgroundColor: pathname.includes('sumber-gabah') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('sumber-gabah') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <Wheat size={20} /> Sumber Gabah
          </Link>
          <Link href="/master-data/lokus-sppg" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('lokus-sppg') ? 600 : 500, backgroundColor: pathname.includes('lokus-sppg') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('lokus-sppg') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <MapPin size={20} /> Lokus SPPG
          </Link>
          <Link href="/master-data/jenis-pangan" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('jenis-pangan') ? 600 : 500, backgroundColor: pathname.includes('jenis-pangan') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('jenis-pangan') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <ShoppingCart size={20} /> Jenis Pangan
          </Link>
          <Link href="/master-data/distributor" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('distributor') ? 600 : 500, backgroundColor: pathname.includes('distributor') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('distributor') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <Truck size={20} /> Distributor
          </Link>
          <Link href="/master-data/parameter-uji" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('parameter-uji') ? 600 : 500, backgroundColor: pathname.includes('parameter-uji') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('parameter-uji') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <FlaskConical size={20} /> Parameter Uji
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', color: '#ef4444', backgroundColor: '#fef2f2', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
          <LogOut size={18} /> Keluar Sistem
        </Link>
      </div>
    </aside>
  );
}
