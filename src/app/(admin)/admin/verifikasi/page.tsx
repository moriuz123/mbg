import React from 'react';
import VerifikasiSekolahForm from '@/components/VerifikasiSekolahForm';
import VerifikasiPosyanduForm from '@/components/VerifikasiPosyanduForm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Verifikasi Penerimaan | MBG Kab. Lebak',
  description: 'Form verifikasi dua arah penerimaan makanan.',
};

export default async function VerifikasiPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = session?.user?.role;

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
            Verifikasi Penerimaan Makanan
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${userRole === 'operator_posyandu' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {userRole === 'operator_posyandu' ? 'Posyandu' : 'Sekolah'}
            </span>
          </h1>
          <p className="text-slate-500 m-0">Sistem Verifikasi Dua Arah. Silakan konfirmasi makanan bergizi gratis yang telah dikirim oleh SPPG.</p>
        </div>
      </div>
      {userRole === 'operator_posyandu' ? (
        <VerifikasiPosyanduForm />
      ) : (
        <VerifikasiSekolahForm />
      )}
    </div>
  );
}
