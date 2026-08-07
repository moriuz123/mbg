import React from 'react';
import { db } from '@/db';
import { sppg, sppgLaporanAktifitas } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MapPin, ChefHat, Activity, Phone, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: any) {
  const resolvedParams = await params;
  const data = await db.query.sppg.findFirst({
    where: eq(sppg.id, parseInt(resolvedParams.id))
  });
  
  if (!data) return { title: 'Tidak Ditemukan' };
  return { title: `${data.namaSppg} | Profil SPPG` };
}

export default async function SppgDetailPublicPage({ params }: any) {
  const resolvedParams = await params;
  const sppgId = parseInt(resolvedParams.id);
  
  if (isNaN(sppgId)) notFound();

  const data = await db.query.sppg.findFirst({
    where: eq(sppg.id, sppgId),
    with: {
      desa: {
        with: {
          kecamatan: true
        }
      }
    }
  });

  if (!data) notFound();

  // Ambil riwayat pengiriman terbaru dari SPPG ini
  const recentActivities = await db.query.sppgLaporanAktifitas.findMany({
    where: eq(sppgLaporanAktifitas.sppgId, sppgId),
    with: {
      sekolah: true,
      posyandu: true,
      standarMenuGizi: true,
    },
    orderBy: [desc(sppgLaporanAktifitas.tanggal)],
    limit: 10
  });

  return (
    <div className="container py-12 animate-fade-in" style={{ minHeight: '80vh', paddingTop: '3rem' }}>
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 mt-4">
        <Link href="/" className="hover:text-primary-600">Beranda</Link>
        <span>/</span>
        <Link href="/sppg" className="hover:text-primary-600">Data SPPG</Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{data.namaSppg}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary-500 to-primary-700"></div>
            
            <div className="relative mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-white mt-10">
              <ChefHat size={40} className="text-primary-600" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{data.namaSppg}</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-6">
              <Star size={14} className="fill-emerald-700" /> Terakreditasi Baik
            </div>
            
            <div className="space-y-4 text-left border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Wilayah Operasional</p>
                  <p className="text-sm text-slate-500">{data.desa?.namaDesa}, Kec. {data.desa?.kecamatan?.namaKecamatan}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Kontak Penanggung Jawab</p>
                  <p className="text-sm text-slate-500">{data.kontakTlp || 'Belum ditambahkan'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Kapasitas Produksi</p>
                  <p className="text-sm text-slate-500">{data.kapasitasPorsi?.toLocaleString('id-ID')} Porsi / Hari</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Activity Log */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="text-primary-600" /> Riwayat Distribusi Makanan
            </h2>
            
            {recentActivities.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {recentActivities.map((act, idx) => {
                  const targetName = act.sekolah?.namaSekolah || act.posyandu?.namaPosyandu || 'Target Tidak Diketahui';
                  return (
                    <div key={act.id} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${act.status === 'Diterima' ? 'bg-emerald-500' : act.status === 'Bermasalah' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                              {act.tanggal ? new Date(act.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </p>
                            <p className="font-bold text-slate-800 text-lg">Terkirim ke: {targetName}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${act.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : act.status === 'Bermasalah' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {act.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
                          <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                            <UtensilsIcon size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{act.standarMenuGizi?.namaMenu || 'Menu Tidak Diketahui'}</p>
                            <p className="text-sm text-slate-500">{act.jumlahPorsi} Porsi • Ke {targetName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <ChefHat size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Belum Ada Riwayat</h3>
                <p className="text-slate-500 text-sm mt-1">SPPG ini belum memiliki catatan pengiriman ke sekolah mana pun.</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}

function UtensilsIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
