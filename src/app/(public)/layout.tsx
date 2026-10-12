import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { getNavigationMenus, getSiteSettings } from '@/app/actions/frontend';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import MaintenanceView from '@/components/MaintenanceView';
import Link from 'next/link';
import { AlertTriangle, Settings } from 'lucide-react';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get('x-current-path') || '';

  // If visiting login, render children directly so login is always accessible
  if (currentPath.startsWith('/login')) {
    return <>{children}</>;
  }

  const [dynamicMenus, siteSettings] = await Promise.all([
    getNavigationMenus(),
    getSiteSettings()
  ]);

  const isMaintenance = siteSettings.maintenance_mode === 'true' || siteSettings.maintenance_mode === '1';

  if (isMaintenance) {
    const session = await auth.api.getSession({
      headers: headersList
    });
    const role = session?.user?.role;
    const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';

    // If regular visitor, show maintenance view
    if (!isAdmin) {
      return <MaintenanceView settings={siteSettings} />;
    }

    // If admin is browsing public site, show a warning notification bar
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-bold flex flex-wrap items-center justify-between sticky top-0 z-[9999] shadow-md border-b border-amber-600 gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-950 shrink-0 animate-pulse" />
            <span>
              <strong>PERHATIAN:</strong> Mode Pemeliharaan Aktif. Pengunjung publik dialihkan ke halaman pemeliharaan. Anda melihat halaman ini karena sedang login sebagai Administrator.
            </span>
          </div>
          <Link 
            href="/admin/pengaturan-situs/umum" 
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
          >
            <Settings size={14} /> Kelola Mode Pemeliharaan
          </Link>
        </div>
        <PublicNavbar dynamicMenus={dynamicMenus} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
        <PublicFooter settings={siteSettings} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar dynamicMenus={dynamicMenus} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <PublicFooter settings={siteSettings} />
    </div>
  );
}
