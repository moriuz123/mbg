'use server';

import { db } from '@/db';
import { standarMenuGizi, kategoriPenerima, standarKecukupanGizi } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getStandarMenu(userSppgId?: number | null) {
  try {
    const list = await db.select({
      id: standarMenuGizi.id,
      namaMenu: standarMenuGizi.namaMenu,
      deskripsi: standarMenuGizi.deskripsi,
      jenisMakan: standarMenuGizi.jenisMakan,
      kaloriKkal: standarMenuGizi.kaloriKkal,
      proteinGram: standarMenuGizi.proteinGram,
      karbohidratGram: standarMenuGizi.karbohidratGram,
      lemakGram: standarMenuGizi.lemakGram,
      status: standarMenuGizi.status,
      kategoriTargetId: standarMenuGizi.kategoriTargetId,
      sppgId: standarMenuGizi.sppgId,
      kategoriNama: kategoriPenerima.namaKategori
    })
    .from(standarMenuGizi)
    .leftJoin(kategoriPenerima, eq(standarMenuGizi.kategoriTargetId, kategoriPenerima.id))
    .where(userSppgId ? sql`${standarMenuGizi.sppgId} IS NULL OR ${standarMenuGizi.sppgId} = ${userSppgId}` : undefined)
    .orderBy(standarMenuGizi.namaMenu);
    
    return list;
  } catch (error) {
    console.error('Error fetching standar menu:', error);
    return [];
  }
}

export async function getKategoriPenerima() {
  try {
    return await db.select().from(kategoriPenerima).orderBy(kategoriPenerima.urutan);
  } catch (error) {
    console.error('Error fetching kategori:', error);
    return [];
  }
}

export async function getAKGList() {
  try {
    return await db.select().from(standarKecukupanGizi);
  } catch (error) {
    console.error('Error fetching AKG list:', error);
    return [];
  }
}

export async function saveStandarMenu(formData: FormData) {
  try {
    const { auth } = await import('@/lib/auth');
    const { headers } = await import('next/headers');
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userSppgId = session?.user?.sppgId ? Number(session.user.sppgId) : undefined;
    const userRole = session?.user?.role;
    const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin' || userRole === 'admin';

    const id = formData.get('id') ? parseInt(formData.get('id') as string) : null;
    const namaMenu = formData.get('namaMenu') as string;
    const deskripsi = formData.get('deskripsi') as string;
    const jenisMakan = formData.get('jenisMakan') as string || 'Siang';
    const kaloriKkal = formData.get('kaloriKkal') ? parseInt(formData.get('kaloriKkal') as string) : null;
    const proteinGram = formData.get('proteinGram') ? formData.get('proteinGram') as string : null;
    const karbohidratGram = formData.get('karbohidratGram') ? formData.get('karbohidratGram') as string : null;
    const lemakGram = formData.get('lemakGram') ? formData.get('lemakGram') as string : null;
    const kategoriTargetId = formData.get('kategoriTargetId') ? parseInt(formData.get('kategoriTargetId') as string) : null;
    const status = formData.get('status') as string || 'Aktif';

    if (id) {
      // Update
      await db.update(standarMenuGizi)
        .set({
          namaMenu, deskripsi, jenisMakan, kaloriKkal, proteinGram, karbohidratGram, lemakGram, kategoriTargetId, status
        })
        .where(eq(standarMenuGizi.id, id));
    } else {
      // Insert
      await db.insert(standarMenuGizi).values({
        namaMenu, deskripsi, jenisMakan, kaloriKkal, proteinGram, karbohidratGram, lemakGram, kategoriTargetId, status, sppgId: isAdmin ? null : (userSppgId || null)
      });
    }

    revalidatePath('/admin/standar-menu');
    return { success: true, message: 'Data menu gizi berhasil disimpan' };
  } catch (error) {
    console.error('Error saving menu:', error);
    return { success: false, message: 'Gagal menyimpan data menu' };
  }
}

export async function deleteStandarMenu(id: number) {
  try {
    await db.delete(standarMenuGizi).where(eq(standarMenuGizi.id, id));
    revalidatePath('/admin/standar-menu');
    return { success: true, message: 'Data menu berhasil dihapus' };
  } catch (error) {
    console.error('Error deleting menu:', error);
    return { success: false, message: 'Gagal menghapus data menu' };
  }
}
