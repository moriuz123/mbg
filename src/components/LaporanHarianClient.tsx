'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Utensils, Box, ShieldCheck, AlertCircle, Clock, CheckCircle2, Calendar } from 'lucide-react';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'sppg' | 'sekolah'>('sppg');

  const defaultDate = searchParams?.get('date') || new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/?date=${newDate}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
      
      {/* FILTER & TABS HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-slate-50 border-b border-slate-100 p-4 gap-4">
        
        {/* TABS */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('sppg')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'sppg' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
            }`}
          >
            <Box size={16} /> <span className="hidden sm:inline">Laporan Dapur SPPG</span><span className="sm:hidden">SPPG</span>
          </button>
          <button 
            onClick={() => setActiveTab('sekolah')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'sekolah' 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
            }`}
          >
            <MapPin size={16} /> <span className="hidden sm:inline">Penerimaan Sekolah & Posyandu</span><span className="sm:hidden">Penerima</span>
          </button>
        </div>

        {/* DATE FILTER */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label htmlFor="dateFilter" className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            Filter Tanggal:
          </label>
          <input 
            type="date" 
            id="dateFilter"
            value={defaultDate}
            onChange={handleDateChange}
            className="flex-1 md:flex-none px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
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
                    <p className="text-slate-500 font-medium">Belum ada laporan aktifitas distribusi pada tanggal {new Date(defaultDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
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
