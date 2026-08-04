import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { LogoutButtonHeader } from '@/components/LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AdminSidebar />
      <main className="admin-main" style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem', display: 'flex', flexDirection: 'column', maxWidth: '1400px' }}>
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
              <LogoutButtonHeader />
            </div>
          </div>
        </header>
        <div style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
