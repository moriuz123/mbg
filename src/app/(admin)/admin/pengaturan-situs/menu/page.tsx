import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

import MenuManagerClient from '@/components/MenuManagerClient';

import { siteSetting } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function PengaturanMenu() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';
  
  if (!isAdmin) redirect('/admin');

  const [menus, footerSetting] = await Promise.all([
    db.query.navigationMenu.findMany({
      orderBy: (m, { asc }) => [asc(m.urutan)]
    }),
    db.query.siteSetting.findFirst({
      where: eq(siteSetting.key, 'footer_quick_links')
    })
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Menu & Tautan Navigasi</h1>
        <p className="text-gray-500 mt-2">Atur menu navigasi utama header dan tautan cepat footer pada portal publik.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <MenuManagerClient initialMenus={menus} initialFooterLinks={footerSetting?.value || ''} />
      </div>
    </div>
  );
}
