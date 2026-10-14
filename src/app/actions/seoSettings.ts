'use server';

import { db } from '@/db';
import { siteSetting } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export interface SeoSettingsMap {
  seo_meta_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
  seo_canonical_url: string;
  seo_author: string;
  seo_publisher: string;
  seo_og_title: string;
  seo_og_description: string;
  seo_og_image: string;
  seo_twitter_card: string;
  seo_twitter_handle: string;
  seo_robots_index: string;
  seo_google_verification: string;
  seo_bing_verification: string;
  seo_google_analytics_id: string;
  seo_show_visitor_counter: string;
}

const DEFAULT_SEO_SETTINGS: SeoSettingsMap = {
  seo_meta_title: 'Sistem Digitalisasi Supply Chain MBG - Pemerintah Kabupaten Lebak',
  seo_meta_description: 'Portal resmi Sistem Digitalisasi Supply Chain Program Makan Bergizi Gratis (MBG) Pemerintah Kabupaten Lebak. Transparansi pasokan bahan pangan lokal, pemantauan dapur SPPG, dan distribusi gizi.',
  seo_meta_keywords: 'MBG Lebak, Makan Bergizi Gratis, Supply Chain MBG, Ketahanan Pangan Lebak, SPPG Lebak, Distribusi Pangan Lebak, Pemkab Lebak',
  seo_canonical_url: 'https://sdsuci.lebakkab.go.id',
  seo_author: 'Dinas Ketahanan Pangan Kabupaten Lebak',
  seo_publisher: 'Pemerintah Kabupaten Lebak',
  seo_og_title: 'Sistem Digitalisasi Supply Chain MBG - Pemkab Lebak',
  seo_og_description: 'Transparansi pasokan bahan pangan lokal, pemantauan dapur SPPG, dan distribusi gizi sekolah & posyandu Kabupaten Lebak.',
  seo_og_image: '/LOGO-LEBAK.png',
  seo_twitter_card: 'summary_large_image',
  seo_twitter_handle: '@pemkablebak',
  seo_robots_index: 'index, follow',
  seo_google_verification: '',
  seo_bing_verification: '',
  seo_google_analytics_id: '',
  seo_show_visitor_counter: 'true',
};

export async function getSeoSettings(): Promise<SeoSettingsMap> {
  try {
    const keys = Object.keys(DEFAULT_SEO_SETTINGS);
    const rows = await db
      .select({
        key: siteSetting.key,
        value: siteSetting.value,
      })
      .from(siteSetting)
      .where(inArray(siteSetting.key, keys));

    const result: SeoSettingsMap = { ...DEFAULT_SEO_SETTINGS };
    for (const row of rows) {
      if (row.key in result) {
        (result as any)[row.key] = row.value || '';
      }
    }
    return result;
  } catch (error) {
    console.error('[GET_SEO_SETTINGS_ERROR]', error);
    return DEFAULT_SEO_SETTINGS;
  }
}

export async function updateSeoSettings(data: Partial<SeoSettingsMap>): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin' || role === 'admin_dinas' || role === 'super_admin';
  if (!isAdmin) {
    throw new Error('Unauthorized');
  }

  const entries = Object.entries(data);

  await Promise.all(
    entries.map(([key, value]) =>
      db
        .insert(siteSetting)
        .values({
          key,
          value: value ?? '',
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: siteSetting.key,
          set: {
            value: value ?? '',
            updatedAt: new Date(),
          },
        })
    )
  );

  revalidatePath('/', 'layout');
}
