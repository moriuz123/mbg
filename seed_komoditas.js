const XLSX = require('xlsx');
const postgres = require('postgres');
const sql = postgres('postgres://postgres:postgres@db:5432/mbg');

async function main() {
  const workbook = XLSX.readFile('docs/REKAP DATA SUPPLY CHAIN.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]]; 
  const data = XLSX.utils.sheet_to_json(sheet, { header: "A" });
  
  // Extract and deduplicate from column C
  const komoditasSet = new Set();
  for (let i = 2; i < data.length; i++) { // Skip headers
      const row = data[i];
      if (row.C) {
          let nama = String(row.C).trim();
          if (nama) {
             // Let's capitalize first letter of each word to keep it clean
             nama = nama.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
             komoditasSet.add(nama);
          }
      }
  }
  
  const excelKomoditas = Array.from(komoditasSet);
  console.log(`Found ${excelKomoditas.length} unique komoditas in Excel.`);
  
  // Get existing
  const existingRows = await sql`SELECT nama_bahan FROM jenis_pangan`;
  const existingNames = new Set(existingRows.map(r => r.nama_bahan.toLowerCase()));
  
  let addedCount = 0;
  for (const nama of excelKomoditas) {
      if (!existingNames.has(nama.toLowerCase())) {
          console.log(`Adding new komoditas: ${nama}`);
          await sql`
              INSERT INTO jenis_pangan (nama_bahan, kategori, satuan_default) 
              VALUES (${nama}, 'Bahan Pokok', 'Kilogram')
          `;
          addedCount++;
          existingNames.add(nama.toLowerCase());
      }
  }
  
  console.log(`Successfully added ${addedCount} new komoditas.`);
  process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
