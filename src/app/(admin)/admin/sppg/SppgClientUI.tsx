'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { createSppg, deleteSppg } from '@/app/actions/sppg';
import { v4 as uuidv4 } from 'uuid';

export default function SppgClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: uuidv4(),
      idSppg: formData.get('idSppg') as string,
      namaSppg: formData.get('namaSppg') as string,
      desa: formData.get('desa') as string,
      jumlahPenerimaManfaat: formData.get('jumlahPenerimaManfaat') as string,
      statusOperasional: 'Aktif',
    };

    const res = await createSppg(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus data SPPG ini?')) {
      await deleteSppg(id);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        style={{ backgroundColor: '#2563eb' }}
      >
        <Plus size={20} /> Tambah SPPG
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
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Tambah Data SPPG</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Kode SPPG</label>
                <input required name="idSppg" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: SPPG-123" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Nama Dapur SPPG</label>
                <input required name="namaSppg" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: Dapur Cibadak" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Desa</label>
                <input required name="desa" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Nama Desa..." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Total Penerima Manfaat</label>
                <input required name="jumlahPenerimaManfaat" type="number" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: 1500" />
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data SPPG'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WE RENDER THE TABLE HERE TO ALLOW DELETE ACTIONS EASILY */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Kode SPPG</th>
                <th className="p-4 font-semibold">Nama Dapur</th>
                <th className="p-4 font-semibold">Desa</th>
                <th className="p-4 font-semibold">Total Penerima</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-900 font-medium">{item.idSppg}</td>
                  <td className="p-4 text-slate-700">{item.namaSppg}</td>
                  <td className="p-4 text-slate-700">{item.desa || '-'}</td>
                  <td className="p-4 font-semibold text-slate-900">{item.jumlahPenerimaManfaat || '0'}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      {item.statusOperasional || 'Aktif'}
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
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Belum ada data SPPG.
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
