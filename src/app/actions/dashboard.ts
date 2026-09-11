'use server';

import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function getDashboardStats() {
  // 1. Total SPPG Aktif
  const sppgCountRes = await db.execute(sql`SELECT count(*) as total FROM sppg WHERE status_operasional = 'Operasional' OR status_operasional = 'Aktif'`);
  const sppgCount = parseInt(sppgCountRes[0]?.total as string) || 0;

  // 2. Total Siswa Penerima Manfaat (Total Laki + Perempuan dari sppg_penerima_manfaat yang Aktif)
  const siswaRes = await db.execute(sql`
    SELECT SUM(jumlah_laki + jumlah_perempuan) as total_siswa 
    FROM sppg_penerima_manfaat 
    WHERE status = 'Aktif'
  `);
  const totalSiswa = parseInt(siswaRes[0]?.total_siswa as string) || 0;

  // 3. Sekolah yang Sudah Tercover
  const sekolahTercoverRes = await db.execute(sql`
    SELECT COUNT(DISTINCT sekolah_id) as total_sekolah
    FROM sekolah_penerimaan_mbg
    WHERE status = 'Aktif'
  `);
  const sekolahTercover = parseInt(sekolahTercoverRes[0]?.total_sekolah as string) || 0;

  // 4. Sekolah Belum Tercover
  const sekolahBelumTercoverRes = await db.execute(sql`
    SELECT COUNT(*) as total_belum
    FROM sekolah
    WHERE sekolah_id NOT IN (
      SELECT DISTINCT sekolah_id FROM sekolah_penerimaan_mbg WHERE status = 'Aktif'
    )
  `);
  const sekolahBelumTercover = parseInt(sekolahBelumTercoverRes[0]?.total_belum as string) || 0;
  
  const totalSekolah = sekolahTercover + sekolahBelumTercover;
  const coveragePercent = totalSekolah > 0 ? ((sekolahTercover / totalSekolah) * 100).toFixed(1) : 0;

  // 5. Statistik per SPPG (Top 5)
  const statsPerSppgRes = await db.execute(sql`
    SELECT 
        p.nama_sppg,
        COUNT(DISTINCT spm.sekolah_id) AS jumlah_sekolah,
        SUM(spm.jumlah_laki + spm.jumlah_perempuan) AS total_siswa_penerima
    FROM sppg p
    LEFT JOIN sppg_penerima_manfaat spm ON p.sppg_id = spm.sppg_id AND spm.status = 'Aktif'
    GROUP BY p.sppg_id, p.nama_sppg
    ORDER BY total_siswa_penerima DESC
    LIMIT 5
  `);
  const statsPerSppg = statsPerSppgRes.map(row => ({
    namaSppg: (row.nama_sppg as string) || 'SPPG',
    jumlahSekolah: parseInt(row.jumlah_sekolah as string) || 0,
    totalSiswa: parseInt(row.total_siswa_penerima as string) || 0,
  }));

  // 6. Total Posyandu Penerima Manfaat (Balita + Bumil + Busui)
  const posyanduPenerimaRes = await db.execute(sql`
    SELECT SUM(jumlah_balita + jumlah_bumil + jumlah_busui) as total_sasaran 
    FROM sppg_posyandu_manfaat 
    WHERE status = 'Aktif'
  `);
  const totalPosyanduSasaran = parseInt(posyanduPenerimaRes[0]?.total_sasaran as string) || 0;

  // 7. Posyandu Tercover
  const posyanduTercoverRes = await db.execute(sql`
    SELECT COUNT(DISTINCT posyandu_id) as total_posyandu
    FROM posyandu_penerimaan_mbg
    WHERE status = 'Aktif'
  `);
  const posyanduTercover = parseInt(posyanduTercoverRes[0]?.total_posyandu as string) || 0;

  // 8. Posyandu Belum Tercover
  const posyanduBelumTercoverRes = await db.execute(sql`
    SELECT COUNT(*) as total_belum
    FROM posyandu
    WHERE id NOT IN (
      SELECT DISTINCT posyandu_id FROM posyandu_penerimaan_mbg WHERE status = 'Aktif'
    )
  `);
  const posyanduBelumTercover = parseInt(posyanduBelumTercoverRes[0]?.total_belum as string) || 0;

  // 9. Total Penggilingan
  const penggilinganRes = await db.execute(sql`SELECT count(*) as total FROM penggilingan WHERE status = 'Aktif'`);
  const totalPenggilingan = parseInt(penggilinganRes[0]?.total as string) || 0;

  // 10. Total Pemasok
  const pemasokRes = await db.execute(sql`SELECT count(*) as total FROM pemasok WHERE status = 'Aktif'`);
  const totalPemasok = parseInt(pemasokRes[0]?.total as string) || 0;

  return {
    sppgCount,
    totalSiswa,
    sekolahTercover,
    sekolahBelumTercover,
    coveragePercent,
    statsPerSppg,
    totalPosyanduSasaran,
    posyanduTercover,
    posyanduBelumTercover,
    totalPenggilingan,
    totalPemasok
  };
}

