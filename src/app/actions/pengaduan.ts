'use server';

import { db } from '@/db';
import { pengaduan, sppg, sekolah } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPengaduanList() {
  try {
    const list = await db.select({
      id: pengaduan.id,
      namaPelapor: pengaduan.namaPelapor,
      kontak: pengaduan.kontak,
      isiPengaduan: pengaduan.isiPengaduan,
      status: pengaduan.status,
      tanggal: pengaduan.tanggal,
      tanggapan: pengaduan.tanggapan,
      sppgName: sppg.namaSppg,
      sekolahName: sekolah.namaSekolah
    })
    .from(pengaduan)
    .leftJoin(sppg, eq(pengaduan.sppgId, sppg.id))
    .leftJoin(sekolah, eq(pengaduan.sekolahId, sekolah.id))
    .orderBy(desc(pengaduan.tanggal));
    
    return list;
  } catch (error) {
    console.error('Error fetching pengaduan:', error);
    return [];
  }
}

export async function submitTanggapan(formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string);
    const tanggapan = formData.get('tanggapan') as string;
    const status = formData.get('status') as string;

    if (!id || !tanggapan) {
      return { success: false, message: 'Data tidak valid' };
    }

    await db.update(pengaduan)
      .set({ tanggapan, status })
      .where(eq(pengaduan.id, id));

    revalidatePath('/admin/pengaduan');
    return { success: true, message: 'Tanggapan berhasil disimpan' };
  } catch (error) {
    console.error('Error saving tanggapan:', error);
    return { success: false, message: 'Gagal menyimpan tanggapan' };
  }
}

export async function submitPengaduanPublic(formData: FormData) {
  try {
    const namaPelapor = formData.get('namaPelapor') as string || 'Anonim';
    const kontak = formData.get('kontak') as string || null;
    const isiPengaduan = formData.get('isiPengaduan') as string;
    const targetType = formData.get('targetType') as string; // 'sekolah' or 'sppg' or 'lainnya'
    const targetId = formData.get('targetId') ? parseInt(formData.get('targetId') as string) : null;

    if (!isiPengaduan) {
      return { success: false, message: 'Isi aduan tidak boleh kosong' };
    }

    await db.insert(pengaduan).values({
      namaPelapor,
      kontak,
      isiPengaduan,
      sppgId: targetType === 'sppg' ? targetId : null,
      sekolahId: targetType === 'sekolah' ? targetId : null,
      status: 'Baru',
      tanggal: new Date()
    });

    revalidatePath('/admin/pengaduan');
    return { success: true, message: 'Terima kasih, laporan/aduan Anda telah berhasil dikirim' };
  } catch (error) {
    console.error('Error submitting pengaduan:', error);
    return { success: false, message: 'Gagal mengirim laporan. Silakan coba lagi.' };
  }
}

export async function getPublicTargets() {
  const sekolahList = await db.select({ id: sekolah.id, nama: sekolah.namaSekolah }).from(sekolah).orderBy(sekolah.namaSekolah);
  const sppgList = await db.select({ id: sppg.id, nama: sppg.namaSppg }).from(sppg).orderBy(sppg.namaSppg);
  return { sekolahList, sppgList };
}
