'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronRight, X, Building2, User, Activity, Calendar, HeartPulse } from 'lucide-react';
import Link from 'next/link';

type PosyanduData = {
  posyanduId: number;
  namaPosyandu: string;
  jumlahBusui: number | null;
  jumlahBalita: number | null;
  jumlahBumil: number | null;
  jumlahTotal: number | null;
  alamatPosyandu: string | null;
  namaKetuaKader: string | null;
  statusPenerimaan: string;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  sppgId: number;
  namaSppg: string;
  kecamatanId: number | null;
  namaKecamatan: string | null;
  desaId: number | null;
  namaDesa: string | null;
};

type FilterOptions = {
  kecamatans: { id: number; nama: string }[];
  desas: { id: number; nama: string; kecamatanId: number | null }[];
};

export default function PosyanduClient({ initialData, filterOptions }: { initialData: PosyanduData[], filterOptions: FilterOptions }) {
  const [search, setSearch] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState<string>('');
  const [filterDesa, setFilterDesa] = useState<string>('');
  const [selectedPosyandu, setSelectedPosyandu] = useState<PosyanduData | null>(null);

  const filteredDesas = useMemo(() => {
    if (!filterKecamatan) return filterOptions.desas;
    return filterOptions.desas.filter(d => d.kecamatanId === parseInt(filterKecamatan));
  }, [filterKecamatan, filterOptions.desas]);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = item.namaPosyandu.toLowerCase().includes(search.toLowerCase());
      const matchKecamatan = filterKecamatan ? item.kecamatanId === parseInt(filterKecamatan) : true;
      const matchDesa = filterDesa ? item.desaId === parseInt(filterDesa) : true;
      
      return matchSearch && matchKecamatan && matchDesa;
    });
  }, [search, filterKecamatan, filterDesa, initialData]);

  const handleKecamatanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterKecamatan(e.target.value);
    setFilterDesa(''); // Reset desa when kecamatan changes
  };

  return (
    <div>
      {/* Filters Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={16} /> Cari Posyandu
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: Posyandu Melati..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ backgroundColor: '#fff' }}
            />
          </div>

          {/* Kecamatan */}
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

          {/* Desa / Kelurahan */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} /> Desa/Kelurahan
            </label>
            <select 
              className="form-input" 
              value={filterDesa} 
              onChange={e => setFilterDesa(e.target.value)}
              style={{ backgroundColor: '#fff', cursor: 'pointer' }}
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
            Menampilkan <strong>{filteredData.length}</strong> posyandu penerima manfaat.
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
          {filteredData.map((posyandu, idx) => (
            <div 
              key={`${posyandu.posyanduId}-${idx}`} 
              className="card animate-fade-in hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between p-5" 
              style={{ animationDelay: `${(idx % 10) * 0.05}s`, cursor: 'pointer', borderLeft: '4px solid var(--primary-500)', borderRadius: '0.75rem', backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}
              onClick={() => setSelectedPosyandu(posyandu)}
            >
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
                {/* Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: '300px' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-600)', flexShrink: 0 }}>
                    <HeartPulse size={24} />
                  </div>
                  <div>
                    <Link href={`/posyandu/${posyandu.posyanduId}`} onClick={e => e.stopPropagation()} className="hover:underline">
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{posyandu.namaPosyandu}</h3>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <span className="badge badge-primary">Posyandu</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 flex-1 w-full border-t md:border-t-0 mt-3 md:mt-0">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="shrink-0" />
                    <span className="truncate">{posyandu.namaDesa}, Kec. {posyandu.namaKecamatan}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <User size={16} className="shrink-0" />
                    <span>{posyandu.jumlahTotal || 0} Penerima Manfaat</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Building2 size={16} className="shrink-0" />
                    <span className="truncate">SPPG: <strong>{posyandu.namaSppg}</strong></span>
                  </div>
                </div>
              </div>
              
              {/* CTA Action */}
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100 md:border-none md:pt-0 md:mt-0 md:pl-6 shrink-0 w-full md:w-auto justify-end" onClick={e => e.stopPropagation()}>
                <Link 
                  href={`/posyandu/${posyandu.posyanduId}`} 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm"
                >
                  Profil & Riwayat <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
          <HeartPulse size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tidak ada data posyandu</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Silakan ubah filter pencarian Anda untuk melihat hasil lainnya.</p>
        </div>
      )}

      {/* Modal Detail Posyandu */}
      {selectedPosyandu && (
        <div className="modal-overlay" onClick={() => setSelectedPosyandu(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">Posyandu</span>
                  <span className="badge badge-success">Aktif MBG</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{selectedPosyandu.namaPosyandu}</h2>
              </div>
              <button 
                onClick={() => setSelectedPosyandu(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Informasi Posyandu</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ketua Kader</span>
                    <span style={{ fontWeight: 500 }}>{selectedPosyandu.namaKetuaKader || '-'}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Alamat</span>
                    <span style={{ fontWeight: 500 }}>
                      {selectedPosyandu.alamatPosyandu ? `${selectedPosyandu.alamatPosyandu}, ` : ''}
                      {selectedPosyandu.namaDesa}, Kec. {selectedPosyandu.namaKecamatan}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-200)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--primary-800)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Data Program MBG</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Unit Pelayanan (SPPG)</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{selectedPosyandu.namaSppg}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Bumil (Ibu Hamil)</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{selectedPosyandu.jumlahBumil || 0} Orang</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Busui (Ibu Menyusui)</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{selectedPosyandu.jumlahBusui || 0} Orang</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Balita</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{selectedPosyandu.jumlahBalita || 0} Anak</span>
                  </div>
                  <div style={{ gridColumn: 'span 2', borderTop: '1px dashed var(--primary-300)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Total Penerima</span>
                    <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary-900)' }}>{selectedPosyandu.jumlahTotal || 0} Orang</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Tanggal Mulai</span>
                    <span style={{ fontWeight: 500, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> 
                      {selectedPosyandu.tanggalMulai ? new Date(selectedPosyandu.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link 
                href={`/posyandu/${selectedPosyandu.posyanduId}`} 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#059669', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.875rem' }}
              >
                Profil & Riwayat Lengkap <ChevronRight size={16} />
              </Link>
              <button className="btn btn-ghost" onClick={() => setSelectedPosyandu(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
