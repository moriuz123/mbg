'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { saveAKG, deleteAKG } from '@/app/actions/akg';

export default function AkgClientUI({ initialData, kategoriList }: { initialData: any[], kategoriList: any[] }) {
  const [data, setData] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      const res = await deleteAKG(id);
      if (res.success) {
        setData(data.filter(d => d.id !== id));
      } else {
        alert(res.message);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (editingItem) formData.append('id', editingItem.id.toString());
    
    const res = await saveAKG(formData);
    if (res.success) {
      window.location.reload();
    } else {
      alert(res.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={openAddModal} className="px-4 py-2 bg-primary-600 text-white rounded-xl flex items-center gap-2 hover:bg-primary-700">
          <Plus size={18} /> Tambah Standar AKG
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-sm text-slate-600">Kategori & Waktu</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Kalori (Min - Max)</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Protein (g)</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Karbohidrat (g)</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Lemak (g)</th>
                <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-4 font-semibold">{item.kategoriNama} <br/><span className="text-xs text-slate-500">{item.jenisMakan}</span></td>
                  <td className="p-4">{item.minEnergiKkal} - {item.maxEnergiKkal}</td>
                  <td className="p-4">{item.minProteinGram} - {item.maxProteinGram}</td>
                  <td className="p-4">{item.minKarbohidratGram} - {item.maxKarbohidratGram}</td>
                  <td className="p-4">{item.minLemakGram} - {item.maxLemakGram}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada data AKG</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingItem ? 'Edit' : 'Tambah'} Standar AKG</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Kategori Target</label>
                  <select name="kategoriId" defaultValue={editingItem?.kategoriId || ''} required className="w-full p-3 border rounded-xl">
                    <option value="">-- Pilih --</option>
                    {kategoriList.map(k => <option key={k.id} value={k.id}>{k.namaKategori}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Waktu Makan</label>
                  <select name="jenisMakan" defaultValue={editingItem?.jenisMakan || 'Siang'} required className="w-full p-3 border rounded-xl">
                    <option value="Pagi">Makan Pagi (Sarapan)</option>
                    <option value="Siang">Makan Siang</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Kalori Min (Kkal)</label>
                  <input type="number" step="0.1" name="minEnergiKkal" defaultValue={editingItem?.minEnergiKkal} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Kalori Max (Kkal)</label>
                  <input type="number" step="0.1" name="maxEnergiKkal" defaultValue={editingItem?.maxEnergiKkal} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Protein Min (g)</label>
                  <input type="number" step="0.1" name="minProteinGram" defaultValue={editingItem?.minProteinGram} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Protein Max (g)</label>
                  <input type="number" step="0.1" name="maxProteinGram" defaultValue={editingItem?.maxProteinGram} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Karbohidrat Min (g)</label>
                  <input type="number" step="0.1" name="minKarbohidratGram" defaultValue={editingItem?.minKarbohidratGram} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Karbohidrat Max (g)</label>
                  <input type="number" step="0.1" name="maxKarbohidratGram" defaultValue={editingItem?.maxKarbohidratGram} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Lemak Min (g)</label>
                  <input type="number" step="0.1" name="minLemakGram" defaultValue={editingItem?.minLemakGram} required className="w-full p-3 border rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Lemak Max (g)</label>
                  <input type="number" step="0.1" name="maxLemakGram" defaultValue={editingItem?.maxLemakGram} required className="w-full p-3 border rounded-xl" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-primary-600 text-white rounded-xl">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
