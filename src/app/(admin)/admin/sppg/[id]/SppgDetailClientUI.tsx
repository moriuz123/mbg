'use client';

import React, { useState } from 'react';
import { Plus, X, Trash2, GraduationCap, Users, Calendar, ArrowLeft, HeartPulse } from 'lucide-react';
import Link from 'next/link';
import { assignSekolahToSppg, unassignSekolah, assignPosyanduToSppg, unassignPosyandu } from '@/app/actions/sppg';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function SppgDetailClientUI({ 
  sppg, 
  assignedSekolah, 
  allSekolah,
  assignedPosyandu,
  allPosyandu,
  allActiveSekolahAssignments = [],
  allActivePosyanduAssignments = []
}: { 
  sppg: any;
  assignedSekolah: any[];
  allSekolah: any[];
  assignedPosyandu: any[];
  allPosyandu: any[];
  allActiveSekolahAssignments?: any[];
  allActivePosyanduAssignments?: any[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPosyanduModalOpen, setIsPosyanduModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmType, setConfirmType] = useState<'sekolah'|'posyandu'>('sekolah');
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Filter out schools that are already assigned to ANY active SPPG
  const availableSekolah = allSekolah.filter(
    (s) => !allActiveSekolahAssignments.some((as) => as.sekolahId === s.id)
  );

  // Filter out posyandus that are already assigned to ANY active SPPG
  const availablePosyandu = allPosyandu.filter(
    (p) => !allActivePosyanduAssignments.some((ap) => ap.posyanduId === p.id)
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sppgId: sppg.id,
      sekolahId: parseInt(formData.get('sekolahId') as string, 10),
      jumlahTotal: parseInt(formData.get('jumlahTotal') as string, 10) || 0,
      tahunAjaran: formData.get('tahunAjaran') as string,
      tanggalMulai: formData.get('tanggalMulai') as string,
    };

    const res = await assignSekolahToSppg(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsOpen(false);
      setToastType('success');
      setToastMessage('Berhasil menambahkan sekolah ke SPPG!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Terjadi kesalahan');
    }
  }

  function handleRemoveClick(id: number, type: 'sekolah'|'posyandu') {
    setConfirmId(id);
    setConfirmType(type);
    setConfirmOpen(true);
  }

  async function handleConfirmRemove() {
    if (!confirmId) return;
    setIsDeleting(true);
    let res;
    if (confirmType === 'sekolah') {
      res = await unassignSekolah(confirmId, sppg.id);
    } else {
      res = await unassignPosyandu(confirmId, sppg.id);
    }
    setIsDeleting(false);
    setConfirmOpen(false);
    
    if (res?.success) {
      setToastType('success');
      setToastMessage(confirmType === 'sekolah' ? 'Sekolah berhasil dihapus dari SPPG!' : 'Posyandu berhasil dihapus dari SPPG!');
    } else {
      setToastType('error');
      setToastMessage(res?.error || 'Gagal menghapus data');
    }
  }

  async function handlePosyanduSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const busui = parseInt(formData.get('jumlahBusui') as string, 10) || 0;
    const bumil = parseInt(formData.get('jumlahBumil') as string, 10) || 0;
    const balita = parseInt(formData.get('jumlahBalita') as string, 10) || 0;
    const total = busui + bumil + balita;

    const data = {
      sppgId: sppg.id,
      posyanduId: parseInt(formData.get('posyanduId') as string, 10),
      jumlahBusui: busui,
      jumlahBumil: bumil,
      jumlahBalita: balita,
      jumlahTotal: total,
      tanggalMulai: formData.get('tanggalMulai') as string,
    };

    const res = await assignPosyanduToSppg(data);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsPosyanduModalOpen(false);
      setToastType('success');
      setToastMessage('Berhasil menambahkan posyandu ke SPPG!');
    } else {
      setToastType('error');
      setToastMessage(res.error || 'Terjadi kesalahan');
    }
  }

  return (
    <>
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      <ConfirmModal 
        isOpen={confirmOpen} 
        title={confirmType === 'sekolah' ? "Hapus Sekolah dari SPPG" : "Hapus Posyandu dari SPPG"}
        message={`Apakah Anda yakin ingin menghapus ${confirmType} ini dari SPPG? History akan tercatat sebagai Berhenti.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmOpen(false)}
      />
      <div className="flex justify-between items-center mb-6">
        <Link href="/admin/sppg" className="text-slate-500 hover:text-primary-600 flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Kembali ke Daftar SPPG
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold shadow-md shadow-primary-600/20 hover:-translate-y-0.5"
          >
            <Plus size={20} /> Sekolah
          </button>
          <button 
            onClick={() => setIsPosyanduModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-md shadow-emerald-600/20 hover:-translate-y-0.5"
          >
            <Plus size={20} /> Posyandu
          </button>
        </div>
      </div>

      {/* MODAL FORM */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Sekolah Penerima</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Pilih Sekolah *</label>
                <select required name="sekolahId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all">
                  <option value="">-- Pilih Sekolah --</option>
                  {availableSekolah.map(s => (
                    <option key={s.id} value={s.id}>{s.namaSekolah}</option>
                  ))}
                </select>
                {availableSekolah.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">Semua sekolah yang ada sudah terdaftar di SPPG (tidak ada sekolah bebas).</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Total Siswa</label>
                  <input required name="jumlahTotal" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tahun Ajaran</label>
                  <input required name="tahunAjaran" type="text" defaultValue="2025/2026" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" placeholder="2025/2026" />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tgl Mulai</label>
                  <input required name="tanggalMulai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || availableSekolah.length === 0}
                className={`mt-2 w-full p-4 bg-primary-600 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-600/20 ${isSubmitting || availableSekolah.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambahkan Penerima'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POSYANDU MODAL FORM */}
      {isPosyanduModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsPosyanduModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="mt-0 mb-6 text-2xl font-bold text-slate-800">Tambah Posyandu Penerima</h2>
            
            <form onSubmit={handlePosyanduSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-700">Pilih Posyandu *</label>
                <select required name="posyanduId" className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all">
                  <option value="">-- Pilih Posyandu --</option>
                  {availablePosyandu.map(p => (
                    <option key={p.id} value={p.id}>{p.namaPosyandu}</option>
                  ))}
                </select>
                {availablePosyandu.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2 font-medium">Semua posyandu yang ada sudah terdaftar di SPPG (tidak ada posyandu bebas).</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-xs font-semibold text-slate-700">Jumlah Busui</label>
                  <input required name="jumlahBusui" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold text-slate-700">Jumlah Bumil</label>
                  <input required name="jumlahBumil" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold text-slate-700">Jumlah Balita</label>
                  <input required name="jumlahBalita" type="number" min="0" className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-slate-700">Tgl Mulai</label>
                  <input required name="tanggalMulai" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting || availablePosyandu.length === 0}
                className={`mt-2 w-full p-4 bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 ${isSubmitting || availablePosyandu.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-700 hover:-translate-y-0.5'}`}
              >
                {isSubmitting ? 'Menyimpan...' : 'Tambahkan Posyandu'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* RENDER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Sekolah / Lembaga</th>
                <th className="p-5 text-center">Total Siswa</th>
                <th className="p-5">Status & Info</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {assignedSekolah.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <GraduationCap size={16} className="text-primary-600" /> {item.sekolah?.namaSekolah || 'Tidak Diketahui'}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-1">TA: {item.tahunAjaran}</div>
                  </td>
                  <td className="p-5 text-center font-bold text-primary-700 bg-primary-50/50">{item.jumlahTotal || (item.jumlahLaki + item.jumlahPerempuan)}</td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar size={12}/> {item.tanggalMulai ? new Date(item.tanggalMulai).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleRemoveClick(item.sekolahId, 'sekolah')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                      title="Berhentikan SPPG untuk Sekolah Ini"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {assignedSekolah.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <Users size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada Sekolah Penerima</p>
                    <p className="text-sm text-slate-400 mt-1">Tambahkan sekolah ke dapur SPPG ini untuk mulai mendistribusikan MBG.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Posyandu</th>
                <th className="p-5 text-center">Total Sasaran</th>
                <th className="p-5">Status & Info</th>
                <th className="p-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {assignedPosyandu.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-5">
                    <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <HeartPulse size={16} className="text-emerald-600" /> {item.posyandu?.namaPosyandu || 'Tidak Diketahui'}
                    </div>
                  </td>
                  <td className="p-5 text-center bg-emerald-50/50">
                    <div className="font-bold text-emerald-700 text-lg mb-1">{item.jumlahTotal || (item.jumlahBalita + item.jumlahBumil + item.jumlahBusui)}</div>
                    <div className="flex gap-2 justify-center text-[10px] text-emerald-600 font-medium">
                      <span className="bg-emerald-100/80 px-1.5 py-0.5 rounded">Busui: {item.jumlahBusui || 0}</span>
                      <span className="bg-emerald-100/80 px-1.5 py-0.5 rounded">Bumil: {item.jumlahBumil || 0}</span>
                      <span className="bg-emerald-100/80 px-1.5 py-0.5 rounded">Balita: {item.jumlahBalita || 0}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex w-fit items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                        <Calendar size={12}/> {item.tanggalMulai ? new Date(item.tanggalMulai).toLocaleDateString('id-ID') : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => handleRemoveClick(item.posyanduId, 'posyandu')}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 inline-flex items-center"
                      title="Berhentikan SPPG untuk Posyandu Ini"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {assignedPosyandu.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <HeartPulse size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium text-lg">Belum ada Posyandu Penerima</p>
                    <p className="text-sm text-slate-400 mt-1">Tambahkan posyandu ke dapur SPPG ini untuk mulai mendistribusikan MBG.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
