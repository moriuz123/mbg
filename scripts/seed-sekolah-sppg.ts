import { db } from '../src/db';
import { 
  sekolah, 
  sppg, 
  kecamatan, 
  desa, 
  kategoriPenerima,
  sppgPenerimaManfaat
} from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function seedData() {
  console.log('Seeding Kecamatan and Desa...');
  
  // 1. Setup Kecamatan & Desa
  let kec = await db.select().from(kecamatan).limit(2);
  if (kec.length === 0) {
    kec = await db.insert(kecamatan).values([
      { namaKecamatan: 'Rangkasbitung' },
      { namaKecamatan: 'Cibadak' }
    ]).returning();
  }

  let ds = await db.select().from(desa).limit(4);
  if (ds.length === 0) {
    ds = await db.insert(desa).values([
      { namaDesa: 'Muara Ciujung Timur', kecamatanId: kec[0].id },
      { namaDesa: 'Rangkasbitung Barat', kecamatanId: kec[0].id },
      { namaDesa: 'Cibadak', kecamatanId: kec[1].id },
      { namaDesa: 'Pasarkeong', kecamatanId: kec[1].id },
    ]).returning();
  }

  console.log('Seeding Kategori Penerima...');
  let kategori = await db.select().from(kategoriPenerima).limit(3);
  if (kategori.length === 0) {
    kategori = await db.insert(kategoriPenerima).values([
      { namaKategori: 'SD', prioritas: 1 },
      { namaKategori: 'SMP', prioritas: 2 },
      { namaKategori: 'SMA', prioritas: 3 }
    ]).returning();
  }

  console.log('Seeding SPPG...');
  const newSppg = await db.insert(sppg).values([
    {
      idSppgCode: `SPPG-${Date.now()}-1`,
      namaSppg: 'Dapur Umum Berkah Lebak',
      desaId: ds[0].id,
      alamat: 'Jl. RT Hardiwinangun No. 12',
      statusOperasional: 'Aktif',
      tanggalOperasional: new Date().toISOString().split('T')[0],
      jumlahPenjamahMakanan: 15,
      chefBersertifikatBnsp: 2,
    },
    {
      idSppgCode: `SPPG-${Date.now()}-2`,
      namaSppg: 'SPPG Cibadak Mandiri',
      desaId: ds[2].id,
      alamat: 'Jl. Raya Rangkasbitung-Pandeglang Km 4',
      statusOperasional: 'Aktif',
      tanggalOperasional: new Date().toISOString().split('T')[0],
      jumlahPenjamahMakanan: 20,
      chefBersertifikatBnsp: 3,
    }
  ]).returning();

  console.log('Seeding Sekolah...');
  // Data dummy yang bervariasi
  const sekolahData = [
    { nama: 'SDN 1 Muara Ciujung Timur', cat: kategori[0].id, desa: ds[0].id, kec: kec[0].id, l: 150, p: 160 },
    { nama: 'SDN 2 Rangkasbitung Barat', cat: kategori[0].id, desa: ds[1].id, kec: kec[0].id, l: 200, p: 190 },
    { nama: 'SMPN 1 Rangkasbitung', cat: kategori[1].id, desa: ds[0].id, kec: kec[0].id, l: 450, p: 470 },
    { nama: 'SMAN 2 Rangkasbitung', cat: kategori[2].id, desa: ds[1].id, kec: kec[0].id, l: 500, p: 520 },
    { nama: 'SDN 1 Cibadak', cat: kategori[0].id, desa: ds[2].id, kec: kec[1].id, l: 120, p: 130 },
    { nama: 'SDN 3 Pasarkeong', cat: kategori[0].id, desa: ds[3].id, kec: kec[1].id, l: 90, p: 95 },
    { nama: 'SMPN 1 Cibadak', cat: kategori[1].id, desa: ds[2].id, kec: kec[1].id, l: 300, p: 310 },
  ];

  const insertedSekolah = await db.insert(sekolah).values(
    sekolahData.map((s, i) => ({
      namaSekolah: s.nama,
      npsn: `2060${Math.floor(1000 + Math.random() * 9000)}`,
      kategoriId: s.cat,
      desaId: s.desa,
      kecamatanId: s.kec,
      alamatSekolah: `Jalan Pendidikan No. ${i + 1}`,
      jumlahSiswaLaki: s.l,
      jumlahSiswaPerempuan: s.p,
      jumlahSiswaTotal: s.l + s.p
    }))
  ).returning();

  console.log('Linking Sekolah to SPPG (sppg_penerima_manfaat)...');
  // SPPG 1 melayani Rangkasbitung (index 0,1,2,3)
  // SPPG 2 melayani Cibadak (index 4,5,6)
  const penerimaLinks = insertedSekolah.map((sek, i) => {
    return {
      sppgId: i < 4 ? newSppg[0].id : newSppg[1].id,
      sekolahId: sek.id,
      status: 'Aktif',
      tanggalMulai: new Date().toISOString().split('T')[0],
    };
  });

  await db.insert(sppgPenerimaManfaat).values(penerimaLinks);

  console.log('Seeding selesai!');
  process.exit(0);
}

seedData().catch(e => {
  console.error('Error seeding:', e);
  process.exit(1);
});
