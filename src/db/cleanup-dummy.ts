import { db } from "./index";
import { kecamatan, desa, sekolah, sppg, posyandu, penggilingan } from "./schema";
import { eq, like } from "drizzle-orm";

async function main() {
  console.log("Memulai proses pembersihan data dummy...");

  // 1. Cari data kecamatan dummy (yang berakhiran " 2")
  const dummyKecs = await db.select().from(kecamatan).where(like(kecamatan.namaKecamatan, '% 2'));
  console.log(`Ditemukan ${dummyKecs.length} kecamatan dummy:`, dummyKecs.map(k => k.namaKecamatan).join(', '));

  for (const dk of dummyKecs) {
    // Nama aslinya tanpa " 2"
    const realName = dk.namaKecamatan.replace(' 2', '');
    const realKec = await db.select().from(kecamatan).where(eq(kecamatan.namaKecamatan, realName)).limit(1);

    if (realKec.length > 0) {
      const realKecId = realKec[0].id;
      console.log(`Mapping ${dk.namaKecamatan} -> ${realName} (ID: ${realKecId})`);

      // Pindahkan Sekolah
      await db.update(sekolah).set({ kecamatanId: realKecId }).where(eq(sekolah.kecamatanId, dk.id));
      // Pindahkan Posyandu
      await db.update(posyandu).set({ kecamatanId: realKecId }).where(eq(posyandu.kecamatanId, dk.id));
      // Pindahkan Penggilingan
      await db.update(penggilingan).set({ kecamatanId: realKecId }).where(eq(penggilingan.kecamatanId, dk.id));
    }
  }

  // 2. Cari data desa dummy
  const dummyDesas = await db.select().from(desa).where(like(desa.namaDesa, '% 2'));
  console.log(`Ditemukan ${dummyDesas.length} desa dummy:`, dummyDesas.map(d => d.namaDesa).join(', '));

  for (const dd of dummyDesas) {
    const realName = dd.namaDesa.replace(' 2', '');
    // Cari desa asli berdasarkan nama (mengabaikan kapitalisasi kadang perlu, tapi coba exact match dulu)
    const realDesa = await db.select().from(desa).where(eq(desa.namaDesa, realName)).limit(1);

    if (realDesa.length > 0) {
      const realDesaId = realDesa[0].id;
      const realDesaKecId = realDesa[0].kecamatanId;
      console.log(`Mapping ${dd.namaDesa} -> ${realName} (ID: ${realDesaId})`);

      // Update SPPG
      await db.update(sppg).set({ desaId: realDesaId }).where(eq(sppg.desaId, dd.id));
      // Update Sekolah
      await db.update(sekolah).set({ desaId: realDesaId }).where(eq(sekolah.desaId, dd.id));
      // Update Posyandu
      await db.update(posyandu).set({ desaId: realDesaId }).where(eq(posyandu.desaId, dd.id));
    } else {
      console.log(`WARNING: Tidak dapat menemukan desa asli untuk ${realName}`);
      // Fallback: Jika tidak ketemu, kita ambil desa acak dari kecamatan yang benar atau biarkan sementara.
      // Kita coba ubah namanya jadi asli saja, dan pindahkan ke kecamatan asli.
      // Kecamatan dummy id:
      const dummyKecId = dd.kecamatanId;
      const dk = dummyKecs.find(k => k.id === dummyKecId);
      if (dk) {
        const realKecName = dk.namaKecamatan.replace(' 2', '');
        const realKec = await db.select().from(kecamatan).where(eq(kecamatan.namaKecamatan, realKecName)).limit(1);
        if (realKec.length > 0) {
           await db.update(desa).set({ namaDesa: realName, kecamatanId: realKec[0].id }).where(eq(desa.id, dd.id));
           console.log(`Desa dummy ${dd.namaDesa} diubah namanya menjadi ${realName} dan dipindah ke Kec ${realKecName}`);
        }
      }
    }
  }

  // 3. Hapus desa dummy yang sudah tidak dipakai (hanya yang masih punya " 2", karena kalau fallback di atas kita rename, bukan hapus)
  console.log("Menghapus desa dummy...");
  for (const dd of dummyDesas) {
     const isStillDummy = await db.select().from(desa).where(eq(desa.id, dd.id)).limit(1);
     if (isStillDummy.length > 0 && isStillDummy[0].namaDesa.includes(' 2')) {
         try {
             await db.delete(desa).where(eq(desa.id, dd.id));
             console.log(`Deleted desa dummy: ${dd.namaDesa}`);
         } catch (e) {
             console.log(`Gagal menghapus desa dummy ${dd.namaDesa}, kemungkinan masih ada relasi.`);
         }
     }
  }

  // 4. Hapus kecamatan dummy
  console.log("Menghapus kecamatan dummy...");
  for (const dk of dummyKecs) {
    try {
      await db.delete(kecamatan).where(eq(kecamatan.id, dk.id));
      console.log(`Deleted kecamatan dummy: ${dk.namaKecamatan}`);
    } catch (e) {
      console.log(`Gagal menghapus kecamatan dummy ${dk.namaKecamatan}, kemungkinan masih ada relasi (misal desa dummy).`);
    }
  }

  // 5. Bersihkan kata " 2" pada entitas master lainnya (SPPG, Sekolah, dll)
  console.log("Membersihkan penamaan dummy (menghapus ' 2') pada master data...");
  const updatePromises = [
    db.execute(`UPDATE sppg SET nama_sppg = REPLACE(nama_sppg, ' 2', '') WHERE nama_sppg LIKE '% 2'`),
    db.execute(`UPDATE sekolah SET nama_sekolah = REPLACE(nama_sekolah, ' 2', '') WHERE nama_sekolah LIKE '% 2'`),
    db.execute(`UPDATE posyandu SET nama_posyandu = REPLACE(nama_posyandu, ' 2', '') WHERE nama_posyandu LIKE '% 2'`),
    db.execute(`UPDATE penggilingan SET nama_penggilingan = REPLACE(nama_penggilingan, ' 2', '') WHERE nama_penggilingan LIKE '% 2'`),
    db.execute(`UPDATE yayasan SET nama_yayasan = REPLACE(nama_yayasan, ' 2', '') WHERE nama_yayasan LIKE '% 2'`),
    db.execute(`UPDATE pemasok SET nama_pemasok = REPLACE(nama_pemasok, ' 2', '') WHERE nama_pemasok LIKE '% 2'`),
    db.execute(`UPDATE jenis_pangan SET nama_bahan = REPLACE(nama_bahan, ' 2', '') WHERE nama_bahan LIKE '% 2'`)
  ];

  await Promise.all(updatePromises);
  console.log("Pembersihan penamaan dummy berhasil.");
  console.log("Proses selesai!");
}

main().catch((e) => {
  console.error("Error selama pembersihan:", e);
  process.exit(1);
});
