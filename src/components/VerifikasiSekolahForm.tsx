'use client';

import React, { useState, useEffect } from 'react';
import { getSekolahList, getPendingDeliveries, submitVerifikasiSekolah } from '@/app/actions/sekolahVerifikasi';

type Sekolah = { id: number; namaSekolah: string };
type Pengiriman = { id: number; tanggal: string; menu: string; jumlahPorsi: number | null; status: string | null };

export default function VerifikasiSekolahForm() {
  const [sekolahList, setSekolahList] = useState<Sekolah[]>([]);
  const [selectedSekolah, setSelectedSekolah] = useState<string>('');
  
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
    getSekolahList().then((list) => {
      setSekolahList(list);
      if (list.length === 1) {
        setSelectedSekolah(list[0].id.toString());
      }
    });
  }, []);

  // When school changes
  useEffect(() => {
    if (selectedSekolah) {
      setIsLoading(true);
      getPendingDeliveries(parseInt(selectedSekolah)).then(deliveries => {
        setPendingDeliveries(deliveries);
        setSelectedPengiriman(''); // reset delivery
        setIsLoading(false);
      });
    } else {
      setPendingDeliveries([]);
    }
  }, [selectedSekolah]);

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
    formData.append('sekolahId', selectedSekolah);
    formData.append('sppgLaporanId', selectedPengiriman);
    formData.append('jumlahPorsiDiterima', jumlahDiterima);
    formData.append('kondisiMakanan', kondisi);
    formData.append('statusDiterima', status);
    formData.append('diverifikasiOleh', petugas);
    formData.append('catatan', catatan);
    if (foto) {
      formData.append('foto', foto);
    }

    const res = await submitVerifikasiSekolah(formData);
    
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
      
      // Refresh pending list
      const deliveries = await getPendingDeliveries(parseInt(selectedSekolah));
      setPendingDeliveries(deliveries);
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
          
          {/* Pilih Sekolah (Hanya tampil jika sekolahList > 1) */}
          {sekolahList.length > 1 ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontWeight: 600 }}>Pilih Sekolah Anda</label>
              <select 
                className="form-input" 
                value={selectedSekolah} 
                onChange={(e) => setSelectedSekolah(e.target.value)}
                required
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

          {/* Pilih Pengiriman Menunggu Verifikasi */}
          {selectedSekolah && (
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
