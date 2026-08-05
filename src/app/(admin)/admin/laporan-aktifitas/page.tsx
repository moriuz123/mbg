import React from 'react';
import { Activity, Plus } from 'lucide-react';
import { db } from '@/db';
import { sppgLaporanAktifitas } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function LaporanAktifitasPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const userRole = session?.user?.role;
  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

  // For now, let's just fetch all Laporan. We can add filtering by SPPG for SPPG roles later.
  const laporanData = await db.query.sppgLaporanAktifitas.findMany({
    with: {
      sppg: true,
      sekolah: true
    },
    orderBy: [desc(sppgLaporanAktifitas.tanggal), desc(sppgLaporanAktifitas.createdAt)],
    limit: 50
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Aktifitas Distribusi</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manajemen dan Riwayat Laporan Pengiriman Menu Makanan
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            Buat Laporan Baru
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Tanggal</th>
                <th className="p-4">SPPG (Dapur)</th>
                <th className="p-4">Tujuan Sekolah</th>
                <th className="p-4">Menu & Porsi</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {laporanData.map((laporan) => (
                <tr key={laporan.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700 whitespace-nowrap">
                    {laporan.tanggal ? new Date(laporan.tanggal).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="p-4 font-bold text-primary-700">
                    {laporan.sppg?.namaSppg || '-'}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {laporan.sekolah?.namaSekolah || '-'}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 font-medium mb-1 line-clamp-1">{laporan.menu}</p>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {laporan.jumlahPorsi} Porsi
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      laporan.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {laporan.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {laporanData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada data laporan aktifitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
