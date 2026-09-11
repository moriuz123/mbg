const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://mbg_user:mbg_password@localhost:5432/mbg_db'
  });
  await client.connect();
  
  await client.query("UPDATE sys_menu SET nama_modul = 'Katalog Menu Harian' WHERE url = '/admin/standar-menu';");
  const res = await client.query("SELECT * FROM sys_menu WHERE url = '/admin/standar-menu';");
  console.log(res.rows);
  
  await client.end();
}
main().catch(console.error);
