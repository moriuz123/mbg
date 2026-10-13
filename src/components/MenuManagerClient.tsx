'use client';

import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, CheckCircle, XCircle, Save, X, 
  ArrowUp, ArrowDown, ExternalLink, Link as LinkIcon, Compass, LayoutTemplate 
} from 'lucide-react';
import { addMenu, updateMenu, deleteMenu, updateMenuStatus, updateSiteSetting } from '@/app/actions/adminSettings';
import toast, { Toaster } from 'react-hot-toast';

type FooterLink = {
  title: string;
  url: string;
};

const defaultQuickLinks: FooterLink[] = [
  { title: 'Portal Lebak', url: 'https://lebakkab.go.id' },
  { title: 'Badan Gizi Nasional', url: 'https://www.bgn.go.id' },
  { title: 'Disketapang Kab. Lebak', url: 'https://disketapang.lebakkab.go.id' },
  { title: 'Dinkes Kab. Lebak', url: 'https://dinkes.lebakkab.go.id' },
  { title: 'Lapor', url: 'https://www.lapor.go.id/' },
  { title: 'Inspektorat Kab. Lebak', url: 'https://inspektorat.lebakkab.go.id' }
];

export default function MenuManagerClient({ 
  initialMenus, 
  initialFooterLinks 
}: { 
  initialMenus: any[]; 
  initialFooterLinks?: string;
}) {
  const [activeSection, setActiveSection] = useState<'header' | 'footer'>('header');

  // --- HEADER MENUS STATE ---
  const [menus, setMenus] = useState(initialMenus);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', url: '', urutan: 0 });

  // --- FOOTER LINKS STATE ---
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>(() => {
    if (initialFooterLinks) {
      try {
        const parsed = JSON.parse(initialFooterLinks);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return defaultQuickLinks;
  });
  const [editingFooterIdx, setEditingFooterIdx] = useState<number | null>(null);
  const [isAddingFooter, setIsAddingFooter] = useState(false);
  const [footerFormData, setFooterFormData] = useState<FooterLink>({ title: '', url: '' });
  const [isSavingFooter, setIsSavingFooter] = useState(false);

  // --- HEADER HANDLERS ---
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
        window.location.reload();
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

  // --- FOOTER HANDLERS ---
  const handleEditFooter = (index: number) => {
    setEditingFooterIdx(index);
    setFooterFormData({ ...footerLinks[index] });
    setIsAddingFooter(false);
  };

  const cancelFooterEdit = () => {
    setEditingFooterIdx(null);
    setFooterFormData({ title: '', url: '' });
    setIsAddingFooter(false);
  };

  const handleAddFooterStart = () => {
    setEditingFooterIdx(null);
    setFooterFormData({ title: '', url: 'https://' });
    setIsAddingFooter(true);
  };

  const handleSaveFooterItem = () => {
    if (!footerFormData.title || !footerFormData.url) {
      toast.error('Judul dan URL tautan tidak boleh kosong!');
      return;
    }

    let updated: FooterLink[];
    if (editingFooterIdx !== null) {
      updated = footerLinks.map((item, idx) => idx === editingFooterIdx ? footerFormData : item);
    } else {
      updated = [...footerLinks, footerFormData];
    }

    setFooterLinks(updated);
    cancelFooterEdit();
    toast.success('Tautan berhasil disimpan dalam daftar! Jangan lupa klik "Simpan ke Portal".');
  };

  const handleDeleteFooter = (index: number) => {
    if (confirm(`Yakin ingin menghapus tautan "${footerLinks[index].title}"?`)) {
      const updated = footerLinks.filter((_, idx) => idx !== index);
      setFooterLinks(updated);
      toast.success('Tautan dihapus dari daftar!');
    }
  };

  const moveFooterLink = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= footerLinks.length) return;

    const copy = [...footerLinks];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setFooterLinks(copy);
  };

  const handleSaveFooterToDatabase = async () => {
    setIsSavingFooter(true);
    const toastId = toast.loading('Menyimpan konfigurasi Tautan Cepat Footer...');
    try {
      await updateSiteSetting('footer_quick_links', JSON.stringify(footerLinks));
      toast.success('Tautan Cepat Footer berhasil diperbarui di portal publik!', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan perubahan footer', { id: toastId });
    } finally {
      setIsSavingFooter(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* TABS SELECTOR */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveSection('header')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeSection === 'header'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Compass size={18} /> Menu Header (Navigasi Utama)
        </button>
        <button
          onClick={() => setActiveSection('footer')}
          className={`pb-3 px-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeSection === 'footer'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <LayoutTemplate size={18} /> Tautan Cepat Footer
        </button>
      </div>

      {/* ================= TAB 1: HEADER NAVIGATION ================= */}
      {activeSection === 'header' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Struktur Menu Utama Header</h2>
              <p className="text-sm text-gray-500">Kelola tautan yang tampil pada navbar portal publik.</p>
            </div>
            <button 
              onClick={handleAddStart}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition flex items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Tambah Menu
            </button>
          </div>

          <div className="p-4">
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
                          else if (url === '/data-penggilingan') suggestedName = 'Data Penggilingan';
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
                      <option value="/data-penggilingan">Modul Data Penggilingan</option>
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
      )}

      {/* ================= TAB 2: FOOTER QUICK LINKS ================= */}
      {activeSection === 'footer' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Pengelolaan Tautan Cepat Footer</h2>
              <p className="text-sm text-gray-500">Kelola daftar tautan eksternal maupun internal pada kolom Tautan Cepat di footer publik.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddFooterStart}
                className="px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Tambah Tautan
              </button>
              <button 
                onClick={handleSaveFooterToDatabase}
                disabled={isSavingFooter}
                className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Save size={16} /> Simpan ke Portal
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Form Tambah/Edit Footer Link */}
            {(isAddingFooter || editingFooterIdx !== null) && (
              <div className="bg-amber-50/60 p-5 rounded-2xl mb-6 border border-amber-200">
                <h3 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                  <LinkIcon size={16} /> {isAddingFooter ? 'Tambah Tautan Cepat Baru' : 'Edit Tautan Cepat'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Judul / Label Tautan</label>
                    <input 
                      type="text" 
                      value={footerFormData.title} 
                      onChange={e => setFooterFormData({ ...footerFormData, title: e.target.value })} 
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white" 
                      placeholder="Cth: Portal Pemkab Lebak" 
                    />
                  </div>
                  <div className="md:col-span-7">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">URL Tujuan</label>
                    <input 
                      type="text" 
                      value={footerFormData.url} 
                      onChange={e => setFooterFormData({ ...footerFormData, url: e.target.value })} 
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white font-mono" 
                      placeholder="https://lebakkab.go.id" 
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={cancelFooterEdit} className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                    <X size={16} /> Batal
                  </button>
                  <button onClick={handleSaveFooterItem} className="px-4 py-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg flex items-center gap-2">
                    <Save size={16} /> Masukkan ke Daftar
                  </button>
                </div>
              </div>
            )}

            {/* List Tautan Footer */}
            {footerLinks.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                Belum ada tautan cepat yang ditambahkan.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                {footerLinks.map((link, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/70 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-0.5">
                        <button 
                          onClick={() => moveFooterLink(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 transition"
                          title="Pindah ke Atas"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => moveFooterLink(idx, 'down')}
                          disabled={idx === footerLinks.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 transition"
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>

                      <span className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-2">
                          {link.title}
                          {link.url.startsWith('http') && <ExternalLink size={12} className="text-gray-400" />}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{link.url}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditFooter(idx)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Tautan"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteFooter(idx)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Tautan"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span>* Klik <strong>Simpan ke Portal</strong> setelah melakukan penambahan, pengubahan, atau pengurutan.</span>
              <span className="font-semibold text-gray-700">{footerLinks.length} Tautan Aktif</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
