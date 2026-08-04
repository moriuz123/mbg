'use client';

import React from 'react';

export default function TentangPage() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', flex: 1 }}>
      {/* Header Spacer for fixed navbar */}
      <div style={{ height: '80px' }}></div>
      
      <section style={{ padding: '6rem 1rem', backgroundColor: '#ffffff', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '2rem' }}>
            Badan Gizi Nasional
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '2rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Program Makan Bergizi Gratis
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            Program Makan Bergizi Gratis (MBG) adalah program prioritas nasional Pemerintah Indonesia untuk memastikan anak-anak mendapat nutrisi berkualitas. Melalui kolaborasi antara Badan Gizi Nasional dan Pemerintah Kabupaten Lebak, program ini diwujudkan dengan pengawasan ketat dari Hulu ke Hilir demi mencetak generasi bangsa yang kuat dan cerdas.
          </p>
          <div style={{ padding: '2rem', backgroundColor: '#fbf5dd', borderRadius: '1.5rem', border: '1px solid rgba(48,109,41,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontStyle: 'italic' }}>
              "Kita tidak boleh membiarkan satu anak pun tertinggal. Gizi yang baik hari ini adalah investasi mutlak untuk masa depan kejayaan bangsa Indonesia."
            </h3>
            <div style={{ fontWeight: 700, color: '#306d29' }}>Prabowo Subianto</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Presiden Republik Indonesia</div>
          </div>
        </div>
      </section>
    </div>
  );
}
