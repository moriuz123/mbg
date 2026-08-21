'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Save, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { saveStandarMenu, deleteStandarMenu } from '@/app/actions/standarMenu';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Menu = {
  id: number;
  namaMenu: string;
  deskripsi: string | null;
  jenisMakan: string | null;
  kaloriKkal: number | null;
  proteinGram: string | null;
  karbohidratGram: string | null;
  lemakGram: string | null;
  status: string | null;
  kategoriTargetId: number | null;
  sppgId: number | null;
  kategoriNama: string | null;
};

type Kategori = {
  id: number;
  namaKategori: string;
};

type AKG = {
  id: number;
  kategoriId: number;
  jenisMakan: string;
  minEnergiKkal: string;
  maxEnergiKkal: string;
  minProteinGram: string;
  maxProteinGram: string;
  minLemakGram: string;
  maxLemakGram: string;
  minKarbohidratGram: string;
  maxKarbohidratGram: string;
};

export default function StandarMenuClient({
  initialData,
  kategoriList,
  akgList = []
}: {
  initialData: Menu[],
  kategoriList: Kategori[],
  akgList?: AKG[]
}) {
  const [data, setData] = useState<Menu[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Menu | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [mounted, setMounted] = useState(false);
  
  // Form States for Validation
  const [fKalori, setFKalori] = useState('');
  const [fProtein, setFProtein] = useState('');
  const [fKarbo, setFKarbo] = useState('');
  const [fLemak, setFLemak] = useState('');
  const [fKategoriId, setFKategoriId] = useState('');
  const [fJenisMakan, setFJenisMakan] = useState('Siang');

  useEffect(() => {
    setMounted(true);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFKalori(''); setFProtein(''); setFKarbo(''); setFLemak(''); setFKategoriId(''); setFJenisMakan('Siang');
    setIsModalOpen(true);
  };

  const openEditModal = (item: Menu) => {
    setEditingItem(item);
    setFKalori(item.kaloriKkal?.toString() || '');
    setFProtein(item.proteinGram || '');
    setFKarbo(item.karbohidratGram || '');
    setFLemak(item.lemakGram || '');
    setFKategoriId(item.kategoriTargetId?.toString() || '');
    setFJenisMakan(item.jenisMakan || 'Siang');
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    setIsDeleting(true);
    const res = await deleteStandarMenu(confirmId);
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res.success) {
      setToastType('success');
      setToastMessage(res.message);
      router.refresh();
    } else {
      setToastType('error');
      setToastMessage(res.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    if (editingItem) {
      formData.append('id', editingItem.id.toString());
    }

    try {
      const res = await saveStandarMenu(formData);
      
      if (res.success) {
        setIsModalOpen(false);
        setToastType('success');
        setToastMessage(res.message);
        router.refresh();
      } else {
        setToastType('error');
        setToastMessage(res.message);
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation Logic
  const getValidation = () => {
    if (!fKategoriId || !fJenisMakan) return null;
    const akg = akgList.find(a => a.kategoriId.toString() === fKategoriId && a.jenisMakan === fJenisMakan);
    if (!akg) return null;

    const valKalori = parseFloat(fKalori);
    const valProtein = parseFloat(fProtein);
    const valKarbo = parseFloat(fKarbo);
    const valLemak = parseFloat(fLemak);

    const isKaloriOk = !isNaN(valKalori) && valKalori >= parseFloat(akg.minEnergiKkal) && valKalori <= parseFloat(akg.maxEnergiKkal);
    const isProteinOk = !isNaN(valProtein) && valProtein >= parseFloat(akg.minProteinGram) && valProtein <= parseFloat(akg.maxProteinGram);
    const isKarboOk = !isNaN(valKarbo) && valKarbo >= parseFloat(akg.minKarbohidratGram) && valKarbo <= parseFloat(akg.maxKarbohidratGram);
    const isLemakOk = !isNaN(valLemak) && valLemak >= parseFloat(akg.minLemakGram) && valLemak <= parseFloat(akg.maxLemakGram);

    return { akg, isKaloriOk, isProteinOk, isKarboOk, isLemakOk };
  };

  const v = getValidation();
  const isFormValid = v ? (v.isKaloriOk && v.isProteinOk && v.isKarboOk && v.isLemakOk) : true;

  return (
    <div>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      
      <ConfirmModal
        isOpen={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Data"
        message="Apakah Anda yakin ingin menghapus menu ini? Data yang dihapus tidak dapat dikembalikan."
        isLoading={isDeleting}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Daftar Menu Gizi</h2>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} /> Tambah Menu
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-sm text-slate-600">Menu & Deskripsi</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Kalori (Kkal)</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Makronutrien</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Target</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="p-4 font-semibold text-sm text-slate-600 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map(item => (
                <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {item.namaMenu}
                      {item.sppgId ? (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Custom SPPG</span>
                      ) : (
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Global (Dinas)</span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 max-w-xs truncate mt-1">{item.deskripsi || '-'}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{item.kaloriKkal || '-'}</td>
                  <td className="p-4">
                    <div className="text-xs text-slate-600">
                      Pro: <span className="font-medium text-slate-900">{item.proteinGram || '-'}g</span> • 
                      Karbo: <span className="font-medium text-slate-900">{item.karbohidratGram || '-'}g</span> • 
                      Lemak: <span className="font-medium text-slate-900">{item.lemakGram || '-'}g</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium mb-1 mr-1">
                      {item.kategoriNama || 'Umum'}
                    </span>
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {item.jenisMakan || 'Siang'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${item.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Menu"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Belum ada data standar menu gizi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-t-0 border-slate-200 rounded-b-xl">
          <div className="text-sm text-slate-500">
            Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> hingga <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> dari <span className="font-medium">{data.length}</span> entri
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center px-4 font-medium text-sm text-slate-700">
              {currentPage} / {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {editingItem ? 'Edit Menu Gizi' : 'Tambah Menu Gizi Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form id="menuForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Info Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Kategori Target</label>
                    <select name="kategoriTargetId" value={fKategoriId} onChange={e => setFKategoriId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white cursor-pointer">
                      <option value="">-- Berlaku Umum --</option>
                      {kategoriList.map(k => (
                        <option key={k.id} value={k.id}>{k.namaKategori}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Waktu Makan</label>
                    <select name="jenisMakan" value={fJenisMakan} onChange={e => setFJenisMakan(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white cursor-pointer">
                      <option value="Pagi">Makan Pagi (Sarapan)</option>
                      <option value="Siang">Makan Siang</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nama Menu</label>
                  <input type="text" name="namaMenu" defaultValue={editingItem?.namaMenu} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Contoh: Nasi, Ayam Bakar, Sayur Bayam, Susu" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Deskripsi Ringkas</label>
                  <textarea name="deskripsi" defaultValue={editingItem?.deskripsi || ''} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all" placeholder="Komposisi bahan..."></textarea>
                </div>

                {v && (
                  <div className={`p-4 rounded-xl flex gap-3 items-start border ${isFormValid ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm mb-1">
                        {isFormValid ? 'Memenuhi Standar AKG' : 'Belum Memenuhi Standar AKG BGN'}
                      </p>
                      <p className="text-xs opacity-90 leading-relaxed">
                        Sistem memvalidasi menu ini untuk target <strong>{kategoriList.find(k => k.id.toString() === fKategoriId)?.namaKategori}</strong> waktu <strong>{fJenisMakan}</strong>.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Kalori (Kkal)</label>
                    <input type="number" name="kaloriKkal" value={fKalori} onChange={e => setFKalori(e.target.value)} required min="0" className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${v && !v.isKaloriOk && fKalori ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'}`} />
                    {v && (
                      <div className={`text-[10px] font-medium ${v.isKaloriOk ? 'text-green-600' : 'text-red-500'}`}>
                        Standar: {v.akg.minEnergiKkal} - {v.akg.maxEnergiKkal}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Protein (g)</label>
                    <input type="number" step="0.1" name="proteinGram" value={fProtein} onChange={e => setFProtein(e.target.value)} required min="0" className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${v && !v.isProteinOk && fProtein ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'}`} />
                    {v && (
                      <div className={`text-[10px] font-medium ${v.isProteinOk ? 'text-green-600' : 'text-red-500'}`}>
                        Standar: {v.akg.minProteinGram} - {v.akg.maxProteinGram}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Karbohidrat (g)</label>
                    <input type="number" step="0.1" name="karbohidratGram" value={fKarbo} onChange={e => setFKarbo(e.target.value)} required min="0" className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${v && !v.isKarboOk && fKarbo ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'}`} />
                    {v && (
                      <div className={`text-[10px] font-medium ${v.isKarboOk ? 'text-green-600' : 'text-red-500'}`}>
                        Standar: {v.akg.minKarbohidratGram} - {v.akg.maxKarbohidratGram}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Lemak (g)</label>
                    <input type="number" step="0.1" name="lemakGram" value={fLemak} onChange={e => setFLemak(e.target.value)} required min="0" className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${v && !v.isLemakOk && fLemak ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:ring-primary-500/20 focus:border-primary-500'}`} />
                    {v && (
                      <div className={`text-[10px] font-medium ${v.isLemakOk ? 'text-green-600' : 'text-red-500'}`}>
                        Standar: {v.akg.minLemakGram} - {v.akg.maxLemakGram}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select name="status" defaultValue={editingItem?.status || 'Aktif'} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white cursor-pointer">
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="menuForm" disabled={isSubmitting || !isFormValid} className="px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed">
                <Save size={18} /> {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
