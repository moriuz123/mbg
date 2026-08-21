'use server';

import { db } from '@/db';
import { standarKecukupanGizi, kategoriPenerima } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAKGData() {
  const data = await db.select({
    id: standarKecukupanGizi.id,
    kategoriId: standarKecukupanGizi.kategoriId,
    kategoriNama: kategoriPenerima.namaKategori,
    jenisMakan: standarKecukupanGizi.jenisMakan,
    minEnergiKkal: standarKecukupanGizi.minEnergiKkal,
    maxEnergiKkal: standarKecukupanGizi.maxEnergiKkal,
    minProteinGram: standarKecukupanGizi.minProteinGram,
    maxProteinGram: standarKecukupanGizi.maxProteinGram,
    minLemakGram: standarKecukupanGizi.minLemakGram,
    maxLemakGram: standarKecukupanGizi.maxLemakGram,
    minKarbohidratGram: standarKecukupanGizi.minKarbohidratGram,
    maxKarbohidratGram: standarKecukupanGizi.maxKarbohidratGram,
  })
  .from(standarKecukupanGizi)
  .leftJoin(kategoriPenerima, eq(standarKecukupanGizi.kategoriId, kategoriPenerima.id));
  return data;
}

export async function getKategoriList() {
  return await db.select().from(kategoriPenerima);
}

export async function saveAKG(formData: FormData) {
  try {
    const id = formData.get('id') ? parseInt(formData.get('id') as string) : null;
    const kategoriId = parseInt(formData.get('kategoriId') as string);
    const jenisMakan = formData.get('jenisMakan') as string;
    const minEnergiKkal = formData.get('minEnergiKkal') as string;
    const maxEnergiKkal = formData.get('maxEnergiKkal') as string;
    const minProteinGram = formData.get('minProteinGram') as string;
    const maxProteinGram = formData.get('maxProteinGram') as string;
    const minLemakGram = formData.get('minLemakGram') as string;
    const maxLemakGram = formData.get('maxLemakGram') as string;
    const minKarbohidratGram = formData.get('minKarbohidratGram') as string;
    const maxKarbohidratGram = formData.get('maxKarbohidratGram') as string;

    const values = {
      kategoriId, jenisMakan, minEnergiKkal, maxEnergiKkal, minProteinGram, maxProteinGram, minLemakGram, maxLemakGram, minKarbohidratGram, maxKarbohidratGram
    };

    if (id) {
      await db.update(standarKecukupanGizi).set(values).where(eq(standarKecukupanGizi.id, id));
    } else {
      await db.insert(standarKecukupanGizi).values(values);
    }
    revalidatePath('/admin/master-data/akg');
    return { success: true, message: 'Data AKG berhasil disimpan' };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Gagal menyimpan data AKG' };
  }
}

export async function deleteAKG(id: number) {
  try {
    await db.delete(standarKecukupanGizi).where(eq(standarKecukupanGizi.id, id));
    revalidatePath('/admin/master-data/akg');
    return { success: true, message: 'Data berhasil dihapus' };
  } catch (error) {
    return { success: false, message: 'Gagal menghapus data' };
  }
}
