"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Map, Factory, LayoutDashboard, LogOut, Database, ChevronDown, ChevronRight, MapPin, ShoppingCart, Truck, Package, Activity, Utensils, GraduationCap, ShieldCheck, HeartPulse, Users, MessageSquare, ClipboardCheck, TestTube2, Building2, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButtonSidebar } from './LogoutButton';

interface AdminSidebarProps {
  userRole?: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ userRole = 'publik', isMobileOpen = false, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(pathname?.startsWith('/admin/master-data'));
  const [isPengaturanSitusOpen, setIsPengaturanSitusOpen] = useState(pathname?.startsWith('/admin/pengaturan-situs'));
  
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const NavItem = ({ href, icon: Icon, children, isActive, isSub = false }: any) => (
    <Link 
      href={href} 
      onClick={handleNavClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
        ${isActive 
          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 translate-x-1' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
        ${isSub ? 'py-2.5 text-sm' : ''}
      `}
    >
      <Icon size={isSub ? 18 : 20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-primary-500'}`} />
      <span className="truncate">{children}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 h-[72px] border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 text-white shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pemkab Lebak</span>
              <span className="text-base font-extrabold text-slate-800 leading-tight tracking-tight">Digitalisasi Supply Chain</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile} 
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar">
          <div>
            <div className="px-4 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Menu Utama</div>
            <div className="space-y-1">
              <NavItem href="/admin" icon={Home} isActive={pathname === '/admin'}>Dasbor Utama</NavItem>
              
              {(isAdmin || userRole === 'sppg' || userRole === 'operator_sppg') && (
                <NavItem 
                  href="/admin/sppg" 
                  icon={isAdmin ? LayoutDashboard : Users} 
                  isActive={pathname?.includes('/admin/sppg')}
                >
                  {isAdmin ? 'Data SPPG' : 'Penerima Manfaat'}
                </NavItem>
              )}
              
              {(userRole === 'sekolah' || userRole === 'operator_sekolah' || userRole === 'operator_posyandu') && (
                <NavItem href="/admin/verifikasi" icon={ShieldCheck} isActive={pathname?.includes('/admin/verifikasi')}>
                  Verifikasi {userRole === 'operator_posyandu' ? 'Posyandu' : 'Sekolah'}
                </NavItem>
              )}

              {(isAdmin || userRole === 'operator_penggilingan') && (
                <NavItem href="/admin/penggilingan" icon={Factory} isActive={pathname?.includes('/admin/penggilingan')}>
                  {isAdmin ? 'Mitra Penggilingan' : 'Operasional Penggilingan'}
                </NavItem>
              )}
              {isAdmin && (
                <NavItem href="/admin/matriks-logistik" icon={Map} isActive={pathname?.includes('/admin/matriks-logistik')}>Matriks Geo-Logistik</NavItem>
              )}

              {(isAdmin || userRole === 'sppg' || userRole === 'operator_sppg') && (
                <NavItem href="/admin/laporan-aktifitas" icon={Activity} isActive={pathname?.includes('/admin/laporan-aktifitas')}>Laporan Aktifitas</NavItem>
              )}

              {(isAdmin || userRole === 'sppg' || userRole === 'operator_sppg') && (
                <NavItem href="/admin/pengawasan" icon={ClipboardCheck} isActive={pathname?.includes('/admin/pengawasan')}>Pengawasan Logistik</NavItem>
              )}

              

              {(isAdmin || userRole === 'sppg' || userRole === 'operator_sppg') && (
                <NavItem href="/admin/mitra-pemasok" icon={Building2} isActive={pathname?.includes('/admin/mitra-pemasok')}>Mitra Pemasok</NavItem>
              )}

              {(isAdmin || userRole === 'sppg' || userRole === 'operator_sppg') && (
                <NavItem href="/admin/standar-menu" icon={Utensils} isActive={pathname?.includes('/admin/standar-menu')}>Katalog Menu Harian</NavItem>
              )}

              {isAdmin && (
                <NavItem href="/admin/manajemen-user" icon={Users} isActive={pathname?.includes('/admin/manajemen-user')}>Manajemen User</NavItem>
              )}

              {isAdmin && (
                <NavItem href="/admin/pengaduan" icon={MessageSquare} isActive={pathname?.includes('/admin/pengaduan')}>Pengaduan Masuk</NavItem>
              )}

              {(isAdmin || userRole === 'operator_sppg' || userRole === 'sppg') && (
                <NavItem href="/admin/pengumuman" icon={MessageSquare} isActive={pathname?.includes('/admin/pengumuman')}>Pengumuman</NavItem>
              )}

              {isAdmin && (
                <div>
                  <button 
                    onClick={() => setIsPengaturanSitusOpen(!isPengaturanSitusOpen)}
                    className="w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <Database size={20} className="text-slate-400 group-hover:text-primary-500 transition-transform duration-200 group-hover:scale-110" />
                      Pengaturan Situs
                    </div>
                    {isPengaturanSitusOpen ? (
                      <ChevronDown size={18} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400" />
                    )}
                  </button>
                  <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isPengaturanSitusOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 border-l-2 border-slate-100 ml-6 space-y-1 py-1">
                      <NavItem href="/admin/pengaturan-situs/umum" icon={LayoutDashboard} isActive={pathname?.includes('/admin/pengaturan-situs/umum')} isSub>Setting Web</NavItem>
                      <NavItem href="/admin/pengaturan-situs/menu" icon={LayoutDashboard} isActive={pathname?.includes('/admin/pengaturan-situs/menu')} isSub>Kelola Menu</NavItem>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAdmin && (
            <div>
              <button 
                onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
                className="w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <div className="flex items-center gap-3">
                  <Database size={20} className="text-slate-400 group-hover:text-primary-500 transition-transform duration-200 group-hover:scale-110" />
                  Master Data
                </div>
                {isMasterDataOpen ? (
                  <ChevronDown size={18} className="text-slate-400" />
                ) : (
                  <ChevronRight size={18} className="text-slate-400" />
                )}
              </button>
            
              <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isMasterDataOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 border-l-2 border-slate-100 ml-6 space-y-1 py-1">
                  <NavItem href="/admin/master-data/yayasan" icon={Home} isActive={pathname?.includes('yayasan')} isSub>Yayasan</NavItem>
                  <NavItem href="/admin/master-data/sekolah" icon={GraduationCap} isActive={pathname?.includes('sekolah')} isSub>Sekolah</NavItem>
                  <NavItem href="/admin/master-data/posyandu" icon={HeartPulse} isActive={pathname?.includes('posyandu')} isSub>Posyandu</NavItem>
                  <NavItem href="/admin/master-data/kabupaten" icon={MapPin} isActive={pathname?.includes('kabupaten')} isSub>Kabupaten</NavItem>
                  <NavItem href="/admin/master-data/kecamatan" icon={MapPin} isActive={pathname?.includes('kecamatan')} isSub>Kecamatan</NavItem>
                  <NavItem href="/admin/master-data/desa" icon={MapPin} isActive={pathname?.includes('desa')} isSub>Desa/Kelurahan</NavItem>
                  <NavItem href="/admin/master-data/komoditas" icon={ShoppingCart} isActive={pathname?.includes('komoditas') || pathname?.includes('jenis-pangan')} isSub>Komoditas</NavItem>
                  <NavItem href="/admin/master-data/pemasok" icon={Truck} isActive={pathname?.includes('pemasok')} isSub>Pemasok</NavItem>
                  <NavItem href="/admin/master-data/parameter-uji" icon={TestTube2} isActive={pathname?.includes('parameter-uji')} isSub>Parameter Uji</NavItem>
                  <NavItem href="/admin/master-data/akg" icon={Utensils} isActive={pathname?.includes('akg')} isSub>Standar Gizi (AKG)</NavItem>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <LogoutButtonSidebar />
        </div>
      </aside>
    </>
  );
}
