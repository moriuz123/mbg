import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getSeoSettings } from '@/app/actions/seoSettings';
import SeoManagerClient from '@/components/SeoManagerClient';

export const metadata = {
  title: 'Konfigurasi SEO & Indeksasi | Admin MBG Lebak',
  description: 'Pengaturan Metadata, Open Graph, Google Search Console, dan Indeksasi Mesin Pencari',
};

export default async function SeoSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';

  if (!isAdmin) {
    redirect('/admin');
  }

  const seoSettings = await getSeoSettings();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SeoManagerClient initialSettings={seoSettings} />
    </div>
  );
}
