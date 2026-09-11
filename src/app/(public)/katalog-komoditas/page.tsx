import React from 'react';
import { Truck, Package, Users, MapPin, Factory } from 'lucide-react';
import { db } from '@/db';
import { sppgPembelianBahan, pemasok } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const metadata = {
  title: 'Analitik Rantai Pasok | MBG Kab. Lebak',
  description: 'Transparansi rantai pasok bahan pangan dari pemasok lokal ke dapur SPPG Program Makan Bergizi Gratis.',
};

export const dynamic = 'force-dynamic';

export default async function AnalitikRantaiPasok() {
  let pembelianData: any[] = [];
  let pemasokAktif: any[] = [];

  try {
    pembelianData = await db.query.sppgPembelianBahan.findMany({
      with: {
        pemasok: { with: { kabupaten: true } },
        jenisPangan: true,
        sppg: true,
      },
      orderBy: [desc(sppgPembelianBahan.tanggalPembelian)]
    });
  } catch (e) {
    console.error('Error fetching pembelian data:', e);
  }

  try {
    pemasokAktif = await db.query.pemasok.findMany({
      where: eq(pemasok.status, 'Aktif'),
      with: { kabupaten: true }
    });
  } catch (e) {
    console.error('Error fetching pemasok:', e);
  }

  const totalTransaksi = pembelianData.length;
  const uniqueSppg = new Set(pembelianData.map((p: any) => p.sppgId)).size;
  const uniqueKomoditas = new Set(pembelianData.filter((p: any) => p.jenisPangan?.namaBahan).map((p: any) => p.jenisPangan.namaBahan)).size;

  const pemasokSummary = new Map<number, { nama: string; alamat: string; tipe: string; totalVolume: number; bahanSet: Set<string>; sppgSet: Set<string> }>();
  pembelianData.forEach((p: any) => {
    if (!p.pemasokId || !p.pemasok) return;
    if (!pemasokSummary.has(p.pemasokId)) {
      pemasokSummary.set(p.pemasokId, {
        nama: p.pemasok.namaPemasok,
        alamat: p.pemasok.alamatPemasok || '-',
        tipe: p.pemasok.tipePemasok || 'Lokal',
        totalVolume: 0,
        bahanSet: new Set(),
        sppgSet: new Set(),
      });
    }
    const entry = pemasokSummary.get(p.pemasokId)!;
    entry.totalVolume += Number(p.volume || 0);
    if (p.jenisPangan?.namaBahan) entry.bahanSet.add(p.jenisPangan.namaBahan);
    if (p.sppg?.namaSppg) entry.sppgSet.add(p.sppg.namaSppg);
  });

  const pemasokRows = Array.from(pemasokSummary.values()).sort((a, b) => b.totalVolume - a.totalVolume);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="h-20"></div>
      
      <main className="flex-1">
        <section className="relative z-10 bg-white py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <p className="font-display mb-2 text-[13px] font-medium tracking-normal text-black/50">Transparansi Rantai Pasok</p>
              <h1 className="font-display text-2xl font-bold tracking-normal text-black sm:text-4xl sm:leading-[1.08]">Analitik Rantai Pasok Pemasok ke SPPG</h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-black/45 sm:text-[15px]">
                Laporan real-time alur distribusi bahan pangan dari Mitra Pemasok Lokal Kabupaten Lebak ke Dapur SPPG Program Makan Bergizi Gratis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mb-12">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl mb-3"><Users size={28} /></div>
                <div className="text-4xl font-black text-slate-800 mb-1">{pemasokAktif.length}</div>
                <div className="text-sm font-medium text-slate-500">Pemasok Aktif Terdaftar</div>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl mb-3"><Package size={28} /></div>
                <div className="text-4xl font-black text-slate-800 mb-1">{uniqueKomoditas}</div>
                <div className="text-sm font-medium text-slate-500">Jenis Komoditas Tersuplai</div>
                <div className="text-xs text-slate-400 mt-1">{totalTransaksi} total transaksi tercatat</div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 flex flex-col justify-center items-center text-center">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl mb-3"><Factory size={28} /></div>
                <div className="text-4xl font-black text-slate-800 mb-1">{uniqueSppg}</div>
                <div className="text-sm font-medium text-slate-500">Dapur SPPG Terlayani</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
              <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Truck size={20} className="text-emerald-600" />
                  Riwayat Rantai Pasok: Pemasok → Bahan → Dapur SPPG
                </h2>
                <p className="text-xs text-slate-500 mt-1">Seluruh transaksi pembelian bahan pangan segar oleh dapur SPPG dari mitra pemasok lokal.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-6 py-4">Pemasok</th>
                      <th className="px-6 py-4">Bahan Pangan</th>
                      <th className="px-6 py-4 text-right">Volume</th>
                      <th className="px-6 py-4">Dapur SPPG Tujuan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pembelianData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-slate-400">
                          <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                          <div className="font-bold">Belum ada data transaksi</div>
                          <div className="text-xs mt-1">Data akan muncul saat SPPG mulai mencatat pembelian bahan pangan.</div>
                        </td>
                      </tr>
                    )}
                    {pembelianData.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {new Date(d.tanggalPembelian).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{d.pemasok?.namaPemasok || '-'}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={10} /> {d.pemasok?.alamatPemasok || 'Lebak'}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">{d.jenisPangan?.namaBahan || '-'}</td>
                        <td className="px-6 py-4 text-right font-black text-emerald-700">{Number(d.volume).toLocaleString('id-ID')} <span className="text-xs font-medium text-slate-500">{d.satuan}</span></td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                            <Factory size={12} /> {d.sppg?.namaSppg || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Profil Mitra Pemasok Aktif</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{pemasokAktif.length} pemasok lokal terdaftar di sistem MBG Kab. Lebak</p>
                </div>
              </div>

              {pemasokRows.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pemasokRows.map((p, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><Truck size={20} /></div>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{p.tipe}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">{p.nama}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-4"><MapPin size={11} /> {p.alamat}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2">
                          <span className="text-slate-500 font-medium">Total Suplai</span>
                          <span className="font-black text-emerald-700">{p.totalVolume.toLocaleString('id-ID')} Kg</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2">
                          <span className="text-slate-500 font-medium">Komoditas</span>
                          <span className="font-bold text-slate-700">{Array.from(p.bahanSet).join(', ') || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 rounded-xl px-3 py-2">
                          <span className="text-slate-500 font-medium">SPPG Dilayani</span>
                          <span className="font-bold text-slate-700 text-xs text-right max-w-[180px] truncate">{Array.from(p.sppgSet).join(', ') || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="px-6 py-3">Nama Pemasok</th>
                          <th className="px-6 py-3">Tipe</th>
                          <th className="px-6 py-3">Alamat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {pemasokAktif.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 font-bold text-slate-800">{p.namaPemasok}</td>
                            <td className="px-6 py-3 text-slate-600">{p.tipePemasok || 'Lokal'}</td>
                            <td className="px-6 py-3 text-slate-500 text-xs">{p.alamatPemasok || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
