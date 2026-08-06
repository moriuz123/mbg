'use server';

import { db } from '@/db';
import { navigationMenu, siteSetting, pengumuman } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getNavigationMenus() {
  try {
    const menus = await db.query.navigationMenu.findMany({
      where: eq(navigationMenu.status, 'Aktif'),
      orderBy: (menu, { asc }) => [asc(menu.urutan)],
    });
    return menus;
  } catch (error) {
    console.error('Error fetching menus:', error);
    return [];
  }
}

export async function getSiteSettings() {
  try {
    const settings = await db.query.siteSetting.findMany();
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    return settingsMap;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function getPengumumanAktif() {
  try {
    const data = await db.query.pengumuman.findMany({
      where: eq(pengumuman.status, 'Aktif'),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
      with: {
        author: {
          columns: { name: true, role: true }
        },
        sppg: {
          columns: { namaSppg: true }
        }
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching pengumuman:', error);
    return [];
  }
}
