'use server';

import { db } from "@/db";
import { penggilingan, penggilinganSumberGabah, penggilinganProduksi, penggilinganDistribusi } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const penggilinganId = session?.user?.penggilinganId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, penggilinganId, isAdmin };
}

export async function getPenggilingan() {
  const { isAdmin, penggilinganId } = await getSessionData();

  if (!isAdmin) {
    if (!penggilinganId) return [];
    return await db.query.penggilingan.findMany({
      where: eq(penggilingan.id, penggilinganId),
      with: { kecamatan: true, desa: true },
      orderBy: [desc(penggilingan.id)],
    });
  }

  return await db.query.penggilingan.findMany({
    with: { kecamatan: true, desa: true },
    orderBy: [desc(penggilingan.id)],
  });
}

export async function createPenggilingan(data: {
  namaPenggilingan: string;
  alamat?: string;
  kecamatanId?: number;
  desaId?: number;
  penanggungJawab?: string;
  noHp?: string;
  nib?: string;
  nomorUmku?: string;
  kbli?: string;
  namaDagang?: string;
  nomorRegistrasiPduk?: string;
  statusPduk?: string;
  tanggalDikeluarkanPduk?: string;
  berlakuSampaiPduk?: string;
  namaUnitProduksi?: string;
  noPermohonanOss?: string;
  kapasitasTerpasangKgMinggu?: string;
  status?: string;
}) {
  try {
    await db.insert(penggilingan).values({
      ...data,
      status: data.status || 'Aktif'
    });
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat data penggilingan' };
  }
}

