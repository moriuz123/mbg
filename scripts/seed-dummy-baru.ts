import { db } from '../src/db';
import { 
  standarMenuGizi, 
  pengaduan, 
  sppgLaporanAktifitas, 
  sekolahLaporanAktifitas,
  sppg,
  sekolah
} from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Seeding dummy data for new tables...');

  // 1. Seed Standar Menu Gizi
  const menus = await db.insert(standarMenuGizi).values([
    {
      namaMenu: 'Nasi, Telur Dadar, Sayur Bayam, Susu',
      deskripsi: 'Menu bergizi seimbang cocok untuk SD',
      kaloriKkal: 650,
      proteinGram: '25.00',
      karbohidratGram: '70.00',
      lemakGram: '15.00',
      status: 'Aktif'
    },
    {
      namaMenu: 'Nasi, Ayam Bakar, Capcay, Buah Pisang',
      deskripsi: 'Menu kaya protein untuk SMP/SMA',
      kaloriKkal: 800,
      proteinGram: '35.00',
      karbohidratGram: '85.00',
      lemakGram: '20.00',
      status: 'Aktif'
    },
    {
      namaMenu: 'Bubur Ayam Spesial, Susu Kedelai',
      deskripsi: 'Menu sarapan mudah dicerna',
      kaloriKkal: 500,
      proteinGram: '18.00',
      karbohidratGram: '60.00',
      lemakGram: '10.00',
      status: 'Aktif'
    }
  ]).returning({ id: standarMenuGizi.id, nama: standarMenuGizi.namaMenu, kalori: standarMenuGizi.kaloriKkal });
  console.log('Inserted Menus:', menus.length);

  // Get some SPPGs and Sekolahs to attach
  const allSppg = await db.select().from(sppg).limit(2);
  const allSekolah = await db.select().from(sekolah).limit(3);

  if (allSppg.length > 0 && allSekolah.length > 0) {
    const sppgId = allSppg[0].id;
    const sekolahId = allSekolah[0].id;
    const sekolahId2 = allSekolah[1]?.id || sekolahId;

    // 2. Seed SPPG Laporan Aktifitas (The Delivery)
    const laporans = await db.insert(sppgLaporanAktifitas).values([
      {
        tanggal: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        sppgId: sppgId,
        sekolahId: sekolahId,
        menu: `${menus[0].nama} (${menus[0].kalori} Kkal)`,
        jumlahPorsi: 150,
        status: 'Diterima'
      },
      {
        tanggal: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
        sppgId: sppgId,
        sekolahId: sekolahId2,
        menu: `${menus[1].nama} (${menus[1].kalori} Kkal)`,
        jumlahPorsi: 200,
        status: 'Bermasalah'
      },
      {
        tanggal: new Date().toISOString(), // Today
        sppgId: sppgId,
        sekolahId: sekolahId,
        menu: `${menus[0].nama} (${menus[0].kalori} Kkal)`,
        jumlahPorsi: 150,
        status: 'Terkirim'
      }
    ]).returning();
    console.log('Inserted SPPG Laporan (Pengiriman):', laporans.length);

    // 3. Seed Sekolah Laporan Aktifitas (The Receipts for the first two)
    await db.insert(sekolahLaporanAktifitas).values([
      {
        sppgLaporanId: laporans[0].id,
        sekolahId: sekolahId,
        tanggalDiterima: new Date(Date.now() - 86400000 * 1.9),
        statusDiterima: 'Diterima Lengkap',
        jumlahPorsiDiterima: 150,
        kondisiMakanan: 'Baik',
        diverifikasiOleh: 'Bpk. Ahmad (Guru Kelas)',
        catatan: 'Makanan tiba tepat waktu dan masih hangat.'
      },
      {
        sppgLaporanId: laporans[1].id,
        sekolahId: sekolahId2,
        tanggalDiterima: new Date(Date.now() - 86400000 * 0.9),
        statusDiterima: 'Diterima Sebagian',
        jumlahPorsiDiterima: 195,
        kondisiMakanan: 'Kurang',
        diverifikasiOleh: 'Ibu Siti (Kepala Sekolah)',
        catatan: 'Kurang 5 porsi dari data DO, kemasan ada yang basah tumpah.'
      }
    ]);
    console.log('Inserted Sekolah Verifikasi (Penerimaan): 2');

    // 4. Seed Pengaduan
    await db.insert(pengaduan).values([
      {
        namaPelapor: 'Budi Santoso',
        kontak: '081234567890',
        isiPengaduan: 'Porsi ayam potongnya hari ini terlalu kecil untuk anak SMP, tolong diperhatikan standar ukurannya.',
        sppgId: sppgId,
        status: 'Diproses',
        tanggal: new Date(Date.now() - 86400000 * 1),
        tanggapan: 'Terima kasih atas masukannya. Kami sudah menegur pihak SPPG terkait agar menyesuaikan ukuran potong sesuai spek.'
      },
      {
        namaPelapor: 'Wali Murid SDN 1',
        kontak: '085712341234',
        isiPengaduan: 'Jam kedatangan makanan jam 11 siang, padahal jam istirahat anak-anak jam 9.30.',
        sekolahId: sekolahId,
        status: 'Baru',
        tanggal: new Date(),
      }
    ]);
    console.log('Inserted Pengaduan: 2');

  }

  console.log('Seeding completed successfully!');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
