import React from 'react';
import { getPengumumanAktif } from '@/app/actions/frontend';
import { createPengumuman } from '@/app/actions/adminSettings';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Megaphone, Plus } from 'lucide-react';

export default async function PengumumanPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const role = session?.user?.role;
  const canCreate = role === 'admin' || role === 'admin_dinas' || role === 'super_admin' || role === 'operator_sppg';
  
  const pengumumanList = await getPengumumanAktif();

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Megaphone className="text-primary-600 w-8 h-8" /> Papan Pengumuman
          </h1>
          <p className="text-gray-500 mt-2">Informasi dan pembaruan penting seputar program Makan Bergizi Gratis.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Create */}
        {canCreate && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-primary-600" /> Buat Pengumuman Baru
              </h2>
              <form action={async (formData) => {
                'use server';
                const judul = formData.get('judul') as string;
                const isi = formData.get('isi') as string;
                if (judul && isi) await createPengumuman({ judul, isi });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Pengumuman</label>
                  <input required type="text" name="judul" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Masukkan judul..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Isi Pesan</label>
                  <textarea required name="isi" rows={5} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" placeholder="Tulis pengumuman di sini..."></textarea>
                </div>
                <button type="submit" className="w-full px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
                  Terbitkan
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List Pengumuman */}
        <div className={`space-y-4 ${canCreate ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {pengumumanList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Belum ada pengumuman saat ini.</p>
            </div>
          ) : (
            pengumumanList.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent-500"></div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.judul}</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full shrink-0">
                    {item.createdAt ? formatDate(item.createdAt.toString()) : '-'}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4 text-sm">{item.isi}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {item.author?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{item.author?.name || 'User'}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                      {item.sppg?.namaSppg || item.author?.role || 'Admin'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
