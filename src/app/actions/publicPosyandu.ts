'use server';

import { db } from "@/db";
import { posyandu, posyanduPenerimaanMbg, sppg, kecamatan, desa } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPublicPosyanduPenerima() {
  const result = await db
    .select({
      posyanduId: posyandu.id,
      namaPosyandu: posyandu.namaPosyandu,
      jumlahBusui: posyandu.jumlahBusui,
      jumlahBalita: posyandu.jumlahBalita,
      jumlahBumil: posyandu.jumlahBumil,
      jumlahTotal: posyandu.jumlahTotal,
      alamatPosyandu: posyandu.alamatPosyandu,
      namaKetuaKader: posyandu.namaKetuaKader,
      statusPenerimaan: posyanduPenerimaanMbg.status,
      tanggalMulai: posyanduPenerimaanMbg.tanggalMulaiMbg,
      tanggalSelesai: posyanduPenerimaanMbg.tanggalSelesaiMbg,
      sppgId: sppg.id,
      namaSppg: sppg.namaSppg,
      kecamatanId: posyandu.kecamatanId,
      namaKecamatan: kecamatan.namaKecamatan,
      desaId: posyandu.desaId,
      namaDesa: desa.namaDesa,
    })
    .from(posyandu)
    .innerJoin(posyanduPenerimaanMbg, eq(posyandu.id, posyanduPenerimaanMbg.posyanduId))
    .innerJoin(sppg, eq(sppg.id, posyanduPenerimaanMbg.sppgId))
    .leftJoin(kecamatan, eq(kecamatan.id, posyandu.kecamatanId))
    .leftJoin(desa, eq(desa.id, posyandu.desaId))
    .where(eq(posyanduPenerimaanMbg.status, 'Aktif'));

  const uniqueMap = new Map();
  for (const item of result) {
    if (!uniqueMap.has(item.posyanduId)) {
      uniqueMap.set(item.posyanduId, item);
    }
  }
  return Array.from(uniqueMap.values());
}

export async function getFilterOptions() {
  const kecamatans = await db.select({ id: kecamatan.id, nama: kecamatan.namaKecamatan }).from(kecamatan);
  const desas = await db.select({ id: desa.id, nama: desa.namaDesa, kecamatanId: desa.kecamatanId }).from(desa);

  return { kecamatans, desas };
}
