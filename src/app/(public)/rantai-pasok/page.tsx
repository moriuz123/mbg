import React from 'react';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import PageHeader from '@/components/PageHeader';
import RantaiPasokClient, { 
  RantaiPasokStats, 
  TopKomoditasItem, 
  PemasokItem, 
  WilayahStatItem 
} from './RantaiPasokClient';

export const metadata = {
  title: 'Rantai Pasok & Mitra Pemasok | Sistem Digitalisasi Supply Chain - Pemkab Lebak',
  description: 'Transparansi rantai pasok bahan pangan dari mitra pemasok lokal ke dapur sentral SPPG.',
};

export const dynamic = 'force-dynamic';

export default async function AnalitikRantaiPasok() {
  // 1. Dapatkan Statistik Utama
  let stats: RantaiPasokStats = {
    pemasokDalam: 0,
    penggilingan: 0,
    pemasokLuar: 0,
    komoditasUnik: 0,
    komoditasDalam: 0,
    komoditasLuar: 0,
    totalKatalogKomoditas: 0,
    sppg: 0,
    transaksi: 0,
    sisaStokBerasSppg: 0,
  };

  try {
    const statsRes = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM pemasok p LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE p.status = 'Aktif' AND (kab.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL)) as total_pemasok_dalam,
        (SELECT COUNT(*) FROM penggilingan) as total_penggilingan,
        (SELECT COUNT(*) FROM pemasok p LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE p.status = 'Aktif' AND kab.nama_kabupaten != 'Kabupaten Lebak') as total_pemasok_luar,
        
        (SELECT COUNT(DISTINCT pb.jenis_pangan_id) FROM sppg_pembelian_bahan pb LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE pb.tipe_sumber = 'Penggilingan' OR (pb.tipe_sumber = 'Pemasok' AND (kab.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL))) as total_komoditas_dalam,
        
        (SELECT COUNT(DISTINCT pb.jenis_pangan_id) FROM sppg_pembelian_bahan pb LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id WHERE pb.tipe_sumber = 'Pemasok' AND kab.nama_kabupaten != 'Kabupaten Lebak') as total_komoditas_luar,
        
        (SELECT COUNT(DISTINCT jenis_pangan_id) FROM sppg_pembelian_bahan) as total_komoditas_unik,
        (SELECT COUNT(*) FROM jenis_pangan) as total_katalog_komoditas,
        (SELECT COUNT(DISTINCT sppg_id) FROM sppg_pembelian_bahan) as total_sppg_aktif,
        (SELECT COUNT(*) FROM sppg_pembelian_bahan) as total_transaksi
    `);

    stats = {
      pemasokDalam: parseInt(statsRes[0]?.total_pemasok_dalam as string) || 0,
      penggilingan: parseInt(statsRes[0]?.total_penggilingan as string) || 0,
      pemasokLuar: parseInt(statsRes[0]?.total_pemasok_luar as string) || 0,
      komoditasUnik: parseInt(statsRes[0]?.total_komoditas_unik as string) || 0,
      komoditasDalam: parseInt(statsRes[0]?.total_komoditas_dalam as string) || 0,
      komoditasLuar: parseInt(statsRes[0]?.total_komoditas_luar as string) || 0,
      totalKatalogKomoditas: parseInt(statsRes[0]?.total_katalog_komoditas as string) || 0,
      sppg: parseInt(statsRes[0]?.total_sppg_aktif as string) || 0,
      transaksi: parseInt(statsRes[0]?.total_transaksi as string) || 0,
      sisaStokBerasSppg: 0,
    };
  } catch (e) {
    console.error('Error fetching stats rantai pasok:', e);
  }

  // 2. Top Komoditas Pangan (Berdasarkan Volume)
  let topKomoditas: TopKomoditasItem[] = [];
  try {
    const topKomoditasRes = await db.execute(sql`
      SELECT 
        jp.jenis_pangan_id as id,
        jp.nama_bahan as nama, 
        jp.kategori,
        COALESCE(SUM(pb.volume), 0) as total_volume, 
        COALESCE(pb.satuan, jp.satuan_default, 'Kg') as satuan,
        COUNT(pb.id) as total_transaksi,
        COUNT(DISTINCT pb.sppg_id) as jumlah_sppg,
        COUNT(DISTINCT pb.pemasok_id) as jumlah_pemasok
      FROM jenis_pangan jp
      LEFT JOIN sppg_pembelian_bahan pb ON jp.jenis_pangan_id = pb.jenis_pangan_id
      GROUP BY jp.jenis_pangan_id, jp.nama_bahan, jp.kategori, pb.satuan, jp.satuan_default
      ORDER BY total_volume DESC, jp.nama_bahan ASC
      LIMIT 10;
    `);

    topKomoditas = topKomoditasRes.map((r: any) => ({
      id: Number(r.id),
      nama: String(r.nama || ''),
      kategori: r.kategori ? String(r.kategori) : null,
      totalVolume: Number(r.total_volume || 0),
      satuan: String(r.satuan || 'Kg'),
      totalTransaksi: Number(r.total_transaksi || 0),
      jumlahSppg: Number(r.jumlah_sppg || 0),
      jumlahPemasok: Number(r.jumlah_pemasok || 0)
    }));
  } catch (e) {
    console.error('Error fetching top komoditas:', e);
  }

  // 3. Seluruh Mitra Pemasok
  let pemasokList: PemasokItem[] = [];
  try {
    const pemasokRes = await db.execute(sql`
      SELECT 
        p.pemasok_id as "pemasokId",
        p.nama_pemasok as "namaPemasok",
        p.tipe_pemasok as "tipePemasok",
        p.status,
        p.alamat_pemasok as "alamatPemasok",
        p.pic_nama as "picNama",
        p.pic_kontak as "picKontak",
        p.kontak,
        COALESCE(kab.nama_kabupaten, 'Kabupaten Lebak') as wilayah,
        COALESCE(SUM(pb.volume), 0) as "totalVolume",
        COUNT(DISTINCT pb.jenis_pangan_id) as "jumlahKomoditas",
        COUNT(DISTINCT pb.sppg_id) as "jumlahSppg"
      FROM pemasok p
      LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id
      LEFT JOIN sppg_pembelian_bahan pb ON p.pemasok_id = pb.pemasok_id
      GROUP BY p.pemasok_id, p.nama_pemasok, p.tipe_pemasok, p.status, p.alamat_pemasok, p.pic_nama, p.pic_kontak, p.kontak, kab.nama_kabupaten
      ORDER BY "totalVolume" DESC, p.nama_pemasok ASC;
    `);

    pemasokList = pemasokRes.map((r: any) => ({
      pemasokId: Number(r.pemasokId),
      namaPemasok: String(r.namaPemasok || ''),
      tipePemasok: r.tipePemasok ? String(r.tipePemasok) : 'Lokal',
      status: r.status ? String(r.status) : 'Aktif',
      alamatPemasok: r.alamatPemasok ? String(r.alamatPemasok) : null,
      wilayah: String(r.wilayah || 'Kabupaten Lebak'),
      picNama: r.picNama ? String(r.picNama) : null,
      picKontak: r.picKontak ? String(r.picKontak) : null,
      kontak: r.kontak ? String(r.kontak) : null,
      totalVolume: Number(r.totalVolume || 0),
      jumlahKomoditas: Number(r.jumlahKomoditas || 0),
      jumlahSppg: Number(r.jumlahSppg || 0),
    }));
  } catch (e) {
    console.error('Error fetching pemasok list:', e);
  }

  // 4. Sebaran Geografis Wilayah
  let wilayahStats: WilayahStatItem[] = [];
  try {
    const wilayahRes = await db.execute(sql`
      SELECT 
        COALESCE(kab.nama_kabupaten, 'Kabupaten Lebak') as wilayah,
        COUNT(p.pemasok_id) as total_pemasok,
        COALESCE(SUM(pb.volume), 0) as total_volume
      FROM pemasok p
      LEFT JOIN kabupaten kab ON p.kabupaten_id = kab.kabupaten_id
      LEFT JOIN sppg_pembelian_bahan pb ON p.pemasok_id = pb.pemasok_id
      WHERE p.status = 'Aktif'
      GROUP BY kab.nama_kabupaten
      ORDER BY total_pemasok DESC;
    `);

    wilayahStats = wilayahRes.map((r: any) => ({
      wilayah: String(r.wilayah || 'Kabupaten Lebak'),
      totalPemasok: Number(r.total_pemasok || 0),
      totalVolume: Number(r.total_volume || 0),
    }));
  } catch (e) {
    console.error('Error fetching wilayah stats:', e);
  }

  // 5. Sisa Stok Beras SPPG
  try {
    const { jenisPangan, sppgPembelianBahan, sppgPemakaianBahan } = await import("@/db/schema");
    const { ilike, inArray, sum } = await import("drizzle-orm");
    const berasRows = await db.select({ id: jenisPangan.id }).from(jenisPangan).where(ilike(jenisPangan.namaBahan, '%beras%'));
    const berasIds = berasRows.map(r => r.id);
    
    if (berasIds.length > 0) {
      const beli = await db.select({ total: sum(sppgPembelianBahan.volume) }).from(sppgPembelianBahan).where(inArray(sppgPembelianBahan.jenisPanganId, berasIds));
      const totalBerasMasuk = Number(beli[0]?.total || 0);
      
      const pakai = await db.select({ total: sum(sppgPemakaianBahan.volume) }).from(sppgPemakaianBahan).where(inArray(sppgPemakaianBahan.jenisPanganId, berasIds));
      const totalBerasKeluar = Number(pakai[0]?.total || 0);
      stats.sisaStokBerasSppg = Math.max(0, totalBerasMasuk - totalBerasKeluar);
    }
  } catch (e) {}

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <PageHeader 
        title="Rantai Pasok & Mitra Logistik MBG" 
        description="Transparansi alur distribusi bahan pangan segar dari Mitra Pemasok Lokal ke Dapur SPPG di Kabupaten Lebak."
        breadcrumbs={[{ label: 'Rantai Pasok' }]}
      />
      
      <main className="container mx-auto px-4 max-w-7xl -mt-4 relative z-20">
        <RantaiPasokClient 
          stats={stats}
          topKomoditas={topKomoditas}
          pemasokList={pemasokList}
          wilayahStats={wilayahStats}
        />
      </main>
    </div>
  );
}
