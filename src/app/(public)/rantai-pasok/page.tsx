'use client';

import React from 'react';
import { Utensils, Truck, Package } from 'lucide-react';
import Link from 'next/link';

export default function RantaiPasokPage() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
      {/* Header Spacer for fixed navbar */}
      <div style={{ height: '80px' }}></div>
      
      <section style={{ padding: '4rem 1rem 6rem 1rem', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Rantai Pasok (Supply Chain)</h2>
            <p style={{ color: '#64748b' }}>Kebutuhan pasokan pangan segar bulanan dari distributor lokal ke setiap SPPG</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fbf5dd', color: '#306d29', borderRadius: '0.75rem' }}><Package size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Pasokan Beras</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>SPPG Pasar Keong</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Pemasok Lokal:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>UD. Wiranata</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Kebutuhan Bulanan:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>2.800 Kg</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '0.75rem' }}><Utensils size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Pasokan Daging Ayam</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>SPPG Pasar Keong</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Pemasok Lokal:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>UD. Wiranata</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748b' }}>Kebutuhan Bulanan:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>2.800 Kg</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <Truck size={24} color="#64748b" />
                </div>
                <Link href="/login" style={{ color: '#306d29', fontWeight: 600, textDecoration: 'none' }}>Lihat Dashboard Rantai Pasok</Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
