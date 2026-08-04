'use server';

import { db } from "@/db";
import { penggilingan_gabah } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPenggilingan() {
  return await db.query.penggilingan_gabah.findMany({
    orderBy: [desc(penggilingan_gabah.createdAt)],
  });
}

export async function createPenggilingan(data: {
  namaPemilik: string;
  namaPerusahaan: string;
  alamat: string;
  kapasitasGiling: string;
  legalitas: string;
  statusKerjasama: string;
}) {
  try {
    await db.insert(penggilingan_gabah).values({
      id: crypto.randomUUID(),
      namaPemilik: data.namaPemilik,
      namaPerusahaan: data.namaPerusahaan,
      alamat: data.alamat,
      kapasitasGiling: data.kapasitasGiling,
      legalitas: data.legalitas,
      statusKerjasama: data.statusKerjasama,
    });
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah data penggilingan' };
  }
}

export async function deletePenggilingan(id: string) {
  try {
    await db.delete(penggilingan_gabah).where(eq(penggilingan_gabah.id, id));
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data penggilingan' };
  }
}
