import { db } from "./index";
import { kecamatan } from "./schema";

const KECAMATAN_LEBAK = [
  "Banjarsari",
  "Bayah",
  "Bojongmanik",
  "Cibadak",
  "Cibeber",
  "Cigemblong",
  "Cihara",
  "Cijaku",
  "Cikulur",
  "Cileles",
  "Cilograng",
  "Cimarga",
  "Cipanas",
  "Cirinten",
  "Curugbitung",
  "Gunungkencana",
  "Kalanganyar",
  "Lebakgedong",
  "Leuwidamar",
  "Maja",
  "Malingping",
  "Muncang",
  "Panggarangan",
  "Rangkasbitung",
  "Sajira",
  "Sobang",
  "Wanasalam",
  "Warunggunung"
];

async function main() {
  console.log("Seeding 28 Kecamatan Kabupaten Lebak...");

  let insertedCount = 0;
  for (const nama of KECAMATAN_LEBAK) {
    try {
      await db.insert(kecamatan).values({ namaKecamatan: nama }).onConflictDoNothing({ target: kecamatan.namaKecamatan });
      insertedCount++;
    } catch (error) {
      console.error(`Gagal memasukkan ${nama}:`, error);
    }
  }

  console.log(`Berhasil memproses ${insertedCount} kecamatan.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