export async function getSppgDashboardStats(sppgId: number) {
  // 1. Info SPPG
  const sppgInfoRes = await db.execute(sql`SELECT nama_sppg, status_operasional FROM sppg WHERE sppg_id = ${sppgId}`);
  const namaSppg = sppgInfoRes[0]?.nama_sppg as string || 'Dapur SPPG';
  const statusOperasional = sppgInfoRes[0]?.status_operasional as string || 'Tidak Diketahui';

  // 2. Total Siswa (Sekolah)
  const siswaRes = await db.execute(sql`
    SELECT SUM(jumlah_total) as total_siswa 
    FROM sppg_penerima_manfaat 
    WHERE sppg_id = ${sppgId} AND status = 'Aktif'
  `);
  const totalSiswa = parseInt(siswaRes[0]?.total_siswa as string) || 0;

  // 3. Total Posyandu (Sasaran)
  const posyanduRes = await db.execute(sql`
    SELECT SUM(jumlah_total) as total_sasaran 
    FROM sppg_posyandu_manfaat 
    WHERE sppg_id = ${sppgId} AND status = 'Aktif'
  `);
  const totalPosyandu = parseInt(posyanduRes[0]?.total_sasaran as string) || 0;

  // 4. Laporan Distribusi Diterima (Total Porsi)
  const laporanRes = await db.execute(sql`
    SELECT SUM(jumlah_porsi) as total_porsi 
    FROM sppg_laporan_aktifitas 
    WHERE sppg_id = ${sppgId} AND status = 'Diterima'
  `);
  const totalPorsiTerkirim = parseInt(laporanRes[0]?.total_porsi as string) || 0;

  // 5. Total Instansi Tujuan
  const countSekolahRes = await db.execute(sql`SELECT COUNT(*) as count FROM sppg_penerima_manfaat WHERE sppg_id = ${sppgId} AND status = 'Aktif'`);
  const countPosyanduRes = await db.execute(sql`SELECT COUNT(*) as count FROM sppg_posyandu_manfaat WHERE sppg_id = ${sppgId} AND status = 'Aktif'`);
  
  const jumlahSekolah = parseInt(countSekolahRes[0]?.count as string) || 0;
  const jumlahPosyandu = parseInt(countPosyanduRes[0]?.count as string) || 0;

  // Count active suppliers used by this SPPG (Dalam Lebak & Luar Lebak)
  const pemasokDalamRes = await db.execute(sql`
    SELECT COUNT(DISTINCT pb.pemasok_id) as count
    FROM sppg_pembelian_bahan pb
    JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    LEFT JOIN kabupaten k ON p.kabupaten_id = k.kabupaten_id
    WHERE pb.sppg_id = ${sppgId} 
      AND (k.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL)
      AND pb.tipe_sumber != 'Penggilingan'
  `);
  
  const pemasokLuarRes = await db.execute(sql`
    SELECT COUNT(DISTINCT pb.pemasok_id) as count
    FROM sppg_pembelian_bahan pb
    JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    JOIN kabupaten k ON p.kabupaten_id = k.kabupaten_id
    WHERE pb.sppg_id = ${sppgId} 
      AND k.nama_kabupaten != 'Kabupaten Lebak'
      AND pb.tipe_sumber != 'Penggilingan'
  `);

  const penggilinganRes = await db.execute(sql`
    SELECT COUNT(DISTINCT pb.penggilingan_id) as count
    FROM sppg_pembelian_bahan pb
    WHERE pb.sppg_id = ${sppgId} 
      AND pb.tipe_sumber = 'Penggilingan'
  `);

  // 1. Jenis Komoditas (Dalam vs Luar)
  const komoditasDalamRes = await db.execute(sql`
    SELECT COUNT(DISTINCT pb.jenis_pangan_id) as count
    FROM sppg_pembelian_bahan pb
    LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    LEFT JOIN kabupaten k ON p.kabupaten_id = k.kabupaten_id
    WHERE pb.sppg_id = ${sppgId} 
      AND (
        pb.tipe_sumber = 'Penggilingan' 
        OR (k.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL)
      )
  `);

  const komoditasLuarRes = await db.execute(sql`
    SELECT COUNT(DISTINCT pb.jenis_pangan_id) as count
    FROM sppg_pembelian_bahan pb
    JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    JOIN kabupaten k ON p.kabupaten_id = k.kabupaten_id
    WHERE pb.sppg_id = ${sppgId} 
      AND pb.tipe_sumber != 'Penggilingan'
      AND k.nama_kabupaten != 'Kabupaten Lebak'
  `);

  // 2. Volume Beras
  const berasStatsRes = await db.execute(sql`
    SELECT 
      SUM(CASE WHEN pb.tipe_sumber = 'Penggilingan' THEN pb.volume ELSE 0 END) as beras_penggilingan,
      SUM(CASE WHEN pb.tipe_sumber != 'Penggilingan' AND (k.nama_kabupaten = 'Kabupaten Lebak' OR p.kabupaten_id IS NULL) THEN pb.volume ELSE 0 END) as beras_pemasok_dalam,
      SUM(CASE WHEN pb.tipe_sumber != 'Penggilingan' AND k.nama_kabupaten != 'Kabupaten Lebak' THEN pb.volume ELSE 0 END) as beras_pemasok_luar
    FROM sppg_pembelian_bahan pb
    JOIN jenis_pangan jp ON pb.jenis_pangan_id = jp.jenis_pangan_id
    LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    LEFT JOIN kabupaten k ON p.kabupaten_id = k.kabupaten_id
    WHERE pb.sppg_id = ${sppgId} 
      AND jp.nama_bahan ILIKE '%Beras%'
  `);

  const totalPemasokDalam = (parseInt(pemasokDalamRes[0]?.count as string) || 0) + (parseInt(penggilinganRes[0]?.count as string) || 0); // Penggilingan are all local Lebak RMUs
  const totalPemasokLuar = parseInt(pemasokLuarRes[0]?.count as string) || 0;

  return {
    namaSppg,
    statusOperasional,
    totalSiswa,
    totalPosyandu,
    totalPorsiTerkirim,
    jumlahSekolah,
    jumlahPosyandu,
    totalPemasokDalam,
    totalPemasokLuar,
    jenisKomoditasDalam: parseInt(komoditasDalamRes[0]?.count as string) || 0,
    jenisKomoditasLuar: parseInt(komoditasLuarRes[0]?.count as string) || 0,
    berasPenggilingan: parseFloat(berasStatsRes[0]?.beras_penggilingan as string) || 0,
    berasPemasokDalam: parseFloat(berasStatsRes[0]?.beras_pemasok_dalam as string) || 0,
    berasPemasokLuar: parseFloat(berasStatsRes[0]?.beras_pemasok_luar as string) || 0,
    totalPenerimaManfaat: totalSiswa + totalPosyandu
  };
}

