'use server';

import { db } from "@/db";
import { kecamatan, desa } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- KECAMATAN ---
export async function getKecamatan() {
  return await db.query.kecamatan.findMany({
    orderBy: [desc(kecamatan.id)]
  });
}

export async function createKecamatan(data: { namaKecamatan: string }) {
  try {
    await db.insert(kecamatan).values(data);
    revalidatePath('/admin/master-data/kecamatan');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal membuat data kecamatan. Mungkin nama sudah ada.' };
  }
}

export async function updateKecamatan(id: number, data: { namaKecamatan: string }) {
  try {
    await db.update(kecamatan).set(data).where(eq(kecamatan.id, id));
    revalidatePath('/admin/master-data/kecamatan');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal mengupdate data kecamatan.' };
  }
}

export async function deleteKecamatan(id: number) {
  try {
    await db.delete(kecamatan).where(eq(kecamatan.id, id));
    revalidatePath('/admin/master-data/kecamatan');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal menghapus kecamatan. Pastikan tidak ada desa yang terikat.' };
  }
}

// --- DESA ---
export async function getDesa() {
  return await db.query.desa.findMany({
    with: { kecamatan: true },
    orderBy: [desc(desa.id)]
  });
}

export async function createDesa(data: { namaDesa: string; kecamatanId: number }) {
  try {
    await db.insert(desa).values(data);
    revalidatePath('/admin/master-data/desa');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal membuat data desa.' };
  }
}

export async function updateDesa(id: number, data: { namaDesa: string; kecamatanId: number }) {
  try {
    await db.update(desa).set(data).where(eq(desa.id, id));
    revalidatePath('/admin/master-data/desa');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal mengupdate data desa.' };
  }
}

export async function deleteDesa(id: number) {
  try {
    await db.delete(desa).where(eq(desa.id, id));
    revalidatePath('/admin/master-data/desa');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal menghapus desa. Pastikan tidak ada data yang terikat (sekolah/sppg).' };
  }
}
