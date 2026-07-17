import React, { useState } from 'react';
import { ArrowLeft, Wheat, Factory, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialGabah = [
  { id: 1, periode: 'Minggu 1, Juli 2026', sumber: 'Petani Lokal - Desa Rangkasbitung', volume: 5000 },
  { id: 2, periode: 'Minggu 1, Juli 2026', sumber: 'KUD Lebak', volume: 3500 },
];

const initialDistribusi = [
  { id: 1, periode: 'Minggu 1, Juli 2026', lokus: 'SPPG Rangkasbitung', volume: 3000 },
  { id: 2, periode: 'Minggu 1, Juli 2026', lokus: 'SPPG Cibadak', volume: 2500 },
];

function PublicPenggilingan() {
  const [activeTab, setActiveTab] = useState('gabah');
  
  const totalGabah = initialGabah.reduce((acc, curr) => acc + curr.volume, 0);
  const totalDistribusi = initialDistribusi.reduce((acc, curr) => acc + curr.volume, 0);

  return (
    <div className="container py-8 animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Data Induk: Pre-Market</h2>
          <p className="text-muted">Transparansi serapan gabah dari petani lokal Kabupaten Lebak.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Akses Publik Terbuka
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
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Periode</th>
                    <th>Sumber Gabah</th>
                    <th>Volume (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {initialGabah.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.periode}</td>
                      <td className="font-medium">{item.sumber}</td>
                      <td>{item.volume.toLocaleString('id-ID')}</td>
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
                  {initialDistribusi.map((item, index) => (
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
    </div>
  );
}

export default PublicPenggilingan;
