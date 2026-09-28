import React from 'react';
import { db } from '@/db';
import { sekolah } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MapPin, GraduationCap, Users, Calendar, Utensils, Star, Activity } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({ params }: any) {
  const resolvedParams = await params;
  const data = await db.query.sekolah.findFirst({
    where: eq(sekolah.id, parseInt(resolvedParams.id))
  });
  
  if (!data) return { title: 'Tidak Ditemukan' };
  return { title: `${data.namaSekolah} | Profil Sekolah` };
}

export default async function SekolahDetailPublicPage({ params }: any) {
  const resolvedParams = await params;
  const sekolahId = parseInt(resolvedParams.id);
  
  if (isNaN(sekolahId)) notFound();

  const data = await db.query.sekolah.findFirst({
    where: eq(sekolah.id, sekolahId),
    with: {
      kecamatan: true,
      desa: true
    }
  });

  if (!data) notFound();

  // Ambil riwayat penerimaan makanan untuk sekolah ini
  const recentActivities: any[] = [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      <PageHeader 
        title="Profil Sekolah Penerima" 
        description="Informasi detail mengenai Sekolah penerima manfaat MBG"
        breadcrumbs={[
          { label: 'Sekolah', href: '/sekolah' },
          { label: data.namaSekolah || 'Detail Sekolah' }
        ]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-blue-700"></div>
            
            <div className="relative mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-white mt-10">
              <GraduationCap size={40} className="text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{data.namaSekolah}</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold mb-6">
              NPSN: {data.npsn || 'Tidak ada'}
            </div>
            
            <div className="space-y-4 text-left border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Lokasi Sekolah</p>
                  <p className="text-sm text-slate-500">{data.desa?.namaDesa}, Kec. {data.kecamatan?.namaKecamatan}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Users className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Jumlah Siswa / Penerima</p>
                  <p className="text-sm text-slate-500 font-bold text-blue-600">{data.jumlahSiswaTotal?.toLocaleString('id-ID')} Anak</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Activity Log */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Utensils className="text-blue-600" /> Riwayat Penerimaan MBG
            </h2>
            
            {recentActivities.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {recentActivities.map((act, idx) => (
                  <div key={act.id} className="relative pl-6">
                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${act.status === 'Diterima' ? 'bg-emerald-500' : act.status === 'Bermasalah' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            {act.tanggal ? new Date(act.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                          </p>
                          <p className="font-bold text-slate-800 text-lg">Dari Dapur: {act.sppg?.namaSppg || 'Tidak Diketahui'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${act.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : act.status === 'Bermasalah' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {act.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white rounded-xl p-3 border border-slate-200 shadow-sm">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Activity size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{act.standarMenuGizi?.namaMenu || 'Menu Tidak Diketahui'}</p>
                          <p className="text-sm text-slate-500">{act.jumlahPorsi} Porsi</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Utensils size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Belum Ada Riwayat</h3>
                <p className="text-slate-500 text-sm mt-1">Sekolah ini belum mencatat penerimaan makanan gizi apapun.</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
