'use server';

import { db } from '@/db';
import { posyandu, sppgLaporanAktifitas, posyanduLaporanAktifitas } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const posyanduId = session?.user?.posyanduId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, posyanduId, isAdmin };
}

export async function getPosyanduList() {
  try {
    const { isAdmin, posyanduId } = await getSessionData();

    if (!isAdmin) {
      if (!posyanduId) return [];
      const list = await db.select({
        id: posyandu.id,
        namaPosyandu: posyandu.namaPosyandu
      }).from(posyandu).where(eq(posyandu.id, posyanduId));
      return list;
    }

    const list = await db.select({
      id: posyandu.id,
      namaPosyandu: posyandu.namaPosyandu
    })
    .from(posyandu)
    .orderBy(posyandu.namaPosyandu);
    
    return list;
  } catch (error) {
    console.error('Error fetching posyandu:', error);
    return [];
  }
}

export async function getPendingPosyanduDeliveries(posyanduId: number) {
  try {
    const rawData = await db.query.sppgLaporanAktifitas.findMany({
      where: and(
        eq(sppgLaporanAktifitas.posyanduId, posyanduId),
        // To avoid showing already verified entries, 
        // normally we would filter status = 'Terkirim'
        eq(sppgLaporanAktifitas.status, 'Terkirim')
      ),
      with: {
        standarMenuGizi: true
      },
      orderBy: [desc(sppgLaporanAktifitas.tanggal)]
    });

    return rawData.map(l => ({
      id: l.id,
      tanggal: l.tanggal,
      menu: l.standarMenuGizi ? `${l.standarMenuGizi.namaMenu} (${l.standarMenuGizi.kaloriKkal || 0} Kkal)` : '-',
      jumlahPorsi: l.jumlahPorsi,
      status: l.status
    }));
  } catch (error) {
    console.error('Error fetching pending deliveries:', error);
    return [];
  }
}

export async function submitVerifikasiPosyandu(formData: FormData) {
  try {
    const sppgLaporanId = parseInt(formData.get('sppgLaporanId') as string);
    const posyanduId = parseInt(formData.get('posyanduId') as string);
    const statusDiterima = formData.get('statusDiterima') as string;
    const jumlahPorsiDiterima = parseInt(formData.get('jumlahPorsiDiterima') as string);
    const kondisiMakanan = formData.get('kondisiMakanan') as string;
    const diverifikasiOleh = formData.get('diverifikasiOleh') as string;
    const catatan = formData.get('catatan') as string;
    const foto = formData.get('foto') as File | null;

    if (!sppgLaporanId || !posyanduId) {
      return { success: false, message: 'Data tidak lengkap' };
    }

    const { isAdmin, posyanduId: userPosyanduId } = await getSessionData();
    if (!isAdmin) {
      if (posyanduId !== userPosyanduId) {
        return { success: false, message: 'Akses ditolak: Anda hanya dapat memverifikasi laporan untuk posyandu Anda sendiri' };
      }
    }

    let fotoDokumentasi = null;

    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `verifikasi-posyandu-${posyanduId}-${Date.now()}-${foto.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, buffer);
      fotoDokumentasi = `/uploads/${fileName}`;
    }

    await db.insert(posyanduLaporanAktifitas).values({
      sppgLaporanId,
      posyanduId,
      statusDiterima,
      jumlahPorsiDiterima,
      kondisiMakanan,
      diverifikasiOleh,
      catatan,
      fotoDokumentasi
    });

    let finalStatus = 'Diterima';
    if (statusDiterima === 'Ditolak' || kondisiMakanan === 'Rusak' || kondisiMakanan === 'Basi') {
      finalStatus = 'Bermasalah';
    }

    await db.update(sppgLaporanAktifitas)
      .set({ status: finalStatus })
      .where(eq(sppgLaporanAktifitas.id, sppgLaporanId));

    revalidatePath('/');
    revalidatePath('/admin/verifikasi');
    
    return { success: true, message: 'Verifikasi berhasil disimpan' };
  } catch (error) {
    console.error('Error submitting verification:', error);
    return { success: false, message: 'Terjadi kesalahan sistem' };
  }
}
