'use server';

import { db } from "@/db";
import { sekolah } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSekolah() {
  return await db.query.sekolah.findMany({
    orderBy: [desc(sekolah.createdAt)],
  });
}

export async function createSekolah(data: {
  namaSekolah: string;
  npsn?: string;
  kategoriId: number;
  alamatSekolah?: string;
  namaKepalaSekolah?: string;
  noHpKepalaSekolah?: string;
  jumlahSiswaTotal: number;
  tahunAjaranLast?: string;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.insert(sekolah).values({
      ...data,
    });
    revalidatePath('/admin/master-data/sekolah');
    return { success: true };
  } catch (error) {
    console.error("Error creating sekolah:", error);
    return { success: false, error: "Gagal menyimpan data sekolah" };
  }
}

export async function updateSekolah(id: number, data: {
  namaSekolah: string;
  npsn?: string;
  kategoriId: number;
  alamatSekolah?: string;
  namaKepalaSekolah?: string;
  noHpKepalaSekolah?: string;
  jumlahSiswaTotal: number;
  tahunAjaranLast?: string;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.update(sekolah).set({
      ...data,
    }).where(eq(sekolah.id, id));
    revalidatePath('/admin/master-data/sekolah');
    return { success: true };
  } catch (error) {
    console.error("Error updating sekolah:", error);
    return { success: false, error: "Gagal mengupdate data sekolah" };
  }
}

export async function deleteSekolah(id: number) {
  try {
    await db.delete(sekolah).where(eq(sekolah.id, id));
    revalidatePath('/admin/master-data/sekolah');
    return { success: true };
  } catch (error) {
    console.error("Error deleting sekolah:", error);
    return { success: false, error: "Gagal menghapus data sekolah" };
  }
}
