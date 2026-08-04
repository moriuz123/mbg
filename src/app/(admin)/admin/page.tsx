import React from 'react';
import { ArrowRight, Utensils, LayoutDashboard, TrendingUp, Activity, Package } from 'lucide-react';
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
          Pantau seluruh data SPPG dan Rantai Pasok Program Makan Bergizi Gratis di Kabupaten Lebak secara real-time.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/admin/sppg" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#306d29', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
            <Utensils size={18} /> Pantau Data SPPG
          </Link>
          <Link href="/admin/supply-chain" className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#334155', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
            <Package size={18} /> Pantau Rantai Pasok
          </Link>
        </div>
      </div>

      <div className="grid gap-6 mb-8 stagger-1" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', display: 'grid' }}>
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Utensils size={32} />
          </div>
          <div className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>42</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ fontSize: '0.875rem', color: '#64748b', letterSpacing: '0.05em' }}>Dapur SPPG</div>
        </div>
        
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <TrendingUp size={32} />
          </div>
          <div className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>32.1k</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ fontSize: '0.875rem', color: '#64748b', letterSpacing: '0.05em' }}>Penerima Manfaat</div>
        </div>
        
        <div className="card glass-panel flex justify-center text-center items-center gap-2" style={{ flexDirection: 'column', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1rem', background: '#fef3c7', color: '#b45309', borderRadius: '50%', marginBottom: '0.5rem' }}>
            <Activity size={32} />
          </div>
          <div className="text-3xl font-bold" style={{ fontSize: '1.875rem', fontWeight: 700 }}>100%</div>
          <div className="text-sm font-medium text-muted uppercase" style={{ fontSize: '0.875rem', color: '#64748b', letterSpacing: '0.05em' }}>Tingkat Keamanan</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
