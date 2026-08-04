'use server';

import { db } from "@/db";
import { sysMenu } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSysMenu() {
  return await db.query.sysMenu.findMany({
    orderBy: [desc(sysMenu.createdAt)],
  });
}

export async function createSysMenu(data: {
  namaModul: string;
  url: string;
  hakAkses: string;
  status: string;
}) {
  try {
    await db.insert(sysMenu).values({
      id: crypto.randomUUID(),
      namaModul: data.namaModul,
      url: data.url,
      hakAkses: data.hakAkses,
      status: data.status,
    });
    revalidatePath('/admin/manajemen-menu');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah menu' };
  }
}

export async function deleteSysMenu(id: string) {
  try {
    await db.delete(sysMenu).where(eq(sysMenu.id, id));
    revalidatePath('/admin/manajemen-menu');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus menu' };
  }
}
