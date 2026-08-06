'use client';

import React, { useState } from 'react';
import { Wheat, Factory, TrendingUp } from 'lucide-react';

type GabahData = {
  id: number;
  periode: string;
  sumber: string;
  volume: number;
};

type DistribusiData = {
  id: number;
  periode: string;
  lokus: string;
  volume: number;
};

export default function PenggilinganClient({ gabahData, distribusiData, totalKapasitas }: { gabahData: GabahData[], distribusiData: DistribusiData[], totalKapasitas: number }) {
  const [activeTab, setActiveTab] = useState('gabah');
  
  const totalGabah = gabahData.reduce((acc, curr) => acc + Number(curr.volume), 0);
  const totalDistribusi = distribusiData.reduce((acc, curr) => acc + Number(curr.volume), 0);

  return (
    <>
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
            <div className="metric-value">{totalKapasitas.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg/Mg</span></div>
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
                    <th>Periode (Minggu Mulai)</th>
                    <th>Sumber Gabah</th>
                    <th>Volume (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {gabahData.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.periode}</td>
                      <td className="font-medium">{item.sumber}</td>
                      <td>{Number(item.volume).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {gabahData.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada data gabah.</td>
                    </tr>
                  )}
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
                    <th>Periode (Minggu Mulai)</th>
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
                      <td>{Number(item.volume).toLocaleString('id-ID')}</td>
                      <td>
                        <span className="badge badge-success">Terkirim</span>
                      </td>
                    </tr>
                  ))}
                  {distribusiData.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada data distribusi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
