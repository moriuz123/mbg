'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Layers, ChevronRight, X, Building2, User, School, Calendar } from 'lucide-react';

type SekolahData = {
  sekolahId: number;
  namaSekolah: string;
  npsn: string | null;
  jumlahSiswaTotal: number | null;
  alamatSekolah: string | null;
  namaKepalaSekolah: string | null;
  statusPenerimaan: string;
  tanggalMulai: string | null;
  tanggalSelesai: string | null;
  sppgId: number;
  namaSppg: string;
  kecamatanId: number | null;
  namaKecamatan: string | null;
  desaId: number | null;
  namaDesa: string | null;
  kategoriId: number | null;
  namaKategori: string | null;
};

type FilterOptions = {
  kecamatans: { id: number; nama: string }[];
  desas: { id: number; nama: string; kecamatanId: number | null }[];
  kategoris: { id: number; nama: string }[];
};

export default function SekolahClient({ initialData, filterOptions }: { initialData: SekolahData[], filterOptions: FilterOptions }) {
  const [search, setSearch] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState<string>('');
  const [filterDesa, setFilterDesa] = useState<string>('');
  const [filterKategori, setFilterKategori] = useState<string>('');
  const [selectedSekolah, setSelectedSekolah] = useState<SekolahData | null>(null);

  const filteredDesas = useMemo(() => {
    if (!filterKecamatan) return filterOptions.desas;
    return filterOptions.desas.filter(d => d.kecamatanId === parseInt(filterKecamatan));
  }, [filterKecamatan, filterOptions.desas]);

  const filteredData = useMemo(() => {
    return initialData.filter(item => {
      const matchSearch = item.namaSekolah.toLowerCase().includes(search.toLowerCase()) || 
                          (item.npsn && item.npsn.includes(search));
      const matchKecamatan = filterKecamatan ? item.kecamatanId === parseInt(filterKecamatan) : true;
      const matchDesa = filterDesa ? item.desaId === parseInt(filterDesa) : true;
      const matchKategori = filterKategori ? item.kategoriId === parseInt(filterKategori) : true;
      
      return matchSearch && matchKecamatan && matchDesa && matchKategori;
    });
  }, [search, filterKecamatan, filterDesa, filterKategori, initialData]);

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
              <Search size={16} /> Cari Sekolah / NPSN
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: SDN 1 Rangkasbitung..."
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

          {/* Jenjang / Kategori */}
          <div>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} /> Jenjang
            </label>
            <select 
              className="form-input" 
              value={filterKategori} 
              onChange={e => setFilterKategori(e.target.value)}
              style={{ backgroundColor: '#fff', cursor: 'pointer' }}
            >
              <option value="">Semua Jenjang</option>
              {filterOptions.kategoris.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>
          
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Menampilkan <strong>{filteredData.length}</strong> sekolah penerima manfaat.
          </span>
          {(search || filterKecamatan || filterDesa || filterKategori) && (
            <button 
              className="btn btn-ghost" 
              onClick={() => { setSearch(''); setFilterKecamatan(''); setFilterDesa(''); setFilterKategori(''); }}
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
          {filteredData.map((sekolah, idx) => (
            <div 
              key={`${sekolah.sekolahId}-${idx}`} 
              className="card animate-fade-in hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between p-5" 
              style={{ animationDelay: `${(idx % 10) * 0.05}s`, cursor: 'pointer', borderLeft: '4px solid var(--primary-500)', borderRadius: '0.75rem', backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}
              onClick={() => setSelectedSekolah(sekolah)}
            >
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full">
                {/* Icon & Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', minWidth: '300px' }}>
                  <div style={{ backgroundColor: 'var(--primary-50)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-600)', flexShrink: 0 }}>
                    <School size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{sekolah.namaSekolah}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      <span className="badge badge-primary">{sekolah.namaKategori || 'N/A'}</span>
                      {sekolah.npsn && <span>NPSN: {sekolah.npsn}</span>}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1.5 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 flex-1 w-full border-t md:border-t-0 mt-3 md:mt-0">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="shrink-0" />
                    <span className="truncate">{sekolah.namaDesa}, Kec. {sekolah.namaKecamatan}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <User size={16} className="shrink-0" />
                    <span>{sekolah.jumlahSiswaTotal || 0} Siswa Penerima</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Building2 size={16} className="shrink-0" />
                    <span className="truncate">SPPG: <strong>{sekolah.namaSppg}</strong></span>
                  </div>
                </div>
              </div>
              
              {/* CTA Action */}
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary-600)', fontSize: '0.875rem', fontWeight: 600, paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)' }} className="md:border-none md:pt-0 md:mt-0 md:pl-6 shrink-0 w-full md:w-auto justify-end">
                Lihat Detail <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--border-color)' }}>
          <School size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Tidak ada data sekolah</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Silakan ubah filter pencarian Anda untuk melihat hasil lainnya.</p>
        </div>
      )}

      {/* Modal Detail Sekolah */}
      {selectedSekolah && (
        <div className="modal-overlay" onClick={() => setSelectedSekolah(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-primary">{selectedSekolah.namaKategori || 'N/A'}</span>
                  <span className="badge badge-success">Aktif MBG</span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{selectedSekolah.namaSekolah}</h2>
              </div>
              <button 
                onClick={() => setSelectedSekolah(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Informasi Sekolah</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NPSN</span>
                    <span style={{ fontWeight: 500 }}>{selectedSekolah.npsn || '-'}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Kepala Sekolah</span>
                    <span style={{ fontWeight: 500 }}>{selectedSekolah.namaKepalaSekolah || '-'}</span>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Alamat</span>
                    <span style={{ fontWeight: 500 }}>
                      {selectedSekolah.alamatSekolah ? `${selectedSekolah.alamatSekolah}, ` : ''}
                      {selectedSekolah.namaDesa}, Kec. {selectedSekolah.namaKecamatan}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-200)' }}>
                <h4 style={{ fontSize: '0.875rem', color: 'var(--primary-800)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Data Program MBG</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Unit Pelayanan (SPPG)</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)' }}>{selectedSekolah.namaSppg}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Jumlah Penerima</span>
                    <span style={{ fontWeight: 600, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={14} /> {selectedSekolah.jumlahSiswaTotal || 0} Siswa
                    </span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary-700)' }}>Tanggal Mulai</span>
                    <span style={{ fontWeight: 500, color: 'var(--primary-900)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> 
                      {selectedSekolah.tanggalMulai ? new Date(selectedSekolah.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                onClick={() => setSelectedSekolah(null)}
                style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Tutup
              </button>
              <button 
                onClick={() => window.location.href = `/sekolah/${selectedSekolah.sekolahId}`}
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
