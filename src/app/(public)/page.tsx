'use client';

import React, { useState } from 'react';
import { ArrowRight, Utensils, ShieldCheck, MapPin, CheckCircle2, ChevronRight, Phone, Mail, Clock, Activity, Users, Home as HomeIcon, Search, Facebook, Twitter, Instagram, Youtube, MessageSquare } from 'lucide-react';
import Link from 'next/link';

function Public() {
  const [formPengaduan, setFormPengaduan] = useState({ nama: '', lokasi: '', kategori: 'Kualitas Makanan', pesan: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Floating Polling Drawer State
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [pollSubmitted, setPollSubmitted] = useState(false);

  const handlePengaduanSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormPengaduan({ nama: '', lokasi: '', kategori: 'Kualitas Makanan', pesan: '' });
    }, 5000);
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* HERO SECTION - BOLD & GLOWING */}
      <section style={{ 
        position: 'relative', 
        backgroundColor: '#0d160f',
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(48, 109, 41, 0.5) 0%, transparent 70%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        color: '#ffffff',
        padding: '8rem 0 12rem 0',
        overflow: 'hidden',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center'
      }}>
        
        {/* Floating Social Media (Left) */}
        <div className="hide-on-mobile" style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 30 }}>
          <a href="#" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.75rem', borderRadius: '50%', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.2)' }} className="hover-bg-blue">
            <Facebook size={20} />
          </a>
          <a href="#" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.75rem', borderRadius: '50%', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.2)' }} className="hover-bg-blue">
            <Twitter size={20} />
          </a>
          <a href="#" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.75rem', borderRadius: '50%', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.2)' }} className="hover-bg-blue">
            <Instagram size={20} />
          </a>
          <a href="#" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff', padding: '0.75rem', borderRadius: '50%', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', border: '1px solid rgba(255,255,255,0.2)' }} className="hover-bg-blue">
            <Youtube size={20} />
          </a>
        </div>

        {/* Floating Drawer Poll (Right) */}
        <div style={{ position: 'absolute', right: isPollOpen ? '0' : 'calc(-1 * min(320px, 85vw))', top: '50%', transform: 'translateY(-50%)', width: 'min(320px, 85vw)', backgroundColor: '#ffffff', borderRadius: '1rem 0 0 1rem', padding: '1.5rem', boxShadow: '-10px 0 25px rgba(0,0,0,0.5)', transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 40, border: '1px solid #e2e8f0', borderRight: 'none' }}>
          
          <button 
            onClick={() => setIsPollOpen(!isPollOpen)}
            style={{ position: 'absolute', left: '-48px', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#306d29', color: '#ffffff', border: 'none', padding: '1rem 0.5rem', borderRadius: '0.5rem 0 0 0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', boxShadow: '-4px 0 10px rgba(0,0,0,0.2)' }}
          >
            <MessageSquare size={20} />
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.75rem' }}>POLLING</span>
          </button>

          <div style={{ color: '#0f172a' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '0.5rem' }}>Suara Publik</h3>
            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5, fontWeight: 600 }}>
              "Bagaimana Menu MBG Hari Ini di tempat anda?"
            </p>
            
            {!pollSubmitted ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button onClick={() => setPollSubmitted(true)} className="poll-btn" style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Memuaskan <ChevronRight size={16} color="#94a3b8" />
                </button>
                <button onClick={() => setPollSubmitted(true)} className="poll-btn" style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Baik <ChevronRight size={16} color="#94a3b8" />
                </button>
                <button onClick={() => setPollSubmitted(true)} className="poll-btn" style={{ padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.5rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Sangat Mengecewakan <ChevronRight size={16} color="#94a3b8" />
                </button>
              </div>
            ) : (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ color: '#166534', fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>Terima kasih atas partisipasi Anda!</p>
                <p style={{ color: '#15803d', fontSize: '0.75rem', marginTop: '0.25rem' }}>Suara Anda membantu evaluasi kami.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
          <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', margin: '0 auto 2.5rem auto', color: '#ffffff', backdropFilter: 'blur(10px)' }}>
            <span style={{ width: '8px', height: '8px', backgroundColor: '#4c8538', borderRadius: '50%', boxShadow: '0 0 10px #4c8538' }}></span>
            Portal Resmi Pemerintahan Lebak
          </div>
          
          <h1 className="hero-title" style={{ 
            fontSize: '4.5rem', 
            fontWeight: 900, 
            lineHeight: 1.2, 
            marginBottom: '1.5rem', 
            letterSpacing: '-0.03em', 
            background: 'linear-gradient(to right, #fde047, #ffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.8))'
          }}>
            Makan Bergizi Gratis
          </h1>
          
          <p className="hero-subtitle" style={{ fontSize: '1.25rem', color: '#e2e8f0', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto 3rem auto', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Transparansi rantai pasok dari petani lokal hingga meja sekolah. Menjamin mutu pangan terbaik demi mencetak generasi emas Kabupaten Lebak.
          </p>
          
          <div className="hero-cta" style={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '650px', margin: '0 auto' }}>
            <form style={{ display: 'flex', width: '100%', position: 'relative' }} onSubmit={(e) => e.preventDefault()}>
              <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 10 }}>
                <Search size={22} />
              </div>
              <input 
                type="text" 
                placeholder="Cari data penggilingan, sebaran sekolah, pengaduan..." 
                style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 4rem', borderRadius: '9999px', border: '2px solid rgba(255,255,255,0.8)', fontSize: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', outline: 'none', backgroundColor: '#ffffff', color: '#0f172a', transition: 'border-color 0.3s' }}
              />
              <button type="submit" style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', padding: '0.875rem 2.25rem', backgroundColor: '#306d29', color: '#ffffff', borderRadius: '9999px', border: 'none', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 10px rgba(48,109,41,0.4)' }}>
                Telusuri
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FLOATING STATS */}
      <section className="stats-section" style={{ marginTop: '-4rem', position: 'relative', zIndex: 20, marginBottom: '6rem' }}>
        <div className="container">
          <div className="stats-bar" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.8)', padding: '1.5rem 2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fbf5dd', color: '#306d29', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(48,109,41,0.1)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #0d530e, #306d29)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>45.2K</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.375rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Siswa Penerima</p>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '60px', backgroundColor: 'rgba(0,0,0,0.08)', display: 'none' }} className="md:block"></div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(22,163,74,0.1)' }}>
                <HomeIcon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #14532d, #22c55e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>124</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.375rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dapur SPPG</p>
              </div>
            </div>

            <div style={{ width: '1px', height: '60px', backgroundColor: 'rgba(0,0,0,0.08)', display: 'none' }} className="md:block"></div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(220,38,38,0.1)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #7f1d1d, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>100%</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.375rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lolos Uji Mutu</p>
              </div>
            </div>
            
            <div style={{ width: '1px', height: '60px', backgroundColor: 'rgba(0,0,0,0.08)', display: 'none' }} className="md:block"></div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#fffbeb', color: '#d97706', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(217,119,6,0.1)' }}>
                <Utensils size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(to right, #b45309, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>100%</h3>
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '0.375rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bahan Lokal</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TENTANG PROGRAM SECTION */}
      <section id="tentang" style={{ padding: '6rem 0 4rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            
            {/* Left Content */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fbf5dd', color: '#306d29', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                <CheckCircle2 size={16} /> Program Prioritas Nasional
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Membangun Generasi Emas Melalui Gizi Seimbang
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                <strong>Makan Bergizi Gratis (MBG)</strong> adalah program unggulan yang diinisiasi oleh <strong>Presiden Republik Indonesia, Bapak Prabowo Subianto</strong>. Program ini bertujuan untuk memastikan setiap anak sekolah di seluruh pelosok negeri mendapatkan asupan gizi yang layak, merata, dan berkualitas tinggi setiap harinya.
              </p>
              <p style={{ fontSize: '1.125rem', color: '#475569', lineHeight: 1.8 }}>
                Pemerintah Kabupaten Lebak berkomitmen penuh mengawal instruksi Presiden ini melalui transparansi rantai pasok. Dari hulu (penggilingan beras lokal) hingga hilir (meja makan siswa), seluruh data dapat dipantau langsung oleh masyarakat.
              </p>
            </div>

            {/* Right Content / Visual */}
            <div style={{ position: 'relative', padding: '1rem' }}>
              <div style={{ position: 'absolute', top: '0', left: '0', right: '2rem', bottom: '2rem', backgroundColor: '#fbf5dd', borderRadius: '1.5rem', zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.5rem', padding: '3rem 2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', marginLeft: '2rem', marginTop: '2rem' }}>
                <div style={{ fontSize: '5rem', color: '#e7e1b1', lineHeight: 0.5, fontFamily: 'serif', position: 'absolute', top: '2.5rem', left: '1.5rem' }}>"</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', lineHeight: 1.4, position: 'relative', zIndex: 11, marginTop: '1.5rem' }}>
                  Kita tidak boleh membiarkan satu anak pun tertinggal. Gizi yang baik hari ini adalah investasi mutlak untuk masa depan kejayaan bangsa Indonesia.
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', position: 'relative', zIndex: 11 }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem' }}>
                    RI
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.125rem' }}>Prabowo Subianto</div>
                    <div style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Presiden Republik Indonesia</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENTO BOX - TRANSPARENCY DASHBOARD */}
      <section id="transparansi" className="bento-section" style={{ padding: '4rem 0 8rem 0' }}>
        <div className="container">
          <div className="bento-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Buku Induk Keterbukaan</h2>
            <p style={{ fontSize: '1.125rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>Seluruh pergerakan logistik pangan diawasi secara digital. Publik memiliki hak penuh untuk memantau.</p>
          </div>

          <div className="bento-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: '1.5rem' }}>
            
            {/* LIVE TRACKER (Spans 2 columns) */}
            <div className="bento-item bento-span-2" style={{ gridColumn: 'span 2', backgroundColor: '#ffffff', borderRadius: '2rem', padding: '3rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50%', right: '-20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(22, 163, 74, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '2.5rem', position: 'relative' }}>Live Tracker Distribusi Hari Ini</h3>
              
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', position: 'relative' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '4rem', fontWeight: 900, color: '#16a34a', lineHeight: 1, letterSpacing: '-0.05em' }}>71%</div>
                  <div style={{ fontSize: '1.125rem', color: '#64748b', fontWeight: 600, marginTop: '0.5rem' }}>Realisasi Porsi (32.150 tersalurkan)</div>
                </div>
                <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
                  <div style={{ height: '16px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '71%', height: '100%', background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)', borderRadius: '9999px' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: 600 }}>Target: 45.200 Porsi</div>
                </div>
              </div>
            </div>

            {/* ACTIVITY LOG (Spans 1 column) */}
            <div style={{ gridColumn: 'span 1', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '2rem', padding: '2.5rem', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>Log Aktivitas Terakhir</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: '#34d399', marginTop: '0.125rem' }}><CheckCircle2 size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Distribusi Selesai</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>SDN 1 Rangkasbitung • 10m lalu</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: '#34d399', marginTop: '0.125rem' }}><CheckCircle2 size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Uji Rapid Negatif (Aman)</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Gudang Penggilingan A • 1j lalu</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: '#34d399', marginTop: '0.125rem' }}><CheckCircle2 size={20} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>Pasokan Ayam Masuk</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>SPPG Cibadak • 3j lalu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PENGGILINGAN BENTO ITEM */}
            <div style={{ gridColumn: 'span 1', backgroundColor: '#ffffff', borderRadius: '2rem', padding: '2rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#fbf5dd', color: '#306d29', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Pre-Market</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Data Penggilingan (Sebagian)</p>
                </div>
              </div>
              <div style={{ flex: 1, overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 600 }}>Sumber</th>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 600, textAlign: 'right' }}>Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>Petani - Rangkasbitung</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>5.000 kg</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>KUD Maju Jaya Lebak</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>3.500 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/data-penggilingan" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '1rem', color: '#0f172a', fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.875rem' }}>Lihat Data Transaksi</span>
                <ChevronRight size={18} color="#94a3b8" />
              </Link>
            </div>

            {/* SPPG BENTO ITEM */}
            <div style={{ gridColumn: 'span 1', backgroundColor: '#ffffff', borderRadius: '2rem', padding: '2rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Utensils size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Post-Market</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Data SPPG (Sebagian)</p>
                </div>
              </div>
              <div style={{ flex: 1, overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 600 }}>Jenis Pangan</th>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 600, textAlign: 'right' }}>Pakai</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>Beras Premium</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>2.800 kg</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>Daging Ayam</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>500 kg</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600, color: '#0f172a' }}>Sayur Mayur</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#16a34a', fontWeight: 700 }}>190 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Link href="/data-sppg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '1rem', color: '#0f172a', fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.875rem' }}>Lihat Data Suplai</span>
                <ChevronRight size={18} color="#94a3b8" />
              </Link>
            </div>

            {/* COMPLAINT MINI PROMO */}
            <div style={{ gridColumn: 'span 1', background: 'linear-gradient(135deg, #306d29 0%, #0d530e 100%)', color: '#ffffff', borderRadius: '2rem', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <ShieldCheck size={40} color="#bbce75" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ada Kejanggalan?</h4>
              <p style={{ fontSize: '0.9375rem', color: '#e7e1b1', marginBottom: '1.5rem' }}>Bantu kami menjaga kualitas makanan anak-anak kita.</p>
              <a href="#pengaduan" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ffffff', color: '#306d29', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>Buat Laporan</a>
            </div>

          </div>
        </div>
      </section>

      {/* COMPLAINT SECTION (Refined) */}
      <section id="pengaduan" style={{ padding: '6rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
            
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Layanan <br/><span style={{ color: '#306d29' }}>Pengaduan</span></h2>
              <p style={{ fontSize: '1.125rem', color: '#64748b', marginBottom: '3rem', lineHeight: 1.6 }}>
                Identitas pelapor dijamin kerahasiaannya. Laporan Anda langsung diteruskan ke sistem antrean Inspektorat Daerah.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={20} color="#0f172a" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hotline 24 Jam</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>0811-2233-4455</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={20} color="#0f172a" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Tim Inspeksi</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>lapor@mbg.lebak.go.id</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: '1 1 400px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '2rem', padding: '3rem', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
                {isSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyCenter: 'center', width: '80px', height: '80px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '50%', marginBottom: '1.5rem' }}>
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Laporan Terkirim</h3>
                    <p style={{ color: '#475569' }}>Terima kasih. Tiket investigasi Anda telah masuk dalam antrean kami.</p>
                  </div>
                ) : (
                  <form onSubmit={handlePengaduanSubmit}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', color: '#0f172a' }}>Kirim Pesan Langsung</h3>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Lokasi / Nama Sekolah *</label>
                      <input type="text" required placeholder="Contoh: SDN 1 Rangkasbitung" value={formPengaduan.lokasi} onChange={(e) => setFormPengaduan({...formPengaduan, lokasi: e.target.value})} style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', backgroundColor: '#f8fafc', fontSize: '0.9375rem', outline: 'none' }} />
                    </div>
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Kategori Indikasi *</label>
                      <select value={formPengaduan.kategori} onChange={(e) => setFormPengaduan({...formPengaduan, kategori: e.target.value})} style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', backgroundColor: '#f8fafc', fontSize: '0.9375rem', outline: 'none' }}>
                        <option>Kualitas Makanan Buruk / Basi</option>
                        <option>Keterlambatan Distribusi</option>
                        <option>Dugaan Pungutan Liar</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Deskripsi Kejadian *</label>
                      <textarea rows="4" required placeholder="Tuliskan kronologi selengkapnya..." value={formPengaduan.pesan} onChange={(e) => setFormPengaduan({...formPengaduan, pesan: e.target.value})} style={{ width: '100%', padding: '0.875rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.75rem', backgroundColor: '#f8fafc', fontSize: '0.9375rem', resize: 'none', outline: 'none' }}></textarea>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: '#0f172a', color: '#ffffff', fontWeight: 700, borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s' }}>
                      Kirim Laporan
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0f172a', paddingTop: '5rem', paddingBottom: '2rem', borderTop: '4px solid #306d29', color: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            {/* Kolom 1: Branding */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <img src="/LOGO-LEBAK.png" alt="Lebak" style={{ height: '48px', backgroundColor: '#ffffff', padding: '0.25rem', borderRadius: '0.5rem' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>MBG Lebak</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Portal Resmi</span>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Sistem pengawasan digital untuk rantai pasok Program Prioritas Nasional Makan Bergizi Gratis (MBG) di wilayah Kabupaten Lebak.
              </p>
            </div>

            {/* Kolom 2: Tautan Cepat */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tautan Cepat</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><a href="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Beranda Utama</a></li>
                <li><a href="#transparansi" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Buku Induk Keterbukaan</a></li>
                <li><Link href="/data-penggilingan" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Data Pre Market</Link></li>
                <li><Link href="/data-sppg" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Data Post Market</Link></li>
              </ul>
            </div>

            {/* Kolom 3: Layanan */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Layanan Publik</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li><a href="#pengaduan" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Pusat Pengaduan</a></li>
                <li><a href="#" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '0.875rem' }} className="hover-text-white">Panduan Pengguna</a></li>
                <li><Link href="/login" style={{ color: '#4c8538', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }} className="hover-text-white">Portal Admin Internal <ArrowRight size={14} /></Link></li>
              </ul>
            </div>

            {/* Kolom 4: Kontak */}
            <div>
              <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Pusat Informasi</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  <MapPin size={18} style={{ color: '#4c8538', flexShrink: 0, marginTop: '0.125rem' }} />
                  <span>Kompleks Perkantoran Pemkab Lebak, Jl. Alun-Alun Rangkasbitung, Banten.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  <Phone size={18} style={{ color: '#4c8538', flexShrink: 0 }} />
                  <span>(0252) 1234567</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                  <Mail size={18} style={{ color: '#4c8538', flexShrink: 0 }} />
                  <span>mbg@lebakkab.go.id</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem', width: '100%', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span>&copy; 2026 Pemerintah Kabupaten Lebak. Hak Cipta Dilindungi.</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text-white">Kebijakan Privasi</a>
              <a href="#" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }} className="hover-text-white">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Public;
