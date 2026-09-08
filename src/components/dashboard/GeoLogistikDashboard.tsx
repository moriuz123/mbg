'use client';

import React from 'react';
import { Map, TrendingUp, TrendingDown, ArrowRightLeft, Target, ShieldCheck } from 'lucide-react';

export default function GeoLogistikDashboard({ stats }: { stats: any }) {
  if (!stats) return <div className="p-8 text-center text-slate-500">Akses ditolak atau data tidak ditemukan.</div>;

  const totalDistribusi = stats.distribusiAgregat.dalamLebak + stats.distribusiAgregat.luarLebak;
  const persenLuarLebak = totalDistribusi > 0 ? ((stats.distribusiAgregat.luarLebak / totalDistribusi) * 100).toFixed(1) : 0;
  const persenDalamLebak = totalDistribusi > 0 ? ((stats.distribusiAgregat.dalamLebak / totalDistribusi) * 100).toFixed(1) : 0;

  const totalGabah = stats.sumberGabahAgregat.dalamLebak + stats.sumberGabahAgregat.luarLebak;
  const persenGabahLuar = totalGabah > 0 ? ((stats.sumberGabahAgregat.luarLebak / totalGabah) * 100).toFixed(1) : 0;

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 rounded-3xl p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Map size={240} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <ShieldCheck size={14} /> LEVEL ENTERPRISE
          </div>
          <h1 className="text-3xl lg:text-4xl font-black mb-3 tracking-tight">Matriks Geo-Logistik Wilayah</h1>
          <p className="text-indigo-100 max-w-2xl text-base lg:text-lg">
            Pantauan Rantai Pasok (Supply Chain) Makro. Melacak ketahanan pangan Kabupaten Lebak melalui rasio aliran Gabah Masuk dan Beras Keluar (Outflow).
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><ArrowRightLeft size={24} /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Rasio Kebocoran Beras (Outflow)</h2>
              <p className="text-sm text-slate-500">Persentase beras yang didistribusikan ke luar Kabupaten Lebak</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <div className="text-4xl font-black text-slate-800">{persenLuarLebak}%</div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-700">Luar Lebak: {stats.distribusiAgregat.luarLebak.toLocaleString('id-ID')} Kg</div>
              <div className="text-sm text-slate-500">Dalam Lebak: {stats.distribusiAgregat.dalamLebak.toLocaleString('id-ID')} Kg</div>
            </div>
          </div>
          
          <div className="w-full bg-emerald-100 rounded-full h-4 overflow-hidden flex">
            <div className="bg-emerald-500 h-4" style={{ width: `${persenDalamLebak}%` }} title="Dalam Lebak"></div>
            <div className="bg-red-500 h-4" style={{ width: `${persenLuarLebak}%` }} title="Luar Lebak"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Target size={24} /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Ketergantungan Gabah Luar</h2>
              <p className="text-sm text-slate-500">Persentase sumber gabah yang didatangkan dari luar Kabupaten Lebak</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end mb-2">
            <div className="text-4xl font-black text-slate-800">{persenGabahLuar}%</div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-700">Luar Lebak: {stats.sumberGabahAgregat.luarLebak.toLocaleString('id-ID')} Kg</div>
              <div className="text-sm text-slate-500">Dalam Lebak: {stats.sumberGabahAgregat.dalamLebak.toLocaleString('id-ID')} Kg</div>
            </div>
          </div>
          
          <div className="w-full bg-emerald-100 rounded-full h-4 overflow-hidden flex">
            <div className="bg-emerald-500 h-4" style={{ width: `${100 - Number(persenGabahLuar)}%` }} title="Dalam Lebak"></div>
            <div className="bg-amber-500 h-4" style={{ width: `${persenGabahLuar}%` }} title="Luar Lebak"></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Peta Suplai Beras per Kecamatan (Dalam Lebak)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Kecamatan Tujuan</th>
                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Total Tersuplai (Kg)</th>
                <th className="p-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status Ketahanan</th>
              </tr>
            </thead>
            <tbody>
              {stats.distribusiKecamatan.map((k: any, idx: number) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{k.kecamatan}</td>
                  <td className="p-4 text-right font-black text-slate-700">{k.totalBerasKg.toLocaleString('id-ID')} Kg</td>
                  <td className="p-4">
                    {k.totalBerasKg > 5000 ? (
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">Aman Surplus</span>
                    ) : (
                      <span className="inline-flex px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">Perlu Perhatian</span>
                    )}
                  </td>
                </tr>
              ))}
              {stats.distribusiKecamatan.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">Belum ada data distribusi kecamatan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
