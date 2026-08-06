import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import SettingWebClient from '@/components/SettingWebClient';

export default async function SettingWeb() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';
  
  if (!isAdmin) redirect('/admin');

  const settingsArray = await db.query.siteSetting.findMany();
  const settings = settingsArray.reduce((acc, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Setting Web</h1>
        <p className="text-gray-500 mt-2">Konfigurasi informasi utama situs, identitas visual, dan profil pemerintah.</p>
      </div>

      <SettingWebClient initialSettings={settings} />
    </div>
  );
}
