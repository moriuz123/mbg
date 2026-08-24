'use server';

import { db } from '@/db';
import { sppgPembelianBahan, sppgPemakaianBahan, sppgUjiRapidTest, masterParameterUji, pemasok, jenisPangan, standarMenuGizi } from '@/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const sppgId = session?.user?.sppgId;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, sppgId, isAdmin };
}

// ==========================================
// 1. PEMBELIAN BAHAN (INCOMING STOCK)
// ==========================================
export async function createPembelianBahan(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const pemasokIdRaw = formData.get('pemasokId') as string;
    const pemasokId = pemasokIdRaw ? parseInt(pemasokIdRaw) : null;
    const sumberPasokan = formData.get('sumberPasokan') as string || 'Pembelian Lokal';
    const baseCatatan = formData.get('catatan') as string || '';
    
    const catatan = baseCatatan ? `[${sumberPasokan}] ${baseCatatan}` : `[${sumberPasokan}]`;

    const data = {
      sppgId,
      pemasokId,
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      tanggalPembelian: formData.get('tanggalPembelian') as string,
      mingguKe: parseInt(formData.get('mingguKe') as string) || null,
      volume: formData.get('volume') as string,
      satuan: formData.get('satuan') as string || 'Kg',
      hargaTotal: formData.get('hargaTotal') as string || null,
      catatan,
    };

    await db.insert(sppgPembelianBahan).values(data);
    revalidatePath('/admin/pengawasan');
    revalidatePath('/admin/supply-chain');
    return { success: true, message: 'Data pembelian bahan berhasil ditambahkan.' };
  } catch (error: any) {
    console.error('Error createPembelianBahan:', error);
    return { success: false, message: error.message || 'Gagal menyimpan data pembelian.' };
  }
}

export async function getPembelianBahan(sppgId?: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    const targetSppgId = isAdmin ? sppgId : userSppgId;

    const whereClause = targetSppgId ? eq(sppgPembelianBahan.sppgId, targetSppgId) : undefined;

    const data = await db.query.sppgPembelianBahan.findMany({
      where: whereClause,
      with: {
        pemasok: true,
        jenisPangan: true,
      },
      orderBy: [desc(sppgPembelianBahan.tanggalPembelian), desc(sppgPembelianBahan.createdAt)]
    });

    return data.map(d => ({
      ...d,
      pemasokNama: d.pemasok?.namaPemasok,
      tipePemasok: d.pemasok?.tipePemasok,
      alamatPemasok: d.pemasok?.alamatPemasok,
      jenisPanganNama: d.jenisPangan?.namaBahan
    }));
  } catch (error) {
    console.error('Error getPembelianBahan:', error);
    return [];
  }
}

export async function deletePembelianBahan(id: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Akses ditolak.' };
      const item = await db.query.sppgPembelianBahan.findFirst({
        where: eq(sppgPembelianBahan.id, id)
      });
      if (!item || item.sppgId !== userSppgId) {
        return { success: false, message: 'Akses ditolak: Data ini bukan milik SPPG Anda.' };
      }
    }

    await db.delete(sppgPembelianBahan).where(eq(sppgPembelianBahan.id, id));
    revalidatePath('/admin/pengawasan');
    revalidatePath('/admin/supply-chain');
    return { success: true, message: 'Data pembelian berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus data pembelian.' };
  }
}

// ==========================================
// 2. PEMAKAIAN BAHAN (OUTGOING STOCK)
// ==========================================
export async function createPemakaianBahan(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const data = {
      sppgId,
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      standarMenuId: formData.get('standarMenuId') ? parseInt(formData.get('standarMenuId') as string) : null,
      tanggalPemakaian: formData.get('tanggalPemakaian') as string,
      mingguKe: parseInt(formData.get('mingguKe') as string) || null,
      volume: formData.get('volume') as string,
      satuan: formData.get('satuan') as string || 'Kg',
      catatan: formData.get('catatan') as string || null,
    };

    await db.insert(sppgPemakaianBahan).values(data);
    revalidatePath('/admin/pengawasan');
    revalidatePath('/admin/supply-chain');
    return { success: true, message: 'Data pemakaian bahan berhasil dicatat.' };
  } catch (error: any) {
    console.error('Error createPemakaianBahan:', error);
    return { success: false, message: error.message || 'Gagal mencatat pemakaian bahan.' };
  }
}

