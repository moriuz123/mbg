'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, Package, Calendar, MapPin, Search } from 'lucide-react';
import { createSupplyChain, deleteSupplyChain } from '@/app/actions/supplyChain';

export default function SupplyChainClientUI({ 
  initialData, 
  sppgList,
  jenisPanganList,
  pemasokList
}: { 
  initialData: any[];
  sppgList: any[];
  jenisPanganList: any[];
  pemasokList: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter Data
  const filteredData = initialData.filter(item => {
    return (
      item.sppg?.namaSppg?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisPangan?.namaBahan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pemasok?.namaPemasok?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sppgId: parseInt(formData.get('sppgId') as string, 10),
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string, 10),
      pemasokId: formData.get('pemasokId') ? parseInt(formData.get('pemasokId') as string, 10) : undefined,
      kebutuhanPerBulan: formData.get('kebutuhanPerBulan') as string,
      satuan: formData.get('satuan') as string || 'Kilogram',
      periode: formData.get('periode') as string,
    };

    const res = await createSupplyChain(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus data rantai pasok ini?')) {
      await deleteSupplyChain(id);
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 sm:text-sm transition-all"
            placeholder="Cari Dapur, Bahan, atau Pemasok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 w-full sm:w-auto bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Data Pasok
        </button>
      </div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Rantai Pasok</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Dapur SPPG *</label>
                <select required name="sppgId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                  <option value="">-- Pilih SPPG --</option>
                  {sppgList.map(item => (
                    <option key={item.id} value={item.id}>{item.namaSppg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Jenis Bahan Pangan *</label>
                <select required name="jenisPanganId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                  <option value="">-- Pilih Bahan --</option>
                  {jenisPanganList.map(item => (
                    <option key={item.id} value={item.id}>{item.namaBahan} ({item.satuanDefault})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Pemasok / Vendor (Opsional)</label>
                <select name="pemasokId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                  <option value="">-- Tidak Ada / Beli Langsung --</option>
                  {pemasokList.map(item => (
                    <option key={item.id} value={item.id}>{item.namaPemasok}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kebutuhan/Bulan</label>
                  <input required name="kebutuhanPerBulan" type="number" step="0.01" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="Contoh: 50.5" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Satuan</label>
                  <select name="satuan" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all">
                    <option value="Kilogram">Kilogram (kg)</option>
                    <option value="Liter">Liter (L)</option>
                    <option value="Gram">Gram (g)</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Ikat">Ikat</option>
                    <option value="Karton">Karton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Periode (Bulan/Tahun)</label>
                <input required name="periode" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                <p className="text-xs text-slate-500 mt-1">Tanggal ini digunakan untuk mencatat bulan kebutuhan.</p>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Dapur SPPG</th>
                <th className="p-5">Bahan Pangan</th>
                <th className="p-5 text-right">Kebutuhan / Bulan</th>
                <th className="p-5">Pemasok</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base">{item.sppg?.namaSppg || 'Tidak Diketahui'}</div>
                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} /> Periode: {new Date(item.periode).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="p-5 font-bold text-slate-700">{item.jenisPangan?.namaBahan || 'Tidak Diketahui'}</td>
                  <td className="p-5 text-right">
                    <span className="inline-flex px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold">
                      {item.kebutuhanPerBulan} {item.satuan}
                    </span>
                  </td>
                  <td className="p-5">
                    {item.pemasok ? (
                      <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <MapPin size={14} className="text-slate-400" /> {item.pemasok.namaPemasok}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Belum Ada Pemasok</span>
                    )}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                      title="Hapus Data"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data Rantai Pasok</p>
                    <p className="text-sm text-slate-400 mt-1">Gunakan tombol tambah untuk mencatat kebutuhan bahan baku SPPG.</p>
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
