'use client';

import React, { useState, useTransition } from 'react';
import { ShoppingCart, PieChart, FlaskConical, Users, Plus, X, Loader2 } from 'lucide-react';
import { addBahanPangan, addRapidTest } from '@/app/actions/sppg';

export default function SPPGClient({ 
  bahanPangan, 
  rapidTest,
  jenisPanganOptions,
  distributorOptions,
  parameterUjiOptions
}: { 
  bahanPangan: any[], 
  rapidTest: any[],
  jenisPanganOptions: any[],
  distributorOptions: any[],
  parameterUjiOptions: any[]
}) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('pembelian');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  
  // Dynamic form state
  const [formBahan, setFormBahan] = useState({ jenis: '', volumeBeli: '', volumePakai: '', sumber: '', cp: '' });
  const [formRapid, setFormRapid] = useState({ tanggal: '2026-07-03', bahan: '', parameter: '', hasil: 'Negatif (Aman)' });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormBahan({ jenis: '', volumeBeli: '', volumePakai: '', sumber: '', cp: '' });
    setFormRapid({ tanggal: '2026-07-03', bahan: '', parameter: '', hasil: 'Negatif (Aman)' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (activeTab === 'pembelian') {
        await addBahanPangan({
          jenis: formBahan.jenis,
          volumeBeli: formBahan.volumeBeli,
          volumePakai: formBahan.volumePakai,
          sumber: formBahan.sumber,
          cp: formBahan.cp
        });
      } else {
        await addRapidTest({
          tanggal: formRapid.tanggal,
          bahan: formRapid.bahan,
          parameter: formRapid.parameter,
          hasil: formRapid.hasil
        });
      }
      handleCloseModal();
    });
  };

  const totalBelanja = bahanPangan.reduce((acc, curr) => acc + parseInt(curr.volumeBeli || 0), 0);
  const totalRealisasi = bahanPangan.reduce((acc, curr) => acc + parseInt(curr.volumePakai || 0), 0);
  const persentaseSerapan = totalBelanja > 0 ? Math.round((totalRealisasi / totalBelanja) * 100) : 0;

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Dasbor SPPG</h2>
          <p className="text-muted">Satuan Pelayanan Pemberian Gizi (Post-Market) - Dapur Sentral.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Status: Lulus Sertifikasi
        </div>
      </div>

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%' }}>
            <ShoppingCart size={32} />
          </div>
          <div>
            <div className="metric-label">Total Volume Pembelian</div>
            <div className="metric-value">{totalBelanja.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%' }}>
            <PieChart size={32} />
          </div>
          <div>
            <div className="metric-label">Realisasi Penggunaan</div>
            <div className="metric-value">{persentaseSerapan}% <span style={{ fontSize: '1rem', fontWeight: 500 }}>Terserap</span></div>
          </div>
        </div>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <Users size={32} />
          </div>
          <div>
            <div className="metric-label">Jumlah Tenaga Kerja</div>
            <div className="metric-value">45 <span style={{ fontSize: '1rem', fontWeight: 500 }}>Orang</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'pembelian' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('pembelian')}
          >
            Pembelian Bahan Pangan
          </button>
          <button 
            className={`btn ${activeTab === 'rapidtest' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('rapidtest')}
          >
            Pemeriksaan Rapid Test
          </button>
        </div>

        {activeTab === 'pembelian' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Log Pembelian dan Penggunaan</h3>
              <button className="btn btn-primary" onClick={handleOpenModal}><Plus size={16}/> Catat Bahan</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Jenis Pangan</th>
                    <th>Volume Dibeli (Kg)</th>
                    <th>Volume Dipakai (Kg)</th>
                    <th>Distributor / Lokasi</th>
                    <th>Contact Person</th>
                  </tr>
                </thead>
                <tbody>
                  {bahanPangan.map(item => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.jenis}</td>
                      <td>{parseInt(item.volumeBeli).toLocaleString('id-ID')}</td>
                      <td>
                        <span className="text-green-600 font-medium">{parseInt(item.volumePakai).toLocaleString('id-ID')}</span>
                      </td>
                      <td>{item.sumber}</td>
                      <td>{item.cp}</td>
                    </tr>
                  ))}
                  {bahanPangan.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-muted">Belum ada data pembelian.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rapidtest' && (
          <div className="animate-fade-in stagger-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Hasil Uji Pangan Segar (Rapid Test)</h3>
              <button className="btn btn-primary" onClick={handleOpenModal}><FlaskConical size={16}/> Entri Uji Baru</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tanggal Uji</th>
                    <th>Bahan Diuji</th>
                    <th>Parameter (Residu/Kuman)</th>
                    <th>Hasil Uji</th>
                  </tr>
                </thead>
                <tbody>
                  {rapidTest.map(item => (
                    <tr key={item.id}>
                      <td>{item.tanggal}</td>
                      <td className="font-medium">{item.bahan}</td>
                      <td>{item.parameter}</td>
                      <td>
                        <span className={`badge ${item.hasil.includes('Negatif') ? 'badge-success' : 'badge-danger'}`}>
                          {item.hasil}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rapidTest.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted">Belum ada data uji rapid test.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {activeTab === 'pembelian' ? 'Tambah Pembelian Bahan' : 'Entri Hasil Rapid Test'}
              </h3>
              <button className="btn btn-ghost" disabled={isPending} onClick={handleCloseModal} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              {activeTab === 'pembelian' ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Jenis Pangan</label>
                    <select 
                      className="form-input" 
                      value={formBahan.jenis}
                      onChange={e => setFormBahan({...formBahan, jenis: e.target.value})}
                      required 
                    >
                      <option value="" disabled>-- Pilih Jenis Pangan --</option>
                      {jenisPanganOptions.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Volume Beli (Kg)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={formBahan.volumeBeli}
                        onChange={e => setFormBahan({...formBahan, volumeBeli: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Volume Dipakai (Kg)</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={formBahan.volumePakai}
                        onChange={e => setFormBahan({...formBahan, volumePakai: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sumber Distributor / Lokasi</label>
                    <select 
                      className="form-input" 
                      value={formBahan.sumber}
                      onChange={e => setFormBahan({...formBahan, sumber: e.target.value})}
                      required 
                    >
                      <option value="" disabled>-- Pilih Distributor --</option>
                      {distributorOptions.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-6">
                    <label className="form-label">Nama CP / No HP</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formBahan.cp}
                      onChange={e => setFormBahan({...formBahan, cp: e.target.value})}
                      required 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Tanggal Uji</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={formRapid.tanggal}
                      onChange={e => setFormRapid({...formRapid, tanggal: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bahan yang Diuji</label>
                    <select 
                      className="form-input" 
                      value={formRapid.bahan}
                      onChange={e => setFormRapid({...formRapid, bahan: e.target.value})}
                      required 
                    >
                      <option value="" disabled>-- Pilih Bahan --</option>
                      {jenisPanganOptions.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Parameter Uji</label>
                    <select 
                      className="form-input" 
                      value={formRapid.parameter}
                      onChange={e => setFormRapid({...formRapid, parameter: e.target.value})}
                      required 
                    >
                      <option value="" disabled>-- Pilih Parameter --</option>
                      {parameterUjiOptions.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-6">
                    <label className="form-label">Hasil Uji</label>
                    <select 
                      className="form-input" 
                      value={formRapid.hasil}
                      onChange={e => setFormRapid({...formRapid, hasil: e.target.value})}
                      required
                    >
                      <option value="Negatif (Aman)">Negatif (Aman)</option>
                      <option value="Positif (Berbahaya)">Positif (Berbahaya)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <button type="button" disabled={isPending} className="btn btn-ghost" onClick={handleCloseModal}>Batal</button>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                  {isPending ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
