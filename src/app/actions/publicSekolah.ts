'use server';

import { db } from "@/db";
import { sekolah, sekolahPenerimaanMbg, sppg, kecamatan, desa, kategoriPenerima } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicSekolahPenerima() {
  const result = await db
    .select({
      sekolahId: sekolah.id,
      namaSekolah: sekolah.namaSekolah,
      npsn: sekolah.npsn,
      jumlahSiswaTotal: sekolah.jumlahSiswaTotal,
      alamatSekolah: sekolah.alamatSekolah,
      namaKepalaSekolah: sekolah.namaKepalaSekolah,
      statusPenerimaan: sekolahPenerimaanMbg.status,
      tanggalMulai: sekolahPenerimaanMbg.tanggalMulaiMbg,
      tanggalSelesai: sekolahPenerimaanMbg.tanggalSelesaiMbg,
      sppgId: sppg.id,
      namaSppg: sppg.namaSppg,
      kecamatanId: sekolah.kecamatanId,
      namaKecamatan: kecamatan.namaKecamatan,
      desaId: sekolah.desaId,
      namaDesa: desa.namaDesa,
      kategoriId: sekolah.kategoriId,
      namaKategori: kategoriPenerima.namaKategori,
    })
    .from(sekolah)
    .innerJoin(sekolahPenerimaanMbg, eq(sekolah.id, sekolahPenerimaanMbg.sekolahId))
    .innerJoin(sppg, eq(sppg.id, sekolahPenerimaanMbg.sppgId))
    .leftJoin(kecamatan, eq(kecamatan.id, sekolah.kecamatanId))
    .leftJoin(desa, eq(desa.id, sekolah.desaId))
    .leftJoin(kategoriPenerima, eq(kategoriPenerima.id, sekolah.kategoriId))
    .where(eq(sekolahPenerimaanMbg.status, 'Aktif'));

  const uniqueMap = new Map();
  for (const item of result) {
    if (!uniqueMap.has(item.sekolahId)) {
      uniqueMap.set(item.sekolahId, item);
    }
  }
  return Array.from(uniqueMap.values());
}

export async function getFilterOptions() {
  const kecamatans = await db.select({ id: kecamatan.id, nama: kecamatan.namaKecamatan }).from(kecamatan);
  const desas = await db.select({ id: desa.id, nama: desa.namaDesa, kecamatanId: desa.kecamatanId }).from(desa);
  const kategoris = await db.select({ id: kategoriPenerima.id, nama: kategoriPenerima.namaKategori }).from(kategoriPenerima);

  return { kecamatans, desas, kategoris };
}