export async function getSekolahDashboardStats(sekolahId: number) {
  // Info Sekolah
  const sekolahInfoRes = await db.execute(sql`SELECT nama_sekolah, jumlah_siswa_laki, jumlah_siswa_perempuan FROM sekolah WHERE sekolah_id = ${sekolahId}`);
  const namaSekolah = sekolahInfoRes[0]?.nama_sekolah as string || 'Sekolah';
  const laki = parseInt(sekolahInfoRes[0]?.jumlah_siswa_laki as string) || 0;
  const perempuan = parseInt(sekolahInfoRes[0]?.jumlah_siswa_perempuan as string) || 0;

  // Laporan yang Diterima
  const laporanRes = await db.execute(sql`
    SELECT SUM(jumlah_porsi_diterima) as total_porsi 
    FROM sekolah_laporan_aktifitas 
    WHERE sekolah_id = ${sekolahId} AND status_diterima = 'Diterima Lengkap'
  `);
  const totalPorsiDiterima = parseInt(laporanRes[0]?.total_porsi as string) || 0;

  // Laporan Menunggu Verifikasi
  const menungguRes = await db.execute(sql`
    SELECT count(*) as count 
    FROM sppg_laporan_aktifitas 
    WHERE sekolah_id = ${sekolahId} AND status = 'Terkirim'
  `);
  const menungguVerifikasi = parseInt(menungguRes[0]?.count as string) || 0;

  // Riwayat Pengiriman Terbaru (5 Terakhir)
  const recentRes = await db.execute(sql`
    SELECT 
      l.id,
      l.tanggal,
      l.jumlah_porsi as jumlah_porsi,
      l.status,
      s.nama_sppg as sppg_name,
      m.nama_menu as menu_name
    FROM sppg_laporan_aktifitas l
    LEFT JOIN sppg s ON l.sppg_id = s.sppg_id
    LEFT JOIN standar_menu_gizi m ON l.standar_menu_id = m.id
    WHERE l.sekolah_id = ${sekolahId}
    ORDER BY l.tanggal DESC, l.id DESC
    LIMIT 5
  `);

  return {
    namaSekolah,
    totalSiswa: laki + perempuan,
    totalPorsiDiterima,
    menungguVerifikasi,
    recentVerifications: recentRes as any[]
  };
}

