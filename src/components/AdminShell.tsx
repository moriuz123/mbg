"use client";

import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Menu, Search, Bell, ShieldCheck } from 'lucide-react';
import { LogoutButtonHeader } from '@/components/LogoutButton';

interface AdminShellProps {
  userRole: string;
  userName: string;
  userInitials: string;
  children: React.ReactNode;
}

export default function AdminShell({ userRole, userName, userInitials, children }: AdminShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <AdminSidebar 
        userRole={userRole} 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1 lg:ml-[280px] flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Header - Responsive Enterprise Style */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white border-b border-slate-200/60 shadow-sm">
          
          {/* Left: Mobile Menu Button & Search */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu size={22} />
            </button>

            {/* Mobile Brand Title */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shadow-md">
                <ShieldCheck size={18} />
              </div>
              <span className="font-bold text-slate-800 text-sm sm:text-base">Supply Chain MBG</span>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-full w-full max-w-md border border-slate-200/50 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari data, menu, atau laporan..." 
                className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400" 
              />
            </div>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
            </div>
            
            <div className="h-6 sm:h-8 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-col items-end hidden sm:flex">
                <span className="text-xs sm:text-sm font-bold text-slate-700 leading-tight">{userName}</span>
                <span className="text-[10px] sm:text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Sesi Aktif
                </span>
              </div>
              <div className="flex items-center gap-1.5 p-1 sm:pr-3 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full border border-slate-200 cursor-pointer">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner shrink-0">
                  {userInitials}
                </div>
                <LogoutButtonHeader />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
