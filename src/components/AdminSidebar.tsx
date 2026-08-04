'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Factory, LayoutDashboard, LogOut, Database, ChevronDown, ChevronRight, MapPin, ShoppingCart, Truck, Package, Activity, Utensils, GraduationCap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButtonSidebar } from './LogoutButton';

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
        <Link href="/admin/sppg" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/sppg') ? 600 : 500, backgroundColor: pathname.includes('/admin/sppg') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/sppg') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <LayoutDashboard size={20} /> Data SPPG
        </Link>
        <Link href="/admin/sekolah" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/sekolah') ? 600 : 500, backgroundColor: pathname.includes('/admin/sekolah') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/sekolah') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <GraduationCap size={20} /> Data Sekolah
        </Link>
        <Link href="/admin/penggilingan" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/penggilingan') ? 600 : 500, backgroundColor: pathname.includes('/admin/penggilingan') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/penggilingan') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <Factory size={20} /> Penggilingan Gabah
        </Link>
        <Link href="/admin/supply-chain" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/supply-chain') ? 600 : 500, backgroundColor: pathname.includes('/admin/supply-chain') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/supply-chain') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <Package size={20} /> Rantai Pasok
        </Link>
        <Link href="/admin/manajemen-menu" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/manajemen-menu') ? 600 : 500, backgroundColor: pathname.includes('/admin/manajemen-menu') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/manajemen-menu') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <LayoutDashboard size={20} /> Manajemen Menu
        </Link>
        <Link href="/admin/rapid-test" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: pathname.includes('/admin/rapid-test') ? 600 : 500, backgroundColor: pathname.includes('/admin/rapid-test') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('/admin/rapid-test') ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' }}>
          <Activity size={20} /> Uji Rapid Test
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
          <Link href="/admin/master-data/jenis-pangan" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('jenis-pangan') ? 600 : 500, backgroundColor: pathname.includes('jenis-pangan') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('jenis-pangan') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <ShoppingCart size={20} /> Jenis Pangan
          </Link>
          <Link href="/admin/master-data/distributor" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('distributor') ? 600 : 500, backgroundColor: pathname.includes('distributor') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('distributor') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <Truck size={20} /> Distributor
          </Link>
          <Link href="/admin/master-data/pemasok" className={`flex items-center gap-3`} style={{ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: pathname.includes('pemasok') ? 600 : 500, backgroundColor: pathname.includes('pemasok') ? 'var(--primary-50)' : 'transparent', color: pathname.includes('pemasok') ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' }}>
            <Truck size={20} /> Pemasok
          </Link>
        </div>
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <LogoutButtonSidebar />
      </div>
    </aside>
  );
}
