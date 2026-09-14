'use server';

import { db } from '@/db';
import { sekolah, sppgLaporanAktifitas, sekolahLaporanAktifitas } from '@/db/schema';
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
  const sekolahId = session?.user?.sekolahId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, sekolahId, isAdmin };
}

// Fetch all schools for the dropdown
export async function getSekolahList() {
  try {
    const { isAdmin, sekolahId } = await getSessionData();

    if (!isAdmin) {
      if (!sekolahId) return [];
      const list = await db.select({
        id: sekolah.id,
        namaSekolah: sekolah.namaSekolah
      }).from(sekolah).where(eq(sekolah.id, sekolahId));
      return list;
    }

    const list = await db.select({
      id: sekolah.id,
      namaSekolah: sekolah.namaSekolah
    })
    .from(sekolah)
    .orderBy(sekolah.namaSekolah);
    
    return list;
  } catch (error) {
    console.error('Error fetching schools:', error);
    return [];
  }
}

// Fetch pending deliveries for a specific school
export async function getPendingDeliveries(sekolahId: number) {
  try {
    const rawData = await db.query.sppgLaporanAktifitas.findMany({
      where: and(
        eq(sppgLaporanAktifitas.sekolahId, sekolahId),
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

// Submit verification
export async function submitVerifikasiSekolah(formData: FormData) {
  try {
    const sppgLaporanId = parseInt(formData.get('sppgLaporanId') as string);
    const sekolahId = parseInt(formData.get('sekolahId') as string);
    const statusDiterima = formData.get('statusDiterima') as string;
    const jumlahPorsiDiterima = parseInt(formData.get('jumlahPorsiDiterima') as string);
    const kondisiMakanan = formData.get('kondisiMakanan') as string;
    const diverifikasiOleh = formData.get('diverifikasiOleh') as string;
    const catatan = formData.get('catatan') as string;
    const foto = formData.get('foto') as File | null;

    if (!sppgLaporanId || !sekolahId) {
      return { success: false, message: 'Data tidak lengkap' };
    }

    const { isAdmin, sekolahId: userSekolahId } = await getSessionData();
    if (!isAdmin) {
      if (sekolahId !== userSekolahId) {
        return { success: false, message: 'Akses ditolak: Anda hanya dapat memverifikasi laporan untuk sekolah Anda sendiri' };
      }
    }

    let fotoDokumentasi: string | null = null;

    // Handle file upload if present
    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `verifikasi-${sekolahId}-${Date.now()}-${foto.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, buffer);
      fotoDokumentasi = `/uploads/${fileName}`;
    }

    // 1. Insert verification record
    await db.insert(sekolahLaporanAktifitas).values({
      sppgLaporanId,
      sekolahId,
      statusDiterima,
      jumlahPorsiDiterima,
      kondisiMakanan,
      diverifikasiOleh,
      catatan,
      fotoDokumentasi
    });

    // 2. Update the original SPPG report status
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

// Fetch verified deliveries (History)
export async function getVerifiedDeliveries(sekolahId: number) {
  try {
    const rawData = await db.query.sekolahLaporanAktifitas.findMany({
      where: eq(sekolahLaporanAktifitas.sekolahId, sekolahId),
      with: {
        laporanSppg: {
          with: {
            standarMenuGizi: true
          }
        }
      },
      orderBy: [desc(sekolahLaporanAktifitas.tanggalDiterima)]
    });

    return rawData.map(l => ({
      id: l.id,
      sppgLaporanId: l.laporanSppgId,
      tanggal: l.laporanSppg?.tanggal,
      menu: l.laporanSppg?.standarMenuGizi ? `${l.laporanSppg.standarMenuGizi.namaMenu} (${l.laporanSppg.standarMenuGizi.kaloriKkal || 0} Kkal)` : '-',
      jumlahPorsiAsli: l.laporanSppg?.jumlahPorsi,
      jumlahPorsiDiterima: l.jumlahPorsiDiterima,
      statusDiterima: l.statusDiterima,
      kondisiMakanan: l.kondisiMakanan,
      diverifikasiOleh: l.diverifikasiOleh,
      catatan: l.catatan
    }));
  } catch (error) {
    console.error('Error fetching verified deliveries:', error);
    return [];
  }
}

// Update verification
export async function updateVerifikasiSekolah(formData: FormData) {
  try {
    const verifikasiId = parseInt(formData.get('verifikasiId') as string);
    const sppgLaporanId = parseInt(formData.get('sppgLaporanId') as string);
    const sekolahId = parseInt(formData.get('sekolahId') as string);
    const statusDiterima = formData.get('statusDiterima') as string;
    const jumlahPorsiDiterima = parseInt(formData.get('jumlahPorsiDiterima') as string);
    const kondisiMakanan = formData.get('kondisiMakanan') as string;
    const diverifikasiOleh = formData.get('diverifikasiOleh') as string;
    const catatan = formData.get('catatan') as string;
    const foto = formData.get('foto') as File | null;

    if (!verifikasiId || !sppgLaporanId || !sekolahId) {
      return { success: false, message: 'Data tidak lengkap' };
    }

    const { isAdmin, sekolahId: userSekolahId } = await getSessionData();
    if (!isAdmin) {
      if (sekolahId !== userSekolahId) {
        return { success: false, message: 'Akses ditolak: Anda hanya dapat mengubah laporan untuk sekolah Anda sendiri' };
      }
    }

    let fotoDokumentasi: string | undefined = undefined;

    // Handle file upload if present
    if (foto && foto.size > 0) {
      const buffer = Buffer.from(await foto.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `verifikasi-${sekolahId}-${Date.now()}-${foto.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, buffer);
      fotoDokumentasi = `/uploads/${fileName}`;
    }

    // 1. Update verification record
    const updatePayload: any = {
      statusDiterima,
      jumlahPorsiDiterima,
      kondisiMakanan,
      diverifikasiOleh,
      catatan
    };
    if (fotoDokumentasi) {
      updatePayload.fotoDokumentasi = fotoDokumentasi;
    }

    await db.update(sekolahLaporanAktifitas)
      .set(updatePayload)
      .where(eq(sekolahLaporanAktifitas.id, verifikasiId));

    // 2. Update the original SPPG report status
    let finalStatus = 'Diterima';
    if (statusDiterima === 'Ditolak' || kondisiMakanan === 'Rusak' || kondisiMakanan === 'Basi') {
      finalStatus = 'Bermasalah';
    }

    await db.update(sppgLaporanAktifitas)
      .set({ status: finalStatus })
      .where(eq(sppgLaporanAktifitas.id, sppgLaporanId));

    revalidatePath('/');
    revalidatePath('/admin/verifikasi');
    
    return { success: true, message: 'Verifikasi berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating verification:', error);
    return { success: false, message: 'Terjadi kesalahan sistem' };
  }
}
