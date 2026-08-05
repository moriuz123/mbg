import { getSysMenu } from "@/app/actions/sysMenu";
import React from 'react';
import MenuClientUI from './MenuClientUI';

export const dynamic = 'force-dynamic';

export default async function ManajemenMenuPage() {
  const menuList = await getSysMenu();

  return (
    <div>
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Menu Sistem</h1>
          <p className="text-slate-500 text-sm">Kelola menu navigasi, modul, dan hak akses otorisasi untuk pengguna sistem.</p>
        </div>
        </div>
        <MenuClientUI initialData={menuList} />
    </div>
  );
}
