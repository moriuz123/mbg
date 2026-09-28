'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronRight, X, Building, Users, Utensils, ShieldCheck, ChefHat, Calendar, BarChart3, MessageSquare, CheckCircle, Clock, Eye, Flame, Dumbbell, Wheat, Droplets, GraduationCap, HeartPulse, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SppgData = {
  sppgId: number;
  idSppgCode: string | null;
  namaSppg: string;
  alamat: string | null;
  statusOperasional: string;
  tanggalOperasional: string | null;
  namaKaSppg: string | null;
  noHpKaSppg: string | null;
  jumlahPenjamahMakanan: number | null;
  jumlahBpjsTk: number | null;
  chefBersertifikatBnsp: number | null;
  keterangan: string | null;
  desaId: number | null;
  namaDesa: string | null;
  kecamatanId: number | null;
  namaKecamatan: string | null;
  totalPenerima: number;
  jumlahSekolah: number;
};

type LaporanData = {
  id: number;
  tanggal: string | null;
  sppgId?: number | null;
  sekolahId?: number | null;
  posyanduId?: number | null;
  menu: string;
  standarMenuGizi?: any;
  jumlahPorsi: number | null;
  status: string | null;
  catatan: string | null;
  namaSppg: string | null;
  namaSekolah: string | null;
  tujuanTipe?: string;
  fotoDokumentasi: string | null;
};

type FilterOptions = {
  kecamatans: { id: number, nama: string }[];
  desas: { id: number, nama: string, kecamatanId: number }[];
};

