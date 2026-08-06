'use server';

import { db } from '@/db';
import { user, sekolah, posyandu, penggilingan, sppg } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUserList() {
  try {
    const list = await db.select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      sekolahId: user.sekolahId,
      posyanduId: user.posyanduId,
      penggilinganId: user.penggilinganId,
      sppgId: user.sppgId,
      sekolahName: sekolah.namaSekolah,
      posyanduName: posyandu.namaPosyandu,
      penggilinganName: penggilingan.namaPenggilingan,
      sppgName: sppg.namaSppg
    })
    .from(user)
    .leftJoin(sekolah, eq(user.sekolahId, sekolah.id))
    .leftJoin(posyandu, eq(user.posyanduId, posyandu.id))
    .leftJoin(penggilingan, eq(user.penggilinganId, penggilingan.id))
    .leftJoin(sppg, eq(user.sppgId, sppg.id))
    .orderBy(desc(user.createdAt));
    
    return list;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function getReferenceData() {
  const sekolahList = await db.select({ id: sekolah.id, nama: sekolah.namaSekolah }).from(sekolah);
  const posyanduList = await db.select({ id: posyandu.id, nama: posyandu.namaPosyandu }).from(posyandu);
  const penggilinganList = await db.select({ id: penggilingan.id, nama: penggilingan.namaPenggilingan }).from(penggilingan);
  const sppgList = await db.select({ id: sppg.id, nama: sppg.namaSppg }).from(sppg);

  return { sekolahList, posyanduList, penggilinganList, sppgList };
}

export async function updateUserRole(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const role = formData.get('role') as string;
    const sekolahId = formData.get('sekolahId') ? parseInt(formData.get('sekolahId') as string) : null;
    const posyanduId = formData.get('posyanduId') ? parseInt(formData.get('posyanduId') as string) : null;
    const penggilinganId = formData.get('penggilinganId') ? parseInt(formData.get('penggilinganId') as string) : null;
    const sppgId = formData.get('sppgId') ? parseInt(formData.get('sppgId') as string) : null;

    if (!id || !role) {
      return { success: false, message: 'Data tidak valid' };
    }

    await db.update(user)
      .set({ 
        role, 
        sekolahId: role === 'operator_sekolah' ? sekolahId : null,
        posyanduId: role === 'operator_posyandu' ? posyanduId : null,
        penggilinganId: role === 'operator_penggilingan' ? penggilinganId : null,
        sppgId: role === 'operator_sppg' ? sppgId : null,
        kecamatanId: null // We remove kecamatan role based on user requirement
      })
      .where(eq(user.id, id));

    revalidatePath('/admin/manajemen-user');
    return { success: true, message: 'Hak akses pengguna berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Gagal memperbarui data pengguna' };
  }
}
