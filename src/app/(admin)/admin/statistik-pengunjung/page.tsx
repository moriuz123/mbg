import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getVisitorAnalytics } from '@/app/actions/visitorStats';
import VisitorAnalyticsClient from '@/components/VisitorAnalyticsClient';

export const metadata = {
  title: 'Statistik & Analitik Pengunjung | Admin MBG Lebak',
  description: 'Pusat Analitik Trafik dan Statistik Pengunjung Sistem MBG Kabupaten Lebak',
};

export default async function VisitorAnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';

  if (!isAdmin) {
    redirect('/admin');
  }

  const initialData = await getVisitorAnalytics('7d');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <VisitorAnalyticsClient initialData={initialData} />
    </div>
  );
}
