'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, MoreVertical, GripVertical, Save, X } from 'lucide-react';
import { addMenu, updateMenu, deleteMenu, updateMenuStatus } from '@/app/actions/adminSettings';
import toast, { Toaster } from 'react-hot-toast';

export default function MenuManagerClient({ initialMenus }: { initialMenus: any[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', urutan: 0 });

  const handleEdit = (menu: any) => {
    setEditingId(menu.id);
    setFormData({ name: menu.name, url: menu.url, urutan: menu.urutan });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', url: '', urutan: 0 });
    setIsAdding(false);
  };

  const handleAddStart = () => {
    setEditingId(null);
    setFormData({ name: '', url: '/', urutan: menus.length > 0 ? Math.max(...menus.map((m) => m.urutan)) + 1 : 1 });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.url) {
      toast.error('Nama menu dan tautan tidak boleh kosong!');
      return;
    }
    const toastId = toast.loading('Menyimpan menu...');
    try {
      if (editingId) {
        await updateMenu(editingId, formData);
        setMenus(menus.map(m => m.id === editingId ? { ...m, ...formData } : m).sort((a, b) => a.urutan - b.urutan));
        toast.success('Menu berhasil diperbarui!', { id: toastId });
      } else {
        await addMenu(formData);
        toast.success('Menu berhasil ditambahkan!', { id: toastId });
        window.location.reload(); // Hard refresh to sync DB id
      }
      cancelEdit();
    } catch (error) {
      toast.error('Terjadi kesalahan saat menyimpan', { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus menu ini?')) {
      const toastId = toast.loading('Menghapus menu...');
      try {
        await deleteMenu(id);
        setMenus(menus.filter(m => m.id !== id));
        toast.success('Menu berhasil dihapus!', { id: toastId });
      } catch (error) {
        toast.error('Gagal menghapus menu', { id: toastId });
      }
    }
  };

  const toggleStatus = async (menu: any) => {
    const newStatus = menu.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    const toastId = toast.loading('Mengubah status...');
    try {
      await updateMenuStatus(menu.id, newStatus);
      setMenus(menus.map(m => m.id === menu.id ? { ...m, status: newStatus } : m));
      toast.success('Status berhasil diubah!', { id: toastId });
    } catch (error) {
      toast.error('Gagal mengubah status', { id: toastId });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Toaster position="top-right" />
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Struktur Menu Utama</h2>
          <p className="text-sm text-gray-500">Kelola tautan yang tampil pada navigasi publik (Enterprise Mode).</p>
        </div>
        <button 
          onClick={handleAddStart}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Tambah Menu
        </button>
      </div>

      <div className="p-4">
        {/* Formulir Edit/Tambah */}
        {(isAdding || editingId) && (
          <div className="bg-primary-50 p-4 rounded-xl mb-6 border border-primary-100">
            <h3 className="text-sm font-bold text-primary-800 mb-3">{isAdding ? 'Tambah Menu Baru' : 'Edit Menu'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Teks Menu</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Cth: Beranda" />
              </div>
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tautan Sumber (Modul)</label>
                <select 
                  value={formData.url} 
                  onChange={e => {
                    const url = e.target.value;
                    let suggestedName = formData.name;
                    if (!formData.name) {
                      if (url === '/') suggestedName = 'Beranda';
                      else if (url === '/sekolah') suggestedName = 'Sekolah';
                      else if (url === '/posyandu') suggestedName = 'Posyandu';
                      else if (url === '/sppg') suggestedName = 'SPPG';
                      else if (url === '/rantai-pasok') suggestedName = 'Rantai Pasok';
                      else if (url === '/pengaduan') suggestedName = 'Pengaduan';
                      else if (url === '/tentang') suggestedName = 'Tentang';
                    }
                    setFormData({...formData, url, name: suggestedName});
                  }} 
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                >
                  <option value="" disabled>-- Pilih Modul --</option>
                  <option value="/">Beranda (Halaman Utama)</option>
                  <option value="/sekolah">Modul Sekolah</option>
                  <option value="/posyandu">Modul Posyandu</option>
                  <option value="/sppg">Modul SPPG</option>
                  <option value="/rantai-pasok">Modul Rantai Pasok</option>
                  <option value="/pengaduan">Modul Lapor/Pengaduan</option>
                  <option value="/tentang">Modul Tentang</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Urutan</label>
                <input type="number" value={formData.urutan} onChange={e => setFormData({...formData, urutan: parseInt(e.target.value)||0})} className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={cancelEdit} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"><X size={16}/> Batal</button>
              <button onClick={handleSave} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center gap-2"><Save size={16}/> Simpan</button>
            </div>
          </div>
        )}

        {/* Tabel Data */}
        {menus.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Belum ada menu yang dikonfigurasi.
          </div>
        ) : (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase font-semibold text-gray-500">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">Urutan</th>
                  <th className="px-4 py-3">Struktur Menu</th>
                  <th className="px-4 py-3 w-32">Status</th>
                  <th className="px-4 py-3 w-24 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs">{menu.urutan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{menu.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5 font-mono">{menu.url}</div>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => toggleStatus(menu)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 transition-colors ${
                          menu.status === 'Aktif' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {menu.status === 'Aktif' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {menu.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(menu)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(menu.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
