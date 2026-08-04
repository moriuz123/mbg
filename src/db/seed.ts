import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mbg";
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding master data...");

  const dists = ["Penggilingan Rangkasbitung", "Peternakan Cibadak", "Pasar Induk Lebak", "KUD Maja", "Agen Telur Berkah"];
  for (let i=0; i<5; i++) {
    await db.insert(schema.masterDistributor).values({ id: crypto.randomUUID(), name: dists[i] });
  }

  const pangans = ["Beras Premium", "Daging Ayam", "Daging Sapi", "Telur Ayam", "Sayur Mayur"];
  for (let i=0; i<5; i++) {
    await db.insert(schema.masterJenisPangan).values({ id: crypto.randomUUID(), name: pangans[i] });
  }

  const params = ["Pestisida", "Formalin", "Boraks", "Rhodamin B", "E. Coli"];
  for (let i=0; i<5; i++) {
    await db.insert(schema.masterParameterUji).values({ id: crypto.randomUUID(), name: params[i] });
  }

  const gabahs = ["Petani Lokal - Desa Rangkasbitung", "KUD Lebak", "Kelompok Tani Makmur", "Koperasi Jaya", "Gapoktan Sejahtera"];
  for (let i=0; i<5; i++) {
    await db.insert(schema.masterSumberGabah).values({ id: crypto.randomUUID(), name: gabahs[i] });
  }

  const lokuses = ["SPPG Rangkasbitung", "SPPG Cibadak", "SPPG Kalanganyar", "SPPG Maja", "SPPG Warunggunung"];
  for (let i=0; i<5; i++) {
    await db.insert(schema.masterLokusSppg).values({ id: crypto.randomUUID(), name: lokuses[i] });
  }

  console.log("Seeding transaction data...");

  for (let i=0; i<5; i++) {
    await db.insert(schema.penggilinganGabah).values({
      id: crypto.randomUUID(),
      sumber: gabahs[i],
      volume: (Math.floor(Math.random() * 5000) + 1000).toString(),
      periode: `Minggu ${i+1}, Juli 2026`,
      status: 'Selesai'
    });
  }

  for (let i=0; i<5; i++) {
    await db.insert(schema.penggilinganDistribusi).values({
      id: crypto.randomUUID(),
      tujuan: lokuses[i],
      volume: (Math.floor(Math.random() * 3000) + 500).toString(),
      tanggal: `2026-07-0${i+1}`
    });
  }

  for (let i=0; i<5; i++) {
    const beli = Math.floor(Math.random() * 1000) + 100;
    const pakai = beli - Math.floor(Math.random() * 20);
    await db.insert(schema.sppgBahan).values({
      id: crypto.randomUUID(),
      jenis: pangans[i],
      volumeBeli: beli.toString(),
      volumePakai: pakai.toString(),
      sumber: dists[i],
      cp: `Admin ${dists[i]} (08123456789)`
    });
  }

  for (let i=0; i<5; i++) {
    await db.insert(schema.sppgRapidTest).values({
      id: crypto.randomUUID(),
      tanggal: `2026-07-0${i+1}`,
      bahan: pangans[i],
      parameter: params[i],
      hasil: i % 2 === 0 ? "Negatif (Aman)" : "Positif (Berbahaya)"
    });
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(console.error);
