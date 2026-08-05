'use client';

import React, { useState } from 'react';
import { Plus, X, GraduationCap, MapPin, Users, Trash2, Edit2 } from 'lucide-react';
import { createSekolah, deleteSekolah } from './actions';

export default function SekolahClientUI({ initialData, categories }: { initialData: any[], categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      namaSekolah: formData.get('namaSekolah') as string,
      npsn: formData.get('npsn') as string,
      kategoriId: parseInt(formData.get('kategoriId') as string),
      alamatSekolah: formData.get('alamatSekolah') as string,
      namaKepalaSekolah: formData.get('namaKepalaSekolah') as string,
      noHpKepalaSekolah: formData.get('noHpKepalaSekolah') as string,
      jumlahSiswaLaki: parseInt(formData.get('jumlahSiswaLaki') as string) || 0,
      jumlahSiswaPerempuan: parseInt(formData.get('jumlahSiswaPerempuan') as string) || 0,
      tahunAjaranLast: formData.get('tahunAjaranLast') as string,
    };

    const res = await createSekolah(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Yakin ingin menghapus data sekolah ini?')) {
      await deleteSekolah(id);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-md shadow-primary-600/20 hover:bg-primary-700 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} /> Tambah Sekolah
        </button>
      </div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-8 relative shadow-2xl my-8">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Data Sekolah</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Sekolah *</label>
                  <input required name="namaSekolah" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Contoh: SDN 1 Rangkasbitung" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">NPSN</label>
                  <input name="npsn" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nomor Pokok Sekolah Nasional" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Kategori / Jenjang *</label>
                  <select required name="kategoriId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all">
                    <option value="">Pilih Kategori...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.namaKategori}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tahun Ajaran</label>
                  <input name="tahunAjaranLast" type="text" defaultValue="2025/2026" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="2025/2026" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Jumlah Siswa Laki-Laki *</label>
                  <input required name="jumlahSiswaLaki" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Jumlah Siswa Perempuan *</label>
                  <input required name="jumlahSiswaPerempuan" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Nama Kepala Sekolah</label>
                  <input name="namaKepalaSekolah" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">No. HP Kepala Sekolah</label>
                  <input name="noHpKepalaSekolah" type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="08..." />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Alamat Lengkap Sekolah</label>
                <textarea name="alamatSekolah" rows={3} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all" placeholder="Alamat lengkap sekolah..."></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-4 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan Data...' : 'Simpan Data Sekolah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sekolah & Jenjang</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Sekolah</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Siswa (L/P)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <GraduationCap size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada data sekolah</p>
                    <p className="text-sm text-slate-400 mt-1">Silakan tambahkan data master sekolah baru.</p>
                  </td>
                </tr>
              ) : (
                initialData.map((sekolah) => (
                  <tr key={sekolah.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
                    <td className="px-6 py-5">
                      <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                        {sekolah.namaSekolah}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100">
                          {sekolah.kategori}
                        </span>
                        {sekolah.npsn && (
                          <span className="text-xs font-medium text-slate-400">NPSN: {sekolah.npsn}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-slate-800 font-medium">{sekolah.namaKepalaSekolah || '-'}</div>
                      <div className="text-xs text-slate-500 mt-1">{sekolah.noHpKepalaSekolah || '-'}</div>
                    </td>
                    <td className="px-6 py-5 text-slate-600">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md text-xs">L: {sekolah.jumlahSiswaLaki}</span>
                        <span className="text-pink-600 font-medium bg-pink-50 px-2 py-0.5 rounded-md text-xs">P: {sekolah.jumlahSiswaPerempuan}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                        <Users size={14} className="text-slate-500" /> {sekolah.jumlahSiswaTotal}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(sekolah.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Hapus Sekolah"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
