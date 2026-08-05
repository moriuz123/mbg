'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Truck } from 'lucide-react';
import { createPemasok, deletePemasok } from '@/app/actions/masterData';

export default function PemasokClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaPemasok: formData.get('namaPemasok') as string,
      alamatPemasok: formData.get('alamatPemasok') as string,
      kontak: formData.get('kontak') as string,
    };

    const res = await createPemasok(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus pemasok ini?')) {
      await deletePemasok(id);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Pemasok
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Pemasok</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Pemasok *</label>
                <input required name="namaPemasok" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: PT Sumber Pangan Lebak" />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Pemasok</label>
                <textarea name="alamatPemasok" rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Alamat lengkap..."></textarea>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Kontak (No HP / Telp)</label>
                <input name="kontak" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="08..." />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pemasok'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Nama Pemasok</th>
                <th className="p-5">Kontak</th>
                <th className="p-5">Alamat</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5 font-bold text-slate-900 text-base flex items-center gap-2">
                    <Truck size={18} className="text-primary-600" /> {item.namaPemasok}
                  </td>
                  <td className="p-5 font-medium text-slate-600">{item.kontak || '-'}</td>
                  <td className="p-5 text-slate-500 max-w-xs truncate">{item.alamatPemasok || '-'}</td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Truck size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data Pemasok</p>
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
