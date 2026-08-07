'use client';

import React, { useState } from 'react';
import { MapPin, Utensils, Box, ShieldCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

type LaporanHarianItem = {
  id: number;
  tanggal: string;
  menu: string | null;
  menuDetail?: string;
  jumlahPorsi: number | null;
  status: string | null;
  sppgName: string | null;
  sekolahName: string | null;
};

export default function LaporanHarianClient({ data }: { data: LaporanHarianItem[] }) {
  const [activeTab, setActiveTab] = useState<'sppg' | 'sekolah'>('sppg');

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      
      {/* TABS */}
      <div className="flex bg-slate-50 border-b border-slate-100 p-2 gap-2">
        <button 
          onClick={() => setActiveTab('sppg')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm transition-all duration-300 ${
            activeTab === 'sppg' 
              ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <Box size={18} /> Laporan Dapur SPPG
        </button>
        <button 
          onClick={() => setActiveTab('sekolah')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm transition-all duration-300 ${
            activeTab === 'sekolah' 
              ? 'bg-white text-emerald-600 shadow-sm border border-slate-200/60' 
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <MapPin size={18} /> Penerimaan Sekolah & Posyandu
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto p-4 md:p-6">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="pb-4 pl-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Tanggal</th>
              <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">SPPG Pengirim</th>
              <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Tujuan Penerima</th>
              {activeTab === 'sppg' ? (
                <>
                  <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Menu Diproduksi</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Porsi</th>
                </>
              ) : (
                <>
                  <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Menu Diterima</th>
                  <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Porsi</th>
                </>
              )}
              <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((laporan) => {
              // Adjust status color based on context if needed
              let statusStyle = 'bg-slate-100 text-slate-600 border-slate-200';
              let StatusIcon = Clock;
              
              if (laporan.status === 'Terkirim' || laporan.status === 'Diterima') {
                statusStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                StatusIcon = CheckCircle2;
              } else if (laporan.status === 'Bermasalah') {
                statusStyle = 'bg-rose-50 text-rose-700 border-rose-200';
                StatusIcon = AlertCircle;
              }

              // In Sekolah tab, change "Terkirim" to "Menunggu"
              let displayStatus = laporan.status;
              if (activeTab === 'sekolah' && laporan.status === 'Terkirim') {
                displayStatus = 'Menunggu Konfirmasi';
                statusStyle = 'bg-amber-50 text-amber-700 border-amber-200';
                StatusIcon = Clock;
              }

              return (
                <tr key={laporan.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 pl-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg text-sm">
                      {new Date(laporan.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                        <Box size={14} />
                      </div>
                      <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                        {laporan.sppgName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <MapPin size={14} />
                      </div>
                      <span className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">
                        {laporan.sekolahName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
                        <Utensils size={14} className="text-slate-400" />
                        {laporan.menu}
                      </div>
                      {laporan.menuDetail && (
                        <div className="text-xs text-slate-500 line-clamp-2 max-w-[200px] leading-relaxed">
                          {laporan.menuDetail}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
                      {laporan.jumlahPorsi}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-right">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusStyle}`}>
                      <StatusIcon size={14} />
                      {displayStatus}
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <ShieldCheck size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">Belum ada laporan aktifitas hari ini.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
