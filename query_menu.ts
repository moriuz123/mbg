import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  const result = await db.execute(sql`SELECT * FROM sys_menu;`);
  console.log(result.rows);
  
  await db.execute(sql`UPDATE sys_menu SET nama_modul = 'Katalog Menu Harian' WHERE url = '/admin/standar-menu';`);
  const result2 = await db.execute(sql`SELECT * FROM sys_menu WHERE url = '/admin/standar-menu';`);
  console.log(result2.rows);
  process.exit(0);
}
main();