export default function SppgClient({ 
  initialData, 
  filterOptions,
  currentTab
}: { 
  initialData: SppgData[], 
  filterOptions: FilterOptions,
  currentTab: string
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState<string>('');
  const [filterDesa, setFilterDesa] = useState<string>('');
  const [selectedSppg, setSelectedSppg] = useState<SppgData | null>(null);
  
  const setTab = (tab: string) => {
    router.push(`/sppg?tab=${tab}`);
  };

  const filteredDesas = useMemo(() => {
    if (!filterKecamatan) return filterOptions.desas;
    return filterOptions.desas.filter(d => d.kecamatanId === parseInt(filterKecamatan));
  }, [filterKecamatan, filterOptions.desas]);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = item.namaSppg.toLowerCase().includes(search.toLowerCase()) || 
                          (item.idSppgCode && item.idSppgCode.toLowerCase().includes(search.toLowerCase()));
      const matchKecamatan = filterKecamatan ? item.kecamatanId === parseInt(filterKecamatan) : true;
      const matchDesa = filterDesa ? item.desaId === parseInt(filterDesa) : true;
      
      return matchSearch && matchKecamatan && matchDesa;
    });
  }, [search, filterKecamatan, filterDesa, initialData]);

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterKecamatan(e.target.value);
    setFilterDesa('');
  };

  // Statistik Computations
  const totalSppg = initialData.length;
  const totalOperasional = initialData.filter(s => s.statusOperasional === 'Operasional').length;
  const totalPenerima = initialData.reduce((acc, curr) => acc + curr.totalPenerima, 0);
  
  const sppgPerKecamatan = useMemo(() => {
    const map = new Map<string, number>();
    initialData.forEach(s => {
      const kecName = s.namaKecamatan || 'Lainnya';
      map.set(kecName, (map.get(kecName) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [initialData]);

  return (
    <div>
      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setTab('directory')}
          style={{
            padding: '1rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: currentTab === 'directory' ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: currentTab === 'directory' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: currentTab === 'directory' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <Building size={18} /> Direktori SPPG
        </button>
        <button 
          onClick={() => setTab('statistics')}
          style={{
            padding: '1rem 1.5rem',
            background: 'none',
            border: 'none',
            borderBottom: currentTab === 'statistics' ? '3px solid var(--primary-600)' : '3px solid transparent',
            color: currentTab === 'statistics' ? 'var(--primary-600)' : 'var(--text-secondary)',
            fontWeight: currentTab === 'statistics' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <BarChart3 size={18} /> Statistik
        </button>
        
      </div>

      {/* TAB CONTENT: DIRECTORY */}
      {currentTab === 'directory' && (
        <div className="animate-fade-in">
          {/* Filters Section */}
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Search size={16} /> Cari SPPG / Kode
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Contoh: Dapur Lebak 1..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ backgroundColor: '#fff' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> Kecamatan
                </label>
                <select 
                  className="form-input" 
                  value={filterKecamatan} 
                  onChange={handleKecamatanChange}
                  style={{ backgroundColor: '#fff', cursor: 'pointer' }}
                >
                  <option value="">Semua Kecamatan</option>
                  {filterOptions.kecamatans.map(k => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} /> Desa/Kelurahan
                </label>
                <select 
                  className="form-input" 
                  value={filterDesa} 
                  onChange={e => setFilterDesa(e.target.value)}
                  disabled={!filterKecamatan}
                  style={{ backgroundColor: '#fff', cursor: filterKecamatan ? 'pointer' : 'not-allowed', opacity: filterKecamatan ? 1 : 0.6 }}
                >
                  <option value="">Semua Desa</option>
                  {filteredDesas.map(d => (
                    <option key={d.id} value={d.id}>{d.nama}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Menampilkan <strong>{filteredData.length}</strong> unit layanan SPPG.
              </span>
              {(search || filterKecamatan || filterDesa) && (
                <button 
                  className="btn btn-ghost" 
                  onClick={() => { setSearch(''); setFilterKecamatan(''); setFilterDesa(''); }}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8125rem' }}
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Results List */}
          {filteredData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredData.map((sppg, idx) => (
                <div 
                  key={sppg.sppgId} 
                  className="card animate-fade-in hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between p-5" 
                  style={{ animationDelay: `${(idx % 10) * 0.05}s`, cursor: 'pointer', borderLeft: sppg.statusOperasional === 'Operasional' ? '4px solid var(--success)' : '4px solid var(--warning)', borderRadius: '0.75rem', backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}
                  onClick={() => setSelectedSppg(sppg)}
                >
                  <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
                    {/* Icon & Title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: '300px' }}>
                      <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-600)', flexShrink: 0 }}>
                        <Building size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{sppg.namaSppg}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          <span>{sppg.idSppgCode || '-'}</span>
                          <span className={`badge ${sppg.statusOperasional === 'Operasional' ? 'badge-success' : 'badge-warning'} ml-1`}>
                            {sppg.statusOperasional}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-1.5 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 flex-1 w-full border-t md:border-t-0 mt-3 md:mt-0">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={16} className="shrink-0" />
                        <span className="truncate">{sppg.namaDesa || '-'}, Kec. {sppg.namaKecamatan || '-'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <Users size={16} className="shrink-0" />
                        <span><strong>{sppg.totalPenerima.toLocaleString('id-ID')}</strong> Penerima di {sppg.jumlahSekolah} Sekolah</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA Action */}
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-600)', fontSize: '0.875rem', fontWeight: 600, paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }} className="md:border-none md:pt-0 md:mt-0 md:pl-6 shrink-0 w-full md:w-auto justify-end">
                    Lihat Profil Lengkap <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
              <Building size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tidak ada data SPPG</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Silakan ubah filter pencarian Anda untuk melihat hasil lainnya.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: STATISTICS */}
      {currentTab === 'statistics' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: '1rem', color: 'var(--primary-600)' }}>
                <Building size={32} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total SPPG</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSppg}</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'var(--success-light)', padding: '1rem', borderRadius: '1rem', color: 'var(--success)' }}>
                <ShieldCheck size={32} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>SPPG Operasional</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalOperasional}</div>
              </div>
            </div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#ebf5ff', padding: '1rem', borderRadius: '1rem', color: '#3b82f6' }}>
                <Users size={32} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Total Penerima Manfaat</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalPenerima.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Sebaran SPPG per Kecamatan</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sppgPerKecamatan.length > 0 ? sppgPerKecamatan.map(([kecName, count], idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 500 }}>{kecName}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} SPPG</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(count / totalSppg) * 100}%`, height: '100%', backgroundColor: 'var(--primary-500)', borderRadius: '4px' }} />
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>Belum ada data</div>
              )}
            </div>
          </div>
        </div>
      )}

      
      {/* Modal Detail SPPG (Same as before, inside directory tab logically but rendered globally) */}
      {selectedSppg && (
        <div className="modal-overlay" onClick={() => setSelectedSppg(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className={`badge ${selectedSppg.statusOperasional === 'Operasional' ? 'badge-success' : 'badge-warning'}`}>{selectedSppg.statusOperasional}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID: {selectedSppg.idSppgCode || 'N/A'}</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{selectedSppg.namaSppg}</h2>
              </div>
              <button 
                onClick={() => setSelectedSppg(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Informasi Dasar</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Penanggung Jawab (Ka. SPPG)</span>
                    <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Users size={14} /> {selectedSppg.namaKaSppg || '-'}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Kontak (No. HP)</span>
                    <span style={{ fontWeight: 500 }}>{selectedSppg.noHpKaSppg || '-'}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Alamat Lengkap</span>
                    <span style={{ fontWeight: 500, display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
                      <MapPin size={16} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                      <span>
                        {selectedSppg.alamat ? `${selectedSppg.alamat}, ` : ''}
                        {selectedSppg.namaDesa || '-'}, Kec. {selectedSppg.namaKecamatan || '-'}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Tanggal Operasional</span>
                    <span style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> 
                      {selectedSppg.tanggalOperasional ? new Date(selectedSppg.tanggalOperasional).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--primary-50)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-200)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--primary-800)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Data Operasional</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Penjamah Makanan</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Utensils size={18} /> {selectedSppg.jumlahPenjamahMakanan || 0}
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Chef Bersertifikat</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <ChefHat size={18} /> {selectedSppg.chefBersertifikatBnsp || 0}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--primary-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--primary-800)', fontWeight: 600 }}>Cakupan Layanan:</span>
                    <span style={{ fontSize: '1.125rem', color: 'var(--primary-900)', fontWeight: 700 }}>{selectedSppg.totalPenerima.toLocaleString('id-ID')} Siswa</span>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--primary-700)', textAlign: 'right' }}>dari {selectedSppg.jumlahSekolah} Sekolah</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setSelectedSppg(null)}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Tutup
              </button>
              <button 
                onClick={() => window.location.href = `/sppg/${selectedSppg.sppgId}`}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-600)', color: '#fff', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Lihat Profil Lengkap
              </button>
            </div>
          </div>
        </div>
      )}

          </div>
  );
}
