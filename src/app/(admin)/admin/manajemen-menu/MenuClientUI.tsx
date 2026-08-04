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
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        style={{ backgroundColor: '#2563eb' }}
      >
        <Plus size={20} /> Tambah Menu / Modul
      </button>

      {/* MODAL FORM */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Tambah Manajemen Menu</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Nama Modul / Menu</label>
                <input required name="namaModul" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: Data Kepegawaian" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>URL Target</label>
                <input required name="url" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: /admin/kepegawaian" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Hak Akses (Role)</label>
                <input required name="hakAkses" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: super_admin,sppg" />
                <small className="text-slate-500 mt-1 block">Pisahkan dengan koma. Opsi: super_admin, sppg, penggilingan_gabah</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Status</label>
                <select required name="status" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  marginTop: '1rem', width: '100%', padding: '0.875rem', backgroundColor: '#2563eb', 
                  color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
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
