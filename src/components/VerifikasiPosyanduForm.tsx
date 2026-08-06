'use client';

import React, { useState, useEffect } from 'react';
import { getPosyanduList, getPendingPosyanduDeliveries, submitVerifikasiPosyandu } from '@/app/actions/posyanduVerifikasi';
import { Camera, CheckCircle, AlertTriangle, Info, MapPin } from 'lucide-react';

type Pengiriman = { id: number; tanggal: string; menu: string; jumlahPorsi: number | null; status: string | null };

export default function VerifikasiPosyanduForm() {
  const [posyanduList, setPosyanduList] = useState<any[]>([]);
  const [selectedPosyanduId, setSelectedPosyanduId] = useState<number | ''>('');
  
  const [pendingDeliveries, setPendingDeliveries] = useState<Pengiriman[]>([]);
  const [selectedPengiriman, setSelectedPengiriman] = useState<string>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [jumlahDiterima, setJumlahDiterima] = useState('');
  const [kondisi, setKondisi] = useState('Baik');
  const [status, setStatus] = useState('Diterima Lengkap');
  const [petugas, setPetugas] = useState('');
  const [catatan, setCatatan] = useState('');
  const [foto, setFoto] = useState<File | null>(null);

  // Initial load
  useEffect(() => {
    getPosyanduList().then(list => {
      setPosyanduList(list);
      if (list.length === 1) {
        setSelectedPosyanduId(list[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedPosyanduId) {
      setIsLoading(true);
      getPendingPosyanduDeliveries(Number(selectedPosyanduId)).then(data => {
        setPendingDeliveries(data);
        setIsLoading(false);
      });
    } else {
      setPendingDeliveries([]);
    }
  }, [selectedPosyanduId]);

  // When delivery is selected, pre-fill some fields
  useEffect(() => {
    if (selectedPengiriman) {
      const delivery = pendingDeliveries.find(d => d.id.toString() === selectedPengiriman);
      if (delivery && delivery.jumlahPorsi) {
        setJumlahDiterima(delivery.jumlahPorsi.toString());
      }
    }
  }, [selectedPengiriman, pendingDeliveries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('posyanduId', selectedPosyanduId.toString());
    formData.append('sppgLaporanId', selectedPengiriman);
    formData.append('jumlahPorsiDiterima', jumlahDiterima);
    formData.append('kondisiMakanan', kondisi);
    formData.append('statusDiterima', status);
    formData.append('diverifikasiOleh', petugas);
    formData.append('catatan', catatan);
    if (foto) {
      formData.append('foto', foto);
    }

    const res = await submitVerifikasiPosyandu(formData);
    
    if (res.success) {
      setMessage({ type: 'success', text: res.message });
      // Reset form
      setSelectedPengiriman('');
      setJumlahDiterima('');
      setKondisi('Baik');
      setStatus('Diterima Lengkap');
      setPetugas('');
      setCatatan('');
      setFoto(null);
      
      // Refresh pending deliveries
      getPendingPosyanduDeliveries(Number(selectedPosyanduId)).then(setPendingDeliveries);
    } else {
      setMessage({ type: 'error', text: res.message });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="card max-w-3xl mx-auto" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>
        Verifikasi Penerimaan Makanan
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
          
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-primary-600" /> Pilih Posyandu
          </h2>
          <div className="relative">
            <select
              value={selectedPosyanduId}
              onChange={(e) => setSelectedPosyanduId(e.target.value ? Number(e.target.value) : '')}
              disabled={posyanduList.length === 1}
              className={`w-full p-4 pl-4 pr-10 border rounded-xl appearance-none bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                posyanduList.length === 1 ? 'border-primary-200 bg-primary-50/50 cursor-not-allowed text-primary-800' : 'border-slate-200 focus:ring-primary-500 hover:border-slate-300'
              }`}
            >
              <option value="">-- Pilih Posyandu Anda --</option>
              {posyanduList.map(pos => (
                <option key={pos.id} value={pos.id}>{pos.namaPosyandu}</option>
              ))}
            </select>
          </div>

          {!selectedPosyanduId ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <Info size={48} className="text-slate-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Pilih Posyandu</h3>
              <p className="text-slate-500">Silakan pilih posyandu terlebih dahulu untuk melihat daftar kiriman yang perlu diverifikasi.</p>
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Pilih Pengiriman (Menunggu Verifikasi)</label>
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
            </div>
          )}

          {/* Detail Verifikasi (Only show if a delivery is selected) */}
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

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem' }}
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Kirim Laporan Verifikasi'}
              </button>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}
