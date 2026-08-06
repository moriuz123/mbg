import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/mbg";
const sql = postgres(connectionString);

async function main() {
  console.log("Seeding dummy Penerima Manfaat...");

  try {
    const sppgs = await sql`SELECT id FROM sppg LIMIT 1`;
    
    if (sppgs.length === 0) {
      console.log("No SPPG found. Please seed SPPG first.");
      process.exit(1);
    }

    const sppg_id = sppgs[0].id;
    const categories = await sql`SELECT kategori_id as id, nama_kategori as nama FROM kategori_penerima`;

    // PAUD
    let catPaud = categories.find(c => c.nama.includes('PAUD') || c.nama.includes('TK'));
    // SD
    let catSd = categories.find(c => c.nama.includes('SD'));
    // SMP
    let catSmp = categories.find(c => c.nama.includes('SMP'));

    // Insert dummy schools if they don't exist
    await sql`
      INSERT INTO sekolah (nama_sekolah, kategori_id)
      VALUES 
        ('TK Dummy 1', ${catPaud ? catPaud.id : 2}),
        ('SD Dummy 1', ${catSd ? catSd.id : 5}),
        ('SMP Dummy 1', ${catSmp ? catSmp.id : 6})
      ON CONFLICT DO NOTHING
    `;

    const schools = await sql`SELECT id, kategori_id FROM sekolah LIMIT 3`;

    if(schools.length < 3) {
       console.log("Not enough schools.");
       return;
    }

    // Insert to sppg_penerima_manfaat
    await sql`
      INSERT INTO sppg_penerima_manfaat (sppg_id, sekolah_id, tahun_ajaran, jumlah_laki, jumlah_perempuan, jumlah_total, status, tanggal_mulai)
      VALUES 
        (${sppg_id}, ${schools[0].id}, '2025/2026', 45, 50, 95, 'Aktif', CURRENT_DATE),
        (${sppg_id}, ${schools[1].id}, '2025/2026', 150, 160, 310, 'Aktif', CURRENT_DATE),
        (${sppg_id}, ${schools[2].id}, '2025/2026', 200, 215, 415, 'Aktif', CURRENT_DATE)
    `;

    console.log("Successfully inserted dummy Penerima Manfaat!");
  } catch (error) {
    console.error("Error seeding dummy data:", error);
  } finally {
    await sql.end();
  }
}

main();
