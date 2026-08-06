'use server';

import { db } from "@/db";
import { pemasok, jenisPangan } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ==== PEMASOK ====
export async function getPemasok() {
  return await db.query.pemasok.findMany({
    orderBy: [desc(pemasok.id)],
  });
}

export async function createPemasok(data: Partial<typeof pemasok.$inferInsert>) {
  try {
    // @ts-ignore - drizzle infer inserts can sometimes complain about generated always id, but we omit it or just pass data
    await db.insert(pemasok).values(data as any);
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah pemasok' };
  }
}

export async function updatePemasok(id: number, data: Partial<typeof pemasok.$inferInsert>) {
  try {
    await db.update(pemasok).set(data).where(eq(pemasok.id, id));
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mengupdate pemasok' };
  }
}

export async function deletePemasok(id: number) {
  try {
    await db.delete(pemasok).where(eq(pemasok.id, id));
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus pemasok' };
  }
}

// ==== JENIS PANGAN ====
export async function getJenisPangan() {
  return await db.query.jenisPangan.findMany({
    orderBy: [desc(jenisPangan.id)],
  });
}

export async function createJenisPangan(data: {
  namaBahan: string;
  kategori?: string;
  satuanDefault?: string;
}) {
  try {
    await db.insert(jenisPangan).values(data);
    revalidatePath('/admin/master-data/jenis-pangan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah jenis pangan' };
  }
}

export async function updateJenisPangan(id: number, data: {
  namaBahan: string;
  kategori?: string;
  satuanDefault?: string;
}) {
  try {
    await db.update(jenisPangan).set(data).where(eq(jenisPangan.id, id));
    revalidatePath('/admin/master-data/jenis-pangan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mengupdate jenis pangan' };
  }
}

export async function deleteJenisPangan(id: number) {
  try {
    await db.delete(jenisPangan).where(eq(jenisPangan.id, id));
    revalidatePath('/admin/master-data/jenis-pangan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus jenis pangan' };
  }
}
