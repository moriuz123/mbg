import React from 'react';
import { db } from '@/db';
import { sppg } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MapPin, ChefHat, Activity, Phone, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import SppgActivityLogClient from './SppgActivityLogClient';

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
  const recentActivities: any[] = [];

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
        <div className="lg:col-span-3 max-w-2xl mx-auto space-y-6">
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

      </div>
    </div>
  );
}
