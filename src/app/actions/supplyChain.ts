'use server';

import { db } from "@/db";
import { supplyChainKebutuhan } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSupplyChain() {
  return await db.query.supplyChainKebutuhan.findMany({
    orderBy: [desc(supplyChainKebutuhan.createdAt)],
    with: {
      sppg: true,
      jenisPangan: true,
      pemasok: true
    }
  });
}

export async function createSupplyChain(data: {
  sppgId: number;
  jenisPanganId: number;
  pemasokId?: number;
  kebutuhanPerBulan: string;
  satuan?: string;
  periode?: string;
}) {
  try {
    await db.insert(supplyChainKebutuhan).values({
      sppgId: data.sppgId,
      jenisPanganId: data.jenisPanganId,
      pemasokId: data.pemasokId || null,
      kebutuhanPerBulan: data.kebutuhanPerBulan,
      satuan: data.satuan || 'Kilogram',
      periode: data.periode || new Date().toISOString().split('T')[0],
    });
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah data rantai pasok' };
  }
}

export async function deleteSupplyChain(id: number) {
  try {
    await db.delete(supplyChainKebutuhan).where(eq(supplyChainKebutuhan.id, id));
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus rantai pasok' };
  }
}