export async function updatePenggilingan(id: number, data: {
  namaPenggilingan: string;
  alamat?: string;
  kecamatanId?: number;
  desaId?: number;
  penanggungJawab?: string;
  noHp?: string;
  nib?: string;
  nomorUmku?: string;
  kbli?: string;
  namaDagang?: string;
  nomorRegistrasiPduk?: string;
  statusPduk?: string;
  tanggalDikeluarkanPduk?: string;
  berlakuSampaiPduk?: string;
  namaUnitProduksi?: string;
  noPermohonanOss?: string;
  kapasitasTerpasangKgMinggu?: string;
  status?: string;
}) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== id) {
      return { success: false, error: 'Akses ditolak' };
    }
    await db.update(penggilingan)
      .set({
        namaPenggilingan: data.namaPenggilingan,
        alamat: data.alamat || null,
        kecamatanId: data.kecamatanId || null,
        desaId: data.desaId || null,
        penanggungJawab: data.penanggungJawab || null,
        noHp: data.noHp || null,
        nib: data.nib || null,
        nomorUmku: data.nomorUmku || null,
        kbli: data.kbli || null,
        namaDagang: data.namaDagang || null,
        nomorRegistrasiPduk: data.nomorRegistrasiPduk || null,
        statusPduk: data.statusPduk || null,
        tanggalDikeluarkanPduk: data.tanggalDikeluarkanPduk || null,
        berlakuSampaiPduk: data.berlakuSampaiPduk || null,
        namaUnitProduksi: data.namaUnitProduksi || null,
        noPermohonanOss: data.noPermohonanOss || null,
        kapasitasTerpasangKgMinggu: data.kapasitasTerpasangKgMinggu || null,
        status: data.status || 'Aktif',
      })
      .where(eq(penggilingan.id, id));
    revalidatePath('/admin/penggilingan');
    revalidatePath(`/admin/penggilingan/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal memperbarui data penggilingan' };
  }
}

export async function deletePenggilingan(id: number) {
  try {
    await db.delete(penggilingan).where(eq(penggilingan.id, id));
    revalidatePath('/admin/penggilingan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus data penggilingan' };
  }
}

export async function getPenggilinganById(id: number) {
  const { isAdmin, penggilinganId } = await getSessionData();

  if (!isAdmin) {
    if (penggilinganId !== id) return null;
  }

  return await db.query.penggilingan.findFirst({
    where: eq(penggilingan.id, id),
  });
}

export async function getSumberGabah(penggilinganId: number) {
  return await db.query.penggilinganSumberGabah.findMany({
    where: eq(penggilinganSumberGabah.penggilinganId, penggilinganId),
    orderBy: [desc(penggilinganSumberGabah.mingguMulai)],
  });
}

export async function addSumberGabah(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  sumberGabah: string;
  namaSumber?: string;
  alamatSumber?: string;
  kontakPerson?: string;
  volumeKg: string;
  hargaBeliPerKg?: string;
  catatan?: string;
}) {
  try {

    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== data.penggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.insert(penggilinganSumberGabah).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      sumberGabah: data.sumberGabah,
      namaSumber: data.namaSumber || null,
      alamatSumber: data.alamatSumber || null,
      kontakPerson: data.kontakPerson || null,
      volumeKg: data.volumeKg,
      hargaBeliPerKg: data.hargaBeliPerKg || null,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah sumber gabah' };
  }
}

export async function deleteSumberGabah(id: number, targetPenggilinganId: number) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== targetPenggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.delete(penggilinganSumberGabah).where(eq(penggilinganSumberGabah.id, id));
    revalidatePath(`/admin/penggilingan/${targetPenggilinganId}`);
    return { success: true, message: 'Data sumber gabah berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data sumber gabah.' };
  }
}

export async function getProduksi(penggilinganId: number) {
  return await db.query.penggilinganProduksi.findMany({
    where: eq(penggilinganProduksi.penggilinganId, penggilinganId),
    orderBy: [desc(penggilinganProduksi.mingguMulai)],
  });
}

export async function addProduksi(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  kapasitasRealisasiKg: string;
  rendemenPersen?: string;
  catatan?: string;
}) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== data.penggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.insert(penggilinganProduksi).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      kapasitasRealisasiKg: data.kapasitasRealisasiKg,
      rendemenPersen: data.rendemenPersen || null,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah realisasi produksi' };
  }
}

export async function deleteProduksi(id: number, targetPenggilinganId: number) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== targetPenggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.delete(penggilinganProduksi).where(eq(penggilinganProduksi.id, id));
    revalidatePath(`/admin/penggilingan/${targetPenggilinganId}`);
    return { success: true, message: 'Data produksi berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data produksi.' };
  }
}

export async function getDistribusi(penggilinganId: number) {
  try {
    return await db.query.penggilinganDistribusi.findMany({
      where: eq(penggilinganDistribusi.penggilinganId, penggilinganId),
      orderBy: [desc(penggilinganDistribusi.mingguMulai)],
      with: {
        sppgTujuan: true
      }
    });
  } catch (error) {
    console.error('Error fetching getDistribusi:', error);
    return [];
  }
}

export async function addDistribusi(data: {
  penggilinganId: number;
  mingguMulai: string;
  mingguSelesai: string;
  volumeKg: string;
  hargaPerKg?: string;
  hargaTotal?: string;
  tujuanTipe: string;
  sppgTujuanId?: number;
  lokasiLain?: string;
  catatan?: string;
}) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== data.penggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.insert(penggilinganDistribusi).values({
      penggilinganId: data.penggilinganId,
      mingguMulai: data.mingguMulai,
      mingguSelesai: data.mingguSelesai,
      volumeKg: data.volumeKg,
      hargaPerKg: data.hargaPerKg || null,
      hargaTotal: data.hargaTotal || null,
      tujuanTipe: data.tujuanTipe,
      sppgTujuanId: data.sppgTujuanId || null,
      lokasiLain: data.lokasiLain,
      catatan: data.catatan || null,
    });
    revalidatePath(`/admin/penggilingan/${data.penggilinganId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah data distribusi' };
  }
}

export async function deleteDistribusi(id: number, targetPenggilinganId: number) {
  try {
    const { isAdmin, penggilinganId } = await getSessionData();
    if (!isAdmin && penggilinganId !== targetPenggilinganId) {
      return { success: false, error: 'Akses ditolak' };
    }

    await db.delete(penggilinganDistribusi).where(eq(penggilinganDistribusi.id, id));
    revalidatePath(`/admin/penggilingan/${targetPenggilinganId}`);
    return { success: true, message: 'Data distribusi beras berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, error: error.message || 'Gagal menghapus data distribusi beras.' };
  }
}