export async function getPemakaianBahan(sppgId?: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    const targetSppgId = isAdmin ? sppgId : userSppgId;

    const whereClause = targetSppgId ? eq(sppgPemakaianBahan.sppgId, targetSppgId) : undefined;

    const data = await db.query.sppgPemakaianBahan.findMany({
      where: whereClause,
      with: {
        jenisPangan: true,
        standarMenuGizi: true,
      },
      orderBy: [desc(sppgPemakaianBahan.tanggalPemakaian), desc(sppgPemakaianBahan.createdAt)]
    });

    return data.map(d => ({
      ...d,
      jenisPanganNama: d.jenisPangan?.namaBahan,
      menuNama: d.standarMenuGizi?.namaMenu
    }));
  } catch (error) {
    console.error('Error getPemakaianBahan:', error);
    return [];
  }
}

export async function deletePemakaianBahan(id: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Akses ditolak.' };
      const item = await db.query.sppgPemakaianBahan.findFirst({
        where: eq(sppgPemakaianBahan.id, id)
      });
      if (!item || item.sppgId !== userSppgId) {
        return { success: false, message: 'Akses ditolak: Data ini bukan milik SPPG Anda.' };
      }
    }

    await db.delete(sppgPemakaianBahan).where(eq(sppgPemakaianBahan.id, id));
    revalidatePath('/admin/pengawasan');
    revalidatePath('/admin/supply-chain');
    return { success: true, message: 'Data pemakaian berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus data pemakaian.' };
  }
}

export async function getActiveMasterParameterUjiList() {
  try {
    return await db.query.masterParameterUji.findMany({
      where: eq(masterParameterUji.statusAktif, true),
      orderBy: [desc(masterParameterUji.createdAt), desc(masterParameterUji.id)]
    });
  } catch (error) {
    console.error('Error getActiveMasterParameterUjiList:', error);
    return [];
  }
}

// ==========================================
// 3. UJI RAPID TEST BAHAN SEGAR
// ==========================================
export async function createUjiRapidTest(formData: FormData) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    let sppgId = parseInt(formData.get('sppgId') as string);
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Anda tidak memiliki akses SPPG.' };
      sppgId = userSppgId;
    }

    const parameterUjiIdRaw = formData.get('parameterUjiId') as string;
    const parameterUjiId = parameterUjiIdRaw ? parseInt(parameterUjiIdRaw) : null;
    let parameterUjiName = formData.get('parameterUji') as string;

    if (parameterUjiId && !isNaN(parameterUjiId)) {
      const masterItem = await db.query.masterParameterUji.findFirst({
        where: eq(masterParameterUji.id, parameterUjiId)
      });
      if (masterItem) {
        parameterUjiName = masterItem.namaParameter;
      }
    }

    const data = {
      sppgId,
      jenisPanganId: parseInt(formData.get('jenisPanganId') as string),
      parameterUjiId: parameterUjiId && !isNaN(parameterUjiId) ? parameterUjiId : null,
      tanggalUji: formData.get('tanggalUji') as string,
      parameterUji: parameterUjiName || 'Pengujian Rutin',
      hasilUji: formData.get('hasilUji') as string,
      petugasPenguji: formData.get('petugasPenguji') as string,
      tindakanLanjut: formData.get('tindakanLanjut') as string || null,
    };

    await db.insert(sppgUjiRapidTest).values(data);
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Hasil uji rapid test berhasil disimpan.' };
  } catch (error: any) {
    console.error('Error createUjiRapidTest:', error);
    return { success: false, message: error.message || 'Gagal menyimpan uji rapid test.' };
  }
}

