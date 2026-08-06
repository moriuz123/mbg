'use server';

import { db } from "@/db";
import { supplyChainKebutuhan } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const sppgId = session?.user?.sppgId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, sppgId, isAdmin };
}

export async function getSupplyChain() {
  const { isAdmin, sppgId } = await getSessionData();

  if (isAdmin) {
    return await db.query.supplyChainKebutuhan.findMany({
      orderBy: [desc(supplyChainKebutuhan.createdAt)],
      with: {
        sppg: true,
        jenisPangan: true,
        pemasok: true
      }
    });
  }

  // Operator SPPG only sees their own supply chain
  if (sppgId) {
    return await db.query.supplyChainKebutuhan.findMany({
      where: eq(supplyChainKebutuhan.sppgId, sppgId),
      orderBy: [desc(supplyChainKebutuhan.createdAt)],
      with: {
        sppg: true,
        jenisPangan: true,
        pemasok: true
      }
    });
  }

  return [];
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
    const { isAdmin, sppgId: userSppgId } = await getSessionData();
    let finalSppgId = data.sppgId;

    if (!isAdmin) {
      if (!userSppgId) return { success: false, error: 'Akun Anda belum terhubung dengan Dapur SPPG' };
      // Force SPPG ID to user's SPPG ID
      finalSppgId = userSppgId;
    }

    await db.insert(supplyChainKebutuhan).values({
      sppgId: finalSppgId,
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
    const { isAdmin, sppgId: userSppgId } = await getSessionData();
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, error: 'Akses ditolak' };
      // Verify ownership
      const item = await db.query.supplyChainKebutuhan.findFirst({
        where: eq(supplyChainKebutuhan.id, id)
      });
      
      if (!item || item.sppgId !== userSppgId) {
        return { success: false, error: 'Akses ditolak: Data ini bukan milik Anda' };
      }
    }

    await db.delete(supplyChainKebutuhan).where(eq(supplyChainKebutuhan.id, id));
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus rantai pasok' };
  }
}
