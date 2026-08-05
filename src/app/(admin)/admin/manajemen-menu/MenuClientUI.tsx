'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, LayoutList } from 'lucide-react';
import { createSysMenu, deleteSysMenu } from '@/app/actions/sysMenu';

export default function MenuClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaModul: formData.get('namaModul') as string,
      url: formData.get('url') as string,
      hakAkses: formData.get('hakAkses') as string,
      status: formData.get('status') as string,
    };

    const res = await createSysMenu(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error || 'Gagal menyimpan');
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      await deleteSysMenu(id);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
  <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
          
        >
          <Plus size={20} /> Tambah Menu / Modul
        </button>
</div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-700"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-xl font-bold">Tambah Manajemen Menu</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block mb-2 text-sm font-semibold">Nama Modul / Menu</label>
                <input required name="namaModul" type="text" className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: Data Kepegawaian" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">URL Target</label>
                <input required name="url" type="text" className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: /admin/kepegawaian" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Hak Akses (Role)</label>
                <input required name="hakAkses" type="text" className="w-full p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: super_admin,sppg" />
                <small className="text-slate-500 mt-1 block">Pisahkan dengan koma. Opsi: super_admin, sppg, penggilingan_gabah</small>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold">Status</label>
                <select required name="status" className="w-full p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 w-full p-3.5 bg-blue-600 text-white rounded-lg font-semibold transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Nama Modul</th>
                <th className="p-4 font-semibold">URL Target</th>
                <th className="p-4 font-semibold">Hak Akses Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <LayoutList size={16} className="text-slate-400" />
                      {item.namaModul}
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">
                    <code className="bg-slate-100 px-2 py-1 rounded text-xs">{item.url}</code>
                  </td>
                  <td className="p-4 text-slate-700">
                    <div className="flex gap-1 flex-wrap">
                      {item.hakAkses.split(',').map((r: string, idx: number) => (
                        <span key={idx} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                          {r.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded inline-flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada data Manajemen Menu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
