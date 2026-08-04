'use server';

import { db } from "@/db";
import { masterSekolah } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSekolah(data: {
  id: string;
  namaSekolah: string;
  jenjang: string;
  alamat: string;
  jumlahSiswa: string;
}) {
  try {
    await db.insert(masterSekolah).values(data);
    revalidatePath('/admin/sekolah');
    return { success: true };
  } catch (error) {
    console.error("Error creating sekolah:", error);
    return { success: false, error: "Gagal menyimpan data sekolah" };
  }
}

export async function deleteSekolah(id: string) {
  try {
    await db.delete(masterSekolah).where(eq(masterSekolah.id, id));
    revalidatePath('/admin/sekolah');
    return { success: true };
  } catch (error) {
    console.error("Error deleting sekolah:", error);
    return { success: false, error: "Gagal menghapus data sekolah" };
  }
}
