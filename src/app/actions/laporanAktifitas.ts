'use server';

import { db } from '@/db';
import { sppgLaporanAktifitas, standarMenuGizi, sekolah, posyandu, sppg, sppgPenerimaManfaat, sppgPosyanduManfaat } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq, inArray, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const sppgId = session?.user?.sppgId ? Number(session.user.sppgId) : undefined;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, sppgId, isAdmin };
}

export async function createLaporanAktifitas(formData: FormData) {
  try {
    const { isAdmin, sppgId: userSppgId } = await getSessionData();
    const tanggal = formData.get('tanggal') as string;
    let sppgId = parseInt(formData.get('sppgId') as string);
    const tujuanTipe = formData.get('tujuanTipe') as string;
    const sekolahId = formData.get('sekolahId') ? parseInt(formData.get('sekolahId') as string) : null;
    const posyanduId = formData.get('posyanduId') ? parseInt(formData.get('posyanduId') as string) : null;
    const menuId = parseInt(formData.get('menuId') as string);
    const jumlahPorsi = parseInt(formData.get('jumlahPorsi') as string);

    // SECURITY CHECK: If not admin, override sppgId with user's own sppgId
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Akun Anda tidak tertaut dengan SPPG manapun' };
      sppgId = userSppgId;
    }
    
    // Ensure the menu exists
    const menuRecord = await db.query.standarMenuGizi.findFirst({
      where: eq(standarMenuGizi.id, menuId)
    });

    if (!menuRecord) {
      return { success: false, message: 'Menu tidak ditemukan' };
    }

    if (tujuanTipe === 'Posyandu' && posyanduId) {
      await db.insert(sppgLaporanAktifitas).values({
        sppgId,
        posyanduId,
        tanggal,
        standarMenuId: menuId,
        jumlahPorsi,
        status: 'Terkirim'
      });
    } else if (tujuanTipe === 'Sekolah' && sekolahId) {
      await db.insert(sppgLaporanAktifitas).values({
        sppgId,
        sekolahId,
        tanggal,
        standarMenuId: menuId,
        jumlahPorsi,
        status: 'Terkirim'
      });
    } else {
      return { success: false, message: 'Tujuan (Sekolah/Posyandu) tidak valid' };
    }

    revalidatePath('/admin/laporan-aktifitas');
    revalidatePath('/');
    return { success: true, message: 'Laporan berhasil dibuat' };
  } catch (error) {
    console.error('Error creating laporan:', error);
    return { success: false, message: 'Gagal membuat laporan' };
  }
}

export async function getDropdownData() {
  const { isAdmin, sppgId: userSppgId } = await getSessionData();

  let sppgList;
  let sekolahList;
  let posyanduList;

  if (isAdmin) {
    sppgList = await db.select({ id: sppg.id, nama: sppg.namaSppg }).from(sppg);
    sekolahList = await db.select({ id: sekolah.id, nama: sekolah.namaSekolah }).from(sekolah);
    posyanduList = await db.select({ id: posyandu.id, nama: posyandu.namaPosyandu }).from(posyandu);
  } else {
    // If SPPG operator, only return their own SPPG
    if (!userSppgId) {
      return { sppgList: [], sekolahList: [], posyanduList: [], menuList: [] };
    }
    sppgList = await db.select({ id: sppg.id, nama: sppg.namaSppg })
      .from(sppg)
      .where(eq(sppg.id, userSppgId));
      
    // Fetch only schools assigned to this SPPG
    const assignedSekolah = await db.select({ sekolahId: sppgPenerimaManfaat.sekolahId })
      .from(sppgPenerimaManfaat)
      .where(eq(sppgPenerimaManfaat.sppgId, userSppgId));
    
    if (assignedSekolah.length > 0) {
      const assignedIds = assignedSekolah.map(a => a.sekolahId).filter(id => id !== null) as number[];
      sekolahList = await db.select({ id: sekolah.id, nama: sekolah.namaSekolah })
        .from(sekolah)
        .where(inArray(sekolah.id, assignedIds));
    } else {
      sekolahList = [];
    }

    // Fetch only posyandu assigned to this SPPG
    const assignedPosyandu = await db.select({ posyanduId: sppgPosyanduManfaat.posyanduId })
      .from(sppgPosyanduManfaat)
      .where(eq(sppgPosyanduManfaat.sppgId, userSppgId));
    
    if (assignedPosyandu.length > 0) {
      const assignedIds = assignedPosyandu.map(a => a.posyanduId).filter(id => id !== null) as number[];
      posyanduList = await db.select({ id: posyandu.id, nama: posyandu.namaPosyandu })
        .from(posyandu)
        .where(inArray(posyandu.id, assignedIds));
    } else {
      posyanduList = [];
    }
  }

  const menuList = await db.select({ 
    id: standarMenuGizi.id, 
    nama: standarMenuGizi.namaMenu,
    kalori: standarMenuGizi.kaloriKkal
  }).from(standarMenuGizi)
  .where(
    sql`${standarMenuGizi.status} = 'Aktif' 
    AND (${isAdmin} 
      OR ${standarMenuGizi.sppgId} IS NULL 
      OR ${standarMenuGizi.sppgId} = ${userSppgId || null})`
  );

  return { sppgList, sekolahList, posyanduList, menuList, userSppgId, isAdmin };
}
