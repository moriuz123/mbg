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

export async function createPemasok(data: {
  namaPemasok: string;
  alamatPemasok?: string;
  kontak?: string;
}) {
  try {
    await db.insert(pemasok).values(data);
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah pemasok' };
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

export async function deleteJenisPangan(id: number) {
  try {
    await db.delete(jenisPangan).where(eq(jenisPangan.id, id));
    revalidatePath('/admin/master-data/jenis-pangan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus jenis pangan' };
  }
}
