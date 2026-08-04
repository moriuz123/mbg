'use server';

import { db } from "@/db";
import { masterPemasok } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getMasterPemasok() {
  return await db.query.masterPemasok.findMany({
    orderBy: [desc(masterPemasok.createdAt)],
  });
}

export async function createMasterPemasok(data: {
  namaPemasok: string;
  kategori: string;
  alamat: string;
  kontak: string;
  status: string;
}) {
  try {
    await db.insert(masterPemasok).values({
      id: crypto.randomUUID(),
      namaPemasok: data.namaPemasok,
      kategori: data.kategori,
      alamat: data.alamat,
      kontak: data.kontak,
      status: data.status,
    });
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah master pemasok' };
  }
}

export async function deleteMasterPemasok(id: string) {
  try {
    await db.delete(masterPemasok).where(eq(masterPemasok.id, id));
    revalidatePath('/admin/master-data/pemasok');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus master pemasok' };
  }
}
