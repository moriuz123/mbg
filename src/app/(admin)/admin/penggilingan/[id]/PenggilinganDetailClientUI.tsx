'use client';

import React, { useState } from 'react';
import { ArrowLeft, Wheat, Factory, Truck, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { addSumberGabah, addProduksi, addDistribusi } from '@/app/actions/penggilingan';

export default function PenggilinganDetailClientUI({ 
  penggilingan, 
  sumberGabahList,
  produksiList,
  distribusiList,
  sppgList
}: { 
  penggilingan: any;
  sumberGabahList: any[];
  produksiList: any[];
  distribusiList: any[];
  sppgList: any[];
}) {
  const [activeTab, setActiveTab] = useState<'sumber' | 'produksi' | 'distribusi'>('sumber');
  
  // Modal states
  const [isSumberOpen, setIsSumberOpen] = useState(false);
  const [isProduksiOpen, setIsProduksiOpen] = useState(false);
  const [isDistribusiOpen, setIsDistribusiOpen] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipeTujuan, setTipeTujuan] = useState('SPPG');

  // Submit Sumber Gabah
  async function handleSumberSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addSumberGabah({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      sumberGabah: formData.get('sumberGabah') as string,
      volumeKg: formData.get('volumeKg') as string,
      hargaBeliPerKg: formData.get('hargaBeliPerKg') as string,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) setIsSumberOpen(false);
    else alert(res.error);
  }

  // Submit Produksi
  async function handleProduksiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const res = await addProduksi({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      kapasitasRealisasiKg: formData.get('kapasitasRealisasiKg') as string,
      rendemenPersen: formData.get('rendemenPersen') as string,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) setIsProduksiOpen(false);
    else alert(res.error);
  }

  // Submit Distribusi
  async function handleDistribusiSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const sppgId = formData.get('sppgTujuanId') as string;
    
    const res = await addDistribusi({
      penggilinganId: penggilingan.id,
      mingguMulai: formData.get('mingguMulai') as string,
      mingguSelesai: formData.get('mingguSelesai') as string,
      volumeKg: formData.get('volumeKg') as string,
      tujuanTipe: tipeTujuan,
      sppgTujuanId: tipeTujuan === 'SPPG' && sppgId ? parseInt(sppgId, 10) : undefined,
      lokasiLain: tipeTujuan === 'Lainnya' ? formData.get('lokasiLain') as string : undefined,
      catatan: formData.get('catatan') as string,
    });
    setIsSubmitting(false);
    if (res.success) setIsDistribusiOpen(false);
    else alert(res.error);
  }

  return (
    <>
      <div className="mb-6">
        <Link href="/admin/penggilingan" className="text-slate-500 hover:text-primary-600 flex items-center gap-2 font-medium transition-colors w-fit">
          <ArrowLeft size={18} /> Kembali ke Daftar Penggilingan
        </Link>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('sumber')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'sumber' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Wheat size={18} /> Sumber Gabah
        </button>
        <button 
          onClick={() => setActiveTab('produksi')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'produksi' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Factory size={18} /> Realisasi Produksi
        </button>
        <button 
          onClick={() => setActiveTab('distribusi')}
          className={`px-5 py-3 font-semibold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'distribusi' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
        >
          <Truck size={18} /> Distribusi Beras
        </button>
      </div>

      {/* TAB CONTENT: SUMBER GABAH */}
      {activeTab === 'sumber' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsSumberOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold">
              <Plus size={18} /> Tambah Sumber Gabah
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Periode (Mingguan)</th>
                  <th className="p-4">Sumber / Asal Gabah</th>
                  <th className="p-4 text-right">Volume (Kg)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {sumberGabahList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4">{item.sumberGabah}</td>
                    <td className="p-4 text-right font-bold text-slate-900">{item.volumeKg} kg</td>
                  </tr>
                ))}
                {sumberGabahList.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data sumber gabah.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUKSI */}
      {activeTab === 'produksi' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsProduksiOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold">
              <Plus size={18} /> Tambah Realisasi
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Periode (Mingguan)</th>
                  <th className="p-4 text-right">Realisasi (Kg)</th>
                  <th className="p-4 text-right">Rendemen (%)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {produksiList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4 text-right font-bold text-slate-900">{item.kapasitasRealisasiKg} kg</td>
                    <td className="p-4 text-right text-slate-600">{item.rendemenPersen ? `${item.rendemenPersen}%` : '-'}</td>
                  </tr>
                ))}
                {produksiList.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data realisasi produksi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DISTRIBUSI */}
      {activeTab === 'distribusi' && (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setIsDistribusiOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-semibold">
              <Plus size={18} /> Tambah Distribusi
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4">Periode (Mingguan)</th>
                  <th className="p-4">Tujuan</th>
                  <th className="p-4 text-right">Volume Beras (Kg)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {distribusiList.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="p-4 font-medium text-slate-700">{item.mingguMulai} <span className="text-slate-400">s/d</span> {item.mingguSelesai}</td>
                    <td className="p-4">
                      <span className="inline-flex px-2 py-0.5 mr-2 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">{item.tujuanTipe}</span>
                      {item.tujuanTipe === 'SPPG' ? item.sppgTujuan?.namaSppg : item.lokasiLain}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">{item.volumeKg} kg</td>
                  </tr>
                ))}
                {distribusiList.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data distribusi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: SUMBER GABAH */}
      {isSumberOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsSumberOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={24} /></button>
            <h2 className="mt-0 mb-6 text-xl font-bold">Catat Sumber Gabah</h2>
            <form onSubmit={handleSumberSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Mulai</label>
                  <input required name="mingguMulai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Selesai</label>
                  <input required name="mingguSelesai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">Asal/Sumber Gabah *</label>
                <input required name="sumberGabah" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" placeholder="Contoh: Petani Lokal Lebak" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Volume (Kg) *</label>
                  <input required name="volumeKg" type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Harga Beli / Kg</label>
                  <input name="hargaBeliPerKg" type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Catatan</label>
                <textarea name="catatan" rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-lg font-bold">{isSubmitting ? 'Loading...' : 'Simpan'}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRODUKSI */}
      {isProduksiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsProduksiOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={24} /></button>
            <h2 className="mt-0 mb-6 text-xl font-bold">Catat Realisasi Produksi</h2>
            <form onSubmit={handleProduksiSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Mulai</label>
                  <input required name="mingguMulai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Selesai</label>
                  <input required name="mingguSelesai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Realisasi Produksi (Kg) *</label>
                  <input required name="kapasitasRealisasiKg" type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Rendemen (%)</label>
                  <input name="rendemenPersen" type="number" step="0.01" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Catatan</label>
                <textarea name="catatan" rows={2} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
              </div>
              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-lg font-bold">{isSubmitting ? 'Loading...' : 'Simpan'}</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISTRIBUSI */}
      {isDistribusiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
            <button onClick={() => setIsDistribusiOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700"><X size={24} /></button>
            <h2 className="mt-0 mb-6 text-xl font-bold">Catat Distribusi Beras</h2>
            <form onSubmit={handleDistribusiSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Mulai</label>
                  <input required name="mingguMulai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold">Tgl Selesai</label>
                  <input required name="mingguSelesai" type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">Volume Beras (Kg) *</label>
                <input required name="volumeKg" type="number" step="0.01" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" placeholder="0" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold">Tipe Tujuan *</label>
                <select value={tipeTujuan} onChange={(e) => setTipeTujuan(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50">
                  <option value="SPPG">Dapur SPPG</option>
                  <option value="Lainnya">Lainnya / Umum</option>
                </select>
              </div>
              {tipeTujuan === 'SPPG' ? (
                <div>
                  <label className="block mb-1 text-sm font-semibold">Pilih SPPG Tujuan *</label>
                  <select required name="sppgTujuanId" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50">
                    <option value="">-- Pilih --</option>
                    {sppgList.map(s => <option key={s.id} value={s.id}>{s.namaSppg}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block mb-1 text-sm font-semibold">Lokasi Tujuan *</label>
                  <input required name="lokasiLain" type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary-500/50" placeholder="Contoh: Pasar Tradisional" />
                </div>
              )}
              <button type="submit" disabled={isSubmitting} className="mt-2 w-full p-3 bg-primary-600 text-white rounded-lg font-bold">{isSubmitting ? 'Loading...' : 'Simpan'}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
