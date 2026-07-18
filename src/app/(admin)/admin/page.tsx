import React from 'react';
import { ArrowRight, Utensils, Factory, LayoutDashboard, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';

function Home() {
  return (
    <div className="animate-fade-in">
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <LayoutDashboard size={32} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Pusat Kendali Pengawasan MBG</h1>
        <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Pantau seluruh rantai pasok Program Makan Bergizi Gratis di Kabupaten Lebak mulai dari hulu (Penggilingan Gabah) hingga hilir (Dapur SPPG Tersertifikasi).
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/penggilingan" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Factory size={18} /> Pantau Pre-Market
          </Link>
          <Link href="/sppg" className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155' }}>
            <Utensils size={18} /> Pantau Post-Market
          </Link>
        </div>
      </div>

      <div className="grid gap-6 mb-8 stagger-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Factory size={32} />
          </div>
          <div className="text-3xl font-bold">15</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ letterSpacing: '0.05em' }}>Penggilingan Aktif</div>
        </div>
        
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Utensils size={32} />
          </div>
          <div className="text-3xl font-bold">42</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ letterSpacing: '0.05em' }}>Dapur SPPG</div>
        </div>
        
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <TrendingUp size={32} />
          </div>
          <div className="text-3xl font-bold">12.5k</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ letterSpacing: '0.05em' }}>Volume Beras (Kg)</div>
        </div>
        
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#fef3c7', color: '#b45309', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Activity size={32} />
          </div>
          <div className="text-3xl font-bold">98%</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ letterSpacing: '0.05em' }}>Tingkat Keamanan</div>
        </div>
      </div>

      <div className="grid gap-6 stagger-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>SOP & Panduan</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>Langkah Uji Rapid Test Daging Ayam</li>
            <li style={{ paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>Standar Mutu Beras Penggilingan</li>
            <li style={{ color: '#334155' }}>Panduan Penerimaan Barang SPPG</li>
          </ul>
        </div>
        
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>Peringatan Sistem</h3>
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
            <strong>Info:</strong> Inspeksi mendadak akan dilakukan pada SPPG Rangkasbitung tanggal 15 Agustus 2026. Harap pastikan keakuratan input data rapid test harian.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
