import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { LogOut, Bell, Search } from 'lucide-react';
import { LogoutButtonHeader } from '@/components/LogoutButton';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = session?.user?.role || 'publik';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <AdminSidebar userRole={userRole} />
      <main className="flex-1 lg:ml-[280px] flex flex-col min-w-0 transition-all duration-300">
        
        {/* Top Header - Enterprise Style */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200/60 shadow-sm">
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
