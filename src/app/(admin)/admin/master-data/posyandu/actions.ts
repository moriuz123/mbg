'use server';

import { db } from "@/db";
import { posyandu } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPosyandu() {
  return await db.query.posyandu.findMany({
    orderBy: [desc(posyandu.createdAt)],
  });
}

export async function createPosyandu(data: {
  namaPosyandu: string;
  alamatPosyandu?: string;
  namaKetuaKader?: string;
  noHpKetuaKader?: string;
  jumlahBusui?: number;
  jumlahBalita?: number;
  jumlahBumil?: number;
  jumlahTotal: number;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.insert(posyandu).values({
      ...data,
    });
    revalidatePath('/admin/master-data/posyandu');
    return { success: true };
  } catch (error) {
    console.error("Error creating posyandu:", error);
    return { success: false, error: "Gagal menyimpan data posyandu" };
  }
}

export async function updatePosyandu(id: number, data: {
  namaPosyandu: string;
  alamatPosyandu?: string;
  namaKetuaKader?: string;
  noHpKetuaKader?: string;
  jumlahBusui?: number;
  jumlahBalita?: number;
  jumlahBumil?: number;
  jumlahTotal: number;
  desaId?: number;
  kecamatanId?: number;
}) {
  try {
    await db.update(posyandu).set({
      ...data,
    }).where(eq(posyandu.id, id));
    revalidatePath('/admin/master-data/posyandu');
    return { success: true };
  } catch (error) {
    console.error("Error updating posyandu:", error);
    return { success: false, error: "Gagal mengupdate data posyandu" };
  }
}

export async function deletePosyandu(id: number) {
  try {
    await db.delete(posyandu).where(eq(posyandu.id, id));
    revalidatePath('/admin/master-data/posyandu');
    return { success: true };
  } catch (error) {
    console.error("Error deleting posyandu:", error);
    return { success: false, error: "Gagal menghapus data posyandu" };
  }
}
