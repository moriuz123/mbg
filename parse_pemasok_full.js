const XLSX = require('xlsx');
const postgres = require('postgres');
const sql = postgres('postgres://postgres:postgres@db:5432/mbg');

async function main() {
  const workbook = XLSX.readFile('docs/REKAP DATA SUPPLY CHAIN.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
  const data = XLSX.utils.sheet_to_json(sheet, { header: \"A\" });
  
  // Extract and deduplicate
  const pemasokMap = new Map();
  for (let i = 2; i < data.length; i++) { // Skip headers
      const row = data[i];
      if (row.D) {
          const nama = String(row.D).trim();
          const alamat = row.E ? String(row.E).trim() : null;
          if (nama && !pemasokMap.has(nama)) {
              pemasokMap.set(nama, alamat);
          }
      }
  }
  
  const uniquePemasok = Array.from(pemasokMap.entries()).map(([nama, alamat]) => ({ nama, alamat }));
  
  console.log(`Found ${uniquePemasok.length} unique pemasok.`);
  
  // Hard reset
  console.log('Truncating table pemasok...');
  await sql`TRUNCATE TABLE pemasok CASCADE`;
  
  // Insert
  console.log('Inserting data...');
  for (const p of uniquePemasok) {
      await sql`
          INSERT INTO pemasok (nama_pemasok, alamat_pemasok, tipe_pemasok) 
          VALUES (${p.nama}, ${p.alamat}, 'Lokal')
      `;
  }
  
  console.log('Data successfully inserted.');
  process.exit(0);
}

main().catch(console.error);
