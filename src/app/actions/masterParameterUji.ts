'use server';

import { db } from '@/db';
import { masterParameterUji } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function checkAdminAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { isAdmin, session };
}

// 1. Get List
export async function getMasterParameterUjiList() {
  const list = await db.query.masterParameterUji.findMany({
    orderBy: [desc(masterParameterUji.createdAt), desc(masterParameterUji.id)],
  });

  // Auto seed jika data masih kosong
  if (list.length === 0) {
    await seedDefaultParameterUji();
    return await db.query.masterParameterUji.findMany({
      orderBy: [desc(masterParameterUji.createdAt), desc(masterParameterUji.id)],
    });
  }

  return list;
}

// 2. Create Parameter Uji
export async function createMasterParameterUji(formData: FormData) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) return { success: false, message: 'Akses ditolak. Membutuhkan hak akses Admin.' };

    const namaParameter = formData.get('namaParameter') as string;
    const kategori = (formData.get('kategori') as string) || 'Kimia';
    const satuan = (formData.get('satuan') as string) || null;
    const ambangBatas = (formData.get('ambangBatas') as string) || null;
    const deskripsi = (formData.get('deskripsi') as string) || null;
    const statusAktif = formData.get('statusAktif') === 'true';

    if (!namaParameter || !namaParameter.trim()) {
      return { success: false, message: 'Nama parameter uji wajib diisi.' };
    }

    await db.insert(masterParameterUji).values({
      namaParameter: namaParameter.trim(),
      kategori: kategori.trim(),
      satuan: satuan ? satuan.trim() : null,
      ambangBatas: ambangBatas ? ambangBatas.trim() : null,
      deskripsi: deskripsi ? deskripsi.trim() : null,
      statusAktif,
    });

    revalidatePath('/admin/master-data/parameter-uji');
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Master parameter uji berhasil ditambahkan.' };
  } catch (error: any) {
    console.error('Error createMasterParameterUji:', error);
    return { success: false, message: error.message || 'Gagal menambahkan master parameter uji.' };
  }
}

// 3. Update Parameter Uji
export async function updateMasterParameterUji(id: number, formData: FormData) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) return { success: false, message: 'Akses ditolak. Membutuhkan hak akses Admin.' };

    const namaParameter = formData.get('namaParameter') as string;
    const kategori = (formData.get('kategori') as string) || 'Kimia';
    const satuan = (formData.get('satuan') as string) || null;
    const ambangBatas = (formData.get('ambangBatas') as string) || null;
    const deskripsi = (formData.get('deskripsi') as string) || null;
    const statusAktif = formData.get('statusAktif') === 'true';

    if (!namaParameter || !namaParameter.trim()) {
      return { success: false, message: 'Nama parameter uji wajib diisi.' };
    }

    await db.update(masterParameterUji)
      .set({
        namaParameter: namaParameter.trim(),
        kategori: kategori.trim(),
        satuan: satuan ? satuan.trim() : null,
        ambangBatas: ambangBatas ? ambangBatas.trim() : null,
        deskripsi: deskripsi ? deskripsi.trim() : null,
        statusAktif,
      })
      .where(eq(masterParameterUji.id, id));

    revalidatePath('/admin/master-data/parameter-uji');
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Master parameter uji berhasil diperbarui.' };
  } catch (error: any) {
    console.error('Error updateMasterParameterUji:', error);
    return { success: false, message: error.message || 'Gagal memperbarui master parameter uji.' };
  }
}

// 4. Toggle Status Aktif
export async function toggleStatusParameterUji(id: number, currentStatus: boolean) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

    await db.update(masterParameterUji)
      .set({ statusAktif: !currentStatus })
      .where(eq(masterParameterUji.id, id));

    revalidatePath('/admin/master-data/parameter-uji');
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Status parameter uji berhasil diubah.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal mengubah status parameter.' };
  }
}

// 5. Delete Parameter Uji
export async function deleteMasterParameterUji(id: number) {
  try {
    const { isAdmin } = await checkAdminAuth();
    if (!isAdmin) return { success: false, message: 'Akses ditolak.' };

    await db.delete(masterParameterUji).where(eq(masterParameterUji.id, id));

    revalidatePath('/admin/master-data/parameter-uji');
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Master parameter uji berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus master parameter uji.' };
  }
}

// 6. Seed Default Standard Parameters
export async function seedDefaultParameterUji() {
  const defaults = [
    {
      namaParameter: 'Formalin',
      kategori: 'Kimia',
      satuan: 'mg/L (PPM)',
      ambangBatas: '0 mg/L (Bebas)',
      deskripsi: 'Pengawet mayat/industri berbahaya yang sering disalahgunakan pada ikan/tahu/mie.',
      statusAktif: true,
    },
    {
      namaParameter: 'Boraks (Asam Borat)',
      kategori: 'Kimia',
      satuan: 'mg/L (PPM)',
      ambangBatas: '0 mg/L (Bebas)',
      deskripsi: 'Bahan pengenyal non-pangan beracun untuk bakso/kerupuk.',
      statusAktif: true,
    },
    {
      namaParameter: 'Escherichia coli (E. Coli)',
      kategori: 'Mikrobiologi',
      satuan: 'APM/g',
      ambangBatas: '< 3 APM/g',
      deskripsi: 'Bakteri indikator kontaminasi fekal pada air limbah atau kebersihan olahan.',
      statusAktif: true,
    },
    {
      namaParameter: 'Salmonella sp.',
      kategori: 'Mikrobiologi',
      satuan: 'Deteksi /25g',
      ambangBatas: 'Negatif / 25 gram',
      deskripsi: 'Bakteri penyebab tifus dan keracunan makanan akut pada unggas/daging.',
      statusAktif: true,
    },
    {
      namaParameter: 'Residu Pestisida (Organofosfat)',
      kategori: 'Kimia',
      satuan: 'mg/kg',
      ambangBatas: '< 0.01 mg/kg',
      deskripsi: 'Sisa racun hama pada buah dan sayuran segar.',
      statusAktif: true,
    },
    {
      namaParameter: 'Nitrit & Nitrat',
      kategori: 'Kimia',
      satuan: 'mg/kg',
      ambangBatas: '< 30 mg/kg',
      deskripsi: 'Pengawet sintesis pada olahan daging segar.',
      statusAktif: true,
    },
    {
      namaParameter: 'Kandungan Logam Berat (Timbal Pb)',
      kategori: 'Kimia',
      satuan: 'mg/kg',
      ambangBatas: '< 0.25 mg/kg',
      deskripsi: 'Cemaran logam berat pada ikan laut dan bahan pakan.',
      statusAktif: true,
    },
  ];

  for (const item of defaults) {
    await db.insert(masterParameterUji).values(item);
  }
}
