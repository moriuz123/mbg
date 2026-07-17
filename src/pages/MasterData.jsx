import React, { useState } from 'react';
import { Database, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';

const initialMasterData = {
  sumberGabah: [
    "Petani Lokal - Desa Rangkasbitung",
    "KUD Lebak",
    "Kelompok Tani Makmur",
    "Koperasi Jaya"
  ],
  lokusSPPG: [
    "SPPG Rangkasbitung",
    "SPPG Cibadak",
    "SPPG Kalanganyar",
    "SPPG Maja"
  ],
  jenisPangan: [
    "Beras Premium",
    "Daging Ayam",
    "Daging Sapi",
    "Telur Ayam",
    "Sayur Mayur",
    "Buah-buahan",
    "Ikan Nila"
  ],
  distributor: [
    "Penggilingan Rangkasbitung",
    "Peternakan Cibadak",
    "Pasar Induk Lebak",
    "KUD Maja",
    "Agen Telur Berkah"
  ],
  parameterUji: [
    "Pestisida",
    "Formalin",
    "Boraks",
    "Rhodamin B",
    "E. Coli"
  ]
};

function MasterData() {
  const { tabId } = useParams();
  
  // State for data and form
  const [data, setData] = useState(initialMasterData);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formValue, setFormValue] = useState("");

  // Mapping URL param to state id
  const tabMapping = {
    'sumber-gabah': { id: 'sumberGabah', label: 'Sumber Gabah' },
    'lokus-sppg': { id: 'lokusSPPG', label: 'Lokus SPPG' },
    'jenis-pangan': { id: 'jenisPangan', label: 'Jenis Pangan' },
    'distributor': { id: 'distributor', label: 'Distributor' },
    'parameter-uji': { id: 'parameterUji', label: 'Parameter Uji' },
  };

  const currentTab = tabMapping[tabId];

  // If invalid route, redirect to default
  if (!currentTab) {
    return <Navigate to="/master-data/sumber-gabah" replace />;
  }

  const activeTab = currentTab.id;
  const activeLabel = currentTab.label;

  const handleOpenModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setFormValue(data[activeTab][index]);
    } else {
      setEditingIndex(null);
      setFormValue("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormValue("");
    setEditingIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValue.trim()) return;

    const currentList = [...data[activeTab]];
    if (editingIndex !== null) {
      currentList[editingIndex] = formValue;
    } else {
      currentList.push(formValue);
    }
    
    setData({
      ...data,
      [activeTab]: currentList
    });
    
    handleCloseModal();
  };

  const handleDelete = (index) => {
    if(window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const currentList = [...data[activeTab]];
      currentList.splice(index, 1);
      setData({
        ...data,
        [activeTab]: currentList
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
                {data[activeTab].map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td className="font-medium">{item}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="flex justify-center gap-2">
                        <button className="btn btn-ghost" onClick={() => handleOpenModal(index)} style={{ padding: '0.25rem', color: '#3b82f6' }} title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="btn btn-ghost" onClick={() => handleDelete(index)} style={{ padding: '0.25rem', color: '#ef4444' }} title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data[activeTab].length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>Belum ada data.</td>
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
                {editingIndex !== null ? `Edit ${activeLabel}` : `Tambah ${activeLabel}`}
              </h3>
              <button className="btn btn-ghost" onClick={handleCloseModal} style={{ padding: '0.5rem' }}>
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
                <button type="button" className="btn btn-ghost" onClick={handleCloseModal}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MasterData;
