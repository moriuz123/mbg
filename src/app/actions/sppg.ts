'use server';

import { db } from "@/db";
import { sppg, sppgPenerimaManfaat, sekolahPenerimaanMbg } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSppg() {
  const { auth } = await import('@/lib/auth');
  const { headers } = await import('next/headers');
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const sppgId = session?.user?.sppgId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';

  if (isAdmin) {
    return await db.query.sppg.findMany({
      orderBy: [desc(sppg.createdAt)],
      with: {
        yayasan: true,
      }
    });
  }

  if (sppgId) {
    return await db.query.sppg.findMany({
      where: eq(sppg.id, sppgId),
      orderBy: [desc(sppg.createdAt)],
      with: {
        yayasan: true,
      }
    });
  }

  return [];
}

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function checkIsAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  return role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
}

async function checkCanManageSppg(targetSppgId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const userSppgId = session?.user?.sppgId;
  
  if (role === 'admin_dinas' || role === 'super_admin' || role === 'admin') return true;
  if ((role === 'sppg' || role === 'operator_sppg') && userSppgId === targetSppgId) return true;
  
  return false;
}

export async function createSppg(data: {
  idSppgCode?: string;
  namaSppg: string;
  desaId?: number;
  yayasanId?: number;
  alamat?: string;
  statusOperasional?: string;
  tanggalOperasional?: string;
  bpjsKesehatan?: boolean;
  namaKaSppg?: string;
  noHpKaSppg?: string;
  jumlahPenjamahMakanan?: number;
  jumlahBpjsTk?: number;
  chefBersertifikatBnsp?: number;
  keterangan?: string;
}) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { success: false, error: 'Akses ditolak: Hanya Admin yang dapat membuat SPPG' };

  try {
    await db.insert(sppg).values(data);
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat SPPG' };
  }
}

export async function updateSppg(id: number, data: {
  idSppgCode?: string;
  namaSppg?: string;
  desaId?: number;
  yayasanId?: number;
  alamat?: string;
  statusOperasional?: string;
  tanggalOperasional?: string;
  bpjsKesehatan?: boolean;
  namaKaSppg?: string;
  noHpKaSppg?: string;
  jumlahPenjamahMakanan?: number;
  jumlahBpjsTk?: number;
  chefBersertifikatBnsp?: number;
  keterangan?: string;
}) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { success: false, error: 'Akses ditolak: Hanya Admin yang dapat mengedit SPPG' };

  try {
    await db.update(sppg).set(data).where(eq(sppg.id, id));
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mengupdate SPPG' };
  }
}

export async function deleteSppg(id: number) {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) return { success: false, error: 'Akses ditolak: Hanya Admin yang dapat menghapus SPPG' };

  try {
    await db.delete(sppg).where(eq(sppg.id, id));
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus SPPG' };
  }
}

export async function getSppgById(id: number) {
  return await db.query.sppg.findFirst({
    where: eq(sppg.id, id)
  });
}

export async function getAssignedSekolah(sppgId: number) {
  const data = await db.query.sppgPenerimaManfaat.findMany({
    where: eq(sppgPenerimaManfaat.sppgId, sppgId),
    with: {
      sekolah: true
    }
  });
  return data;
}

