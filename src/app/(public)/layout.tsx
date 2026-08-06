import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { getNavigationMenus } from '@/app/actions/frontend';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const dynamicMenus = await getNavigationMenus();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar dynamicMenus={dynamicMenus} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
