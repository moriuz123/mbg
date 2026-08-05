'use server';

import { db } from "@/db";
import { penggilingan, penggilinganSumberGabah, penggilinganProduksi, penggilinganDistribusi } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPenggilingan() {
  return await db.query.penggilingan.findMany({
    orderBy: [desc(penggilingan.id)],
  });
}

export async function createPenggilingan(data: {
  namaPenggilingan: string;
  alamat?: string;
  kecamatanId?: number;
  penanggungJawab?: string;
  noHp?: string;
  kapasitasTerpasangKgMinggu?: string;
  status?: string;
}) {
  try {
    await db.insert(penggilingan).values({
      ...data,
      status: data.status || 'Aktif'
    });
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat data penggilingan' };
  }
}

export async function deletePenggilingan(id: number) {
  try {
    await db.delete(penggilingan).where(eq(penggilingan.id, id));
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data penggilingan' };
  }
}

export async function getPenggilinganById(id: number) {
  return await db.query.penggilingan.findFirst({
    where: eq(penggilingan.id, id),
  });
}

export async function getSumberGabah(penggilinganId: number) {
  return await db.query.penggilinganSumberGabah.findMany({
    where: eq(penggilinganSumberGabah.penggilinganId, penggilinganId),
    orderBy: [desc(penggilinganSumberGabah.mingguMulai)],
  });
}

export async function addSumberGabah(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  sumberGabah: string;
  volumeKg: string;
  hargaBeliPerKg?: string;
  catatan?: string;
}) {
  try {
    await db.insert(penggilinganSumberGabah).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      sumberGabah: data.sumberGabah,
      volumeKg: data.volumeKg,
      hargaBeliPerKg: data.hargaBeliPerKg || null,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah sumber gabah' };
  }
}

export async function getProduksi(penggilinganId: number) {
  return await db.query.penggilinganProduksi.findMany({
    where: eq(penggilinganProduksi.penggilinganId, penggilinganId),
    orderBy: [desc(penggilinganProduksi.mingguMulai)],
  });
}

export async function addProduksi(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  kapasitasRealisasiKg: string;
  rendemenPersen?: string;
  catatan?: string;
}) {
  try {
    await db.insert(penggilinganProduksi).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      kapasitasRealisasiKg: data.kapasitasRealisasiKg,
      rendemenPersen: data.rendemenPersen || null,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah realisasi produksi' };
  }
}

export async function getDistribusi(penggilinganId: number) {
  return await db.query.penggilinganDistribusi.findMany({
    where: eq(penggilinganDistribusi.penggilinganId, penggilinganId),
    orderBy: [desc(penggilinganDistribusi.mingguMulai)],
    with: {
      sppgTujuan: true
    }
  });
}

export async function addDistribusi(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  volumeKg: string;
  tujuanTipe: string;
  sppgTujuanId?: number;
  lokasiLain?: string;
  catatan?: string;
}) {
  try {
    await db.insert(penggilinganDistribusi).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      volumeKg: data.volumeKg,
      tujuanTipe: data.tujuanTipe,
      sppgTujuanId: data.sppgTujuanId || null,
      lokasiLain: data.lokasiLain,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah data distribusi' };
  }
}
