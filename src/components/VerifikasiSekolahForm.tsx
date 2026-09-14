'use client';

import React, { useState, useEffect } from 'react';
import { getSekolahList, getPendingDeliveries, submitVerifikasiSekolah, getVerifiedDeliveries, updateVerifikasiSekolah } from '@/app/actions/sekolahVerifikasi';
import { Edit2 } from 'lucide-react';

type Sekolah = { id: number; namaSekolah: string };
type Pengiriman = { id: number; tanggal: string; menu: string; jumlahPorsi: number | null; status: string | null };
type VerifiedDelivery = { id: number; sppgLaporanId: number; tanggal: string; menu: string; jumlahPorsiAsli: number | null; jumlahPorsiDiterima: number | null; statusDiterima: string; kondisiMakanan: string; diverifikasiOleh: string | null; catatan: string | null };

export default function VerifikasiSekolahForm() {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<string>('');
  
  const [pendingDeliveries, setPendingDeliveries] = useState<Pengiriman[]>([]);
  const [verifiedDeliveries, setVerifiedDeliveries] = useState<VerifiedDelivery[]>([]);
  const [selectedPengiriman, setSelectedPengiriman] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editVerifikasiId, setEditVerifikasiId] = useState<number | null>(null);
  const [jumlahDiterima, setJumlahDiterima] = useState('');
  const [kondisi, setKondisi] = useState('Baik');
  const [status, setStatus] = useState('Diterima Lengkap');
  const [petugas, setPetugas] = useState('');
  const [catatan, setCatatan] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  useEffect(() => {
    async function loadSekolah() {
      const list = await getSekolahList();
      setSekolahList(list);
      if (list.length === 1) {
        setSelectedSekolah(list[0].id.toString());
      }
    }
    loadSekolah();
  }, []);

  useEffect(() => {
    async function loadDeliveries() {
      if (!selectedSekolah) {
        setPendingDeliveries([]);
        setVerifiedDeliveries([]);
        return;
      }
      setIsLoading(true);
      const [pending, verified] = await Promise.all([
        getPendingDeliveries(parseInt(selectedSekolah)),
        getVerifiedDeliveries(parseInt(selectedSekolah))
      ]);
      setPendingDeliveries(pending);
      setVerifiedDeliveries(verified);
      setIsLoading(false);
    }
    loadDeliveries();
  }, [selectedSekolah]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSekolah || (!selectedPengiriman && !isEditMode)) {
      setMessage({ type: 'error', text: 'Silakan pilih sekolah dan data pengiriman.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('sekolahId', selectedSekolah);
    formData.append('sppgLaporanId', selectedPengiriman);
    formData.append('statusDiterima', status);
    formData.append('jumlahPorsiDiterima', jumlahDiterima);
    formData.append('kondisiMakanan', kondisi);
    formData.append('diverifikasiOleh', petugas);
    formData.append('catatan', catatan);
    if (foto) {
      formData.append('foto', foto);
    }

    let res;
    if (isEditMode && editVerifikasiId) {
      formData.append('verifikasiId', editVerifikasiId.toString());
      res = await updateVerifikasiSekolah(formData);
    } else {
      res = await submitVerifikasiSekolah(formData);
    }

    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      // Reset form
      cancelEdit();
      
      // Refresh list
      const [pending, verified] = await Promise.all([
        getPendingDeliveries(parseInt(selectedSekolah)),
        getVerifiedDeliveries(parseInt(selectedSekolah))
      ]);
      setPendingDeliveries(pending);
      setVerifiedDeliveries(verified);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
    
    setIsLoading(false);
  };

  const handleEdit = (v: VerifiedDelivery) => {
    setIsEditMode(true);
    setEditVerifikasiId(v.id);
    setSelectedPengiriman(v.sppgLaporanId.toString());
    
    setJumlahDiterima(v.jumlahPorsiDiterima?.toString() || '');
    setKondisi(v.kondisiMakanan || 'Baik');
    setStatus(v.statusDiterima || 'Diterima Lengkap');
    setPetugas(v.diverifikasiOleh || '');
    setCatatan(v.catatan || '');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditVerifikasiId(null);
    setSelectedPengiriman('');
    setJumlahDiterima('');
    setKondisi('Baik');
    setStatus('Diterima Lengkap');
    setPetugas('');
    setCatatan('');
    setFoto(null);
  };

  return (
    <div className="space-y-6">
      <div className="card max-w-3xl mx-auto" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
          {isEditMode ? 'Edit Verifikasi Penerimaan' : 'Verifikasi Penerimaan Makanan'}
        </h2>
        
        {message && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem',
            backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            
            {/* Pilih Sekolah */}
            {sekolahList.length > 1 ? (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Pilih Sekolah Anda</label>
                <select 
                  className="form-input" 
                  value={selectedSekolah} 
                  onChange={(e) => setSelectedSekolah(e.target.value)}
                  required
                  disabled={isEditMode}
                >
                  <option value="">-- Pilih Sekolah --</option>
                  {sekolahList.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSekolah}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>Sekolah Anda</label>
                <div className="form-input" style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}>
                  {sekolahList[0]?.namaSekolah || 'Memuat...'}
                </div>
              </div>
            )}

            {/* Pilih Pengiriman */}
            {selectedSekolah && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontWeight: 600 }}>
                  {isEditMode ? 'Data Pengiriman yang Diedit' : 'Pilih Pengiriman (Menunggu Verifikasi)'}
                </label>
                
                {isEditMode ? (
                  <div className="form-input" style={{ backgroundColor: '#f1f5f9' }}>
                    ID Laporan: {selectedPengiriman}
                  </div>
                ) : (
                  <>
                    {pendingDeliveries.length === 0 ? (
                      <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                        {isLoading ? 'Memuat data...' : 'Tidak ada kiriman makanan yang menunggu verifikasi.'}
                      </div>
                    ) : (
                      <select 
                        className="form-input" 
                        value={selectedPengiriman} 
                        onChange={(e) => setSelectedPengiriman(e.target.value)}
                        required
                      >
                        <option value="">-- Pilih Data Pengiriman --</option>
                        {pendingDeliveries.map(d => (
                          <option key={d.id} value={d.id}>
                            {new Date(d.tanggal).toLocaleDateString('id-ID')} - {d.menu} ({d.jumlahPorsi} Porsi)
                          </option>
                        ))}
                      </select>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Detail Verifikasi */}
            {selectedPengiriman && (
              <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  Form Konfirmasi Penerimaan
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Status Diterima</label>
                    <select className="form-input" value={status} onChange={e => setStatus(e.target.value)} required>
                      <option value="Diterima Lengkap">Diterima Lengkap</option>
                      <option value="Diterima Sebagian">Diterima Sebagian</option>
                      <option value="Ditolak">Ditolak (Dikembalikan)</option>
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Jumlah Porsi Fisik Diterima</label>
                    <input type="number" className="form-input" value={jumlahDiterima} onChange={e => setJumlahDiterima(e.target.value)} required min="0" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Kondisi Makanan</label>
                    <select className="form-input" value={kondisi} onChange={e => setKondisi(e.target.value)} required>
                      <option value="Baik">Baik & Layak Konsumsi</option>
                      <option value="Kurang">Kurang Layak (Kemasan Rusak)</option>
                      <option value="Basi">Basi / Tidak Layak</option>
                    </select>
                  </div>
                  
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Nama Petugas Penerima (Guru)</label>
                    <input type="text" className="form-input" placeholder="Contoh: Bpk. Budi" value={petugas} onChange={e => setPetugas(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    className="form-input" 
                    rows={3} 
                    placeholder="Ada lauk yang tumpah, atau porsi kurang 2 box, dll..."
                    value={catatan}
                    onChange={e => setCatatan(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Unggah Foto Makanan (Opsional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="form-input"
                    style={{ padding: '0.5rem', backgroundColor: '#ffffff' }}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFoto(e.target.files[0]);
                      } else {
                        setFoto(null);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary flex-1" 
                    style={{ padding: '0.75rem', fontSize: '1rem' }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Kirim Laporan Verifikasi')}
                  </button>
                  
                  {isEditMode && (
                    <button 
                      type="button" 
                      className="btn" 
                      style={{ padding: '0.75rem', fontSize: '1rem', backgroundColor: '#f1f5f9', color: '#475569' }}
                      onClick={cancelEdit}
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </form>
      </div>

      {/* Riwayat Verifikasi */}
      {selectedSekolah && verifiedDeliveries.length > 0 && (
        <div className="card max-w-3xl mx-auto" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
            Riwayat Verifikasi Anda
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="p-3 font-semibold">Tanggal</th>
                  <th className="p-3 font-semibold">Menu (Dari SPPG)</th>
                  <th className="p-3 font-semibold text-center">Porsi Diterima</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {verifiedDeliveries.map((v) => (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-slate-700">{v.tanggal ? new Date(v.tanggal).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="p-3 font-medium text-slate-800">{v.menu}</td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-slate-800">{v.jumlahPorsiDiterima}</span>
                      <span className="text-slate-400 text-xs ml-1">/ {v.jumlahPorsiAsli}</span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold ${
                        v.statusDiterima?.includes('Lengkap') ? 'bg-emerald-100 text-emerald-700' : 
                        v.statusDiterima?.includes('Sebagian') ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {v.statusDiterima}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => handleEdit(v)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Verifikasi"
                        disabled={isEditMode && editVerifikasiId === v.id}
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