export async function assignSekolahToSppg(data: { sppgId: number, sekolahId: number, jumlahTotal: number, tahunAjaran: string, tanggalMulai: string }) {
  const canManage = await checkCanManageSppg(data.sppgId);
  if (!canManage) return { success: false, error: 'Akses ditolak: Anda tidak memiliki akses untuk mengubah SPPG ini' };

  try {
    // 1. Insert ke sppg_penerima_manfaat (aktif)
    await db.insert(sppgPenerimaManfaat).values({
      sppgId: data.sppgId,
      sekolahId: data.sekolahId,
      tahunAjaran: data.tahunAjaran,
      jumlahTotal: data.jumlahTotal,
      status: 'Aktif',
      tanggalMulai: data.tanggalMulai,
    });
    
    // 2. Cek apakah di sekolah_penerimaan_mbg sudah ada untuk sekolah & sppg ini (opsional: jika ada update status, jika tidak insert baru)
    // Untuk sederhana, kita selalu insert history penerimaan baru
    await db.insert(sekolahPenerimaanMbg).values({
      sekolahId: data.sekolahId,
      sppgId: data.sppgId,
      status: 'Aktif',
      tanggalMulaiMbg: data.tanggalMulai,
      tahunAjaran: data.tahunAjaran,
    });

    revalidatePath(`/admin/sppg/${data.sppgId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Gagal menambahkan sekolah ke SPPG. Pastikan tidak ada duplikasi data.' };
  }
}

export async function unassignSekolah(id: number, sppgId: number) {
  const canManage = await checkCanManageSppg(sppgId);
  if (!canManage) return { success: false, error: 'Akses ditolak: Anda tidak memiliki akses untuk mengubah SPPG ini' };

  try {
    // Cari id sppg_penerima_manfaat
    const rec = await db.query.sppgPenerimaManfaat.findFirst({
      where: eq(sppgPenerimaManfaat.id, id)
    });
    
    if (rec) {
      // Update history
      await db.update(sekolahPenerimaanMbg)
        .set({ status: 'Berhenti', tanggalSelesaiMbg: new Date().toISOString().split('T')[0], catatanStatus: 'Dihapus dari SPPG' })
        .where(eq(sekolahPenerimaanMbg.sekolahId, rec.sekolahId));
      
      // Hapus data aktif
      await db.delete(sppgPenerimaManfaat).where(eq(sppgPenerimaManfaat.id, id));
    }
    
    revalidatePath(`/admin/sppg/${sppgId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus sekolah dari SPPG' };
  }
}

import { sppgPosyanduManfaat, posyanduPenerimaanMbg } from "@/db/schema";

export async function getAssignedPosyandu(sppgId: number) {
  const data = await db.query.sppgPosyanduManfaat.findMany({
    where: eq(sppgPosyanduManfaat.sppgId, sppgId),
    with: {
      posyandu: true
    }
  });
  return data;
}

export async function assignPosyanduToSppg(data: { 
  sppgId: number; 
  posyanduId: number; 
  jumlahBusui: number;
  jumlahBumil: number;
  jumlahBalita: number;
  jumlahTotal: number; 
  tanggalMulai: string 
}) {
  const canManage = await checkCanManageSppg(data.sppgId);
  if (!canManage) return { success: false, error: 'Akses ditolak: Anda tidak memiliki akses untuk mengubah SPPG ini' };

  try {
    await db.insert(sppgPosyanduManfaat).values({
      sppgId: data.sppgId,
      posyanduId: data.posyanduId,
      jumlahBusui: data.jumlahBusui,
      jumlahBumil: data.jumlahBumil,
      jumlahBalita: data.jumlahBalita,
      jumlahTotal: data.jumlahTotal,
      status: 'Aktif',
      tanggalMulai: data.tanggalMulai,
    });
    
    await db.insert(posyanduPenerimaanMbg).values({
      posyanduId: data.posyanduId,
      sppgId: data.sppgId,
      status: 'Aktif',
      tanggalMulaiMbg: data.tanggalMulai,
    });

    revalidatePath(`/admin/sppg/${data.sppgId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: 'Gagal menambahkan posyandu ke SPPG. Pastikan tidak ada duplikasi data.' };
  }
}

export async function unassignPosyandu(id: number, sppgId: number) {
  const canManage = await checkCanManageSppg(sppgId);
  if (!canManage) return { success: false, error: 'Akses ditolak: Anda tidak memiliki akses untuk mengubah SPPG ini' };

  try {
    const rec = await db.query.sppgPosyanduManfaat.findFirst({
      where: eq(sppgPosyanduManfaat.id, id)
    });
    
    if (rec) {
      await db.update(posyanduPenerimaanMbg)
        .set({ status: 'Berhenti', tanggalSelesaiMbg: new Date().toISOString().split('T')[0], catatanStatus: 'Dihapus dari SPPG' })
        .where(eq(posyanduPenerimaanMbg.posyanduId, rec.posyanduId));
      
      await db.delete(sppgPosyanduManfaat).where(eq(sppgPosyanduManfaat.id, id));
    }
    
    revalidatePath(`/admin/sppg/${sppgId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus posyandu dari SPPG' };
  }
}
