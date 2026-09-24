'use server';

import { db } from "@/db";
import { supplyChainKebutuhan } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

async function getSessionData() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = session?.user?.role;
  const sppgId = session?.user?.sppgId ? Number(session.user.sppgId) : undefined;
  const isAdmin = role === 'admin_dinas' || role === 'super_admin' || role === 'admin';
  return { role, sppgId, isAdmin };
}

export async function getSupplyChain() {
  const { isAdmin, sppgId } = await getSessionData();

  if (isAdmin) {
    return await db.query.supplyChainKebutuhan.findMany({
      orderBy: [desc(supplyChainKebutuhan.createdAt)],
      with: {
        sppg: true,
        jenisPangan: true,
        pemasok: true
      }
    });
  }

  // Operator SPPG only sees their own supply chain
  if (sppgId) {
    return await db.query.supplyChainKebutuhan.findMany({
      where: eq(supplyChainKebutuhan.sppgId, sppgId),
      orderBy: [desc(supplyChainKebutuhan.createdAt)],
      with: {
        sppg: true,
        jenisPangan: true,
        pemasok: true
      }
    });
  }

  return [];
}

export async function createSupplyChain(data: {
  sppgId: number;
  jenisPanganId: number;
  pemasokId?: number;
  kebutuhanPerBulan: string;
  satuan?: string;
  periode?: string;
}) {
  try {
    const { isAdmin, sppgId: userSppgId } = await getSessionData();
    let finalSppgId = data.sppgId;

    if (!isAdmin) {
      if (!userSppgId) return { success: false, error: 'Akun Anda belum terhubung dengan Dapur SPPG' };
      finalSppgId = userSppgId;
    }

    await db.insert(supplyChainKebutuhan).values({
      sppgId: finalSppgId,
      jenisPanganId: data.jenisPanganId,
      pemasokId: data.pemasokId || null,
      kebutuhanPerBulan: data.kebutuhanPerBulan,
      satuan: data.satuan || 'Kilogram',
      periode: data.periode || new Date().toISOString().split('T')[0],
    });
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menambah data rantai pasok' };
  }
}

export async function deleteSupplyChain(id: number) {
  try {
    const { isAdmin, sppgId: userSppgId } = await getSessionData();
    
    if (!isAdmin) {
      if (!userSppgId) return { success: false, error: 'Akses ditolak' };
      const item = await db.query.supplyChainKebutuhan.findFirst({
        where: eq(supplyChainKebutuhan.id, id)
      });
      
      if (!item || item.sppgId !== userSppgId) {
        return { success: false, error: 'Akses ditolak: Data ini bukan milik Anda' };
      }
    }

    await db.delete(supplyChainKebutuhan).where(eq(supplyChainKebutuhan.id, id));
    revalidatePath('/admin/supply-chain');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal menghapus rantai pasok' };
  }
}

/**
 * Audit & Real-time Inventory Calculation for Dapur SPPG
 */
