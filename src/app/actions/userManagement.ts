'use server';

import { db } from '@/db';
import { user, account, sekolah, posyandu, penggilingan, sppg } from '@/db/schema';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUserList() {
  try {
    const list = await db.select({
      id: user.id,
      name: user.name,
      username: user.username,
      displayUsername: user.displayUsername,
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




export async function createUserByAdmin(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const username = (formData.get('username') as string)?.trim().toLowerCase();
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const sekolahId = formData.get('sekolahId') ? parseInt(formData.get('sekolahId') as string) : null;
    const posyanduId = formData.get('posyanduId') ? parseInt(formData.get('posyanduId') as string) : null;
    const penggilinganId = formData.get('penggilinganId') ? parseInt(formData.get('penggilinganId') as string) : null;
    const sppgId = formData.get('sppgId') ? parseInt(formData.get('sppgId') as string) : null;

    if (!name || !username || !password || !role) {
      return { success: false, message: 'Data tidak lengkap' };
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      return { success: false, message: 'Username hanya boleh huruf kecil, angka, dan underscore' };
    }

    // Check if username exists
    const existing = await db.select({ id: user.id }).from(user).where(eq(user.username, username));
    if (existing.length > 0) {
      return { success: false, message: 'Username sudah digunakan' };
    }

    const newUserId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const dummyEmail = `${username}@internal.mbg.local`;

    await db.insert(user).values({
      id: newUserId,
      name,
      email: dummyEmail,
      username,
      displayUsername: username,
      role,
      emailVerified: true,
      sekolahId: role === 'operator_sekolah' ? sekolahId : null,
      posyanduId: role === 'operator_posyandu' ? posyanduId : null,
      penggilinganId: role === 'operator_penggilingan' ? penggilinganId : null,
      sppgId: role === 'operator_sppg' ? sppgId : null,
    });

    // accountId harus username agar better-auth signIn.username() bisa match
    await db.insert(account).values({
      id: uuidv4(),
      userId: newUserId,
      providerId: 'credential',
      accountId: username,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    revalidatePath('/admin/manajemen-user');
    return { success: true, message: `Pengguna @${username} berhasil dibuat` };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Gagal membuat pengguna baru' };
  }
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