export async function getUjiRapidTest(sppgId?: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    const targetSppgId = isAdmin ? sppgId : userSppgId;

    const whereClause = targetSppgId ? eq(sppgUjiRapidTest.sppgId, targetSppgId) : undefined;

    const data = await db.query.sppgUjiRapidTest.findMany({
      where: whereClause,
      with: {
        jenisPangan: true,
        parameterMaster: true,
      },
      orderBy: [desc(sppgUjiRapidTest.tanggalUji), desc(sppgUjiRapidTest.createdAt)]
    });

    return data.map(d => ({
      ...d,
      jenisPanganNama: d.jenisPangan?.namaBahan,
      parameterMaster: d.parameterMaster,
    }));
  } catch (error) {
    console.error('Error getUjiRapidTest:', error);
    return [];
  }
}

export async function deleteUjiRapidTest(id: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, message: 'Akses ditolak.' };
      const item = await db.query.sppgUjiRapidTest.findFirst({
        where: eq(sppgUjiRapidTest.id, id)
      });
      if (!item || item.sppgId !== userSppgId) {
        return { success: false, message: 'Akses ditolak: Data ini bukan milik SPPG Anda.' };
      }
    }

    await db.delete(sppgUjiRapidTest).where(eq(sppgUjiRapidTest.id, id));
    revalidatePath('/admin/pengawasan');
    return { success: true, message: 'Hasil uji rapid test berhasil dihapus.' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus uji rapid test.' };
  }
}

/**
 * DASHBOARD PANGAN SEGAR DIBELI HARIAN
 * Groups purchases by fresh food item (Tomat, Cabai, Beras, Daging, Sayuran, dll) with daily volume & supplier origin
 */
export async function getDailyFreshFoodPurchasesStats(filterSppgId?: number, dateString?: string) {
  const { sppgId: userSppgId, isAdmin } = await getSessionData();
  const targetSppgId = isAdmin ? (filterSppgId || null) : userSppgId;

  const sppgFilterSql = targetSppgId ? sql`AND pb.sppg_id = ${targetSppgId}` : sql``;
  const targetDate = dateString || new Date().toISOString().split('T')[0];

  const rawRows = await db.execute(sql`
    SELECT 
      pb.id,
      pb.tanggal_pembelian,
      jp.nama_bahan,
      jp.kategori,
      pb.volume,
      pb.satuan,
      pb.harga_total,
      pb.catatan,
      p.nama_pemasok,
      p.tipe_pemasok,
      p.alamat_pemasok,
      s.nama_sppg
    FROM sppg_pembelian_bahan pb
    LEFT JOIN jenis_pangan jp ON pb.jenis_pangan_id = jp.jenis_pangan_id
    LEFT JOIN pemasok p ON pb.pemasok_id = p.pemasok_id
    LEFT JOIN sppg s ON pb.sppg_id = s.sppg_id
    WHERE pb.tanggal_pembelian = ${targetDate} ${sppgFilterSql}
    ORDER BY pb.id DESC
  `);

  const commodityMap: Record<string, { namaBahan: string; kategori: string; totalVolume: number; satuan: string; totalBiaya: number; suppliers: string[] }> = {};

  rawRows.forEach((row: any) => {
    const key = row.nama_bahan || 'Pangan Segar';
    const vol = parseFloat(row.volume as string) || 0;
    const price = parseFloat(row.harga_total as string) || 0;
    const supplierInfo = row.nama_pemasok ? `${row.nama_pemasok} (${row.tipe_pemasok || 'Pemasok'})` : 'Pemasok Umum';

    if (!commodityMap[key]) {
      commodityMap[key] = {
        namaBahan: key,
        kategori: row.kategori || 'Sayuran & Segar',
        totalVolume: 0,
        satuan: row.satuan || 'Kg',
        totalBiaya: 0,
        suppliers: []
      };
    }

    commodityMap[key].totalVolume += vol;
    commodityMap[key].totalBiaya += price;
    if (!commodityMap[key].suppliers.includes(supplierInfo)) {
      commodityMap[key].suppliers.push(supplierInfo);
    }
  });

  const commodityList = Object.values(commodityMap);

  return {
    tanggal: targetDate,
    rawList: rawRows as any[],
    commodityList,
    totalItemsPurchased: commodityList.length,
    totalVolumeOverall: commodityList.reduce((acc, curr) => acc + curr.totalVolume, 0)
  };
}
