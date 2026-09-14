import AdminShell from '@/components/AdminShell';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = session?.user?.role || 'publik';
  const userName = session?.user?.name || 'Pengguna';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <AdminShell userRole={userRole} userName={userName} userInitials={userInitials}>
      {children}
    </AdminShell>
  );
}
