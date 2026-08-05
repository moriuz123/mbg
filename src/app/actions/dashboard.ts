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
    namaSppg: row.nama_sppg,
    jumlahSekolah: parseInt(row.jumlah_sekolah as string) || 0,
    totalSiswa: parseInt(row.total_siswa_penerima as string) || 0,
  }));

  return {
    sppgCount,
    totalSiswa,
    sekolahTercover,
    sekolahBelumTercover,
    coveragePercent,
    statsPerSppg
  };
}
