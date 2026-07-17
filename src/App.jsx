import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import { Home, Factory, LayoutDashboard, LogIn, LogOut, Menu, X, Database, ChevronDown, ChevronRight, Wheat, MapPin, ShoppingCart, Truck, FlaskConical } from 'lucide-react';

// Pages
import AdminHome from './pages/Home';
import PenggilinganPage from './pages/Penggilingan';
import SPPGPage from './pages/SPPG';
import MasterDataPage from './pages/MasterData';
import LoginPage from './pages/Login';
import PublicPage from './pages/Public';
import PublicPenggilingan from './pages/PublicPenggilingan';
import PublicSPPG from './pages/PublicSPPG';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/penggilingan') || location.pathname.startsWith('/sppg') || location.pathname.startsWith('/master-data');
  const isLoginPath = location.pathname === '/login';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(location.pathname.startsWith('/master-data'));

  // --- ADMIN LAYOUT (SIDEBAR) ---
  if (isAdminPath) {
    return (
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Sidebar */}
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
            <NavLink to="/admin" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' })}>
              <Home size={20} /> Dasbor Utama
            </NavLink>
            <NavLink to="/penggilingan" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' })}>
              <Factory size={20} /> Penggilingan (Pre)
            </NavLink>
            <NavLink to="/sppg" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#475569', transition: 'all 0.2s', textDecoration: 'none' })}>
              <LayoutDashboard size={20} /> SPPG (Post)
            </NavLink>
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
              <NavLink to="/master-data/sumber-gabah" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' })}>
                <Wheat size={20} /> Sumber Gabah
              </NavLink>
              <NavLink to="/master-data/lokus-sppg" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' })}>
                <MapPin size={20} /> Lokus SPPG
              </NavLink>
              <NavLink to="/master-data/jenis-pangan" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' })}>
                <ShoppingCart size={20} /> Jenis Pangan
              </NavLink>
              <NavLink to="/master-data/distributor" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' })}>
                <Truck size={20} /> Distributor
              </NavLink>
              <NavLink to="/master-data/parameter-uji" className={({isActive}) => `flex items-center gap-3`} style={({isActive}) => ({ padding: '0.875rem 1rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: isActive ? 600 : 500, backgroundColor: isActive ? 'var(--primary-50)' : 'transparent', color: isActive ? 'var(--primary-700)' : '#64748b', transition: 'all 0.2s', textDecoration: 'none' })}>
                <FlaskConical size={20} /> Parameter Uji
              </NavLink>
            </div>
          </div>

          <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', color: '#ef4444', backgroundColor: '#fef2f2', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
              <LogOut size={18} /> Keluar Sistem
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main" style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', maxWidth: '1400px' }}>
          {/* Top header for admin */}
          <header className="admin-header flex justify-between items-center mb-8 pb-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Portal Pengawasan</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0, marginTop: '0.25rem' }}>Selamat datang kembali, Petugas Inspeksi.</p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="hide-on-mobile" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#16a34a', borderRadius: '50%' }}></span> Sesi Aktif
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.5rem 0.25rem 0.25rem', backgroundColor: '#f8fafc', borderRadius: '9999px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-100)', color: 'var(--primary-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem' }}>
                  PI
                </div>
                <Link to="/" title="Keluar Sistem" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.375rem', borderRadius: '50%', transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <LogOut size={18} />
                </Link>
              </div>
            </div>
          </header>
          
          <div style={{ flex: 1 }}>
            <Routes>
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/penggilingan" element={<PenggilinganPage />} />
              <Route path="/sppg" element={<SPPGPage />} />
              <Route path="/master-data" element={<Navigate to="/master-data/sumber-gabah" replace />} />
              <Route path="/master-data/:tabId" element={<MasterDataPage />} />
            </Routes>
          </div>
        </main>
      </div>
    );
  }

  // --- PUBLIC & LOGIN LAYOUT (TOP NAVBAR) ---
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isLoginPath && (
        <header className="public-header" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', width: '100%', padding: '1rem 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div className="container flex items-center justify-between public-header-container" style={{ position: 'relative' }}>
            <div className="branding-container flex items-center gap-4">
              <img src="/LOGO-LEBAK.png" alt="Logo Lebak" className="branding-logo" style={{ height: '40px', width: 'auto' }} />
              <div className="hide-on-mobile" style={{ height: '28px', width: '2px', backgroundColor: '#e2e8f0' }}></div>
              <div className="branding-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pemerintah Kabupaten Lebak</p>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: '1.2' }}>Portal MBG</h1>
              </div>
            </div>
            
            {/* Hamburger Button (Mobile Only) */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', display: 'none' }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="desktop-nav-wrapper hide-on-mobile" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              <nav className="public-nav flex gap-8 items-center">
                <a href="/" className="nav-link-effect">Beranda</a>
                <a href="/#tentang" className="nav-link-effect">Tentang MBG</a>
                <Link to="/data-penggilingan" className="nav-link-effect">Pre Market</Link>
                <Link to="/data-sppg" className="nav-link-effect">Post Market</Link>
                <a href="/#pengaduan" className="nav-link-effect">Pengaduan</a>
              </nav>
            </div>

            <div className="hide-on-mobile">
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(37,99,235,0.2)' }}>
                <LogIn size={18} /> Login
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="mobile-nav-dropdown">
              <nav style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem' }}>
                <a href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                  <Home size={20} color="#3b82f6" /> Beranda
                </a>
                <a href="/#tentang" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                  <LayoutDashboard size={20} color="#3b82f6" /> Tentang MBG
                </a>
                <Link to="/data-penggilingan" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                  <Factory size={20} color="#3b82f6" /> Pre Market
                </Link>
                <Link to="/data-sppg" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                  <LayoutDashboard size={20} color="#3b82f6" /> Post Market
                </Link>
                <a href="/#pengaduan" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}>
                  <Menu size={20} color="#3b82f6" /> Pengaduan
                </a>
                
                <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem', borderRadius: '0.75rem' }}>
                    <LogIn size={20} /> Login ke Portal Admin
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </header>
      )}

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/data-penggilingan" element={<PublicPenggilingan />} />
          <Route path="/data-sppg" element={<PublicSPPG />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
