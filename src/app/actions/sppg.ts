'use server';

import { db } from "@/db";
import { sppg, sppgPenerimaManfaat, sekolahPenerimaanMbg } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSppg() {
  return await db.query.sppg.findMany({
    orderBy: [desc(sppg.createdAt)],
  });
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
  try {
    await db.insert(sppg).values(data);
    revalidatePath('/admin/sppg');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal membuat SPPG' };
  }
}

export async function deleteSppg(id: number) {
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

export async function assignSekolahToSppg(data: { sppgId: number, sekolahId: number, jumlahLaki: number, jumlahPerempuan: number, tahunAjaran: string, tanggalMulai: string }) {
  try {
    // 1. Insert ke sppg_penerima_manfaat (aktif)
    await db.insert(sppgPenerimaManfaat).values({
      sppgId: data.sppgId,
      sekolahId: data.sekolahId,
      tahunAjaran: data.tahunAjaran,
      jumlahLaki: data.jumlahLaki,
      jumlahPerempuan: data.jumlahPerempuan,
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
