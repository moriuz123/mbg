import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import MenuManagerClient from '@/components/MenuManagerClient';

export default async function PengaturanMenu() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';
  
  if (!isAdmin) redirect('/admin');

  const menus = await db.query.navigationMenu.findMany({
    orderBy: (m, { asc }) => [asc(m.urutan)]
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Menu Navigasi</h1>
        <p className="text-gray-500 mt-2">Atur menu navigasi yang tampil pada portal publik.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <MenuManagerClient initialMenus={menus} />
      </div>
    </div>
  );
}
