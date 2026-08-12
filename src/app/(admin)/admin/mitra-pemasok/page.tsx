import React from 'react';
import { getActiveSuppliersForSppg } from '@/app/actions/supplyChain';
import { getPemasok } from '@/app/actions/masterData';
import MitraPemasokClientUI from '@/components/MitraPemasokClientUI';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function MitraPemasokPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userRole = session?.user?.role || 'publik';
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';
  const isSppg = userRole === 'sppg' || userRole === 'operator_sppg';

  // Access Control: Admin Dinas and SPPG Operators can access
  if (!isAdmin && !isSppg) {
    redirect('/admin');
  }

  const userSppgId = session?.user?.sppgId;
  const suppliers = isSppg 
    ? await getActiveSuppliersForSppg(userSppgId ?? undefined)
    : await getPemasok();

  return (
    <main className="max-w-7xl mx-auto space-y-6">
      <MitraPemasokClientUI 
        initialSuppliers={suppliers}
        isAdmin={isAdmin}
        userSppgId={userSppgId ?? undefined}
      />
    </main>
  );
}
