"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Factory, LayoutDashboard, LogOut, Database, ChevronDown, ChevronRight, MapPin, ShoppingCart, Truck, Package, Activity, Utensils, GraduationCap, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButtonSidebar } from './LogoutButton';

export default function AdminSidebar({ userRole = 'publik' }: { userRole?: string }) {
  const pathname = usePathname();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(pathname?.startsWith('/admin/master-data'));
  
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  const NavItem = ({ href, icon: Icon, children, isActive, isSub = false }: any) => (
    <Link 
      href={href} 
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
        ${isActive 
          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 translate-x-1' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
        ${isSub ? 'py-2.5 text-sm' : ''}
      `}
    >
      <Icon size={isSub ? 18 : 20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110 text-slate-400 group-hover:text-primary-500'}`} />
      {children}
    </Link>
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300">
      
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-[72px] border-b border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 text-white">
          <ShieldCheck size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pemkab Lebak</span>
          <span className="text-lg font-extrabold text-slate-800 leading-tight tracking-tight">Portal MBG</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar">
        
        <div>
          <div className="px-4 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Menu Utama</div>
          <div className="space-y-1">
            <NavItem href="/admin" icon={Home} isActive={pathname === '/admin'}>Dasbor Utama</NavItem>
            
            {(isAdmin || userRole === 'sppg') && (
              <NavItem href="/admin/sppg" icon={LayoutDashboard} isActive={pathname?.includes('/admin/sppg')}>Data SPPG</NavItem>
            )}
            
            {(isAdmin || userRole === 'operator_sekolah') && (
              <NavItem href="/admin/sekolah" icon={GraduationCap} isActive={pathname?.includes('/admin/sekolah')}>Data Sekolah</NavItem>
            )}
            
            {(isAdmin || userRole === 'operator_penggilingan') && (
              <NavItem href="/admin/penggilingan" icon={Factory} isActive={pathname?.includes('/admin/penggilingan')}>Penggilingan Gabah</NavItem>
            )}

            {(isAdmin || userRole === 'sppg') && (
              <NavItem href="/admin/laporan-aktifitas" icon={Activity} isActive={pathname?.includes('/admin/laporan-aktifitas')}>Laporan Aktifitas</NavItem>
            )}

            {(isAdmin || userRole === 'sppg' || userRole === 'operator_penggilingan') && (
              <NavItem href="/admin/supply-chain" icon={Package} isActive={pathname?.includes('/admin/supply-chain')}>Rantai Pasok</NavItem>
            )}

            {isAdmin && (
              <NavItem href="/admin/manajemen-menu" icon={Utensils} isActive={pathname?.includes('/admin/manajemen-menu')}>Manajemen Menu</NavItem>
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
          
          <div className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${isMasterDataOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pl-4 border-l-2 border-slate-100 ml-6 space-y-1 py-1">
              <NavItem href="/admin/master-data/kecamatan" icon={MapPin} isActive={pathname?.includes('kecamatan')} isSub>Kecamatan</NavItem>
              <NavItem href="/admin/master-data/desa" icon={MapPin} isActive={pathname?.includes('desa')} isSub>Desa/Kelurahan</NavItem>
              <NavItem href="/admin/master-data/jenis-pangan" icon={ShoppingCart} isActive={pathname?.includes('jenis-pangan')} isSub>Jenis Pangan</NavItem>
              <NavItem href="/admin/master-data/pemasok" icon={Truck} isActive={pathname?.includes('pemasok')} isSub>Pemasok</NavItem>
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
  );
}