export async function getPosyanduDashboardStats(posyanduId: number) {
  // Info Posyandu
  const posyanduInfoRes = await db.execute(sql`SELECT nama_posyandu FROM posyandu WHERE id = ${posyanduId}`);
  const namaPosyandu = posyanduInfoRes[0]?.nama_posyandu as string || 'Posyandu';
  
  // Total Sasaran
  const sasaranRes = await db.execute(sql`
    SELECT 
      SUM(jumlah_total) as total,
      SUM(jumlah_bumil) as total_bumil,
      SUM(jumlah_busui) as total_busui,
      SUM(jumlah_balita) as total_balita
    FROM sppg_posyandu_manfaat 
    WHERE posyandu_id = ${posyanduId} AND status = 'Aktif'
  `);
  
  const totalSasaran = parseInt(sasaranRes[0]?.total as string) || 0;
  const totalBumil = parseInt(sasaranRes[0]?.total_bumil as string) || 0;
  const totalBusui = parseInt(sasaranRes[0]?.total_busui as string) || 0;
  const totalBalita = parseInt(sasaranRes[0]?.total_balita as string) || 0;

  // Laporan yang Diterima
  const laporanRes = await db.execute(sql`
    SELECT SUM(jumlah_porsi_diterima) as total_porsi 
    FROM posyandu_laporan_aktifitas 
    WHERE posyandu_id = ${posyanduId} AND status_diterima = 'Diterima Lengkap'
  `);
  const totalPorsiDiterima = parseInt(laporanRes[0]?.total_porsi as string) || 0;

  // Laporan Menunggu Verifikasi
  const menungguRes = await db.execute(sql`
    SELECT count(*) as count 
    FROM sppg_laporan_aktifitas 
    WHERE posyandu_id = ${posyanduId} AND status = 'Terkirim'
  `);
  const menungguVerifikasi = parseInt(menungguRes[0]?.count as string) || 0;

  // Riwayat Pengiriman Terbaru (5 Terakhir)
  const recentRes = await db.execute(sql`
    SELECT 
      l.id,
      l.tanggal,
      l.jumlah_porsi as jumlah_porsi,
      l.status,
      s.nama_sppg as sppg_name,
      m.nama_menu as menu_name
    FROM sppg_laporan_aktifitas l
    LEFT JOIN sppg s ON l.sppg_id = s.sppg_id
    LEFT JOIN standar_menu_gizi m ON l.standar_menu_id = m.id
    WHERE l.posyandu_id = ${posyanduId}
    ORDER BY l.tanggal DESC, l.id DESC
    LIMIT 5
  `);

  return {
    namaPosyandu,
    totalSasaran,
    totalBumil,
    totalBusui,
    totalBalita,
    totalPorsiDiterima,
    menungguVerifikasi,
    recentVerifications: recentRes as any[]
  };
}

