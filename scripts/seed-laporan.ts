import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { db } from "../src/db";

async function main() {
  console.log("Seeding dummy Laporan Harian...");

  try {
    // Check if we have any SPPG and Sekolah
    const sppgs = await db.select().from(schema.sppg).limit(3);
    const sekolahs = await db.select().from(schema.sekolah).limit(3);

    if (sppgs.length === 0 || sekolahs.length === 0) {
      console.log("Not enough SPPG or Sekolah data. Seeding SPPG and Sekolah first if needed.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const dummyData = [
      {
        sppgId: sppgs[0].id,
        sekolahId: sekolahs[0].id,
        tanggal: today,
        menu: "Nasi, Ayam Goreng, Sayur Sop, Tempe, Buah Pisang",
        jumlahPorsi: 120,
        status: "Terkirim",
        catatan: "Pengiriman tepat waktu",
      },
      {
        sppgId: sppgs[1] ? sppgs[1].id : sppgs[0].id,
        sekolahId: sekolahs[1] ? sekolahs[1].id : sekolahs[0].id,
        tanggal: today,
        menu: "Nasi, Ikan Bakar, Sayur Lodeh, Tahu, Jeruk",
        jumlahPorsi: 85,
        status: "Diterima",
        catatan: "Diterima oleh pihak sekolah dalam kondisi baik",
      },
      {
        sppgId: sppgs[2] ? sppgs[2].id : sppgs[0].id,
        sekolahId: sekolahs[2] ? sekolahs[2].id : sekolahs[0].id,
        tanggal: today,
        menu: "Nasi, Telur Dadar, Tumis Kangkung, Kerupuk, Semangka",
        jumlahPorsi: 150,
        status: "Bermasalah",
        catatan: "Terlambat 15 menit karena kendala cuaca",
      },
      {
        sppgId: sppgs[0].id,
        sekolahId: sekolahs[1] ? sekolahs[1].id : sekolahs[0].id,
        tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        menu: "Nasi, Daging Rendang, Sayur Nangka, Apel",
        jumlahPorsi: 85,
        status: "Terkirim",
        catatan: "Ok",
      }
    ];

    await db.insert(schema.sppgLaporanAktifitas).values(dummyData);
    console.log("Successfully inserted dummy Laporan Harian!");

  } catch (error) {
    console.error("Error seeding dummy data:", error);
  } finally {
    process.exit(0);
  }
}

main();
