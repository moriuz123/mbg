import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mbg";
const sql = postgres(connectionString);

async function main() {
  console.log("Seeding dummy Laporan Harian...");

  try {
    const sppgs = await sql`SELECT id FROM sppg LIMIT 3`;
    const sekolahs = await sql`SELECT id FROM sekolah LIMIT 3`;

    if (sppgs.length === 0 || sekolahs.length === 0) {
      console.log("Not enough SPPG or Sekolah data. Cannot insert dummy reports.");
      process.exit(1);
    }

    const today = new Date().toISOString().split('T')[0];

    await sql`
      INSERT INTO sppg_laporan_aktifitas (sppg_id, sekolah_id, tanggal, menu, jumlah_porsi, status, catatan)
      VALUES 
        (${sppgs[0].id}, ${sekolahs[0].id}, ${today}, 'Nasi, Ayam Goreng, Sayur Sop, Tempe, Buah Pisang', 120, 'Terkirim', 'Pengiriman tepat waktu'),
        (${sppgs[1] ? sppgs[1].id : sppgs[0].id}, ${sekolahs[1] ? sekolahs[1].id : sekolahs[0].id}, ${today}, 'Nasi, Ikan Bakar, Sayur Lodeh, Tahu, Jeruk', 85, 'Diterima', 'Diterima oleh pihak sekolah dalam kondisi baik'),
        (${sppgs[2] ? sppgs[2].id : sppgs[0].id}, ${sekolahs[2] ? sekolahs[2].id : sekolahs[0].id}, ${today}, 'Nasi, Telur Dadar, Tumis Kangkung, Kerupuk, Semangka', 150, 'Bermasalah', 'Terlambat 15 menit karena kendala cuaca'),
        (${sppgs[0].id}, ${sekolahs[1] ? sekolahs[1].id : sekolahs[0].id}, CURRENT_DATE - INTERVAL '1 day', 'Nasi, Daging Rendang, Sayur Nangka, Apel', 85, 'Terkirim', 'Ok')
    `;

    console.log("Successfully inserted dummy Laporan Harian!");
  } catch (error) {
    console.error("Error seeding dummy data:", error);
  } finally {
    await sql.end();
  }
}

main();
