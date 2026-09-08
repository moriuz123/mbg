import { db } from "./index";
import { 
  kecamatan, desa, kategoriPenerima, sekolah, yayasan, sppg, sppgSertifikasi, 
  sppgPenerimaManfaat, pemasok, jenisPangan, supplyChainKebutuhan, 
  penggilingan, penggilinganSumberGabah, penggilinganProduksi, penggilinganDistribusi,
  posyandu, sppgPosyanduManfaat, posyanduPenerimaanMbg
} from "./schema";

async function main() {
  console.log("Seeding data...");

  // 1. KECAMATAN
  const kecs = await db.insert(kecamatan).values([
    { namaKecamatan: "Rangkasbitung 2" },
    { namaKecamatan: "Cibadak 2" },
    { namaKecamatan: "Warunggunung 2" }
  ]).returning();

  // 2. DESA
  const desas = await db.insert(desa).values([
    { kecamatanId: kecs[0].id, namaDesa: "Muara Ciujung Timur 2" },
    { kecamatanId: kecs[0].id, namaDesa: "Cijoro Pasir 2" },
    { kecamatanId: kecs[1].id, namaDesa: "Pasar Keong 2" }
  ]).returning();

  // 3. KATEGORI PENERIMA
  const kats = await db.insert(kategoriPenerima).values([
    { namaKategori: "SD/MI 2" },
    { namaKategori: "SMP/MTs 2" },
    { namaKategori: "SMA/SMK/MA 2" }
  ]).returning();

  // 4. SEKOLAH
  const seks = await db.insert(sekolah).values([
    { namaSekolah: "SDN 2 Rangkasbitung", npsn: "20601237", kategoriId: kats[0].id, desaId: desas[0].id, kecamatanId: kecs[0].id, alamatSekolah: "Jl. 2", jumlahSiswaLaki: 100, jumlahSiswaPerempuan: 120 },
    { namaSekolah: "SMPN 2 Cibadak", npsn: "20601238", kategoriId: kats[1].id, desaId: desas[2].id, kecamatanId: kecs[1].id, alamatSekolah: "Jl. 3", jumlahSiswaLaki: 150, jumlahSiswaPerempuan: 160 },
    { namaSekolah: "SMAN 2 Warunggunung", npsn: "20601239", kategoriId: kats[2].id, desaId: desas[2].id, kecamatanId: kecs[2].id, alamatSekolah: "Jl. 4", jumlahSiswaLaki: 200, jumlahSiswaPerempuan: 210 }
  ]).returning();

  // 5. YAYASAN
  const yays = await db.insert(yayasan).values([
    { namaYayasan: "Yayasan Bhakti Lebak 2", alamat: "Rangkasbitung", kontak: "081234567890" },
    { namaYayasan: "Yayasan Pendidikan Harapan 2", alamat: "Cibadak", kontak: "081987654321" },
    { namaYayasan: "Yayasan Generasi Maju 2", alamat: "Warunggunung", kontak: "08122334455" }
  ]).returning();

  // 6. SPPG
  const sppgs = await db.insert(sppg).values([
    { idSppgCode: "SPPG-004", namaSppg: "Dapur Umum Rangkas 2", desaId: desas[0].id, yayasanId: yays[0].id, alamat: "Jl. Sentral", statusOperasional: "Aktif", namaKaSppg: "Hasan", noHpKaSppg: "081122223333", jumlahPenjamahMakanan: 5, jumlahBpjsTk: 20 },
    { idSppgCode: "SPPG-005", namaSppg: "Dapur Sehat Cibadak 2", desaId: desas[2].id, yayasanId: yays[1].id, alamat: "Jl. Pasar Keong", statusOperasional: "Aktif", namaKaSppg: "Wati", noHpKaSppg: "081133334444", jumlahPenjamahMakanan: 4, jumlahBpjsTk: 16 },
    { idSppgCode: "SPPG-006", namaSppg: "Dapur Mutiara Warunggunung 2", desaId: desas[2].id, yayasanId: yays[2].id, alamat: "Jl. Mutiara", statusOperasional: "Belum Operasional", namaKaSppg: "Dewi", noHpKaSppg: "081144445555", jumlahPenjamahMakanan: 3, jumlahBpjsTk: 13 }
  ]).returning();

  // 7. SPPG SERTIFIKASI
  await db.insert(sppgSertifikasi).values([
    { sppgId: sppgs[0].id, jenisSertifikasi: "HALAL", status: true, tanggalBerlaku: "2028-01-01", keterangan: "Halal MUI" },
    { sppgId: sppgs[1].id, jenisSertifikasi: "IKL", status: true, tanggalBerlaku: "2029-01-01", keterangan: "Dinkes" },
    { sppgId: sppgs[2].id, jenisSertifikasi: "SLHS", status: false, tanggalBerlaku: "2025-01-01", keterangan: "Kadaluarsa" }
  ]);

  // 8. SPPG PENERIMA MANFAAT
  await db.insert(sppgPenerimaManfaat).values([
    { sppgId: sppgs[0].id, sekolahId: seks[0].id, tahunAjaran: "2025/2026", jumlahLaki: 150, jumlahPerempuan: 200, tanggalMulai: "2025-07-01", status: "Aktif" },
    { sppgId: sppgs[1].id, sekolahId: seks[1].id, tahunAjaran: "2025/2026", jumlahLaki: 200, jumlahPerempuan: 220, tanggalMulai: "2025-07-01", status: "Aktif" },
    { sppgId: sppgs[2].id, sekolahId: seks[2].id, tahunAjaran: "2025/2026", jumlahLaki: 300, jumlahPerempuan: 300, tanggalMulai: "2025-07-01", status: "Aktif" }
  ]);

  // 8.5 POSYANDU
  const posyandus = await db.insert(posyandu).values([
    { namaPosyandu: "Posyandu Melati 1", desaId: desas[0].id, kecamatanId: kecs[0].id, alamatPosyandu: "Jl. Bunga 1", namaKetuaKader: "Ibu Ani", noHpKetuaKader: "08123456781", jumlahBusui: 10, jumlahBalita: 20, jumlahBumil: 15, jumlahTotal: 45 },
    { namaPosyandu: "Posyandu Mawar 2", desaId: desas[2].id, kecamatanId: kecs[1].id, alamatPosyandu: "Jl. Bunga 2", namaKetuaKader: "Ibu Budi", noHpKetuaKader: "08123456782", jumlahBusui: 8, jumlahBalita: 15, jumlahBumil: 10, jumlahTotal: 33 }
  ]).returning();

  // 8.6 SPPG POSYANDU MANFAAT
  await db.insert(sppgPosyanduManfaat).values([
    { sppgId: sppgs[0].id, posyanduId: posyandus[0].id, jumlahBusui: 10, jumlahBalita: 20, jumlahBumil: 15, jumlahTotal: 45, tanggalMulai: "2025-07-01", status: "Aktif" },
    { sppgId: sppgs[1].id, posyanduId: posyandus[1].id, jumlahBusui: 8, jumlahBalita: 15, jumlahBumil: 10, jumlahTotal: 33, tanggalMulai: "2025-07-01", status: "Aktif" }
  ]);

  // 8.7 POSYANDU PENERIMAAN MBG (Riwayat)
  await db.insert(posyanduPenerimaanMbg).values([
    { posyanduId: posyandus[0].id, sppgId: sppgs[0].id, status: "Aktif", tanggalMulaiMbg: "2025-07-01" },
    { posyanduId: posyandus[1].id, sppgId: sppgs[1].id, status: "Aktif", tanggalMulaiMbg: "2025-07-01" }
  ]);

  // 9. PEMASOK
  const pems = await db.insert(pemasok).values([
    { namaPemasok: "PT. Pangan Nusantara 2", alamatPemasok: "Tangerang", kontak: "021-998877" },
    { namaPemasok: "CV. Tani Jaya 2", alamatPemasok: "Lebak", kontak: "0855667788" },
    { namaPemasok: "Toko Beras Sejahtera 2", alamatPemasok: "Rangkasbitung", kontak: "081199998888" }
  ]).returning();

  // 10. KOMODITAS / JENIS PANGAN
  const jps = await db.insert(jenisPangan).values([
    { namaBahan: "Beras Medium 2", kategori: "Karbohidrat/ Padi- Padian", satuanDefault: "Kilogram" },
    { namaBahan: "Telur Ayam 2", kategori: "Protein Hewani", satuanDefault: "Kilogram" },
    { namaBahan: "Kacang Hijau 2", kategori: "Protein Nabati", satuanDefault: "Kilogram" }
  ]).returning();

  // 11. SUPPLY CHAIN KEBUTUHAN
  await db.insert(supplyChainKebutuhan).values([
    { sppgId: sppgs[0].id, jenisPanganId: jps[0].id, pemasokId: pems[0].id, kebutuhanPerBulan: "500.00", periode: "2026-08-01" },
    { sppgId: sppgs[1].id, jenisPanganId: jps[1].id, pemasokId: pems[1].id, kebutuhanPerBulan: "300.00", periode: "2026-08-01" },
    { sppgId: sppgs[2].id, jenisPanganId: jps[2].id, pemasokId: pems[2].id, kebutuhanPerBulan: "150.00", periode: "2026-08-01" }
  ]);

  // 12. PENGGILINGAN
  const pengs = await db.insert(penggilingan).values([
    { namaPenggilingan: "Penggilingan Padi Makmur 2", alamat: "Jl. Sawah Makmur", kecamatanId: kecs[0].id, penanggungJawab: "Supardi", kapasitasTerpasangKgMinggu: "5000" },
    { namaPenggilingan: "Penggilingan Subur 2", alamat: "Jl. Pertanian", kecamatanId: kecs[1].id, penanggungJawab: "Joko", kapasitasTerpasangKgMinggu: "3000" },
    { namaPenggilingan: "Penggilingan Harapan Tani 2", alamat: "Jl. Sawah Indah", kecamatanId: kecs[2].id, penanggungJawab: "Gatot", kapasitasTerpasangKgMinggu: "4500" }
  ]).returning();

  // 13. PENGGILINGAN SUMBER GABAH
  await db.insert(penggilinganSumberGabah).values([
    { penggilinganId: pengs[0].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", sumberGabah: "Petani Lokal Desa A", volumeKg: "2000" },
    { penggilinganId: pengs[1].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", sumberGabah: "KUD Harapan", volumeKg: "1500" },
    { penggilinganId: pengs[2].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", sumberGabah: "Kelompok Tani Sejahtera", volumeKg: "2500" }
  ]);

  // 14. PENGGILINGAN PRODUKSI
  await db.insert(penggilinganProduksi).values([
    { penggilinganId: pengs[0].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", gabahDigilingKg: "1200", berasDihasilkanKg: "720" },
    { penggilinganId: pengs[1].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", gabahDigilingKg: "900", berasDihasilkanKg: "540" },
    { penggilinganId: pengs[2].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", gabahDigilingKg: "1500", berasDihasilkanKg: "900" }
  ]);

  // 15. PENGGILINGAN DISTRIBUSI
  await db.insert(penggilinganDistribusi).values([
    { penggilinganId: pengs[0].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", volumeKg: "1000", tujuanTipe: "SPPG", sppgTujuanId: sppgs[0].id },
    { penggilinganId: pengs[1].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", volumeKg: "500", tujuanTipe: "SPPG", sppgTujuanId: sppgs[1].id },
    { penggilinganId: pengs[2].id, mingguMulai: "2026-08-01", mingguSelesai: "2026-08-07", volumeKg: "1000", tujuanTipe: "Pasar", sppgTujuanId: null }
  ]);

  console.log("Seeding complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
