'use client';

import React, { useState, useTransition } from 'react';
import { Database, Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { addMasterData, updateMasterData, deleteMasterData } from '@/app/actions/master';
import { useRouter } from 'next/navigation';

export default function MasterDataClient({ activeTab, activeLabel, tableData }: { activeTab: any, activeLabel: string, tableData: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValue, setFormValue] = useState("");

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormValue(item.name);
    } else {
      setEditingId(null);
      setFormValue("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormValue("");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    startTransition(async () => {
      if (editingId) {
        await updateMasterData(activeTab, editingId, formValue);
      } else {
        await addMasterData(activeTab, formValue);
      }
      handleCloseModal();
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      startTransition(async () => {
        await deleteMasterData(activeTab, id);
        router.refresh();
      });
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl mb-2">Manajemen Master Data</h2>
          <p className="text-muted">Kelola data referensi yang digunakan pada modul Pre-Market dan Post-Market.</p>
        </div>
        <div className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Database size={16} /> Konfigurasi Aktif
        </div>
      </div>

      <div className="card">
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl">Daftar {activeLabel}</h3>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={16}/> Tambah Data
            </button>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>No</th>
                  <th>Nama Item / Deskripsi</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td className="font-medium">{item.name}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="flex justify-center gap-2">
                        <button disabled={isPending} className="btn btn-ghost" onClick={() => handleOpenModal(item)} style={{ padding: '0.25rem', color: '#3b82f6' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button disabled={isPending} className="btn btn-ghost" onClick={() => handleDelete(item.id)} style={{ padding: '0.25rem', color: '#ef4444' }} title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>Belum ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {editingId ? `Edit ${activeLabel}` : `Tambah ${activeLabel}`}
              </h3>
              <button className="btn btn-ghost" disabled={isPending} onClick={handleCloseModal} style={{ padding: '0.5rem' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-6">
                <label className="form-label">Nama Item / Deskripsi</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formValue}
                  onChange={e => setFormValue(e.target.value)}
                  placeholder={`Contoh entri untuk ${activeLabel}`}
                  required 
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" disabled={isPending} className="btn btn-ghost" onClick={handleCloseModal}>Batal</button>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                  {isPending ? <Loader2 className="animate-spin" size={18} /> : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