export async function getSppgInventorySummary(filterSppgId?: number) {
  const { isAdmin, sppgId: userSppgId } = await getSessionData();
  const targetSppgId = isAdmin ? (filterSppgId || null) : userSppgId;

  const sppgFilterSql = targetSppgId ? sql`WHERE sppg_id = ${targetSppgId}` : sql``;

  const rawRows = await db.execute(sql`
    SELECT 
      jp.jenis_pangan_id,
      jp.nama_bahan,
      jp.kategori,
      jp.satuan_default,
      COALESCE(k.kebutuhan_bulan, 0) as kebutuhan_bulan,
      COALESCE(p.total_masuk, 0) as total_masuk,
      COALESCE(m.total_keluar, 0) as total_keluar,
      COALESCE(p.total_biaya, 0) as total_biaya
    FROM jenis_pangan jp
    LEFT JOIN (
      SELECT jenis_pangan_id, SUM(CAST(kebutuhan_per_bulan AS NUMERIC)) as kebutuhan_bulan
      FROM supply_chain_kebutuhan
      ${sppgFilterSql}
      GROUP BY jenis_pangan_id
    ) k ON jp.jenis_pangan_id = k.jenis_pangan_id
    LEFT JOIN (
      SELECT jenis_pangan_id, SUM(CAST(volume AS NUMERIC)) as total_masuk, SUM(CAST(harga_total AS NUMERIC)) as total_biaya
      FROM sppg_pembelian_bahan
      ${sppgFilterSql}
      GROUP BY jenis_pangan_id
    ) p ON jp.jenis_pangan_id = p.jenis_pangan_id
    LEFT JOIN (
      SELECT jenis_pangan_id, SUM(CAST(volume AS NUMERIC)) as total_keluar
      FROM sppg_pemakaian_bahan
      ${sppgFilterSql}
      GROUP BY jenis_pangan_id
    ) m ON jp.jenis_pangan_id = m.jenis_pangan_id
    WHERE k.kebutuhan_bulan > 0 OR p.total_masuk > 0 OR m.total_keluar > 0
    ORDER BY jp.nama_bahan ASC
  `);

  let totalBahanKritis = 0;
  let totalBahanWaspada = 0;
  let totalPengeluaranNominal = 0;

  const inventoryList = rawRows.map((row: any) => {
    const kebutuhanBulan = parseFloat(row.kebutuhan_bulan) || 0;
    const totalMasuk = parseFloat(row.total_masuk) || 0;
    const totalKeluar = parseFloat(row.total_keluar) || 0;
    const sisaStok = totalMasuk - totalKeluar;
    const totalBiaya = parseFloat(row.total_biaya) || 0;

    totalPengeluaranNominal += totalBiaya;

    let statusStok: 'Aman' | 'Waspada' | 'Kritis' = 'Aman';
    
    if (kebutuhanBulan > 0) {
      if (sisaStok < (kebutuhanBulan * 0.2)) {
        statusStok = 'Kritis';
        totalBahanKritis++;
      } else if (sisaStok <= (kebutuhanBulan * 0.5)) {
        statusStok = 'Waspada';
        totalBahanWaspada++;
      }
    } else if (sisaStok <= 0) {
      statusStok = 'Kritis';
      totalBahanKritis++;
    }

    return {
      jenisPanganId: row.jenis_pangan_id,
      namaBahan: row.nama_bahan,
      kategori: row.kategori || 'Pangan Umum',
      satuan: row.satuan_default || 'Kg',
      kebutuhanBulan,
      totalMasuk,
      totalKeluar,
      sisaStok,
      totalBiaya,
      statusStok
    };
  });

  return {
    inventoryList,
    totalBahanKritis,
    totalBahanWaspada,
    totalJenisBahan: inventoryList.length,
    totalPengeluaranNominal
  };
}

/**
 * Fetch Active Suppliers / Vendors supplying to this SPPG
 */
export async function getActiveSuppliersForSppg(filterSppgId?: number | null) {
  const { isAdmin, sppgId: userSppgId } = await getSessionData();
  const targetSppgId = isAdmin ? (filterSppgId || null) : userSppgId;

  const sppgFilterSql = targetSppgId ? sql`WHERE pb.sppg_id = ${targetSppgId} OR sk.sppg_id = ${targetSppgId}` : sql``;

  const rows = await db.execute(sql`
    SELECT DISTINCT
      p.pemasok_id,
      p.nama_pemasok,
      p.tipe_pemasok,
      p.pic_nama,
      p.pic_kontak,
      p.email,
      p.alamat_pemasok,
      p.status,
      COUNT(DISTINCT pb.id) as total_pembelian,
      SUM(CAST(pb.harga_total AS NUMERIC)) as total_nominal
    FROM pemasok p
    LEFT JOIN sppg_pembelian_bahan pb ON p.pemasok_id = pb.pemasok_id
    LEFT JOIN supply_chain_kebutuhan sk ON p.pemasok_id = sk.pemasok_id
    ${sppgFilterSql}
    GROUP BY p.pemasok_id, p.nama_pemasok, p.tipe_pemasok, p.pic_nama, p.pic_kontak, p.email, p.alamat_pemasok, p.status
    ORDER BY total_pembelian DESC, p.nama_pemasok ASC
  `);

  return rows.map((r: any) => ({
    id: r.pemasok_id,
    namaPemasok: r.nama_pemasok,
    tipePemasok: r.tipe_pemasok || 'Pemasok Pangan',
    picNama: r.pic_nama || 'PIC Pemasok',
    picKontak: r.pic_kontak || '-',
    email: r.email,
    alamatPemasok: r.alamat_pemasok || 'Kabupaten Lebak',
    status: r.status || 'Aktif',
    totalPembelian: parseInt(r.total_pembelian as string) || 0,
    totalNominal: parseFloat(r.total_nominal as string) || 0
  }));
}
