'use server';

import { db } from '@/db';
import { sppgPembelianBahan, sppgPemakaianBahan, sppgUjiRapidTest, pemasok, jenisPangan, standarMenuGizi } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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

// ==========================================
// 1. PEMBELIAN BAHAN (INCOMING STOCK)
// ==========================================
export async function createPembelianBahan(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const data = {
      sppgId,
      pemasokId: parseInt(formData.get('pemasokId') as string),
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      tanggalPembelian: formData.get('tanggalPembelian') as string,
      mingguKe: parseInt(formData.get('mingguKe') as string) || null,
      volume: formData.get('volume') as string,
      satuan: formData.get('satuan') as string || 'Kg',
      hargaTotal: formData.get('hargaTotal') as string || null,
      catatan: formData.get('catatan') as string || null,
    };

    await db.insert(sppgPembelianBahan).values(data);
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Data pembelian bahan berhasil ditambahkan.' };
  } catch (error: any) {
    console.error('Error createPembelianBahan:', error);
    return { success: false, message: error.message || 'Gagal menyimpan data pembelian.' };
  }
}

export async function getPembelianBahan(sppgId?: number) {
  const { sppgId: userSppgId, isAdmin } = await getSessionData();
  const targetSppgId = isAdmin ? sppgId : userSppgId;

  const whereClause = targetSppgId ? eq(sppgPembelianBahan.sppgId, targetSppgId) : undefined;

  const data = await db.query.sppgPembelianBahan.findMany({
    where: whereClause,
    with: {
      pemasok: true,
      jenisPangan: true,
    },
    orderBy: [desc(sppgPembelianBahan.tanggalPembelian), desc(sppgPembelianBahan.createdAt)]
  });

  return data.map(d => ({
    ...d,
    pemasokNama: d.pemasok?.namaPemasok,
    jenisPanganNama: d.jenisPangan?.namaBahan
  }));
}

// ==========================================
// 2. PEMAKAIAN BAHAN (OUTGOING STOCK)
// ==========================================
export async function createPemakaianBahan(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const data = {
      sppgId,
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      standarMenuId: formData.get('standarMenuId') ? parseInt(formData.get('standarMenuId') as string) : null,
      tanggalPemakaian: formData.get('tanggalPemakaian') as string,
      mingguKe: parseInt(formData.get('mingguKe') as string) || null,
      volume: formData.get('volume') as string,
      satuan: formData.get('satuan') as string || 'Kg',
      catatan: formData.get('catatan') as string || null,
    };

    await db.insert(sppgPemakaianBahan).values(data);
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Data pemakaian bahan berhasil dicatat.' };
  } catch (error: any) {
    console.error('Error createPemakaianBahan:', error);
    return { success: false, message: error.message || 'Gagal mencatat pemakaian bahan.' };
  }
}

export async function getPemakaianBahan(sppgId?: number) {
  const { sppgId: userSppgId, isAdmin } = await getSessionData();
  const targetSppgId = isAdmin ? sppgId : userSppgId;

  const whereClause = targetSppgId ? eq(sppgPemakaianBahan.sppgId, targetSppgId) : undefined;

  const data = await db.query.sppgPemakaianBahan.findMany({
    where: whereClause,
    with: {
      jenisPangan: true,
      standarMenuGizi: true,
    },
    orderBy: [desc(sppgPemakaianBahan.tanggalPemakaian), desc(sppgPemakaianBahan.createdAt)]
  });

  return data.map(d => ({
    ...d,
    jenisPanganNama: d.jenisPangan?.namaBahan,
    menuNama: d.standarMenuGizi?.namaMenu
  }));
}

// ==========================================
// 3. UJI RAPID TEST BAHAN SEGAR
// ==========================================
export async function createUjiRapidTest(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const data = {
      sppgId,
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      tanggalUji: formData.get('tanggalUji') as string,
      parameterUji: formData.get('parameterUji') as string,
      hasilUji: formData.get('hasilUji') as string,
      petugasPenguji: formData.get('petugasPenguji') as string,
      tindakanLanjut: formData.get('tindakanLanjut') as string || null,
    };

    await db.insert(sppgUjiRapidTest).values(data);
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Hasil uji rapid test berhasil disimpan.' };
  } catch (error: any) {
    console.error('Error createUjiRapidTest:', error);
    return { success: false, message: error.message || 'Gagal menyimpan uji rapid test.' };
  }
}

export async function getUjiRapidTest(sppgId?: number) {
  const { sppgId: userSppgId, isAdmin } = await getSessionData();
  const targetSppgId = isAdmin ? sppgId : userSppgId;

  const whereClause = targetSppgId ? eq(sppgUjiRapidTest.sppgId, targetSppgId) : undefined;

  const data = await db.query.sppgUjiRapidTest.findMany({
    where: whereClause,
    with: {
      jenisPangan: true,
    },
    orderBy: [desc(sppgUjiRapidTest.tanggalUji), desc(sppgUjiRapidTest.createdAt)]
  });

  return data.map(d => ({
    ...d,
    jenisPanganNama: d.jenisPangan?.namaBahan
  }));
}
