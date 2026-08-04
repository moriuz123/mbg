'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, Utensils, ShieldCheck, MapPin, CheckCircle2, 
  ChevronRight, Phone, Mail, Clock, Activity, Users, Home as HomeIcon, 
  Search, Facebook, Twitter, Instagram, Youtube, MessageSquare, Truck, Package 
} from 'lucide-react';
import Link from 'next/link';

function Public() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        backgroundColor: '#0d160f',
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(48, 109, 41, 0.5) 0%, transparent 70%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-2v4h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        color: '#ffffff',
        padding: '10rem 1rem 8rem 1rem',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', color: '#ffffff', backdropFilter: 'blur(10px)' }}>
          <span style={{ width: '8px', height: '8px', backgroundColor: '#4c8538', borderRadius: '50%', boxShadow: '0 0 10px #4c8538' }}></span>
          Program Prioritas Nasional Pemerintah Indonesia
        </div>
        
        <h1 className="hero-title" style={{ 
          fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem', letterSpacing: '-0.02em', 
          background: 'linear-gradient(to right, #fde047, #ffffff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', maxWidth: '800px'
        }}>
          Makan Bergizi Gratis
        </h1>
        
        <p className="hero-subtitle" style={{ fontSize: '1.125rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '600px' }}>
          Pantau distribusi logistik dan makanan bergizi gratis secara real-time dari Dapur Satelit (SPPG) ke seluruh sekolah di wilayah Kabupaten Lebak.
        </p>

        <Link href="#statistik" style={{
          padding: '1rem 2rem', backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '1rem',
          fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', transition: 'transform 0.2s'
        }}>
          Lihat Distribusi <ArrowRight size={18} />
        </Link>
      </section>

      {/* STATISTIK DISTRIBUSI */}
      <section id="statistik" style={{ padding: '6rem 1rem', backgroundColor: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Statistik Distribusi Real-time</h2>
            <p style={{ color: '#64748b' }}>Pembaruan terakhir: Hari ini, 08:30 WIB</p>
          </div>

          <div className="card glass-panel" style={{ padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(48,109,41,0.2)', backgroundColor: '#ffffff', boxShadow: '0 16px 40px rgba(15,23,42,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
              
              <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>32.1K</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Penerima Manfaat</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1rem', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#fbf5dd', color: '#306d29', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <HomeIcon size={24} />
                </div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>14</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Titik Dapur SPPG</p>
              </div>

              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', color: '#1d4ed8', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <ShieldCheck size={24} />
                </div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>100%</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.875rem', textTransform: 'uppercase' }}>Keamanan Pangan Uji Rapid</p>
              </div>

            </div>

            <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>Realisasi Pengiriman Hari Ini</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>71%</span>
              </div>
              <div style={{ height: '12px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '71%', height: '100%', backgroundColor: '#22c55e', borderRadius: '9999px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Public;
