import { db } from "./index";

async function main() {
  console.log("Membersihkan penamaan dummy (menghapus ' 2') pada master data...");
  const updatePromises = [
    db.execute(`UPDATE sppg SET nama_sppg = REPLACE(nama_sppg, ' 2', '') WHERE nama_sppg LIKE '% 2'`),
    db.execute(`UPDATE sekolah SET nama_sekolah = REPLACE(nama_sekolah, ' 2', '') WHERE nama_sekolah LIKE '% 2'`),
    db.execute(`UPDATE posyandu SET nama_posyandu = REPLACE(nama_posyandu, ' 2', '') WHERE nama_posyandu LIKE '% 2'`),
    db.execute(`UPDATE penggilingan SET nama_penggilingan = REPLACE(nama_penggilingan, ' 2', '') WHERE nama_penggilingan LIKE '% 2'`),
    db.execute(`UPDATE yayasan SET nama_yayasan = REPLACE(nama_yayasan, ' 2', '') WHERE nama_yayasan LIKE '% 2'`),
    db.execute(`UPDATE pemasok SET nama_pemasok = REPLACE(nama_pemasok, ' 2', '') WHERE nama_pemasok LIKE '% 2'`)
  ];

  await Promise.all(updatePromises);
  console.log("Pembersihan penamaan dummy berhasil.");
}

main().catch((e) => {
  console.error("Error selama pembersihan:", e);
  process.exit(1);
});
