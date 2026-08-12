'use client';

import React, { useState } from 'react';
import { ShoppingBag, Calendar, MapPin, Truck, Leaf, CheckCircle2, ChevronRight, PackageCheck } from 'lucide-react';
import Link from 'next/link';

interface DailyFreshFoodWidgetProps {
  stats: {
    tanggal: string;
    rawList: any[];
    commodityList: Array<{
      namaBahan: string;
      kategori: string;
      totalVolume: number;
      satuan: string;
      totalBiaya: number;
      suppliers: string[];
    }>;
    totalItemsPurchased: number;
    totalVolumeOverall: number;
  };
  showLinkToPengawasan?: boolean;
}

export default function DailyFreshFoodWidget({ stats, showLinkToPengawasan = true }: DailyFreshFoodWidgetProps) {
  const [selectedDate, setSelectedDate] = useState(stats.tanggal);

  const getEmojiForBahan = (nama: string) => {
    const n = nama.toLowerCase();
    if (n.includes('tomat')) return '🍅';
    if (n.includes('cabai') || n.includes('cabe')) return '🌶️';
    if (n.includes('beras')) return '🌾';
    if (n.includes('ayam') || n.includes('daging')) return '🥩';
    if (n.includes('telur')) return '🥚';
    if (n.includes('ikan')) return '🐟';
    if (n.includes('bayam') || n.includes('kangkung') || n.includes('sayur') || n.includes('sawi')) return '🥦';
    if (n.includes('bawang')) return '🧄';
    if (n.includes('tempe') || n.includes('tahu')) return '🧈';
    if (n.includes('buah') || n.includes('pisang') || n.includes('jeruk') || n.includes('apel')) return '🍎';
    if (n.includes('susu')) return '🥛';
    return '📦';
  };

  const formattedDate = new Date(stats.tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
      {/* HEADER WIDGET */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shadow-inner">
            <Leaf size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Dashboard Pangan Segar Dibeli Harian</h2>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5" suppressHydrationWarning>
              <Calendar size={14} className="text-emerald-600" /> {formattedDate}
            </p>
          </div>
        </div>

        {showLinkToPengawasan && (
          <Link 
            href="/admin/pengawasan"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20"
          >
            + Input Pembelian <ChevronRight size={14} />
          </Link>
        )}
      </div>

      {/* REKAP RINCIAN KOMODITAS PANGAN SEGAR (Tomat, Cabai, Sayur, Beras, Daging, dll) */}
      {stats.commodityList.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stats.commodityList.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 rounded-2xl p-4 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{getEmojiForBahan(item.namaBahan)}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-200">
                      {item.kategori}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-800 transition-colors">
                    {item.namaBahan}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="text-2xl font-black text-slate-800 group-hover:text-emerald-700">
                    {item.totalVolume.toLocaleString('id-ID')} <span className="text-sm font-bold text-slate-500">{item.satuan}</span>
                  </div>

                  {item.suppliers.length > 0 && (
                    <div className="text-[11px] font-semibold text-slate-500 mt-1 flex items-center gap-1 truncate" title={item.suppliers.join(', ')}>
                      <Truck size={12} className="text-emerald-600 shrink-0" />
                      <span className="truncate">Asal: {item.suppliers[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* TABEL DETAIL TRANSAKSI HARIAN TERIMA / BELI */}
          <div className="bg-slate-50/60 rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="p-4 bg-slate-100/70 border-b border-slate-200/60 font-extrabold text-xs text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <PackageCheck size={16} className="text-emerald-600" /> Rincian Penerimaan & Sumber Asal Pangan Hari Ini
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-3 pl-5">Jenis Bahan</th>
                    <th className="p-3">Sumber / Asal Pangan (Pemasok)</th>
                    <th className="p-3 text-right">Volume</th>
                    <th className="p-3 text-right pr-5">Harga Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 text-slate-700">
                  {stats.rawList.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="p-3 pl-5 font-extrabold text-slate-800">
                        {getEmojiForBahan(row.nama_bahan || '')} {row.nama_bahan}
                      </td>
                      <td className="p-3 font-semibold text-emerald-800 flex items-center gap-1">
                        <MapPin size={12} className="text-emerald-600 shrink-0" />
                        {row.nama_pemasok ? `${row.nama_pemasok} (${row.tipe_pemasok || 'Pemasok'})` : 'Pembelian Langsung'}
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">
                        {row.volume} {row.satuan}
                      </td>
                      <td className="p-3 text-right pr-5 font-bold text-slate-700">
                        {row.harga_total ? `Rp ${parseFloat(row.harga_total).toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <ShoppingBag size={48} className="mx-auto mb-3 text-slate-300" />
          <h3 className="font-bold text-slate-700 text-base">Belum Ada Transaksi Pembelian Pangan Segar Hari Ini</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Catat penerimaan tomat, cabai, sayuran, beras, atau daging dari pemasok lokal melalui modul pengawasan logistik.
          </p>
          {showLinkToPengawasan && (
            <Link 
              href="/admin/pengawasan"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              + Catat Pembelian Hari Ini
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
