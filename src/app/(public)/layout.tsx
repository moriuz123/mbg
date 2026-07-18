import PublicNavbar from '@/components/PublicNavbar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
