'use server';

import { db } from "@/db";
import { yayasan } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getYayasans() {
  return await db.query.yayasan.findMany({
    orderBy: (yayasan, { asc }) => [asc(yayasan.namaYayasan)],
  });
}

export async function createYayasan(data: {
  namaYayasan: string;
  alamat?: string;
  kontak?: string;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.insert(yayasan).values(data);
    revalidatePath('/admin/master-data/yayasan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat Yayasan' };
  }
}

export async function deleteYayasan(id: number) {
  try {
    await db.delete(yayasan).where(eq(yayasan.id, id));
    revalidatePath('/admin/master-data/yayasan');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus Yayasan' };
  }
}

export async function updateYayasan(id: number, data: {
  namaYayasan: string;
  alamat?: string;
  kontak?: string;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.update(yayasan).set({
      ...data,
    }).where(eq(yayasan.id, id));
    revalidatePath('/admin/master-data/yayasan');
    return { success: true };
  } catch (error) {
    console.error("Error updating yayasan:", error);
    return { success: false, error: "Gagal mengupdate data yayasan" };
  }
}
