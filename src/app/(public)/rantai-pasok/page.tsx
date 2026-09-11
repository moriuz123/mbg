import React from 'react';
import { Truck, Package, Users, MapPin, Factory, Activity, TrendingUp } from 'lucide-react';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import Link from 'next/link';

export const metadata = {
  title: 'Analitik Rantai Pasok | MBG Kab. Lebak',
  description: 'Transparansi rantai pasok bahan pangan dari pemasok lokal ke dapur SPPG Program Makan Bergizi Gratis.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export default async function AnalitikRantaiPasok() {
  // 1. Dapatkan Statistik Utama
  const statsRes = await db.execute(sql`
    SELECT 
      (SELECT COUNT(*) FROM pemasok p LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE p.status = 'Aktif' AND (kab.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL)) as total_pemasok_dalam,
      (SELECT COUNT(*) FROM penggilingan) as total_penggilingan,
      (SELECT COUNT(*) FROM pemasok p LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE p.status = 'Aktif' AND kab.nama_kabupaten != 'Kabupaten Lebak') as total_pemasok_luar,
      
      (SELECT COUNT(DISTINCT pb.jenis_pangan_id) FROM sppg_pembelian_bahan pb LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE pb.tipe_sumber = 'Penggilingan' OR (pb.tipe_sumber = 'Pemasok' AND (kab.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL))) as total_komoditas_dalam,
      
      (SELECT COUNT(DISTINCT pb.jenis_pangan_id) FROM sppg_pembelian_bahan pb LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE pb.tipe_sumber = 'Pemasok' AND kab.nama_kabupaten != 'Kabupaten Lebak') as total_komoditas_luar,
      
      (SELECT COUNT(DISTINCT jenis_pangan_id) FROM sppg_pembelian_bahan) as total_komoditas_unik,
      (SELECT COUNT(DISTINCT sppg_id) FROM sppg_pembelian_bahan) as total_sppg_aktif,
      (SELECT COUNT(*) FROM sppg_pembelian_bahan) as total_transaksi
  `);
  
  const stats = {
    pemasokDalam: parseInt(statsRes[0]?.total_pemasok_dalam as string) || 0,
    penggilingan: parseInt(statsRes[0]?.total_penggilingan as string) || 0,
    pemasokLuar: parseInt(statsRes[0]?.total_pemasok_luar as string) || 0,
    komoditasUnik: parseInt(statsRes[0]?.total_komoditas_unik as string) || 0,
    komoditasDalam: parseInt(statsRes[0]?.total_komoditas_dalam as string) || 0,
    komoditasLuar: parseInt(statsRes[0]?.total_komoditas_luar as string) || 0,
    sppg: parseInt(statsRes[0]?.total_sppg_aktif as string) || 0,
    transaksi: parseInt(statsRes[0]?.total_transaksi as string) || 0,
  };

  // 2. Dapatkan Riwayat Terbaru (Live Feed - Max 10)
  const feedRes = await db.execute(sql`
    SELECT 
      pb.id,
      pb.tanggal_pembelian,
      jp.nama_bahan,
      pb.volume,
      COALESCE(pb.satuan, jp.satuan_default, 'Kg') as satuan,
      s.nama_sppg,
      COALESCE(p.nama_pemasok, pg.nama_penggilingan) as nama_sumber,
      COALESCE(p.alamat_pemasok, pg.alamat) as alamat_sumber,
      pb.tipe_sumber
    FROM sppg_pembelian_bahan pb
    JOIN jenis_pangan jp ON pb.jenis_pangan_id = jp.jenis_pangan_id
    JOIN sppg s ON pb.sppg_id = s.sppg_id
    LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    LEFT JOIN penggilingan pg ON pb.penggilingan_id = pg.penggilingan_id
    ORDER BY pb.tanggal_pembelian DESC, pb.created_at DESC
    LIMIT 10
  `);

  // 3. Profil Pemasok Teratas (Berdasarkan Volume)
  const topPemasokRes = await db.execute(sql`
    SELECT 
      p.nama_pemasok,
      p.tipe_pemasok,
      kab.nama_kabupaten as wilayah,
      SUM(pb.volume) as total_volume,
      COUNT(DISTINCT pb.jenis_pangan_id) as jumlah_komoditas,
      COUNT(DISTINCT pb.sppg_id) as jumlah_sppg
    FROM pemasok p
    JOIN sppg_pembelian_bahan pb ON p.pemasok_id = pb.pemasok_id
    LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id
    WHERE p.status = 'Aktif'
    GROUP BY p.pemasok_id, p.nama_pemasok, p.tipe_pemasok, kab.nama_kabupaten
    ORDER BY total_volume DESC
    LIMIT 9
  `);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-20"></div>
      
      <main className="flex-1">
        <section className="relative z-10 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 text-emerald-700">
                <Activity size={14} className="animate-pulse" /> Live Tracking Logistik
              </div>
              <h1 className="font-display text-2xl font-bold tracking-normal text-slate-900 sm:text-4xl sm:leading-[1.1]">
                Rantai Pasok Terbuka MBG
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
                Transparansi alur distribusi bahan pangan segar dari Mitra Pemasok Lokal ke Dapur SPPG di Kabupaten Lebak.
              </p>
            </div>

            {/* KPI Stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-12">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={24} /></div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Mitra Pemasok</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{stats.pemasokDalam + stats.pemasokLuar + stats.penggilingan}</div>
                <div className="text-sm font-medium text-slate-500 mb-3">Total Pemasok & Penggilingan</div>
                
                <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Pemasok (Dalam Lebak)</span>
                    <span className="font-bold text-slate-700">{stats.pemasokDalam} Mitra</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Pemasok (Luar Lebak)</span>
                    <span className="font-bold text-slate-700">{stats.pemasokLuar} Mitra</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Penggilingan Padi (Lokal)</span>
                    <span className="font-bold text-slate-700">{stats.penggilingan} Mitra</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Bahan Baku</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{stats.komoditasUnik}</div>
                <div className="text-sm font-medium text-slate-500 mb-3">Jenis Komoditas Tersuplai</div>
                
                <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Disuplai dari Dalam</span>
                    <span className="font-bold text-slate-700">{stats.komoditasDalam} Komoditas</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Disuplai dari Luar</span>
                    <span className="font-bold text-slate-700">{stats.komoditasLuar} Komoditas</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Factory size={24} /></div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Penerima</span>
                </div>
                <div className="text-3xl font-black text-slate-800 mb-1">{stats.sppg}</div>
                <div className="text-sm font-medium text-slate-500 mb-3">Dapur SPPG Disuplai</div>
                
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-amber-500" /> {stats.transaksi.toLocaleString('id-ID')} Total Transaksi
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Top Pemasok */}
            <div className="mb-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Top Mitra Logistik</h2>
                  <p className="text-sm text-slate-500 mt-1">Pemasok dengan volume kontribusi bahan pangan terbesar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPemasokRes.map((p: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 transition-colors">
                        <Truck size={24} />
                      </div>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {p.tipe_pemasok || 'Lokal'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{p.nama_pemasok}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-6">
                      <MapPin size={14} className="text-slate-400" /> {p.wilayah || 'Kabupaten Lebak'}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Volume Suplai</div>
                        <div className="font-black text-slate-800">{parseFloat(p.total_volume as string).toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-500">Kg/L</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Cakupan</div>
                        <div className="font-bold text-slate-700">{p.jumlah_sppg} Dapur</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Feed Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12 relative">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={20} className="text-primary-600" />
                    Live Feed Pembelian Terbaru
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">10 transaksi pencatatan bahan segar terakhir secara real-time.</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-white text-slate-400 text-[10px] font-extrabold uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Sumber Pemasok</th>
                      <th className="px-6 py-4">Komoditas</th>
                      <th className="px-6 py-4 text-right">Volume</th>
                      <th className="px-6 py-4">Tujuan SPPG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {feedRes.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-400">
                          <Package className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <div className="font-bold text-slate-500">Belum ada transaksi logistik</div>
                        </td>
                      </tr>
                    )}
                    {feedRes.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                          {new Date(d.tanggal_pembelian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{d.nama_sumber || '-'}</div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                            {d.tipe_sumber === 'Penggilingan' ? '🌾 PENGGILINGAN' : '🏢 PEMASOK'}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{d.nama_bahan || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-slate-800">{parseFloat(d.volume as string).toLocaleString('id-ID')}</span>
                          <span className="text-xs font-semibold text-slate-500 ml-1">{d.satuan}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                            <Factory size={12} className="text-slate-400" /> {d.nama_sppg || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
