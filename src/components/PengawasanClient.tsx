'use client';

import React, { useState } from 'react';
import { PackagePlus, PackageMinus, TestTube2, AlertCircle, Plus, Check, X } from 'lucide-react';
import { createPembelianBahan, createPemakaianBahan, createUjiRapidTest } from '@/app/actions/sppgPengawasan';
import toast from 'react-hot-toast';

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
  const [selectedParameterId, setSelectedParameterId] = useState<string>('');

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
      window.location.reload(); // Quick refresh to get new data
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
        <button 
          onClick={() => setActiveTab('pembelian')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'pembelian' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <PackagePlus size={18} /> Bahan Pangan Masuk
        </button>
        <button 
          onClick={() => setActiveTab('pemakaian')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'pemakaian' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <PackageMinus size={18} /> Pemakaian Masak
        </button>
        <button 
          onClick={() => setActiveTab('uji')} 
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all ${activeTab === 'uji' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
        >
          <TestTube2 size={18} /> Hasil Uji Mutu
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {activeTab === 'pembelian' && 'Riwayat Pembelian & Penerimaan Bahan'}
              {activeTab === 'pemakaian' && 'Realisasi Pemakaian Bahan Harian'}
              {activeTab === 'uji' && 'Log Inspeksi Uji Rapid Test'}
            </h2>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-semibold text-sm shadow-sm">
            <Plus size={18} /> Tambah Data
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                {activeTab === 'pembelian' && <th className="px-6 py-4">Pemasok</th>}
                <th className="px-6 py-4">Jenis Pangan</th>
                {(activeTab === 'pembelian' || activeTab === 'pemakaian') && <th className="px-6 py-4">Volume</th>}
                {activeTab === 'pemakaian' && <th className="px-6 py-4">Untuk Menu</th>}
                {activeTab === 'uji' && <th className="px-6 py-4">Parameter</th>}
                {activeTab === 'uji' && <th className="px-6 py-4">Hasil</th>}
                {activeTab === 'uji' && <th className="px-6 py-4">Tindakan</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'pembelian' && initialPembelian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">{new Date(d.tanggalPembelian).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">{d.pemasokNama}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{d.jenisPanganNama}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-semibold">{d.volume} {d.satuan}</span></td>
                </tr>
              ))}
              {activeTab === 'pemakaian' && initialPemakaian.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">{new Date(d.tanggalPemakaian).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{d.jenisPanganNama}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded font-semibold">{d.volume} {d.satuan}</span></td>
                  <td className="px-6 py-4">{d.menuNama || '-'}</td>
                </tr>
              ))}
              {activeTab === 'uji' && initialUjiRapid.map((d: any) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">{new Date(d.tanggalUji).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{d.jenisPanganNama}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{d.parameterUji}</span>
                      {d.parameterMaster && (
                        <span className="text-[11px] text-slate-500 font-medium">
                          {d.parameterMaster.kategori || 'Umum'} {d.parameterMaster.ambangBatas ? `• Max: ${d.parameterMaster.ambangBatas}` : ''}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${d.hasilUji.toLowerCase().includes('aman') && !d.hasilUji.toLowerCase().includes('tidak aman') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {d.hasilUji}
                    </span>
                  </td>
                  <td className="px-6 py-4">{d.tindakanLanjut || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {activeTab === 'pembelian' && 'Input Pembelian Bahan Segar'}
                {activeTab === 'pemakaian' && 'Input Pemakaian Bahan Harian'}
                {activeTab === 'uji' && 'Input Hasil Uji Rapid Test'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isAdmin && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">SPPG (Unit Layanan) <span className="text-red-500">*</span></label>
                  <select name="sppgId" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                    <option value="">-- Pilih SPPG --</option>
                    {sppgList.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.namaSppg}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'pembelian' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Pembelian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPembelian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Pemasok / Supplier <span className="text-red-500">*</span></label>
                    <select name="pemasokId" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                      <option value="">-- Pilih Pemasok --</option>
                      {pemasokList.map((p: any) => (
                        <option key={p.id} value={p.id}>{p.namaPemasok} ({p.kategoriSupply || 'Pemasok'})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Pangan / Bahan <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                      <option value="">-- Pilih Jenis Pangan --</option>
                      {jenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Volume Total <span className="text-red-500">*</span></label>
                      <input type="text" name="volume" required placeholder="Misal: 150" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter / Ikat" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'pemakaian' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Pemakaian <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalPemakaian" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Pangan / Bahan Digunakan <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                      <option value="">-- Pilih Jenis Pangan --</option>
                      {jenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Volume Digunakan <span className="text-red-500">*</span></label>
                      <input type="text" name="volume" required placeholder="Misal: 50" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Satuan <span className="text-red-500">*</span></label>
                      <input type="text" name="satuan" required defaultValue="Kg" placeholder="Kg / Liter" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'uji' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tanggal Uji <span className="text-red-500">*</span></label>
                    <input type="date" name="tanggalUji" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Jenis Pangan / Bahan Diuji <span className="text-red-500">*</span></label>
                    <select name="jenisPanganId" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                      <option value="">-- Pilih Jenis Pangan --</option>
                      {jenisPanganList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.namaBahan} ({j.kategoriPangan})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Master Parameter Uji <span className="text-red-500">*</span>
                    </label>
                    {masterParameterList && masterParameterList.length > 0 ? (
                      <select 
                        name="parameterUjiId" 
                        required 
                        value={selectedParameterId}
                        onChange={(e) => setSelectedParameterId(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                      >
                        <option value="">-- Pilih Item Parameter Uji --</option>
                        {masterParameterList.map((m: any) => (
                          <option key={m.id} value={m.id}>
                            {m.namaParameter} ({m.kategori || 'Umum'}{m.ambangBatas ? ` - Batas: ${m.ambangBatas}` : ''})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" name="parameterUji" required placeholder="Ketik nama parameter (Misal: Formalin, Boraks)" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Hasil Uji <span className="text-red-500">*</span></label>
                      <select name="hasilUji" required className="w-full px-4 py-3 rounded-xl border border-slate-200">
                        <option value="Aman">Aman / Bebas</option>
                        <option value="Tidak Aman">Tidak Aman / Positif</option>
                        <option value="Peringatan">Peringatan / Mendekati Batas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Petugas Penguji <span className="text-red-500">*</span></label>
                      <input type="text" name="petugasPenguji" required placeholder="Nama Petugas" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Tindakan Lanjut</label>
                    <input type="text" name="tindakanLanjut" placeholder="Misal: Dibuang, Retur ke pemasok, Lanjut Olah" className="w-full px-4 py-3 rounded-xl border border-slate-200" />
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-medium transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-primary-600 text-white hover:bg-primary-700 rounded-xl font-semibold transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2">
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
