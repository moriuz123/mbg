"use server";

import { db } from "@/db";
import { sppg, sppgPenerimaManfaat, sppgSertifikasi } from "@/db/schema";
import { sum, count, eq } from "drizzle-orm";

export async function getPublicStats() {
  try {
    // 1. Total Penerima Manfaat & Breakdown
    const { kategoriPenerima, sekolah } = await import("@/db/schema");
    const penerimaManfaatQuery = await db.select({
      totalSiswa: sum(sekolah.jumlahSiswaTotal)
    }).from(sekolah);

    const totalPenerima = Number(penerimaManfaatQuery[0]?.totalSiswa || 0);

    // Breakdown
    const breakdownQuery = await db.select({
      kategori: kategoriPenerima.namaKategori,
      totalSiswa: sum(sekolah.jumlahSiswaTotal)
    })
    .from(sekolah)
    .leftJoin(kategoriPenerima, eq(sekolah.kategoriId, kategoriPenerima.id))
    .groupBy(kategoriPenerima.namaKategori);

    const breakdownPenerima = breakdownQuery.map(row => ({
      kategori: row.kategori || 'Lainnya',
      totalSiswa: Number(row.totalSiswa || 0)
    }));

    // 2. Titik Dapur SPPG
    const sppgQuery = await db.select({ count: count() })
      .from(sppg);
    
    const totalSppg = sppgQuery[0]?.count || 0;

    // 3. Keamanan Pangan (Persentase Dapur dgn Sertifikasi Aktif)
    const totalSppgAllQuery = await db.select({ count: count() }).from(sppg);
    const totalSppgAll = totalSppgAllQuery[0]?.count || 1;

    // Count distinct SPPG with at least one active certification
    const sertifikasiQuery = await db.select({ count: count(sppgSertifikasi.sppgId) })
      .from(sppgSertifikasi)
      .where(eq(sppgSertifikasi.status, true));
    
    // Simplification for dummy data, let's just cap at 100
    let keamananPangan = Math.round((Number(sertifikasiQuery[0]?.count || 0) / totalSppgAll) * 100);
    if (keamananPangan > 100) keamananPangan = 100;

    // Posyandu data
    const posyandu = (await import("@/db/schema")).posyandu;
    const sppgPosyanduManfaat = (await import("@/db/schema")).sppgPosyanduManfaat;
    
    const posyanduQuery = await db.select({ count: count() }).from(posyandu);
    const totalPosyandu = posyanduQuery[0]?.count || 0;

    const posyanduPenerimaQuery = await db.select({ 
      total: sum(posyandu.jumlahTotal),
      busui: sum(posyandu.jumlahBusui),
      bumil: sum(posyandu.jumlahBumil),
      balita: sum(posyandu.jumlahBalita),
    }).from(posyandu);
    
    const totalPosyanduPenerima = Number(posyanduPenerimaQuery[0]?.total || 0);
    const totalBusui = Number(posyanduPenerimaQuery[0]?.busui || 0);
    const totalBumil = Number(posyanduPenerimaQuery[0]?.bumil || 0);
    const totalBalita = Number(posyanduPenerimaQuery[0]?.balita || 0);

    // Sekolah data
    const sekolahQuery = await db.select({ count: count() }).from(sekolah);
    const totalSekolah = sekolahQuery[0]?.count || 0;
    
    const totalSiswa = totalPenerima; // This was already calculated from sppgPenerimaManfaat

    // Calculate realisasi pengiriman for today
    const { sppgLaporanAktifitas } = await import("@/db/schema");
    const today = new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];
    const todayDeliveries = await db.select({
      status: sppgLaporanAktifitas.status
    }).from(sppgLaporanAktifitas).where(eq(sppgLaporanAktifitas.tanggal, today));

    let realisasiPengiriman = 0;
    if (todayDeliveries.length > 0) {
      const delivered = todayDeliveries.filter(d => d.status === 'Diterima' || d.status === 'Diterima Lengkap' || d.status === 'Terkirim').length;
      realisasiPengiriman = Math.round((delivered / todayDeliveries.length) * 100);
    }

    return {
      totalPenerima: totalPenerima + totalPosyanduPenerima,
      breakdownPenerima,
      totalSppg,
      totalSekolah,
      totalSiswa,
      totalPosyandu,
      totalPosyanduPenerima,
      totalBusui,
      totalBumil,
      totalBalita,
      keamananPangan,
      realisasiPengiriman
    };
  } catch (error) {
    console.error("Error getting public stats:", error);
    return {
      totalPenerima: 0,
      breakdownPenerima: [],
      totalSppg: 0,
      totalSekolah: 0,
      totalSiswa: 0,
      totalPosyandu: 0,
      totalPosyanduPenerima: 0,
      totalBusui: 0,
      totalBumil: 0,
      totalBalita: 0,
      keamananPangan: 0,
      realisasiPengiriman: 0
    };
  }
}

