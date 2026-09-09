'use client';

import React, { useState } from 'react';
import { PackagePlus, PackageMinus, TestTube2, AlertCircle, Plus, Check, X, Trash2 } from 'lucide-react';
import { 
  createPembelianBahan, 
  createPemakaianBahan, 
  createUjiRapidTest,
  deletePembelianBahan,
  deletePemakaianBahan,
  deleteUjiRapidTest
} from '@/app/actions/sppgPengawasan';
import toast from 'react-hot-toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function PengawasanClient({
  initialPembelian,
  initialPemakaian,
  initialUjiRapid,
  masterParameterList,
  pemasokList,
  jenisPanganList,
  standarMenuList,
  sppgList,
  isAdmin,
  userSppgId
}: any) {
  const [activeTab, setActiveTab] = useState<'pembelian' | 'pemakaian' | 'uji'>('pembelian');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sumberPasokan, setSumberPasokan] = useState('Pembelian Lokal');
  const [selectedParameterId, setSelectedParameterId] = useState<string>('');

  // Safe Array Checks
  const safePembelian = Array.isArray(initialPembelian) ? initialPembelian : [];
  const safePemakaian = Array.isArray(initialPemakaian) ? initialPemakaian : [];
  const safeUjiRapid = Array.isArray(initialUjiRapid) ? initialUjiRapid : [];
  const safeMasterParameterList = Array.isArray(masterParameterList) ? masterParameterList : [];
  const safePemasokList = Array.isArray(pemasokList) ? pemasokList : [];
  const safeJenisPanganList = Array.isArray(jenisPanganList) ? jenisPanganList : [];
  const safeStandarMenuList = Array.isArray(standarMenuList) ? standarMenuList : [];
  const safeSppgList = Array.isArray(sppgList) ? sppgList : [];

  // Delete State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; type: 'pembelian' | 'pemakaian' | 'uji' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let res;
    if (activeTab === 'pembelian') {
      res = await createPembelianBahan(formData);
    } else if (activeTab === 'pemakaian') {
      res = await createPemakaianBahan(formData);
    } else {
      res = await createUjiRapidTest(formData);
    }

    setIsSubmitting(false);
    if (res.success) {
      toast.success(res.message);
      setIsModalOpen(false);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteClick = (id: number, type: 'pembelian' | 'pemakaian' | 'uji') => {
    setDeleteTarget({ id, type });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    let res;
    if (deleteTarget.type === 'pembelian') {
      res = await deletePembelianBahan(deleteTarget.id);
    } else if (deleteTarget.type === 'pemakaian') {
      res = await deletePemakaianBahan(deleteTarget.id);
    } else {
      res = await deleteUjiRapidTest(deleteTarget.id);
    }
    setIsDeleting(false);
    setConfirmOpen(false);

    if (res.success) {
      toast.success(res.message);
      window.location.reload();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <ConfirmModal 
        isOpen={confirmOpen}
        title="Hapus Catatan Pengawasan"
        message="Apakah Anda yakin ingin menghapus data ini? Data yang dihapus akan memperbarui sisa stok gudang otomatis."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex-wrap sm:flex-nowrap gap-1">
        <button
          onClick={() => setActiveTab('pembelian')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'pembelian'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PackagePlus size={18} />
          Pembelian Bahan ({safePembelian.length})
        </button>
        <button
          onClick={() => setActiveTab('pemakaian')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'pemakaian'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <PackageMinus size={18} />
          Pemakaian Harian ({safePemakaian.length})
        </button>
        <button
          onClick={() => setActiveTab('uji')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'uji'
              ? 'bg-primary-600 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <TestTube2 size={18} />
          Uji Rapid Test ({safeUjiRapid.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {activeTab === 'pembelian' && 'Riwayat Pembelian & Logistik Masuk'}
              {activeTab === 'pemakaian' && 'Catatan Pemakaian Bahan Dapur (Keluar)'}
              {activeTab === 'uji' && 'Hasil Pengujian Rapid Test Keamanan Pangan'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {activeTab === 'pembelian' && 'Transparansi sumber pangan dari mitra pemasok lokal.'}
              {activeTab === 'pemakaian' && 'Volume bahan baku yang diolah untuk menu MBG.'}
              {activeTab === 'uji' && 'Hasil sampel pengujian bebas bahan kimia berbahaya & mikrobiologi.'}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-primary-700 transition-all shadow-sm shrink-0"
          >
            <Plus size={18} />
            Catat {activeTab === 'pembelian' ? 'Pembelian' : activeTab === 'pemakaian' ? 'Pemakaian' : 'Hasil Uji'}
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                {activeTab === 'pembelian' && (
                  <>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Bahan Pangan</th>
                    <th className="px-6 py-4">Volume</th>
                    <th className="px-6 py-4">Pemasok</th>
                    
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </>
                )}
                {activeTab === 'pemakaian' && (
                  <>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Bahan Pangan</th>
                    <th className="px-6 py-4">Volume Digunakan</th>
                    <th className="px-6 py-4">Menu Terkait</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </>
                )}
                {activeTab === 'uji' && (
                  <>
                    <th className="px-6 py-4">Tanggal Uji</th>
                    <th className="px-6 py-4">Bahan Pangan</th>
                    <th className="px-6 py-4">Parameter Uji</th>
                    <th className="px-6 py-4">Hasil Uji</th>
                    <th className="px-6 py-4">Tindakan Lanjut</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {activeTab === 'pembelian' && safePembelian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalPembelian}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Pangan'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{d.volume} {d.satuan}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.pemasokNama || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'pembelian')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Pembelian"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'pemakaian' && safePemakaian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalPemakaian}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Pangan'}</td>
                  <td className="px-6 py-4 font-bold text-amber-600">{d.volume} {d.satuan}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.menuNama || 'Umum / Dapur'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'pemakaian')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Pemakaian"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {activeTab === 'uji' && safeUjiRapid.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700">{d.tanggalUji}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPanganNama || 'Bahan Segar'}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{d.parameterMaster?.namaParameter || d.parameterUji}</div>
                    {d.parameterMaster?.ambangBatas && (
                      <div className="text-[11px] text-slate-400">Batas: {d.parameterMaster.ambangBatas}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${d.hasilUji.toLowerCase().includes('aman') && !d.hasilUji.toLowerCase().includes('tidak aman') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {d.hasilUji}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.tindakanLanjut || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteClick(d.id, 'uji')} 
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Hapus Uji Rapid"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}

              {((activeTab === 'pembelian' && safePembelian.length === 0) ||
                (activeTab === 'pemakaian' && safePemakaian.length === 0) ||
                (activeTab === 'uji' && safeUjiRapid.length === 0)) && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    Belum ada catatan data {activeTab}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP MODAL TAMBAH DATA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setIsModalOpen(false)} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            aria-hidden="true"
          />

          {/* Modal Container Box */}
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col z-10 overflow-hidden border border-slate-200">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                {activeTab === 'pembelian' && 'Input Pembelian Bahan Segar'}
                {activeTab === 'pemakaian' && 'Input Pemakaian Bahan Harian'}
                {activeTab === 'uji' && 'Input Hasil Uji Rapid Test'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-130px)]">
              {isAdmin && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">SPPG (Unit Layanan) <span className="text-red-500">*</span></label>
                  <select name="sppgId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                    <option value="">-- Pilih SPPG --</option>
                    {safeSppgList.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.namaSppg}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'pembelian' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Pembelian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPembelian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Sumber Pasokan <span className="text-red-500">*</span></label>
                    <select 
                      name="sumberPasokan" 
                      value={sumberPasokan}
                      onChange={(e) => setSumberPasokan(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm"
                    >
                      <option value="Pembelian Lokal">Pembelian Pangan Lokal (Dana Banper)</option>
                      <option value="Dropping Pusat">Bantuan / Dropping Pusat (Non-pembelian)</option>
                    </select>
                  </div>

                  {sumberPasokan === 'Pembelian Lokal' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Pemasok Lokal <span className="text-red-500">*</span></label>
                      <select name="pemasokId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                        <option value="">-- Pilih Pemasok --</option>
                        {safePemasokList.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.namaPemasok} ({p.kategoriSupply || 'Pemasok'})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                      <option value="">-- Pilih Komoditas --</option>
                      {safeJenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Volume Total <span className="text-red-500">*</span></label>
                      <input type="number" step="0.01" min="0" name="volume" required placeholder="Misal: 150" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter / Ikat" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Catatan / No. Kuitansi</label>
                    <input type="text" name="catatan" placeholder="Misal: Nota #10293, Pembelian Beras Medium Super" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                </>
              )}

              {activeTab === 'pemakaian' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Pemakaian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPemakaian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan Digunakan <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                      <option value="">-- Pilih Komoditas --</option>
                      {safeJenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Volume Digunakan <span className="text-red-500">*</span></label>
                      <input type="number" step="0.01" min="0" name="volume" required placeholder="Misal: 50" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'uji' && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tanggal Uji <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalUji" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Komoditas / Bahan Diuji <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                      <option value="">-- Pilih Komoditas --</option>
                      {safeJenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Master Parameter Uji <span className="text-red-500">*</span>
                    </label>
                    {safeMasterParameterList.length > 0 ? (
                      <select 
                        name="parameterUjiId" 
                        required 
                        value={selectedParameterId}
                        onChange={(e) => setSelectedParameterId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-sm"
                      >
                        <option value="">-- Pilih Item Parameter Uji --</option>
                        {safeMasterParameterList.map((m: any) => (
                          <option key={m.id} value={m.id}>
                            {m.namaParameter} ({m.kategori || 'Umum'}{m.ambangBatas ? ` - Batas: ${m.ambangBatas}` : ''})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" name="parameterUji" required placeholder="Ketik nama parameter (Misal: Formalin, Boraks)" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Hasil Uji <span className="text-red-500">*</span></label>
                      <select name="hasilUji" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm">
                        <option value="Aman">Aman / Bebas</option>
                        <option value="Tidak Aman">Tidak Aman / Positif</option>
                        <option value="Peringatan">Peringatan / Mendekati Batas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Petugas Penguji <span className="text-red-500">*</span></label>
                      <input type="text" name="petugasPenguji" required placeholder="Nama Petugas" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Tindakan Lanjut</label>
                    <input type="text" name="tindakanLanjut" placeholder="Misal: Dibuang, Retur ke pemasok, Lanjut Olah" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm" />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-medium transition-colors text-sm">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2 text-sm">
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
