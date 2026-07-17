import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, PieChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const initialBahanPangan = [
  { id: 1, jenis: 'Beras Premium', volumeBeli: 3000, volumePakai: 2800, sumber: 'Penggilingan Rangkasbitung', cp: 'Bpk. Budi (0812345)' },
  { id: 2, jenis: 'Daging Ayam', volumeBeli: 500, volumePakai: 500, sumber: 'Peternakan Cibadak', cp: 'Ibu Ani (0856789)' },
  { id: 3, jenis: 'Sayur Mayur', volumeBeli: 200, volumePakai: 190, sumber: 'Pasar Induk Lebak', cp: 'Mang Oleh (0890123)' },
];

const initialRapidTest = [
  { id: 1, tanggal: '2026-07-01', bahan: 'Sayur Mayur', parameter: 'Pestisida', hasil: 'Negatif (Aman)' },
  { id: 2, tanggal: '2026-07-02', bahan: 'Daging Ayam', parameter: 'Formalin', hasil: 'Negatif (Aman)' },
];

function PublicSPPG() {
  const [activeTab, setActiveTab] = useState('pembelian');
  
  const totalBelanja = initialBahanPangan.reduce((acc, curr) => acc + curr.volumeBeli, 0);
  const totalRealisasi = initialBahanPangan.reduce((acc, curr) => acc + curr.volumePakai, 0);
  const persentaseSerapan = Math.round((totalRealisasi / totalBelanja) * 100) || 0;

  return (
    <div className="container py-8 animate-fade-in">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Data Induk: Post-Market</h2>
          <p className="text-muted">Lacak seluruh suplai bahan makanan segar ke dapur sentral SPPG.</p>
        </div>
        <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
          Akses Publik Terbuka
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
                  {initialBahanPangan.map(item => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.jenis}</td>
                      <td>{item.volumeBeli.toLocaleString('id-ID')}</td>
                      <td>
                        <span className="text-green-600 font-medium">{item.volumePakai.toLocaleString('id-ID')}</span>
                      </td>
                      <td>{item.sumber}</td>
                      <td>{item.cp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'rapidtest' && (
          <div className="animate-fade-in stagger-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Hasil Uji Pangan Segar (Rapid Test)</h3>
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
                  {initialRapidTest.map(item => (
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
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicSPPG;
