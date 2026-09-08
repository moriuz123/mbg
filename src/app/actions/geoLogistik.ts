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

  return {
    distribusiAgregat,
    distribusiKecamatan,
    sumberGabahAgregat
  };
}
