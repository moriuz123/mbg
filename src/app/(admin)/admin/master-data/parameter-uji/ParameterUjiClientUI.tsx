'use client';

import React, { useState } from 'react';
import { TestTube2, Plus, Search, Filter, Edit2, Trash2, CheckCircle2, XCircle, Sparkles, X, Save, AlertCircle } from 'lucide-react';
import { 
  createMasterParameterUji, 
  updateMasterParameterUji, 
  toggleStatusParameterUji, 
  deleteMasterParameterUji,
  seedDefaultParameterUji 
} from '@/app/actions/masterParameterUji';

type ParameterUjiItem = {
  id: number;
  namaParameter: string;
  kategori: string | null;
  satuan: string | null;
  ambangBatas: string | null;
  deskripsi: string | null;
  statusAktif: boolean | null;
  createdAt: string | Date | null;
};

export default function ParameterUjiClientUI({ initialData }: { initialData: ParameterUjiItem[] }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ParameterUjiItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metrics
  const totalItem = initialData.length;
  const totalKimia = initialData.filter(d => d.kategori === 'Kimia').length;
  const totalMikrobiologi = initialData.filter(d => d.kategori === 'Mikrobiologi').length;
  const totalAktif = initialData.filter(d => d.statusAktif).length;

  const filteredData = initialData.filter(item => {
    const matchSearch = item.namaParameter.toLowerCase().includes(search.toLowerCase()) || 
                        (item.deskripsi && item.deskripsi.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = categoryFilter ? item.kategori === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ParameterUjiItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (item: ParameterUjiItem) => {
    const res = await toggleStatusParameterUji(item.id, !!item.statusAktif);
    if (!res.success) alert(res.message);
    else window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item parameter uji ini?')) return;
    const res = await deleteMasterParameterUji(id);
    if (!res.success) alert(res.message);
    else window.location.reload();
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Tambahkan data standar default parameter uji (Formalin, Boraks, E. Coli, Salmonella, dll)?')) return;
    setIsSubmitting(true);
    await seedDefaultParameterUji();
    window.location.reload();
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let res;
    if (editingItem) {
      res = await updateMasterParameterUji(editingItem.id, formData);
    } else {
      res = await createMasterParameterUji(formData);
    }

    if (res.success) {
      setIsModalOpen(false);
      window.location.reload();
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
            <TestTube2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Parameter</p>
            <p className="text-2xl font-bold text-slate-800">{totalItem}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TestTube2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uji Kimia</p>
            <p className="text-2xl font-bold text-slate-800">{totalKimia}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TestTube2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mikrobiologi</p>
            <p className="text-2xl font-bold text-slate-800">{totalMikrobiologi}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status Aktif</p>
            <p className="text-2xl font-bold text-slate-800">{totalAktif}</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header Actions */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari parameter uji..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Filter className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm outline-none cursor-pointer font-medium text-slate-700"
              >
                <option value="">Semua Kategori</option>
                <option value="Kimia">Kimia</option>
                <option value="Mikrobiologi">Mikrobiologi</option>
                <option value="Fisik">Fisik</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {initialData.length === 0 && (
              <button
                onClick={handleSeedDefaults}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-bold transition-all border border-emerald-200 flex items-center gap-2"
              >
                <Sparkles size={16} /> Isi Standard Preset
              </button>
            )}

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Plus size={18} /> Tambah Parameter Uji
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Nama Parameter Uji</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Satuan</th>
                <th className="p-4">Ambang Batas (Maksimal)</th>
                <th className="p-4">Deskripsi / Keterangan</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-slate-800 flex items-center gap-2">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg shrink-0">
                      <TestTube2 size={16} />
                    </div>
                    {item.namaParameter}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.kategori === 'Kimia' ? 'bg-blue-100 text-blue-700' :
                      item.kategori === 'Mikrobiologi' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {item.kategori || 'Umum'}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{item.satuan || '-'}</td>
                  <td className="p-4 font-semibold text-slate-800">{item.ambangBatas || '-'}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">{item.deskripsi || '-'}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      title="Klik untuk ubah status aktif"
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        item.statusAktif ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {item.statusAktif ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {item.statusAktif ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-slate-100 text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Hapus Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <AlertCircle size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="font-bold text-slate-700">Belum ada item parameter uji</p>
                    <p className="text-xs text-slate-400 mt-1">Klik "Tambah Parameter Uji" atau "Isi Standard Preset" untuk menambahkan item baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">
                {editingItem ? 'Edit Master Parameter Uji' : 'Tambah Master Parameter Uji Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Parameter Uji <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="namaParameter"
                  required
                  defaultValue={editingItem?.namaParameter || ''}
                  placeholder="Contoh: Formalin, Boraks, E. Coli, Pestisida"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Uji</label>
                  <select
                    name="kategori"
                    defaultValue={editingItem?.kategori || 'Kimia'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none bg-white font-medium text-slate-800"
                  >
                    <option value="Kimia">Kimia</option>
                    <option value="Mikrobiologi">Mikrobiologi</option>
                    <option value="Fisik">Fisik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Satuan Pengukuran</label>
                  <input
                    type="text"
                    name="satuan"
                    defaultValue={editingItem?.satuan || ''}
                    placeholder="Contoh: mg/L, PPM, APM/g"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ambang Batas Maksimal</label>
                <input
                  type="text"
                  name="ambangBatas"
                  defaultValue={editingItem?.ambangBatas || ''}
                  placeholder="Contoh: 0 mg/L (Bebas), < 3 APM/g"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi / Keterangan Uji</label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  defaultValue={editingItem?.deskripsi || ''}
                  placeholder="Keterangan uji rapid test dan bahaya jika melebihi batas..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none text-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                <select
                  name="statusAktif"
                  defaultValue={editingItem?.statusAktif !== false ? 'true' : 'false'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="true">Aktif (Dapat dipilih di form rapid test)</option>
                  <option value="false">Non-Aktif (Disembunyikan)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-primary-600 text-white font-bold hover:bg-primary-700 rounded-xl transition-colors text-sm flex items-center gap-2 shadow-sm"
                >
                  <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Parameter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
