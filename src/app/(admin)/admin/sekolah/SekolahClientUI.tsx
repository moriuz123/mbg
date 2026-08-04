'use client';

import React, { useState } from 'react';
import { Plus, X, GraduationCap, MapPin, Users, Trash2 } from 'lucide-react';
import { createSekolah, deleteSekolah } from './actions';
import { v4 as uuidv4 } from 'uuid';

export default function SekolahClientUI({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: uuidv4(),
      namaSekolah: formData.get('namaSekolah') as string,
      jenjang: formData.get('jenjang') as string,
      alamat: formData.get('alamat') as string,
      jumlahSiswa: formData.get('jumlahSiswa') as string,
    };

    const res = await createSekolah(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Yakin ingin menghapus data sekolah ini?')) {
      await deleteSekolah(id);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        style={{ 
          backgroundColor: '#306d29', color: '#ffffff', border: 'none', borderRadius: '0.5rem', 
          padding: '0.75rem 1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
          cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(48,109,41,0.2)'
        }}
      >
        <Plus size={20} /> Tambah Sekolah
      </button>

      {/* MODAL FORM */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '1rem', width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>Tambah Data Sekolah</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Nama Sekolah</label>
                <input required name="namaSekolah" type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: SDN 1 Rangkasbitung" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Jenjang Pendidikan</label>
                <select required name="jenjang" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                  <option value="">Pilih Jenjang...</option>
                  <option value="PAUD/TK">PAUD / TK</option>
                  <option value="SD/MI">SD / MI</option>
                  <option value="SMP/MTS">SMP / MTs</option>
                  <option value="SMA/SMK">SMA / SMK / MA</option>
                  <option value="Pondok Pesantren">Pondok Pesantren</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Jumlah Siswa</label>
                <input required name="jumlahSiswa" type="number" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Contoh: 250" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Alamat Lengkap</label>
                <textarea required name="alamat" rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }} placeholder="Alamat lengkap sekolah..."></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  marginTop: '1rem', width: '100%', padding: '0.875rem', backgroundColor: '#306d29', 
                  color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data Sekolah'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WE RENDER THE TABLE HERE TO ALLOW DELETE ACTIONS EASILY */}
      <div style={{ marginTop: '2rem', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nama Sekolah & Jenjang</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alamat Lengkap</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jumlah Siswa</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '0.875rem' }}>
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    Belum ada data sekolah yang tersimpan.
                  </td>
                </tr>
              ) : (
                initialData.map((sekolah) => (
                  <tr key={sekolah.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="hover:bg-slate-50">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <GraduationCap size={16} color="#306d29" /> {sekolah.namaSekolah}
                      </div>
                      <div style={{ display: 'inline-flex', marginTop: '0.5rem', alignItems: 'center', padding: '0.15rem 0.5rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: 600 }}>
                        {sekolah.jenjang}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
                        <MapPin size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} /> {sekolah.alamat}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', color: '#0f172a', fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Users size={14} color="#64748b" /> {sekolah.jumlahSiswa}
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDelete(sekolah.id)}
                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                        className="hover:bg-red-50"
                      >
                        <Trash2 size={16} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
