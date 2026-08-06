import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Dropping jumlah_b3 columns...");
  try {
    await db.execute(sql`ALTER TABLE posyandu DROP COLUMN IF EXISTS jumlah_b3;`);
    await db.execute(sql`ALTER TABLE sppg_posyandu_manfaat DROP COLUMN IF EXISTS jumlah_b3;`);
    console.log("Columns dropped successfully.");
  } catch (err) {
    console.error("Failed to drop columns:", err);
  }
  process.exit(0);
}

main();
