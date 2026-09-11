'use server';

import { db } from "@/db";
import { sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getGeoLogistikStats() {
  // Check auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isAdmin = session?.user?.role === 'admin_dinas' || session?.user?.role === 'super_admin' || session?.user?.role === 'admin';
  if (!isAdmin) return null;

  // 1. Total Produksi vs Distribusi Luar/Dalam Lebak
  const distribusiAgregatRes = await db.execute(sql`
    SELECT 
      wilayah_distribusi,
      SUM(CAST(volume_kg AS NUMERIC)) as total_volume
    FROM penggilingan_distribusi
    GROUP BY wilayah_distribusi
  `);

  const distribusiAgregat = {
    dalamLebak: 0,
    luarLebak: 0
  };

  distribusiAgregatRes.forEach(row => {
    const vol = parseFloat(row.total_volume as string) || 0;
    if (row.wilayah_distribusi === 'Luar Kabupaten Lebak') {
      distribusiAgregat.luarLebak += vol;
    } else {
      distribusiAgregat.dalamLebak += vol;
    }
  });

  // 2. Data Suplai Beras per Kecamatan Tujuan (Dalam Lebak)
  const distribusiKecamatanRes = await db.execute(sql`
    SELECT 
      COALESCE(k.nama_kecamatan, 'Lainnya/Luar') as nama_kecamatan,
      SUM(CAST(d.volume_kg AS NUMERIC)) as total_beras_kg
    FROM penggilingan_distribusi d
    LEFT JOIN sppg s ON d.sppg_tujuan_id = s.sppg_id
    LEFT JOIN yayasan y ON s.yayasan_id = y.yayasan_id
    LEFT JOIN kecamatan k ON d.kecamatan_tujuan_id = k.kecamatan_id OR y.kecamatan_id = k.kecamatan_id
    WHERE d.wilayah_distribusi = 'Dalam Kabupaten Lebak' OR d.wilayah_distribusi IS NULL OR d.wilayah_distribusi = 'Dalam Lebak'
    GROUP BY k.nama_kecamatan
    ORDER BY total_beras_kg DESC
  `);

  const distribusiKecamatan = distribusiKecamatanRes.map(row => ({
    kecamatan: row.nama_kecamatan,
    totalBerasKg: parseFloat(row.total_beras_kg as string) || 0
  }));

  // 3. Sumber Gabah: Dalam vs Luar Lebak
  const sumberGabahAgregatRes = await db.execute(sql`
    SELECT 
      lokasi_wilayah,
      SUM(CAST(volume_kg AS NUMERIC)) as total_gabah
    FROM penggilingan_sumber_gabah
    GROUP BY lokasi_wilayah
  `);

  const sumberGabahAgregat = {
    dalamLebak: 0,
    luarLebak: 0
  };

  sumberGabahAgregatRes.forEach(row => {
    const vol = parseFloat(row.total_gabah as string) || 0;
    if (row.lokasi_wilayah === 'Luar Kabupaten Lebak' || row.lokasi_wilayah === 'Luar Lebak') {
      sumberGabahAgregat.luarLebak += vol;
    } else {
      sumberGabahAgregat.dalamLebak += vol;
    }
  });

  // 4. Performa per Penggilingan (Matriks Penggilingan)
  const matriksPenggilinganRes = await db.execute(sql`
    WITH gabah AS (
      SELECT penggilingan_id, 
             SUM(CASE WHEN lokasi_wilayah LIKE 'Dalam%' THEN CAST(volume_kg AS NUMERIC) ELSE 0 END) as dalam,
             SUM(CASE WHEN lokasi_wilayah LIKE 'Luar%' THEN CAST(volume_kg AS NUMERIC) ELSE 0 END) as luar
      FROM penggilingan_sumber_gabah
      GROUP BY penggilingan_id
    ),
    distribusi AS (
      SELECT penggilingan_id,
             SUM(CASE WHEN wilayah_distribusi LIKE 'Dalam%' THEN CAST(volume_kg AS NUMERIC) ELSE 0 END) as dalam,
             SUM(CASE WHEN wilayah_distribusi LIKE 'Luar%' THEN CAST(volume_kg AS NUMERIC) ELSE 0 END) as luar
      FROM penggilingan_distribusi
      GROUP BY penggilingan_id
    )
    SELECT 
      p.penggilingan_id,
      p.nama_penggilingan,
      p.kapasitas_terpasang_kg_minggu as kapasitas,
      COALESCE(g.dalam, 0) as gabah_dalam,
      COALESCE(g.luar, 0) as gabah_luar,
      COALESCE(d.dalam, 0) as beras_dalam,
      COALESCE(d.luar, 0) as beras_luar
    FROM penggilingan p
    LEFT JOIN gabah g ON p.penggilingan_id = g.penggilingan_id
    LEFT JOIN distribusi d ON p.penggilingan_id = d.penggilingan_id
    WHERE p.status = 'Aktif'
    ORDER BY COALESCE(d.dalam, 0) DESC, p.nama_penggilingan ASC
  `);

  const matriksPenggilingan = matriksPenggilinganRes.map((row: any) => ({
    id: row.penggilingan_id,
    nama: row.nama_penggilingan,
    kapasitasKg: parseFloat(row.kapasitas) || 0,
    gabahDalam: parseFloat(row.gabah_dalam) || 0,
    gabahLuar: parseFloat(row.gabah_luar) || 0,
    berasDalam: parseFloat(row.beras_dalam) || 0,
    berasLuar: parseFloat(row.beras_luar) || 0,
  }));

  return {
    distribusiAgregat,
    distribusiKecamatan,
    sumberGabahAgregat,
    matriksPenggilingan
  };
}
