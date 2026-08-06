import React from 'react';
import { Utensils, Truck, Package, Egg, MapPin, Calendar, Beef, Wheat, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { supplyChainKebutuhan } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const metadata = {
  title: 'Rantai Pasok (Supply Chain) | MBG Kab. Lebak',
  description: 'Kebutuhan pasokan pangan segar bulanan dari distributor lokal ke setiap SPPG',
};

export default async function RantaiPasokPage() {
  const dataPasokan = await db.query.supplyChainKebutuhan.findMany({
    with: {
      sppg: true,
      jenisPangan: true,
      pemasok: true,
    },
    orderBy: [desc(supplyChainKebutuhan.createdAt)],
    limit: 20
  });

  // Helper function to pick icon based on jenisPangan name
  const getIcon = (nama: string) => {
    const lower = nama.toLowerCase();
    if (lower.includes('beras')) return <Wheat className="w-8 h-8" />;
    if (lower.includes('daging') || lower.includes('ayam')) return <Beef className="w-8 h-8" />;
    if (lower.includes('telur')) return <Egg className="w-8 h-8" />;
    if (lower.includes('sayur')) return <Utensils className="w-8 h-8" />;
    return <Package className="w-8 h-8" />;
  };

  const getColorTheme = (nama: string) => {
    const lower = nama.toLowerCase();
    if (lower.includes('beras')) return 'from-amber-100 to-amber-50 text-amber-600 border-amber-200';
    if (lower.includes('daging') || lower.includes('ayam')) return 'from-rose-100 to-rose-50 text-rose-600 border-rose-200';
    if (lower.includes('telur')) return 'from-orange-100 to-orange-50 text-orange-600 border-orange-200';
    if (lower.includes('sayur')) return 'from-emerald-100 to-emerald-50 text-emerald-600 border-emerald-200';
    return 'from-slate-100 to-slate-50 text-slate-600 border-slate-200';
  };

  const getBadgeTheme = (nama: string) => {
    const lower = nama.toLowerCase();
    if (lower.includes('beras')) return 'bg-amber-100 text-amber-700 ring-amber-500/20';
    if (lower.includes('daging') || lower.includes('ayam')) return 'bg-rose-100 text-rose-700 ring-rose-500/20';
    if (lower.includes('telur')) return 'bg-orange-100 text-orange-700 ring-orange-500/20';
    if (lower.includes('sayur')) return 'bg-emerald-100 text-emerald-700 ring-emerald-500/20';
    return 'bg-slate-100 text-slate-700 ring-slate-500/20';
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary-500 selection:text-white pb-20">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-32 mb-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-500 opacity-20 blur-[100px]"></div>
          <div className="absolute right-0 bottom-0 -z-10 m-auto h-[250px] w-[250px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-200">Keterbukaan Data Publik</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 text-transparent bg-clip-text">
            Jejaring Rantai Pasok MBG
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            Memantau aliran kebutuhan pangan segar dari pemasok lokal ke seluruh dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) di Kabupaten Lebak.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-1">
                {dataPasokan.length}+
              </div>
              <div className="text-sm text-slate-400">Kontrak Pemasok</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-1">
                {new Set(dataPasokan.map(d => d.sppgId)).size}
              </div>
              <div className="text-sm text-slate-400">Titik Dapur</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-3xl font-bold text-white mb-1">
                {new Set(dataPasokan.map(d => d.jenisPanganId)).size}
              </div>
              <div className="text-sm text-slate-400">Jenis Komoditas</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-center items-center group cursor-pointer hover:bg-white/10 transition-colors">
              <Link href="/login" className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} className="text-white" />
                </div>
                <div className="text-xs font-medium text-white">Login Mitra</div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Data Pemenuhan Kebutuhan Dapur</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold">Bulan Ini</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dataPasokan.map((item) => {
            const gradientTheme = getColorTheme(item.jenisPangan?.namaBahan || '');
            const badgeTheme = getBadgeTheme(item.jenisPangan?.namaBahan || '');
            
            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-3xl p-1 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 border border-slate-200"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradientTheme.split(' ')[0]} to-transparent opacity-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110`}></div>
                
                <div className="p-5 pb-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientTheme} shadow-inner`}>
                      {getIcon(item.jenisPangan?.namaBahan || '')}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTheme}`}>
                      {item.jenisPangan?.namaBahan}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors">
                    {item.sppg?.namaSppg}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium mb-6">
                    <Calendar size={14} />
                    <span>Periode: {new Date(item.periode || '').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="m-2 mt-0 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Pemasok Lokal</div>
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <MapPin size={16} className="text-slate-400" />
                        {item.pemasok?.namaPemasok || 'Sedang mencari pemasok...'}
                      </div>
                    </div>
                    <div className="h-px w-full bg-slate-200/80"></div>
                    <div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Volume Kebutuhan</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          {Number(item.kebutuhanPerBulan).toLocaleString('id-ID')}
                        </span>
                        <span className="text-sm font-bold text-slate-500">{item.satuan}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
