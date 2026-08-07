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

    let menus = await db.select().from(schema.standarMenuGizi).limit(2);
    let standarMenuId1;
    let standarMenuId2;
    if (menus.length === 0) {
      const insertedMenus = await db.insert(schema.standarMenuGizi).values([
        { namaMenu: "Nasi, Ayam Goreng, Sayur Sop, Tempe, Buah Pisang", kaloriKkal: 600, status: "Aktif" },
        { namaMenu: "Nasi, Ikan Bakar, Sayur Lodeh, Tahu, Jeruk", kaloriKkal: 650, status: "Aktif" }
      ]).returning({ id: schema.standarMenuGizi.id });
      standarMenuId1 = insertedMenus[0].id;
      standarMenuId2 = insertedMenus[1].id;
    } else {
      standarMenuId1 = menus[0].id;
      standarMenuId2 = menus[1] ? menus[1].id : menus[0].id;
    }

    const today = new Date().toISOString().split('T')[0];

    const dummyData = [
      {
        sppgId: sppgs[0].id,
        sekolahId: sekolahs[0].id,
        tanggal: today,
        standarMenuId: standarMenuId1,
        jumlahPorsi: 120,
        status: "Terkirim",
        catatan: "Pengiriman tepat waktu",
      },
      {
        sppgId: sppgs[1] ? sppgs[1].id : sppgs[0].id,
        sekolahId: sekolahs[1] ? sekolahs[1].id : sekolahs[0].id,
        tanggal: today,
        standarMenuId: standarMenuId2,
        jumlahPorsi: 85,
        status: "Diterima",
        catatan: "Diterima oleh pihak sekolah dalam kondisi baik",
      },
      {
        sppgId: sppgs[2] ? sppgs[2].id : sppgs[0].id,
        sekolahId: sekolahs[2] ? sekolahs[2].id : sekolahs[0].id,
        tanggal: today,
        standarMenuId: standarMenuId1,
        jumlahPorsi: 150,
        status: "Bermasalah",
        catatan: "Terlambat 15 menit karena kendala cuaca",
      },
      {
        sppgId: sppgs[0].id,
        sekolahId: sekolahs[1] ? sekolahs[1].id : sekolahs[0].id,
        tanggal: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        standarMenuId: standarMenuId2,
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
