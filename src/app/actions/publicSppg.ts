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
      sekolah: true,
      posyandu: true,
      standarMenuGizi: true
    },
    orderBy: [desc(sppgLaporanAktifitas.tanggal), desc(sppgLaporanAktifitas.createdAt)]
  });

  return data.map(p => ({
    id: p.id,
    tanggal: p.tanggal,
    sppgId: p.sppgId,
    sekolahId: p.sekolahId,
    posyanduId: p.posyanduId,
    menu: p.standarMenuGizi?.namaMenu || '-',
    standarMenuGizi: p.standarMenuGizi ? {
      namaMenu: p.standarMenuGizi.namaMenu,
      deskripsi: p.standarMenuGizi.deskripsi,
      kaloriKkal: p.standarMenuGizi.kaloriKkal,
      proteinGram: p.standarMenuGizi.proteinGram,
      karbohidratGram: p.standarMenuGizi.karbohidratGram,
      lemakGram: p.standarMenuGizi.lemakGram,
    } : null,
    jumlahPorsi: p.jumlahPorsi,
    status: p.status,
    catatan: p.catatan,
    namaSppg: p.sppg?.namaSppg || null,
    namaSekolah: p.sekolah?.namaSekolah || p.posyandu?.namaPosyandu || null,
    tujuanTipe: p.sekolah ? 'Sekolah' : p.posyandu ? 'Posyandu' : '-',
    fotoDokumentasi: p.fotoDokumentasi,
  }));
}
