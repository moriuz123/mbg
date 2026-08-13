import { db } from "./index";
import { jenisPangan } from "./schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Migrating komoditas categories...");

  // Update existing category values to match new requested categories
  await db.execute(sql`
    UPDATE jenis_pangan 
    SET kategori = CASE 
      WHEN kategori ILIKE '%karbo%' OR kategori ILIKE '%padi%' THEN 'Karbohidrat/ Padi- Padian'
      WHEN kategori ILIKE '%bumbu%' OR kategori ILIKE '%rempah%' THEN 'Bumbu/ Rempah'
      WHEN kategori ILIKE '%hewani%' OR kategori ILIKE '%daging%' OR kategori ILIKE '%ayam%' OR kategori ILIKE '%ikan%' THEN 'Protein Hewani'
      WHEN kategori ILIKE '%nabati%' OR kategori ILIKE '%kacang%' OR kategori ILIKE '%tahu%' OR kategori ILIKE '%tempe%' THEN 'Protein Nabati'
      WHEN kategori ILIKE '%sayur%' THEN 'Sayur'
      WHEN kategori ILIKE '%buah%' THEN 'Buah'
      WHEN kategori ILIKE '%susu%' THEN 'Susu'
      ELSE kategori
    END
    WHERE kategori IS NOT NULL;
  `);

  console.log("Category migration complete!");
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
