'use server';

import { db } from "@/db";
import { sppg, desa, kecamatan, sppgPenerimaManfaat, pengaduan, sppgLaporanAktifitas } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getPublicSppg() {
  const sppgs = await db.query.sppg.findMany({
    with: {
      desa: {
        with: {
          kecamatan: true
        }
      },
      penerimaManfaat: {
        where: eq(sppgPenerimaManfaat.status, 'Aktif')
      }
    },
    orderBy: [desc(sppg.id)]
  });

  return sppgs.map(s => {
    // Hitung total penerima
    const totalPenerima = s.penerimaManfaat.reduce((sum, p) => sum + (p.jumlahTotal || 0), 0);
    
    return {
      sppgId: s.id,
      idSppgCode: s.idSppgCode,
      namaSppg: s.namaSppg,
      alamat: s.alamat,
      statusOperasional: s.statusOperasional,
      tanggalOperasional: s.tanggalOperasional,
      namaKaSppg: s.namaKaSppg,
      noHpKaSppg: s.noHpKaSppg,
      jumlahPenjamahMakanan: s.jumlahPenjamahMakanan,
      jumlahBpjsTk: s.jumlahBpjsTk,
      chefBersertifikatBnsp: s.chefBersertifikatBnsp,
      keterangan: s.keterangan,
      desaId: s.desaId,
      namaDesa: s.desa?.namaDesa || null,
      kecamatanId: s.desa?.kecamatan?.id || null,
      namaKecamatan: s.desa?.kecamatan?.namaKecamatan || null,
      totalPenerima,
      jumlahSekolah: s.penerimaManfaat.length
    };
  });
}

export async function getPublicLaporanAktifitas() {
  const data = await db.query.sppgLaporanAktifitas.findMany({
    with: {
      sppg: true,
      sekolah: true
    },
    orderBy: [desc(sppgLaporanAktifitas.tanggal), desc(sppgLaporanAktifitas.createdAt)]
  });

  return data.map(p => ({
    id: p.id,
    tanggal: p.tanggal,
    menu: p.menu,
    jumlahPorsi: p.jumlahPorsi,
    status: p.status,
    catatan: p.catatan,
    namaSppg: p.sppg?.namaSppg || null,
    namaSekolah: p.sekolah?.namaSekolah || null,
    fotoDokumentasi: p.fotoDokumentasi,
  }));
}
