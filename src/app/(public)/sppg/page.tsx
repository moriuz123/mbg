'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SppgPage() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
      {/* Header Spacer for fixed navbar */}
      <div style={{ height: '80px' }}></div>
      
      <section style={{ padding: '4rem 1rem', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 80px)' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Titik Layanan (SPPG)</h2>
            <p style={{ color: '#64748b' }}>Data lokasi Satuan Pelayanan Pemenuhan Gizi di wilayah Kabupaten Lebak</p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '1.5rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={20} color="#306d29" /> Direktori Dapur SPPG</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', color: '#64748b', fontSize: '0.875rem' }}>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Kode / Nama SPPG</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Wilayah / Desa</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Total Penerima</th>
                    <th style={{ padding: '1rem 1.5rem', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Status</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.9375rem' }}>
                  <tr style={{ transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Lebak Rangkasbitung 1</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>VYHRF3PX • Generasi Petarung</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>Muara Ciujung Barat</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569', fontWeight: 600 }}>2.525 Jiwa</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Operasional</span>
                    </td>
                  </tr>
                  <tr style={{ transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Lebak Cibadak Pasar Keong</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>OCGSTA4B • Hamim Center</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>Pasar Keong</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569', fontWeight: 600 }}>3.360 Jiwa</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Operasional</span>
                    </td>
                  </tr>
                  <tr style={{ transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>Lebak Cihara 1</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>GFT3ISE0 • Yayasan Al-Ahkam</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>Cihara</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', color: '#475569', fontWeight: 600 }}>3.612 Jiwa</td>
                    <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#fef08a', color: '#854d0e', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>Persiapan</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
