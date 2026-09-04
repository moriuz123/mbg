import React from 'react';
import { Utensils, Truck, Package, Egg, MapPin, Calendar, Beef, Wheat, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { supplyChainKebutuhan } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const metadata = {
  title: 'Katalog Komoditas | MBG Kab. Lebak',
  description: 'Kebutuhan pasokan pangan segar bulanan dari distributor lokal ke setiap SPPG',
};

export const dynamic = 'force-dynamic';

export default async function KatalogKomoditasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pageStr = Array.isArray(searchParams?.page) ? searchParams.page[0] : searchParams?.page;
  const currentPage = parseInt(pageStr || '1', 10);
  const itemsPerPage = 9;

  const semuaPangan = await db.query.jenisPangan.findMany();
  const dataPasokan = await db.query.supplyChainKebutuhan.findMany({
    with: {
      sppg: true,
      jenisPangan: true,
      pemasok: true,
    },
    orderBy: [desc(supplyChainKebutuhan.createdAt)],
    limit: 1000 // Fetch more to get all data for grouping
  });

  // Group by jenisPangan
  const komoditasMap = new Map<string, {
    jenisPangan: any,
    pemasokMap: Map<number, { pemasok: any, totalVolume: number, satuan: string }>
  }>();

  // Initialize with all master data
  semuaPangan.forEach(pangan => {
    komoditasMap.set(pangan.id.toString(), {
      jenisPangan: pangan,
      pemasokMap: new Map()
    });
  });

  dataPasokan.forEach(item => {
    if (!item.jenisPangan) return;
    
    const bahanId = item.jenisPangan.id.toString();
    if (!komoditasMap.has(bahanId)) {
      komoditasMap.set(bahanId, {
        jenisPangan: item.jenisPangan,
        pemasokMap: new Map()
      });
    }

    const pMap = komoditasMap.get(bahanId)!.pemasokMap;
    // We group by pemasok or "Belum Ditentukan"
    const pemasokId = item.pemasok?.id || 0;
    
    // Only add if there is a supplier and volume
    if (item.pemasok) {
      if (!pMap.has(pemasokId)) {
        pMap.set(pemasokId, {
          pemasok: item.pemasok,
          totalVolume: 0,
          satuan: item.satuan || item.jenisPangan.satuanDefault || 'Kg'
        });
      }
      pMap.get(pemasokId)!.totalVolume += Number(item.kebutuhanPerBulan || 0);
    }
  });

  const groupedData = Array.from(komoditasMap.values());
  const totalItems = groupedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedData = groupedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <main className="flex-1">
        <section className="relative z-10 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-8">
              <p className="font-display mb-2 text-[13px] font-medium tracking-normal text-black/50">Rantai pasok lokal</p>
              <h1 className="font-display text-2xl font-bold tracking-normal text-black sm:text-4xl sm:leading-[1.08]">Bahan Baku Pangan</h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-black/45 sm:text-[15px]">Cari ketersediaan bahan baku dari Pemasok Lokal di Kabupaten Lebak untuk Program Makan Bergizi Gratis.</p>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-3 mb-12">
              <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-6 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-slate-800 mb-2">{dataPasokan.length}+</div>
                <div className="text-sm font-medium text-slate-500">Kontrak Pemasok Aktif</div>
              </div>
              <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-6 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-slate-800 mb-2">{new Set(dataPasokan.map(d => d.sppgId)).size}</div>
                <div className="text-sm font-medium text-slate-500">Titik Dapur Terlayani</div>
              </div>
              <div className="rounded-2xl border border-black/[0.06] bg-slate-50 p-6 flex flex-col justify-center items-center text-center">
                <div className="text-4xl font-bold text-slate-800 mb-2">{groupedData.length}</div>
                <div className="text-sm font-medium text-slate-500">Jenis Komoditas Tersedia</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Ketersediaan Komoditas</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">Bulan Ini</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {paginatedData.map((group, idx) => {
                const gradientTheme = getColorTheme(group.jenisPangan.namaBahan || '');
                const badgeTheme = getBadgeTheme(group.jenisPangan.namaBahan || '');
                const pemasokList = Array.from(group.pemasokMap.values());
                
                return (
                  <div 
                    key={idx} 
                    className="group bg-white rounded-3xl p-1 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 border border-slate-200 flex flex-col"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradientTheme.split(' ')[0]} to-transparent opacity-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110`}></div>
                    
                    <div className="p-6 pb-4 border-b border-slate-100 flex-none">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradientTheme} shadow-inner`}>
                          {getIcon(group.jenisPangan.namaBahan || '')}
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTheme}`}>
                          {group.jenisPangan.kategori || 'Bahan Pokok'}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">
                        {group.jenisPangan.namaBahan}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">Tersedia dari {pemasokList.length} Pemasok Lokal</p>
                    </div>

                    <div className="p-4 bg-slate-50/50 flex-1 rounded-b-3xl">
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-2">Daftar Pemasok & Ketersediaan</div>
                        
                        <div className="space-y-2">
                          {pemasokList.length === 0 ? (
                            <div className="text-center py-4 text-sm text-slate-500 italic bg-white/50 rounded-xl border border-slate-100/50">
                              Belum ada data pasokan
                            </div>
                          ) : (
                            pemasokList.map((p, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <Truck size={16} className="text-slate-400" />
                                  <span className="text-sm font-bold text-slate-700">{p.pemasok.namaPemasok}</span>
                                </div>
                                <div className="flex items-baseline gap-1 text-right">
                                  <span className="text-lg font-black text-slate-900">
                                    {p.totalVolume.toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-xs font-bold text-slate-500">{p.satuan}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {paginatedData.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">Belum ada data komoditas</h3>
                <p className="text-slate-500">Data pasokan bahan baku dari pemasok lokal belum tersedia.</p>
              </div>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link 
                    href={`/katalog-komoditas?page=${currentPage - 1}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </Link>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed">
                    <ChevronLeft size={20} />
                  </div>
                )}
                
                <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 shadow-sm">
                  Halaman {currentPage} dari {totalPages}
                </div>
                
                {currentPage < totalPages ? (
                  <Link 
                    href={`/katalog-komoditas?page=${currentPage + 1}`}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </Link>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 cursor-not-allowed">
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            )}
            
          </div>
        </section>
      </main>
    </div>
  );
}
