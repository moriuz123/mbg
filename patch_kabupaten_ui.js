const fs = require('fs');
let code = fs.readFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', 'utf8');

// Replace standard terms
code = code.replace(/Kecamatan/g, 'Kabupaten');
code = code.replace(/kecamatan/g, 'kabupaten');
code = code.replace(/namaKecamatan/g, 'namaKabupaten');

// Write back
fs.writeFileSync('src/app/(admin)/admin/master-data/kabupaten/KabupatenClientUI.tsx', code);
