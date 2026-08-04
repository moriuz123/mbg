'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Package } from 'lucide-react';
import { addSupplyChain, deleteSupplyChain } from '@/app/actions/sppg';

export default function SupplyChainClientUI({ initialData, sppgList, pemasokList }: { initialData: any[], sppgList: any[], pemasokList: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sppgId: formData.get('sppgId') as string,
      jenisPanganSegar: formData.get('jenisPanganSegar') as string,
      namaPemasok: formData.get('namaPemasok') as string,
      kebutuhanPerBulan: formData.get('kebutuhanPerBulan') as string,
      satuan: formData.get('satuan') as string,
    };

    const res = await addSupplyChain(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error || 'Gagal menyimpan');
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus data rantai pasok ini?')) {
      await deleteSupplyChain(id);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        style={{ backgroundColor: '#2563eb' }}
      >
        <Plus size={20} /> Tambah Pasokan
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
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Tambah Data Rantai Pasok</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Untuk SPPG</label>
                <select required name="sppgId" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="">Pilih SPPG...</option>
                  {sppgList.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSppg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Jenis Pangan Segar</label>
                <input required name="jenisPanganSegar" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: Beras Premium" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Nama Pemasok</label>
                <select required name="namaPemasok" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="">Pilih Pemasok...</option>
                  {pemasokList?.map(p => (
                    <option key={p.id} value={p.namaPemasok}>{p.namaPemasok} - {p.kategori}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Kebutuhan / Bulan</label>
                  <input required name="kebutuhanPerBulan" type="number" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: 1000" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Satuan</label>
                  <input required name="satuan" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Kg / Liter" />
                </div>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
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
                <th className="p-4 font-semibold">Jenis Pangan</th>
                <th className="p-4 font-semibold">Nama Pemasok</th>
                <th className="p-4 font-semibold">Kebutuhan Bulanan</th>
                <th className="p-4 font-semibold">Satuan</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 text-slate-900 font-medium">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-slate-400" />
                      {item.jenisPanganSegar}
                    </div>
                  </td>
                  <td className="p-4 text-slate-700">{item.namaPemasok}</td>
                  <td className="p-4 font-semibold text-slate-900">{item.kebutuhanPerBulan}</td>
                  <td className="p-4 text-slate-500">{item.satuan}</td>
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
                    Belum ada data Rantai Pasok.
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
