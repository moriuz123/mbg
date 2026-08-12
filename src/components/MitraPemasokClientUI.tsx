'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Phone, 
  MapPin, 
  Mail, 
  CheckCircle2, 
  Search, 
  X, 
  Edit3, 
  Trash2, 
  ShoppingCart,
  UserCheck
} from 'lucide-react';
import { createPemasok, updatePemasok, deletePemasok } from '@/app/actions/masterData';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface MitraPemasokClientUIProps {
  initialSuppliers: any[];
  isAdmin: boolean;
  userSppgId?: number | null;
}

export default function MitraPemasokClientUI({ 
  initialSuppliers, 
  isAdmin,
  userSppgId 
}: MitraPemasokClientUIProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredData = initialSuppliers.filter(item => {
    const matchesSearch = 
      item.namaPemasok?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.picNama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamatPemasok?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'Semua' || item.tipePemasok === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      namaPemasok: formData.get('namaPemasok') as string,
      tipePemasok: formData.get('tipePemasok') as string || 'Pemasok Pangan',
      picNama: formData.get('picNama') as string || null,
      picKontak: formData.get('picKontak') as string || null,
      email: formData.get('email') as string || null,
      alamatPemasok: formData.get('alamatPemasok') as string || null,
      status: (formData.get('status') as string) || 'Aktif',
    };

    let res;
    if (editingItem) {
      res = await updatePemasok(editingItem.id, payload);
    } else {
      res = await createPemasok(payload);
    }

    setIsSubmitting(false);

    if (res.success) {
      toast.success(editingItem ? 'Data pemasok berhasil diperbarui!' : 'Pemasok baru berhasil ditambahkan!');
      setIsModalOpen(false);
      setEditingItem(null);
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal menyimpan data pemasok');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const res = await deletePemasok(deleteId);
    setIsDeleting(false);
    setConfirmOpen(false);

    if (res.success) {
      toast.success('Pemasok berhasil dihapus');
      window.location.reload();
    } else {
      toast.error(res.error || 'Gagal menghapus pemasok');
    }
  };

  return (
    <div className="space-y-6">
      <ConfirmModal 
        isOpen={confirmOpen}
        title="Hapus Mitra Pemasok"
        message="Apakah Anda yakin ingin menghapus data pemasok ini? Tindakan ini tidak dapat dibatalkan."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* HEADER & FILTER BAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Daftar Mitra Pemasok SPPG</h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Direktori BUMDes, Koperasi Pangan, dan Vendor penyuplai bahan baku ke dapur.
            </p>
          </div>
        </div>

        <button 
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <Plus size={16} /> Tambah Mitra Pemasok
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
          {['Semua', 'BUMDes', 'Koperasi', 'Perusahaan', 'Individu/Petani'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                filterType === type 
                  ? 'bg-white text-emerald-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari pemasok, PIC, alamat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* GRID CARDS DAFTAR PEMASOK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold">
                  {item.tipePemasok || 'Pemasok Pangan'}
                </span>
                <span className={`text-xs font-bold flex items-center gap-1 ${item.status === 'Nonaktif' ? 'text-slate-400' : 'text-emerald-600'}`}>
                  <CheckCircle2 size={14} /> {item.status || 'Aktif'}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.namaPemasok}
                </h3>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                  <MapPin size={14} className="text-slate-400 shrink-0" /> {item.alamatPemasok || 'Kabupaten Lebak'}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <div className="text-xs flex items-center justify-between">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <UserCheck size={14} /> PIC Vendor:
                  </span>
                  <span className="font-bold text-slate-800">{item.picNama || '-'}</span>
                </div>

                {item.picKontak && item.picKontak !== '-' && (
                  <div className="text-xs flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Phone size={14} /> WhatsApp:
                    </span>
                    <a 
                      href={`https://wa.me/${item.picKontak.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1 bg-emerald-100/60 px-2 py-0.5 rounded-md"
                    >
                      {item.picKontak}
                    </a>
                  </div>
                )}

                {item.email && (
                  <div className="text-xs flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Mail size={14} /> Email:
                    </span>
                    <span className="font-semibold text-slate-600 truncate max-w-[150px]">{item.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs font-semibold text-slate-400">
                {item.totalPembelian ? `${item.totalPembelian} Transaksi` : 'Mitra Terdaftar'}
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                  title="Edit Pemasok"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(item.id)}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Hapus Pemasok"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-500">
            <Building2 size={48} className="mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-slate-700 text-base">Belum Ada Mitra Pemasok Terdaftar</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Klik tombol &quot;Tambah Mitra Pemasok&quot; di atas untuk memasukkan data BUMDes, Koperasi Pangan, atau Kelompok Tani mitra dapur Anda.
            </p>
          </div>
        )}
      </div>

      {/* MODAL FORM TAMBAH / EDIT PEMASOK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingItem ? 'Edit Data Mitra Pemasok' : 'Tambah Mitra Pemasok Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Pemasok / Vendor <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="namaPemasok" 
                  required 
                  defaultValue={editingItem?.namaPemasok || ''}
                  placeholder="Misal: BUMDes Cibadak Mandiri / Koperasi Pangan"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tipe Pemasok <span className="text-red-500">*</span></label>
                  <select 
                    name="tipePemasok" 
                    required 
                    defaultValue={editingItem?.tipePemasok || 'BUMDes'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white"
                  >
                    <option value="BUMDes">BUMDes</option>
                    <option value="Koperasi">Koperasi Pangan</option>
                    <option value="Perusahaan">Perusahaan / PT / CV</option>
                    <option value="Individu/Petani">Kelompok Tani / Petani</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status Aktif</label>
                  <select 
                    name="status" 
                    defaultValue={editingItem?.status || 'Aktif'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama PIC / Pengelola</label>
                  <input 
                    type="text" 
                    name="picNama" 
                    defaultValue={editingItem?.picNama || ''}
                    placeholder="Nama Kontak PIC"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">No. Telepon / WhatsApp</label>
                  <input 
                    type="text" 
                    name="picKontak" 
                    defaultValue={editingItem?.picKontak || ''}
                    placeholder="08123456789"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Vendor</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={editingItem?.email || ''}
                  placeholder="pemasok@domain.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Lengkap</label>
                <textarea 
                  name="alamatPemasok" 
                  rows={3}
                  defaultValue={editingItem?.alamatPemasok || ''}
                  placeholder="Alamat kantor / lokasi gudang pemasok..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold text-xs transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-xs transition-all shadow-md shadow-emerald-600/20 disabled:opacity-70"
                >
                  {isSubmitting ? 'Menyimpan...' : (editingItem ? 'Update Pemasok' : 'Simpan Pemasok')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
