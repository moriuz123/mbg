import React from 'react';
import { getMasterParameterUjiList } from '@/app/actions/masterParameterUji';
import ParameterUjiClientUI from './ParameterUjiClientUI';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Master Parameter Uji | Admin MBG',
  description: 'Kelola master item parameter uji rapid test keamanan pangan dapur SPPG',
};

export default async function ParameterUjiPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');
  
  const role = session.user.role;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  if (!isAdmin) redirect('/admin');

  const parameterList = await getMasterParameterUjiList();

  return (
    <main className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Master Item Parameter Uji</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Kelola data standar parameter uji rapid test laboratorium & dapur SPPG (Formalin, Boraks, E. Coli, Pestisida, dll).
          </p>
        </div>
      </div>

      <ParameterUjiClientUI initialData={parameterList} />
    </main>
  );
}
