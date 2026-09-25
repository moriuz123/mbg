'use client';

import React, { useState } from 'react';
import { Wheat, Factory, Warehouse, Settings, TrendingUp, Percent, MapPin, Search, XCircle } from 'lucide-react';

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

export default function PenggilinganClient({ gabahData, distribusiData, macroStats, pabrikList = [], filterOptions = { kecamatans: [], desas: [], kategoris: [] }, isHomepage = false }: { gabahData: MonthlyData[], distribusiData: MonthlyData[], macroStats: MacroStats, pabrikList?: any[], filterOptions?: any, isHomepage?: boolean }) {
  const [mainTab, setMainTab] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('gabah');
  const [searchPabrik, setSearchPabrik] = useState('');
  
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterDesa, setFilterDesa] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const getUtilisasiStatus = (utilisasi: string) => {
    const val = parseFloat(utilisasi);
    if (val < 40) return { text: "Menganggur (Kurang Pasokan)", color: "text-rose-600", border: "border-rose-200", bg: "bg-rose-50" };
    if (val <= 80) return { text: "Optimal", color: "text-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50" };
    return { text: "Kelebihan Beban", color: "text-amber-600", border: "border-amber-200", bg: "bg-amber-50" };
  };
  
  const utilStatus = getUtilisasiStatus(macroStats.utilisasiMesin);

  const filteredDesas = filterKecamatan 
    ? filterOptions.desas.filter((d: any) => d.kecamatanId === parseInt(filterKecamatan))
    : filterOptions.desas;

  const filteredPabriks = pabrikList.filter(p => {
    const matchSearch = p.namaPenggilingan?.toLowerCase().includes(searchPabrik.toLowerCase());
    const matchKecamatan = filterKecamatan ? p.kecamatanId === parseInt(filterKecamatan) : true;
    const matchDesa = filterDesa ? p.desaId === parseInt(filterDesa) : true;
    const matchStatus = filterStatus ? p.status === filterStatus : true;
    return matchSearch && matchKecamatan && matchDesa && matchStatus;
  });

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredPabriks.length / itemsPerPage);
  const currentPabriks = filteredPabriks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    setSearchPabrik('');
    setFilterKecamatan('');
    setFilterDesa('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPabrik(e.target.value);
    setCurrentPage(1); // Reset page on search
  };

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterKecamatan(e.target.value);
    setFilterDesa('');
    setCurrentPage(1);
  };

  const handleDesaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterDesa(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* MAIN TABS */}
      {!isHomepage && (
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
      )}

      {mainTab === 'dashboard' && (
        <div className="animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card glass-panel border-t-4 border-t-sky-500 flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: '50%' }}>
            <MapPin size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Penyerapan Lokal</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.persenLokal} <span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          </div>
        </div>

        <div className="card glass-panel border-t-4 border-t-amber-500 flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#fef3c7', color: '#b45309', borderRadius: '50%' }}>
            <Wheat size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Gabah Masuk</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.totalGabah.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>

        <div className="card glass-panel border-t-4 border-t-violet-500 flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#ede9fe', color: '#6d28d9', borderRadius: '50%' }}>
            <Percent size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Rata-Rata Rendemen</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.rataRendemen} <span style={{ fontSize: '1rem', fontWeight: 500 }}>%</span></div>
          </div>
        </div>

        <div className="card glass-panel border-t-4 border-t-emerald-500 flex items-center gap-4 p-4 shadow-sm">
          <div style={{ padding: '0.75rem', background: '#dcfce7', color: '#15803d', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase">Distribusi Beras MBG</div>
            <div className="text-2xl font-black text-slate-800">{macroStats.totalDistribusi.toLocaleString('id-ID')} <span style={{ fontSize: '1rem', fontWeight: 500 }}>Kg</span></div>
          </div>
        </div>

        <div className="card glass-panel border-t-4 border-t-indigo-500 flex items-center gap-4 p-4 shadow-sm">
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
        <div className="bg-white border border-slate-200 border-t-4 border-t-amber-500 rounded-2xl p-6 shadow-sm">
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

        <div className="bg-white border border-slate-200 border-t-4 border-t-emerald-500 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-emerald-600"/> Rincian Distribusi Beras Keluar</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600 font-medium">Ke SPPG (Makan Bergizi Gratis)</span>
              <span className="font-black text-emerald-700">{macroStats.distribusiSppg.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="text-slate-600">Distribusi Umum Lokal</span>
              <span className="font-bold text-slate-700">{macroStats.distribusiLokalUmum.toLocaleString('id-ID')} Kg</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">Dijual Keluar Lebak (Outflow)</span>
              <span className="font-bold text-rose-600">{macroStats.distribusiLuar.toLocaleString('id-ID')} Kg</span>
            </div>
          </div>
        </div>
      </div>

      {!isHomepage ? (
        <>
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
                        <th className="p-3 text-xs font-bold text-slate-600 uppercase text-right">Total Volume Distribusi (Kg)</th>
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
        </>
      ) : (
        <div className="mt-12 text-center">
          <a href="/data-penggilingan" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-1">
            Selengkapnya Lihat Direktori Mitra <TrendingUp size={20} />
          </a>
        </div>
      )}
      </div>
      )}

      {mainTab === 'direktori' && (
        <div className="animate-fade-in">
          {/* Filters Section */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2"><Search size={16} className="text-primary-600"/> Cari & Filter Penggilingan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Cari Nama</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Berkah Mukti..." 
                  value={searchPabrik}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Kecamatan</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-colors"
                  value={filterKecamatan} 
                  onChange={handleKecamatanChange}
                >
                  <option value="">Semua Kecamatan</option>
                  {filterOptions.kecamatans.map((k: any) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Desa / Kelurahan</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-colors disabled:opacity-50"
                  value={filterDesa} 
                  onChange={handleDesaChange}
                  disabled={!filterKecamatan}
                >
                  <option value="">Semua Desa</option>
                  {filteredDesas.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Status Operasional</label>
                <select 
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-50 focus:bg-white transition-colors"
                  value={filterStatus} 
                  onChange={handleStatusChange}
                >
                  <option value="">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">
                Menampilkan <strong className="text-slate-800">{filteredPabriks.length}</strong> mitra penggilingan.
              </span>
              {(searchPabrik || filterKecamatan || filterDesa || filterStatus) && (
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <XCircle size={16} /> Reset Filter
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {currentPabriks.map((pabrik: any) => (
              <div 
                key={pabrik.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between"
                style={{ borderLeft: pabrik.status === 'Aktif' ? '4px solid var(--success)' : '4px solid var(--warning)' }}
              >
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
                  {/* Icon & Title */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: '250px' }}>
                    <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-600)', flexShrink: 0 }}>
                      <Factory size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{pabrik.namaPenggilingan}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <span className={`badge ${pabrik.status === 'Aktif' ? 'badge-success' : 'badge-warning'}`}>
                          {pabrik.status || 'Aktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 flex-1 w-full border-t md:border-t-0 mt-3 md:mt-0">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={16} className="shrink-0 text-slate-400" />
                      <span className="truncate">{pabrik.desa?.namaDesa ? `Desa ${pabrik.desa.namaDesa}, Kec. ${pabrik.kecamatan?.namaKecamatan}` : (pabrik.alamat || 'Alamat belum dilengkapi')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-1">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Warehouse size={16} className="shrink-0 text-emerald-500" />
                        <span>Stok Beras: <strong>{pabrik.sisaStokBeras ? Number(pabrik.sisaStokBeras).toLocaleString('id-ID') : 0} Kg</strong></span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Settings size={16} className="shrink-0 text-amber-500" />
                        <span>Kapasitas: <strong>{pabrik.kapasitasTerpasangKgMinggu ? Number(pabrik.kapasitasTerpasangKgMinggu).toLocaleString('id-ID') : 0} Kg/Mg</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredPabriks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Factory size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">Tidak ada mitra penggilingan yang ditemukan.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