export async function getPenggilinganDashboardStats(penggilinganId: number) {
  try {
    // Info Penggilingan
    const penggilinganInfoRes = await db.execute(sql`
      SELECT nama_penggilingan, kapasitas_terpasang_kg_minggu, penanggung_jawab, no_hp 
      FROM penggilingan 
      WHERE penggilingan_id = ${penggilinganId}
    `);
    const info = penggilinganInfoRes[0] || {};
    const namaPenggilingan = (info.nama_penggilingan as string) || 'Penggilingan';
    const kapasitasKGMinggu = parseFloat(info.kapasitas_terpasang_kg_minggu as string) || 0;

    // 1. Total Suplai Beras (Volume Kg Distribusi) & Total Penjualan (Rp)
    let totalSuplaiKg = 0;
    let totalPenjualanRp = 0;
    try {
      const suplaiRes = await db.execute(sql`
        SELECT 
          SUM(CAST(volume_kg AS NUMERIC)) as total_suplai,
          SUM(COALESCE(CAST(harga_total AS NUMERIC), CAST(volume_kg AS NUMERIC) * CAST(harga_per_kg AS NUMERIC), 0)) as total_penjualan
        FROM penggilingan_distribusi 
        WHERE penggilingan_id = ${penggilinganId}
      `);
      totalSuplaiKg = parseFloat(suplaiRes[0]?.total_suplai as string) || 0;
      totalPenjualanRp = parseFloat(suplaiRes[0]?.total_penjualan as string) || 0;
    } catch (e) {
      const suplaiRes = await db.execute(sql`
        SELECT SUM(CAST(volume_kg AS NUMERIC)) as total_suplai 
        FROM penggilingan_distribusi 
        WHERE penggilingan_id = ${penggilinganId}
      `);
      totalSuplaiKg = parseFloat(suplaiRes[0]?.total_suplai as string) || 0;
    }

    // 2. Total Realisasi Produksi (Kg)
    const prodRes = await db.execute(sql`
      SELECT SUM(CAST(beras_dihasilkan_kg AS NUMERIC)) as total_produksi 
      FROM penggilingan_produksi 
      WHERE penggilingan_id = ${penggilinganId}
    `);
    const totalProduksiKg = parseFloat(prodRes[0]?.total_produksi as string) || 0;

    // 3. Total Gabah Masuk (Kg)
    const gabahRes = await db.execute(sql`
      SELECT SUM(CAST(volume_kg AS NUMERIC)) as total_gabah 
      FROM penggilingan_sumber_gabah 
      WHERE penggilingan_id = ${penggilinganId}
    `);
    const totalGabahKg = parseFloat(gabahRes[0]?.total_gabah as string) || 0;

    // 4. SPPG Terlayani
    const sppgRes = await db.execute(sql`
      SELECT COUNT(DISTINCT sppg_tujuan_id) as count 
      FROM penggilingan_distribusi 
      WHERE penggilingan_id = ${penggilinganId} AND sppg_tujuan_id IS NOT NULL
    `);
    const jumlahSppgTerlayani = parseInt(sppgRes[0]?.count as string) || 0;

    // 5. Riwayat Distribusi Terbaru
    let recentRes: any[] = [];
    try {
      recentRes = await db.execute(sql`
        SELECT 
          d.id,
          d.minggu_mulai,
          d.minggu_selesai,
          d.volume_kg,
          d.harga_per_kg,
          d.harga_total,
          d.tujuan_tipe,
          s.nama_sppg as sppg_name,
          d.lokasi_lain
        FROM penggilingan_distribusi d
        LEFT JOIN sppg s ON d.sppg_tujuan_id = s.sppg_id
        WHERE d.penggilingan_id = ${penggilinganId}
        ORDER BY d.minggu_mulai DESC, d.id DESC
        LIMIT 5
      `);
    } catch (e) {
      recentRes = await db.execute(sql`
        SELECT 
          d.id,
          d.minggu_mulai,
          d.minggu_selesai,
          d.volume_kg,
          d.tujuan_tipe,
          s.nama_sppg as sppg_name,
          d.lokasi_lain
        FROM penggilingan_distribusi d
        LEFT JOIN sppg s ON d.sppg_tujuan_id = s.sppg_id
        WHERE d.penggilingan_id = ${penggilinganId}
        ORDER BY d.minggu_mulai DESC, d.id DESC
        LIMIT 5
      `);
    }

    return {
      namaPenggilingan,
      kapasitasKGMinggu,
      totalSuplaiKg,
      totalProduksiKg,
      totalGabahKg,
      totalPenjualanRp,
      jumlahSppgTerlayani,
      recentDistributions: recentRes as any[]
    };
  } catch (error) {
    console.error('Error in getPenggilinganDashboardStats:', error);
    return {
      namaPenggilingan: 'Penggilingan',
      kapasitasKGMinggu: 0,
      totalSuplaiKg: 0,
      totalProduksiKg: 0,
      totalGabahKg: 0,
      totalPenjualanRp: 0,
      jumlahSppgTerlayani: 0,
      recentDistributions: []
    };
  }
}
