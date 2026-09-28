import React from 'react';
import { Package, Factory, Utensils, TrendingUp } from 'lucide-react';

export default function StokBerasCard({ 
  totalStok, 
  stokPenggilingan, 
  stokSppg 
}: { 
  totalStok: number; 
  stokPenggilingan: number; 
  stokSppg: number;
}) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#071840] to-[#0a2463] p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Package size={120} />
        </div>
        <span className="text-accent-500 font-bold tracking-widest text-sm uppercase mb-2 block relative z-10">
          Real-Time Inventory
        </span>
        <h3 className="text-white text-2xl md:text-3xl font-extrabold mb-4 relative z-10">
          Total Sisa Stok Beras
        </h3>
        <div className="flex items-center justify-center gap-3 relative z-10">
          <span className="text-5xl md:text-7xl font-black text-white drop-shadow-md">
            {formatNumber(totalStok)}
          </span>
          <span className="text-xl md:text-2xl text-white/80 font-bold self-end mb-2">Kg</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50">
        <div className="p-8 flex items-center gap-6 hover:bg-white transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
            <Factory size={32} />
          </div>
          <div>
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide mb-1">Di Penggilingan (Hulu)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800">{formatNumber(stokPenggilingan)}</span>
              <span className="text-slate-500 font-bold">Kg</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 flex items-center gap-6 hover:bg-white transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
            <Utensils size={32} />
          </div>
          <div>
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-wide mb-1">Di Dapur SPPG (Hilir)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-800">{formatNumber(stokSppg)}</span>
              <span className="text-slate-500 font-bold">Kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
