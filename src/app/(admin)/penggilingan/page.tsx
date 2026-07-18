'use client';

import React, { useState } from 'react';
import { Wheat, Plus, Factory, TrendingUp, X } from 'lucide-react';

const masterSumberGabah = [
  "Petani Lokal - Desa Rangkasbitung",
  "KUD Lebak",
  "Kelompok Tani Makmur",
  "Koperasi Jaya"
];

const masterLokusSPPG = [
  "SPPG Rangkasbitung",
  "SPPG Cibadak",
  "SPPG Kalanganyar",
  "SPPG Maja"
];

const initialGabah = [
  { id: 1, periode: 'Minggu 1, Juli 2026', sumber: 'Petani Lokal - Desa Rangkasbitung', volume: 5000 },
  { id: 2, periode: 'Minggu 1, Juli 2026', sumber: 'KUD Lebak', volume: 3500 },
];

const initialDistribusi = [
  { id: 1, periode: 'Minggu 1, Juli 2026', lokus: 'SPPG Rangkasbitung', volume: 3000 },
  { id: 2, periode: 'Minggu 1, Juli 2026', lokus: 'SPPG Cibadak', volume: 2500 },
];

function Penggilingan() {
  const [activeTab, setActiveTab] = useState('gabah');
  const [gabahData, setGabahData] = useState(initialGabah);
  const [distribusiData, setDistribusiData] = useState(initialDistribusi);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ sumber: '', volume: '', periode: 'Minggu 2, Juli 2026' });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ sumber: '', volume: '', periode: 'Minggu 2, Juli 2026' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'gabah') {
      const newItem = {
        id: Date.now(),
        periode: formData.periode,
        sumber: formData.sumber,
        volume: parseInt(formData.volume) || 0
      };
      setGabahData([newItem, ...gabahData]);
    } else {
      const newItem = {
        id: Date.now(),
        periode: formData.periode,
        lokus: formData.sumber, // reuse field
        volume: parseInt(formData.volume) || 0
      };
      setDistribusiData([newItem, ...distribusiData]);
    }
    handleCloseModal();
  };

  const totalGabah = gabahData.reduce((acc, curr) => acc + curr.volume, 0);
  const totalDistribusi = distribusiData.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Pengawasan Pre-Market</h2>
          <p className="text-muted">Pemantauan aktivitas di tingkat Penggilingan (Pabrik Beras).</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Status: Aktif Memantau
        </div>
      </div>

      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '50%' }}>
            <Wheat size={32} />
          </div>
          <div>
            <div className="metric-label">Total Gabah Dibeli</div>
            <div className="metric-value">{totalGabah.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%' }}>
            <Factory size={32} />
          </div>
          <div>
            <div className="metric-label">Kapasitas Produksi</div>
            <div className="metric-value">10.000 <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg/Mg</span></div>
          </div>
        </div>
        <div className="card glass-panel flex items-center gap-6">
          <div style={{ padding: '1rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <div className="metric-label">Total Distribusi Beras</div>
            <div className="metric-value">{totalDistribusi.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-4 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button 
            className={`btn ${activeTab === 'gabah' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('gabah')}
          >
            Sumber Gabah
          </button>
          <button 
            className={`btn ${activeTab === 'distribusi' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('distribusi')}
          >
            Pendistribusian (SPPG)
          </button>
        </div>

        {activeTab === 'gabah' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Catatan Gabah Masuk</h3>
              <button className="btn btn-primary" onClick={handleOpenModal}><Plus size={16}/> Tambah Data</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Periode</th>
                    <th>Sumber Gabah</th>
                    <th>Volume (Kg)</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {gabahData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.periode}</td>
                      <td className="font-medium">{item.sumber}</td>
                      <td>{item.volume.toLocaleString('id-ID')}</td>
                      <td>
                        <button className="badge badge-warning" style={{ border: 'none', cursor: 'pointer' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'distribusi' && (
          <div className="animate-fade-in stagger-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Catatan Distribusi ke SPPG</h3>
              <button className="btn btn-primary" onClick={handleOpenModal}><Plus size={16}/> Tambah Distribusi</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Periode</th>
                    <th>Lokus Penjualan (SPPG)</th>
                    <th>Volume (Kg)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.periode}</td>
                      <td className="font-medium">{item.lokus}</td>
                      <td>{item.volume.toLocaleString('id-ID')}</td>
                      <td>
                        <span className="badge badge-success">Terkirim</span>
                      </td>
                    </tr>
                  ))}
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
                {activeTab === 'gabah' ? 'Tambah Catatan Gabah' : 'Tambah Distribusi'}
              </h3>
              <button className="btn btn-ghost" onClick={handleCloseModal} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label className="form-label">Periode</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.periode}
                  onChange={e => setFormData({...formData, periode: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">{activeTab === 'gabah' ? 'Sumber Gabah / Petani' : 'Lokus Penjualan / Nama SPPG'}</label>
                <select 
                  className="form-input" 
                  value={formData.sumber}
                  onChange={e => setFormData({...formData, sumber: e.target.value})}
                  required 
                >
                  <option value="" disabled>-- Pilih {activeTab === 'gabah' ? 'Sumber Gabah' : 'SPPG Tujuan'} --</option>
                  {activeTab === 'gabah' 
                    ? masterSumberGabah.map((item, idx) => (
                        <option key={idx} value={item}>{item}</option>
                      ))
                    : masterLokusSPPG.map((item, idx) => (
                        <option key={idx} value={item}>{item}</option>
                      ))
                  }
                </select>
              </div>
              <div className="form-group mb-6">
                <label className="form-label">Volume (Kg)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={formData.volume}
                  onChange={e => setFormData({...formData, volume: e.target.value})}
                  placeholder="Contoh: 1000"
                  required 
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Penggilingan;
