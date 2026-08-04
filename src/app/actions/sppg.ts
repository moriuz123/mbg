'use server';

import { db } from "@/db";
import { sppg, sppgSupplyChain, sppgRapidTest } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSppg() {
  return await db.query.sppg.findMany({
    orderBy: [desc(sppg.createdAt)],
  });
}

export async function createSppg(data: any) {
  try {
    await db.insert(sppg).values(data);
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat SPPG' };
  }
}

export async function deleteSppg(id: string) {
  try {
    await db.delete(sppg).where(eq(sppg.id, id));
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus SPPG' };
  }
}

export async function getSupplyChain() {
  return await db.query.sppgSupplyChain.findMany({
    orderBy: [desc(sppgSupplyChain.createdAt)],
  });
}

export async function addSupplyChain(data: { 
  sppgId: string; 
  jenisPanganSegar: string; 
  namaPemasok: string; 
  kebutuhanPerBulan: string; 
  satuan: string; 
}) {
  await db.insert(sppgSupplyChain).values({
    id: crypto.randomUUID(),
    sppgId: data.sppgId,
    jenisPanganSegar: data.jenisPanganSegar,
    namaPemasok: data.namaPemasok,
    kebutuhanPerBulan: data.kebutuhanPerBulan,
    satuan: data.satuan,
  });
  revalidatePath('/admin/supply-chain');
  return { success: true };
}

export async function deleteSupplyChain(id: string) {
  try {
    await db.delete(sppgSupplyChain).where(eq(sppgSupplyChain.id, id));
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus rantai pasok' };
  }
}

export async function getRapidTest() {
  return await db.query.sppgRapidTest.findMany({
    orderBy: [desc(sppgRapidTest.createdAt)],
  });
}

export async function addRapidTest(data: {
  sppgId: string;
  tanggal: string;
  bahan: string;
  parameter: string;
  hasil: string;
}) {
  try {
    await db.insert(sppgRapidTest).values({
      id: crypto.randomUUID(),
      sppgId: data.sppgId,
      tanggal: data.tanggal,
      bahan: data.bahan,
      parameter: data.parameter,
      hasil: data.hasil,
    });
    revalidatePath('/admin/rapid-test');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah hasil uji rapid test' };
  }
}

export async function deleteRapidTest(id: string) {
  try {
    await db.delete(sppgRapidTest).where(eq(sppgRapidTest.id, id));
    revalidatePath('/admin/rapid-test');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus uji rapid test' };
  }
}
