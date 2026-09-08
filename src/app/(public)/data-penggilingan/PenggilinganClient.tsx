'use client';

import React, { useState } from 'react';
import { Wheat, Factory, TrendingUp, Percent, MapPin } from 'lucide-react';

type MonthlyData = {
  id: number;
  periode: string;
  volume: number;
};

type MacroStats = {
  totalGabah: number;
  totalGabahLokal: number;
  gabahLuarLebak: number;
  totalDistribusi: number;
  distribusiSppg: number;
  distribusiLokalUmum: number;
  distribusiLuar: number;
  totalKapasitas: number;
  persenLokal: string;
  rataRendemen: string;
  utilisasiMesin: string;
};

export default function PenggilinganClient({ gabahData, distribusiData, macroStats, pabrikList = [] }: { gabahData: MonthlyData[], distribusiData: MonthlyData[], macroStats: MacroStats, pabrikList?: any[] }) {
  const [mainTab, setMainTab] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('gabah');
  const [searchPabrik, setSearchPabrik] = useState('');

  const getUtilisasiStatus = (utilisasi: string) => {
    const val = parseFloat(utilisasi);
    if (val < 40) return { text: "Menganggur (Kurang Pasokan)", color: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50" };
    if (val <= 80) return { text: "Optimal", color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" };
    return { text: "Kelebihan Beban", color: "text-amber-600", border: "border-amber-200", bg: "bg-amber-50" };
  };
  
  const utilStatus = getUtilisasiStatus(macroStats.utilisasiMesin);

  const filteredPabriks = pabrikList.filter(p => p.namaPenggilingan?.toLowerCase().includes(searchPabrik.toLowerCase()));

  return (
    <>
      {/* MAIN TABS */}
      <div className="flex gap-4 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setMainTab('dashboard')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${mainTab === 'dashboard' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Agregasi & Statistik
        </button>
        <button 
          onClick={() => setMainTab('direktori')}
          className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${mainTab === 'direktori' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Katalog Mitra Penggilingan
        </button>
      </div>

      {mainTab === 'dashboard' && (
        <div className="animate-fade-in">
      <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card glass-panel flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: 'var(--primary-100)', color: 'var(--primary-700)', borderRadius: '50%' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Serapan Gabah Lokal</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.persenLokal} <span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          </div>
        </div>

        <div className="card glass-panel flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <Wheat size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Gabah Masuk</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.totalGabah.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>

        <div className="card glass-panel flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#ede9fe', color: '#6d28d9', borderRadius: '50%' }}>
            <Percent size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Rata-Rata Rendemen</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.rataRendemen} <span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          </div>
        </div>

        <div className="card glass-panel flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Distribusi Beras MBG</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.totalDistribusi.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>

        <div className="card glass-panel flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#e0e7ff', color: '#4338ca', borderRadius: '50%' }}>
            <Factory size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase" title={`Kapasitas Maksimal: ${macroStats.totalKapasitas.toLocaleString('id-ID')} Kg/Minggu`}>Tingkat Utilisasi Mesin</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-slate-800">{macroStats.utilisasiMesin} <span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
            </div>
            <div className={`text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded border ${utilStatus.bg} ${utilStatus.color} ${utilStatus.border}`}>
              Status: {utilStatus.text}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><Wheat size={16} className="text-amber-600"/> Rincian Asal Gabah Masuk</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600">Dari Petani Dalam Lebak</span>
              <span className="font-bold text-amber-700">{macroStats.totalGabahLokal.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Dari Luar Daerah / Impor</span>
              <span className="font-bold text-rose-600">{macroStats.gabahLuarLebak.toLocaleString('id-ID')} Kg</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-600"/> Rincian Distribusi Beras Keluar</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600 font-medium">Ke SPPG (Makan Bergizi Gratis)</span>
              <span className="font-black text-emerald-700">{macroStats.distribusiSppg.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600">Ke Pasar Bebas Dalam Lebak</span>
              <span className="font-bold text-slate-800">{macroStats.distribusiLokalUmum.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Dijual Keluar Lebak (Outflow)</span>
              <span className="font-bold text-rose-600">{macroStats.distribusiLuar.toLocaleString('id-ID')} Kg</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card border border-slate-200 shadow-sm p-6 rounded-2xl bg-white">
        <div className="flex gap-4 mb-6 border-b border-slate-200 pb-4">
          <button 
            className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'gabah' ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('gabah')}
          >
            Tren Suplai Gabah
          </button>
          <button 
            className={`px-4 py-2 font-bold rounded-xl transition-colors ${activeTab === 'distribusi' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:bg-slate-100'}`}
            onClick={() => setActiveTab('distribusi')}
          >
            Tren Distribusi Beras
          </button>
        </div>

        {activeTab === 'gabah' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Agregasi Gabah Masuk (Per Bulan)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase">No</th>
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase">Periode (Bulan)</th>
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Total Volume Gabah Diserap (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {gabahData.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-bold text-slate-800">{item.periode}</td>
                      <td className="p-3 text-right font-black text-amber-700">{Number(item.volume).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {gabahData.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data rekapan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'distribusi' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Agregasi Distribusi Beras (Per Bulan)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase">No</th>
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase">Periode (Bulan)</th>
                    <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Total Volume Beras Didistribusikan (Kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {distribusiData.map((item, index) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-bold text-slate-800">{item.periode}</td>
                      <td className="p-3 text-right font-black text-emerald-700">{Number(item.volume).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {distribusiData.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data rekapan.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </div>
      )}

      {mainTab === 'direktori' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Katalog Mitra Penggilingan</h3>
            <input 
              type="text" 
              placeholder="Cari nama penggilingan..." 
              value={searchPabrik}
              onChange={(e) => setSearchPabrik(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPabriks.map(pabrik => (
              <div key={pabrik.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                      <Factory size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{pabrik.namaPenggilingan}</h4>
                      <p className="text-xs text-slate-500">{pabrik.namaDagang || 'Penggilingan Padi'}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${pabrik.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {pabrik.status || 'Aktif'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {pabrik.desa?.namaDesa ? `Desa ${pabrik.desa.namaDesa}, Kec. ${pabrik.kecamatan?.namaKecamatan}` : (pabrik.alamat || 'Alamat belum dilengkapi')}</p>
                  <p className="flex items-center gap-2">👨‍💼 {pabrik.penanggungJawab || 'PIC Belum diatur'} {pabrik.noHp ? `(${pabrik.noHp})` : ''}</p>
                  <p className="flex items-center gap-2">⚙️ Kapasitas: <span className="font-bold text-amber-700">{pabrik.kapasitasTerpasangKgMinggu ? Number(pabrik.kapasitasTerpasangKgMinggu).toLocaleString('id-ID') : 0} Kg/Mg</span></p>
                </div>
              </div>
            ))}
            
            {filteredPabriks.length === 0 && (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Factory size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Tidak ada mitra penggilingan yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
