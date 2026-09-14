import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  const res = await db.execute(sql`SELECT * FROM sppg WHERE nama_sppg ILIKE '%Muara Ciujung Barat 1%'`);
  console.log(res);
  process.exit(0);
}
main();
