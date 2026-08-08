'use client';

import React, { useState } from 'react';
import { Calendar, Utensils, Activity, Eye, X, GraduationCap, HeartPulse, MapPin, CheckCircle2, AlertTriangle, Clock, Flame, Dumbbell, Wheat, Droplets, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function SppgActivityLogClient({ recentActivities }: { recentActivities: any[] }) {
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  if (!recentActivities || recentActivities.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
        <Utensils size={48} className="mx-auto text-slate-300 mb-3" />
        <h3 className="text-lg font-bold text-slate-700">Belum Ada Riwayat Laporan</h3>
        <p className="text-slate-500 text-sm mt-1">SPPG ini belum memiliki catatan distribusi makanan gizi ke sekolah/posyandu.</p>
      </div>
    );
  }

  return (
    <>
      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
        {recentActivities.map((act) => {
          const isSekolah = !!act.sekolah;
          const targetName = act.sekolah?.namaSekolah || act.posyandu?.namaPosyandu || 'Target Tidak Diketahui';
          const targetUrl = isSekolah ? `/sekolah/${act.sekolahId}` : `/posyandu/${act.posyanduId}`;
          const menuName = act.standarMenuGizi?.namaMenu || 'Menu Standar MBG';

          return (
            <div key={act.id} className="relative pl-6">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${act.status === 'Diterima' ? 'bg-emerald-500' : act.status === 'Bermasalah' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar size={12} />
                      {act.tanggal ? new Date(act.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-lg">Terkirim ke:</span>
                      <Link href={targetUrl} className="font-bold text-primary-600 hover:underline flex items-center gap-1">
                        {isSekolah ? <GraduationCap size={18} /> : <HeartPulse size={18} className="text-emerald-600" />}
                        {targetName}
                      </Link>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${act.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : act.status === 'Bermasalah' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {act.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm mt-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl shrink-0">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{menuName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{act.jumlahPorsi} Porsi Paket Gizi</p>
                    </div>
                  </div>

                  {/* CTA BUTTON FOR DETAIL */}
                  <button
                    onClick={() => setSelectedActivity(act)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                  >
                    <Eye size={14} /> Lihat Detail Laporan
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* POPUP MODAL DETAIL LAPORAN AKTIFITAS */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedActivity(null)}>
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            {/* Header Modal */}
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100 mb-2">
                  <Activity size={14} /> Detail Laporan Distribusi MBG
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                  {selectedActivity.standarMenuGizi?.namaMenu || 'Laporan Pengiriman Gizi'}
                </h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                  <Calendar size={12} />
                  {selectedActivity.tanggal ? new Date(selectedActivity.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedActivity(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              
              {/* Info Target & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Penerima</span>
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    {selectedActivity.sekolah ? (
                      <>
                        <GraduationCap className="text-primary-600 shrink-0" size={18} />
                        <Link href={`/sekolah/${selectedActivity.sekolahId}`} className="hover:underline">
                          {selectedActivity.sekolah.namaSekolah}
                        </Link>
                      </>
                    ) : selectedActivity.posyandu ? (
                      <>
                        <HeartPulse className="text-emerald-600 shrink-0" size={18} />
                        <Link href={`/posyandu/${selectedActivity.posyanduId}`} className="hover:underline">
                          {selectedActivity.posyandu.namaPosyandu}
                        </Link>
                      </>
                    ) : (
                      'Penerima Tidak Diketahui'
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Status & Porsi</span>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-sm">{selectedActivity.jumlahPorsi} Porsi</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedActivity.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : selectedActivity.status === 'Bermasalah' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {selectedActivity.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rincian Nutrisi Menu Gizi */}
              {selectedActivity.standarMenuGizi && (
                <div className="p-5 bg-gradient-to-br from-primary-50/50 to-blue-50/30 rounded-2xl border border-primary-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800 mb-3 flex items-center gap-1.5">
                    <Utensils size={14} /> Nilai Gizi per Porsi Menu ({selectedActivity.standarMenuGizi.namaMenu})
                  </h4>

                  {selectedActivity.standarMenuGizi.deskripsi && (
                    <p className="text-xs text-slate-600 mb-4 italic bg-white/80 p-2.5 rounded-xl border border-primary-100/50">
                      "{selectedActivity.standarMenuGizi.deskripsi}"
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                      <Flame size={16} className="mx-auto text-amber-500 mb-1" />
                      <span className="block text-xs font-bold text-slate-800">{selectedActivity.standarMenuGizi.kaloriKkal || '-'}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Kalori (Kkal)</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                      <Dumbbell size={16} className="mx-auto text-blue-500 mb-1" />
                      <span className="block text-xs font-bold text-slate-800">{selectedActivity.standarMenuGizi.proteinGram || '-'} g</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Protein</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                      <Wheat size={16} className="mx-auto text-emerald-500 mb-1" />
                      <span className="block text-xs font-bold text-slate-800">{selectedActivity.standarMenuGizi.karbohidratGram || '-'} g</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Karbohidrat</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 shadow-sm">
                      <Droplets size={16} className="mx-auto text-pink-500 mb-1" />
                      <span className="block text-xs font-bold text-slate-800">{selectedActivity.standarMenuGizi.lemakGram || '-'} g</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Lemak</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dokumentasi Foto jika ada */}
              {selectedActivity.fotoDokumentasi && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                    <ImageIcon size={14} /> Dokumentasi Pengiriman
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-60 bg-slate-100">
                    <img 
                      src={selectedActivity.fotoDokumentasi} 
                      alt="Dokumentasi MBG" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Catatan / Keterangan Laporan */}
              {selectedActivity.catatan && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Catatan Laporan</h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedActivity.catatan}
                  </p>
                </div>
              )}

            </div>

            {/* Footer Modal */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Tutup Laporan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
