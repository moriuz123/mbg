'use server';

import { db } from '@/db';
import { pengumuman, siteSetting, navigationMenu } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function createPengumuman(data: { judul: string; isi: string }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error('Unauthorized');

  const role = session.user.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin' && role !== 'operator_sppg') {
    throw new Error('Forbidden');
  }

  await db.insert(pengumuman).values({
    judul: data.judul,
    isi: data.isi,
    authorId: session.user.id,
    sppgId: role === 'operator_sppg' ? session.user.sppgId : null,
    status: 'Aktif'
  });

  revalidatePath('/');
  revalidatePath('/admin/pengumuman');
}

export async function updateSiteSetting(key: string, value: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  await db.insert(siteSetting).values({ key, value }).onConflictDoUpdate({
    target: siteSetting.key,
    set: { value, updatedAt: new Date() }
  });

  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs');
}

export async function updateSiteSettingsBulk(settingsData: Record<string, string>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  const promises = Object.entries(settingsData).map(([key, value]) => 
    db.insert(siteSetting).values({ key, value }).onConflictDoUpdate({
      target: siteSetting.key,
      set: { value, updatedAt: new Date() }
    })
  );

  await Promise.all(promises);
  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs/umum');
}

export async function addMenu(data: { name: string; url: string; urutan: number }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  await db.insert(navigationMenu).values(data);
  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs');
}

export async function deleteMenu(id: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  await db.delete(navigationMenu).where(eq(navigationMenu.id, id));
  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs');
}

export async function updateMenu(id: number, data: { name: string; url: string; urutan: number }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  await db.update(navigationMenu).set(data).where(eq(navigationMenu.id, id));
  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs');
}

export async function updateMenuStatus(id: number, status: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = session?.user?.role as string;
  if (role !== 'admin' && role !== 'admin_dinas' && role !== 'super_admin') throw new Error('Forbidden');

  await db.update(navigationMenu).set({ status }).where(eq(navigationMenu.id, id));
  revalidatePath('/');
  revalidatePath('/admin/pengaturan-situs');
}
