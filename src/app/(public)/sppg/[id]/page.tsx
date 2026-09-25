import React from 'react';
import { db } from '@/db';
import { sppg, sppgPenerimaManfaat, sppgPosyanduManfaat } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MapPin, Users, GraduationCap, HeartPulse, ChefHat, Activity, Phone, Star, TrendingUp } from 'lucide-react';
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

  const sekolahList = await db.query.sppgPenerimaManfaat.findMany({
    where: eq(sppgPenerimaManfaat.sppgId, sppgId),
    with: {
      sekolah: true
    }
  });

  const posyanduList = await db.query.sppgPosyanduManfaat.findMany({
    where: eq(sppgPosyanduManfaat.sppgId, sppgId),
    with: {
      posyandu: true
    }
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
                  <p className="text-sm text-slate-500">{data.noHpKaSppg || 'Belum ditambahkan'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Jumlah Penjamah Makanan</p>
                  <p className="text-sm text-slate-500">{data.jumlahPenjamahMakanan || 0} Orang</p>
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
            
            <SppgActivityLogClient recentActivities={recentActivities} />
          </div>
        </div>

        {/* Right Col: Data Penerima */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="text-primary-600" /> Daftar Penerima Layanan MBG
            </h2>
            
            {sekolahList.length === 0 && posyanduList.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Users size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Belum Ada Data</h3>
                <p className="text-slate-500 text-sm mt-1">SPPG ini belum memiliki daftar penerima manfaat.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sekolahList.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <GraduationCap size={16} /> Data Sekolah
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sekolahList.map((item) => (
                        <Link href={`/sekolah/${item.sekolahId}`} key={`sek-${item.id}`} className="block">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-shadow h-full">
                            <h4 className="font-bold text-slate-800 mb-1">{item.sekolah?.namaSekolah}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Total: {item.jumlahTotal || (item.jumlahLaki + item.jumlahPerempuan)} Siswa</span>
                              <span className={`px-2 py-0.5 rounded-full ${item.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {posyanduList.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <HeartPulse size={16} /> Data Posyandu
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {posyanduList.map((item) => (
                        <Link href={`/posyandu/${item.posyanduId}`} key={`pos-${item.id}`} className="block">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:shadow-md transition-shadow h-full">
                            <h4 className="font-bold text-slate-800 mb-1">{item.posyandu?.namaPosyandu}</h4>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Balita: {item.posyandu?.jumlahBalita || 0}</span>
                              <span>Bumil: {item.posyandu?.jumlahBumil || 0}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
