'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Save, Activity, Search, Filter, Package, CheckCircle, Clock } from 'lucide-react';
import { createLaporanAktifitas } from '@/app/actions/laporanAktifitas';

type LaporanType = {
  id: number;
  tanggal: string | null;
  sppgName: string;
  sekolahName: string;
  menu: string;
  jumlahPorsi: number | null;
  status: string | null;
  verifikasi: any;
};

type DropdownData = {
  sppgList: { id: number, nama: string }[];
  sekolahList: { id: number, nama: string }[];
  posyanduList: { id: number, nama: string }[];
  menuList: { id: number, nama: string, kalori: number | null }[];
  isAdmin?: boolean;
  userSppgId?: number | null;
};

export default function LaporanAktifitasClient({ 
  laporanData,
  dropdownData
}: { 
  laporanData: LaporanType[],
  dropdownData: DropdownData
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVerifikasi, setSelectedVerifikasi] = useState<any>(null);
  const [tujuanTipe, setTujuanTipe] = useState<'Sekolah' | 'Posyandu'>('Sekolah');
  
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterPenerima, setFilterPenerima] = useState('');
  const [filterSppg, setFilterSppg] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dashboard Metrics for SPPG
  const todayStr = new Date().toISOString().split('T')[0];
  const todayReports = laporanData.filter(l => l.tanggal && l.tanggal.startsWith(todayStr));
  const totalPorsiHariIni = todayReports.reduce((sum, l) => sum + (l.jumlahPorsi || 0), 0);
  const totalDiterima = todayReports.filter(l => l.status === 'Diterima').length;
  const menungguVerifikasi = todayReports.filter(l => l.status === 'Terkirim').length;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = laporanData.filter(l => {
    let match = true;
    if (filterTanggal && l.tanggal) {
      if (!l.tanggal.startsWith(filterTanggal)) match = false;
    }
    if (filterPenerima && l.sekolahName) {
      if (!l.sekolahName.toLowerCase().includes(filterPenerima.toLowerCase())) match = false;
    }
    if (dropdownData.isAdmin && filterSppg && l.sppgName !== filterSppg) {
      match = false;
    }
    if (dropdownData.isAdmin && filterStatus && l.status !== filterStatus) {
      match = false;
    }
    return match;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await createLaporanAktifitas(formData);
    
    if (res.success) {
      setIsModalOpen(false);
      window.location.reload(); 
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laporan Harian SPPG</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Riwayat laporan pengiriman menu makanan dan detail verifikasi
            </p>
          </div>
        </div>
        
        {/* Actions */}
        {!dropdownData.isAdmin && (
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2 shadow-sm shadow-primary-500/20">
              <Plus size={18} />
              Buat Laporan Baru
            </button>
          </div>
        )}
      </div>

      {/* SPPG Dashboard Widget */}
      {!dropdownData.isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Porsi (Hari Ini)</p>
              <p className="text-2xl font-bold text-slate-800">{totalPorsiHariIni}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-300 transition-colors">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Laporan Diterima</p>
              <p className="text-2xl font-bold text-slate-800">{totalDiterima}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-colors">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Menunggu Verifikasi</p>
              <p className="text-2xl font-bold text-slate-800">{menungguVerifikasi}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/50">
          {dropdownData.isAdmin && (
            <div className="flex-1 md:max-w-xs flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
              <Filter size={16} className="text-slate-400" />
              <select value={filterSppg} onChange={(e) => setFilterSppg(e.target.value)} className="w-full text-sm outline-none bg-transparent cursor-pointer font-medium text-slate-700">
                <option value="">Semua SPPG</option>
                {dropdownData.sppgList.map(s => <option key={s.id} value={s.nama}>{s.nama}</option>)}
              </select>
            </div>
          )}
          {dropdownData.isAdmin && (
            <div className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
              <Activity size={16} className="text-slate-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm outline-none bg-transparent cursor-pointer font-medium text-slate-700">
                <option value="">Semua Status</option>
                <option value="Terkirim">Terkirim</option>
                <option value="Diterima">Diterima</option>
                <option value="Bermasalah">Bermasalah</option>
              </select>
            </div>
          )}
          <div className="flex-1 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama penerima (Sekolah/Posyandu)..." 
              className="w-full text-sm outline-none bg-transparent"
              value={filterPenerima}
              onChange={(e) => setFilterPenerima(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500 transition-all">
            <Filter size={16} className="text-slate-400" />
            <input 
              type="date" 
              className="text-sm outline-none bg-transparent text-slate-700"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
            />
            {filterTanggal && (
              <button onClick={() => setFilterTanggal('')} className="text-slate-400 hover:text-red-500">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Tanggal</th>
                <th className="p-4">SPPG (Dapur)</th>
                <th className="p-4">Tujuan (Sekolah/Posyandu)</th>
                <th className="p-4">Menu & Porsi</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredData.map((laporan) => (
                <tr key={laporan.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-slate-700 whitespace-nowrap">
                    {laporan.tanggal ? new Date(laporan.tanggal).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="p-4 font-bold text-primary-700">
                    {laporan.sppgName}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    {laporan.sekolahName}
                  </td>
                  <td className="p-4">
                    <p className="text-slate-700 font-medium mb-1 line-clamp-1">{laporan.menu}</p>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {laporan.jumlahPorsi} Porsi
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                      laporan.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : 
                      laporan.status === 'Bermasalah' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {laporan.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {laporan.verifikasi && (
                      <button 
                        onClick={() => setSelectedVerifikasi(laporan.verifikasi)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-800 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        Detail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Belum ada data laporan aktifitas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {isModalOpen && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Kirim Laporan Distribusi Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="laporanForm" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Tanggal Pengiriman</label>
                  <input type="date" name="tanggal" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>

                <input type="hidden" name="sppgId" value={dropdownData.sppgList.length > 0 ? dropdownData.sppgList[0].id : ''} />

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Tujuan Tipe</label>
                  <select name="tujuanTipe" required value={tujuanTipe} onChange={(e) => setTujuanTipe(e.target.value as any)} className="w-full p-2.5 rounded-lg border border-slate-300 outline-none bg-white">
                    <option value="Sekolah">Sekolah</option>
                    <option value="Posyandu">Posyandu</option>
                  </select>
                </div>

                {tujuanTipe === 'Sekolah' ? (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Sekolah Tujuan</label>
                    <select name="sekolahId" required className="w-full p-2.5 rounded-lg border border-slate-300 outline-none bg-white">
                      <option value="">-- Pilih Sekolah --</option>
                      {dropdownData.sekolahList.map(s => (
                        <option key={s.id} value={s.id}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Posyandu Tujuan</label>
                    <select name="posyanduId" required className="w-full p-2.5 rounded-lg border border-slate-300 outline-none bg-white">
                      <option value="">-- Pilih Posyandu --</option>
                      {dropdownData.posyanduList.map(s => (
                        <option key={s.id} value={s.id}>{s.nama}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="p-4 bg-primary-50 border border-primary-100 rounded-xl space-y-4 my-2">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary-800">Menu Standar yang Dikirim</label>
                    <p className="text-xs text-primary-600 mb-2">Pilih dari katalog standar menu gizi dinas.</p>
                    <select name="menuId" required className="w-full p-2.5 rounded-lg border border-primary-200 outline-none bg-white font-medium text-slate-800 focus:ring-2 focus:ring-primary-500">
                      <option value="">-- Pilih Menu Gizi --</option>
                      {dropdownData.menuList.map(m => (
                        <option key={m.id} value={m.id}>{m.nama} ({m.kalori} Kkal)</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-primary-800">Jumlah Porsi Dikirim</label>
                    <input type="number" name="jumlahPorsi" required min="1" className="w-full p-2.5 rounded-lg border border-primary-200 outline-none bg-white focus:ring-2 focus:ring-primary-500" placeholder="Contoh: 150" />
                  </div>
                </div>
                
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Batal
              </button>
              <button type="submit" form="laporanForm" disabled={isSubmitting} className="px-5 py-2.5 bg-primary-600 text-white font-medium hover:bg-primary-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-primary-600/30">
                <Save size={18} /> {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </div>
        </div>, document.body
      )}

      {selectedVerifikasi && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Detail Verifikasi</h3>
              <button onClick={() => setSelectedVerifikasi(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-semibold text-slate-500 mb-1">Status Diterima</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${selectedVerifikasi.statusDiterima === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {selectedVerifikasi.statusDiterima}
                  </span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500 mb-1">Kondisi Makanan</span>
                  <span className="font-medium text-slate-800">{selectedVerifikasi.kondisiMakanan}</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500 mb-1">Porsi Diterima</span>
                  <span className="font-medium text-slate-800">{selectedVerifikasi.jumlahPorsiDiterima} Porsi</span>
                </div>
                <div>
                  <span className="block font-semibold text-slate-500 mb-1">Diverifikasi Oleh</span>
                  <span className="font-medium text-slate-800">{selectedVerifikasi.diverifikasiOleh || '-'}</span>
                </div>
                <div className="col-span-2">
                  <span className="block font-semibold text-slate-500 mb-1">Waktu Verifikasi</span>
                  <span className="font-medium text-slate-800">{selectedVerifikasi.tanggalDiterima ? new Date(selectedVerifikasi.tanggalDiterima).toLocaleString('id-ID') : '-'}</span>
                </div>
                {selectedVerifikasi.catatan && (
                  <div className="col-span-2">
                    <span className="block font-semibold text-slate-500 mb-1">Catatan Tambahan</span>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {selectedVerifikasi.catatan}
                    </div>
                  </div>
                )}
                {selectedVerifikasi.fotoDokumentasi && (
                  <div className="col-span-2">
                    <span className="block font-semibold text-slate-500 mb-2">Foto Dokumentasi</span>
                    <img src={selectedVerifikasi.fotoDokumentasi} alt="Dokumentasi Verifikasi" className="w-full h-auto rounded-xl border border-slate-200" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
              <button type="button" onClick={() => setSelectedVerifikasi(null)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
}