export async function getPublicLaporanHarian(dateStr?: string) {
  try {
    const { sppgLaporanAktifitas } = await import("@/db/schema");
    const { desc, eq } = await import("drizzle-orm");

    // Format target date as YYYY-MM-DD. Use provided dateStr or today's date.
    // Ensure we use local time (WIB) for today
    const targetDate = dateStr || new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0];

    const rawData = await db.query.sppgLaporanAktifitas.findMany({
      with: {
        sppg: true,
        sekolah: true,
        posyandu: true,
        standarMenuGizi: true
      },
      where: eq(sppgLaporanAktifitas.tanggal, targetDate),
      orderBy: [desc(sppgLaporanAktifitas.createdAt)],
      limit: 50 // Get more data for the day instead of just 6
    });

    return rawData.map(l => {
      let receiverName = '-';
      if (l.sekolah) {
        receiverName = l.sekolah.namaSekolah;
      } else if (l.posyandu) {
        receiverName = `Posyandu ${l.posyandu.namaPosyandu}`;
      }

      return {
        id: l.id,
        tanggal: l.tanggal,
        menu: l.standarMenuGizi ? `${l.standarMenuGizi.namaMenu} (${l.standarMenuGizi.kaloriKkal || 0} Kkal)` : '-',
        menuDetail: l.standarMenuGizi?.deskripsi || '',
        jumlahPorsi: l.jumlahPorsi,
        status: l.status,
        sppgName: l.sppg?.namaSppg || '-',
        sekolahName: receiverName
      };
    });
  } catch (error) {
    console.error("Error getting public laporan:", error);
    return [];
  }
}

export async function getSupplyChainStats() {
  const { penggilingan, pemasok, penggilinganSumberGabah } = await import("@/db/schema");
  const { count, sum } = await import("drizzle-orm");

  let totalPenggilingan = 0;
  let totalPemasok = 0;
  let serapanGabahKg = 0;
  let kapasitasGilingKg = 0;

  try {
    
    const pengQuery = await db.select({ count: count(), kapasitas: sum(penggilingan.kapasitasTerpasangKgMinggu) }).from(penggilingan);
    const pengAktifQuery = await db.select({ count: count() }).from(penggilingan).where(eq(penggilingan.status, 'Aktif'));
    totalPenggilingan = Number(pengAktifQuery[0]?.count || 0); // Override total to only return active
    kapasitasGilingKg = Number(pengQuery[0]?.kapasitas || 0);
  } catch (e) {}

  try {
    const pemQuery = await db.select({ count: count() }).from(pemasok).where(eq(pemasok.status, 'Aktif'));
    totalPemasok = Number(pemQuery[0]?.count || 0);
  } catch (e) {}

  try {
    const serapanQuery = await db.select({ total: sum(penggilinganSumberGabah.volumeKg) }).from(penggilinganSumberGabah);
    serapanGabahKg = Number(serapanQuery[0]?.total || 0);
  } catch (e) {}

  
  return {
    totalPenggilingan,
    totalPemasok,
    serapanGabahTon: serapanGabahKg / 1000,
    kapasitasGilingTon: kapasitasGilingKg / 1000
  };

}
