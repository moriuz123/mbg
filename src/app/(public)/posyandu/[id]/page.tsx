import React from 'react';
import { db } from '@/db';
import { posyandu } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MapPin, HeartPulse, Users, Calendar, Utensils, Activity, User, Building2, Baby, Heart } from 'lucide-react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export async function generateMetadata({ params }: any) {
  const resolvedParams = await params;
  const posyanduId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(posyanduId)) return { title: 'Posyandu Tidak Ditemukan' };

  const data = await db.query.posyandu.findFirst({
    where: eq(posyandu.id, posyanduId)
  });
  
  if (!data) return { title: 'Tidak Ditemukan' };
  return { title: `${data.namaPosyandu} | Profil Posyandu Penerima MBG` };
}

export default async function PosyanduDetailPublicPage({ params }: any) {
  const resolvedParams = await params;
  const posyanduId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(posyanduId)) notFound();

  // Ambil data posyandu beserta kecamatan, desa, dan assignment SPPG aktif
  const data = await db.query.posyandu.findFirst({
    where: eq(posyandu.id, posyanduId),
    with: {
      kecamatan: true,
      desa: true,
      posyanduManfaat: {
        where: (manfaat, { eq }) => eq(manfaat.status, 'Aktif'),
        with: {
          sppg: true
        }
      }
    }
  });

  if (!data) notFound();

  const activeAssignment = data.posyanduManfaat?.[0];
  const sppgAktif = activeAssignment?.sppg;

  // Ambil riwayat penerimaan makanan untuk posyandu ini
  const recentActivities: any[] = [];

  // Calculate target breakdown
  const busui = activeAssignment?.jumlahBusui ?? data.jumlahBusui ?? 0;
  const bumil = activeAssignment?.jumlahBumil ?? data.jumlahBumil ?? 0;
  const balita = activeAssignment?.jumlahBalita ?? data.jumlahBalita ?? 0;
  const totalPenerima = activeAssignment?.jumlahTotal ?? data.jumlahTotal ?? (busui + bumil + balita);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fade-in">
      <PageHeader 
        title="Profil Posyandu" 
        description="Informasi detail mengenai Posyandu penerima manfaat MBG"
        breadcrumbs={[
          { label: 'Posyandu', href: '/posyandu' },
          { label: data.namaPosyandu || 'Detail Posyandu' }
        ]}
      />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Profile & Targets Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-emerald-500 to-teal-700"></div>
            
            <div className="relative mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-white mt-10">
              <HeartPulse size={44} className="text-emerald-600" />
            </div>
            
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">{data.namaPosyandu}</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-6 border border-emerald-200">
              <HeartPulse size={14} /> Posyandu Penerima MBG
            </div>
            
            <div className="space-y-4 text-left border-t border-slate-100 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Lokasi Posyandu</p>
                  <p className="text-sm text-slate-500">
                    {data.alamatPosyandu ? `${data.alamatPosyandu}, ` : ''}
                    Desa {data.desa?.namaDesa || '-'}, Kec. {data.kecamatan?.namaKecamatan || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Ketua Kader</p>
                  <p className="text-sm text-slate-500 font-medium">{data.namaKetuaKader || '-'}</p>
                  {data.noHpKetuaKader && <p className="text-xs text-slate-400">{data.noHpKetuaKader}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="text-slate-400 mt-0.5 shrink-0" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Unit Pelayanan (SPPG)</p>
                  <p className="text-sm text-emerald-700 font-bold">
                    {sppgAktif ? (
                      <Link href={`/sppg/${sppgAktif.id}`} className="hover:underline flex items-center gap-1">
                        {sppgAktif.namaSppg}
                      </Link>
                    ) : (
                      <span className="text-slate-400 font-normal">Belum terhubung ke SPPG</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Target Breakdown Box */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-left">Rincian Sasaran Penerima</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-pink-50 border border-pink-100">
                  <Heart size={16} className="mx-auto text-pink-600 mb-1" />
                  <span className="block text-xs font-bold text-pink-700">{bumil}</span>
                  <span className="text-[10px] text-pink-500 font-medium">Bumil</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <Users size={16} className="mx-auto text-purple-600 mb-1" />
                  <span className="block text-xs font-bold text-purple-700">{busui}</span>
                  <span className="text-[10px] text-purple-500 font-medium">Busui</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100">
                  <Baby size={16} className="mx-auto text-amber-600 mb-1" />
                  <span className="block text-xs font-bold text-amber-700">{balita}</span>
                  <span className="text-[10px] text-amber-500 font-medium">Balita</span>
                </div>
              </div>
              <div className="mt-3 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800">Total Sasaran</span>
                <span className="text-base font-extrabold text-emerald-700">{totalPenerima.toLocaleString('id-ID')} Orang</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Activity & Reception History Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Utensils className="text-emerald-600" /> Riwayat Penerimaan MBG Posyandu
            </h2>
            
            {recentActivities.length > 0 ? (
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pb-4">
                {recentActivities.map((act) => (
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
                      
                      <div className="flex items-center gap-3 bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                          <Activity size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800">{act.standarMenuGizi?.namaMenu || 'Menu Tidak Diketahui'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{act.jumlahPorsi} Porsi Paket Gizi Ibu & Anak</p>
                        </div>
                      </div>
                      {act.catatan && (
                        <p className="mt-3 text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100 italic">
                          "{act.catatan}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Utensils size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Belum Ada Riwayat Laporan</h3>
                <p className="text-slate-500 text-sm mt-1">Posyandu ini belum mencatat riwayat penerimaan makanan gizi dari SPPG.</p>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
    </div>
  );
}
