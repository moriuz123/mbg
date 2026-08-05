import re

# Update layout.tsx
layout_file = 'src/app/(admin)/layout.tsx'
with open(layout_file, 'r') as f:
    layout_content = f.read()

new_layout = """import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { LogOut, Bell, Search } from 'lucide-react';
import { LogoutButtonHeader } from '@/components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <AdminSidebar />
      <main className="flex-1 lg:ml-[280px] flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Header - Enterprise Style */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-full w-full max-w-md border border-slate-200/50 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Cari data, menu, atau laporan..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
            </div>
            
            <div className="h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-bold text-slate-700 leading-tight">Petugas Inspeksi</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Sesi Aktif
                </span>
              </div>
              <div className="flex items-center gap-2 p-1 pr-3 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full border border-slate-200 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                  PI
                </div>
                <LogoutButtonHeader />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
"""

with open(layout_file, 'w') as f:
    f.write(new_layout)

# Update AdminSidebar.tsx
sidebar_file = 'src/components/AdminSidebar.tsx'
with open(sidebar_file, 'r') as f:
    sidebar_content = f.read()

new_sidebar = """"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Factory, LayoutDashboard, LogOut, Database, ChevronDown, ChevronRight, MapPin, ShoppingCart, Truck, Package, Activity, Utensils, GraduationCap, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LogoutButtonSidebar } from './LogoutButton';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(pathname.startsWith('/admin/master-data'));

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
            <NavItem href="/admin/sppg" icon={LayoutDashboard} isActive={pathname.includes('/admin/sppg')}>Data SPPG</NavItem>
            <NavItem href="/admin/sekolah" icon={GraduationCap} isActive={pathname.includes('/admin/sekolah')}>Data Sekolah</NavItem>
            <NavItem href="/admin/penggilingan" icon={Factory} isActive={pathname.includes('/admin/penggilingan')}>Penggilingan Gabah</NavItem>
            <NavItem href="/admin/supply-chain" icon={Package} isActive={pathname.includes('/admin/supply-chain')}>Rantai Pasok</NavItem>
            <NavItem href="/admin/manajemen-menu" icon={Utensils} isActive={pathname.includes('/admin/manajemen-menu')}>Manajemen Menu</NavItem>
            <NavItem href="/admin/rapid-test" icon={Activity} isActive={pathname.includes('/admin/rapid-test')}>Uji Rapid Test</NavItem>
          </div>
        </div>

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
              <NavItem href="/admin/master-data/jenis-pangan" icon={ShoppingCart} isActive={pathname.includes('jenis-pangan')} isSub>Jenis Pangan</NavItem>
              <NavItem href="/admin/master-data/distributor" icon={Truck} isActive={pathname.includes('distributor')} isSub>Distributor</NavItem>
              <NavItem href="/admin/master-data/pemasok" icon={Truck} isActive={pathname.includes('pemasok')} isSub>Pemasok</NavItem>
            </div>
          </div>
        </div>

      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <LogoutButtonSidebar />
      </div>
    </aside>
  );
}
"""

with open(sidebar_file, 'w') as f:
    f.write(new_sidebar)
print("Updated layouts!")

