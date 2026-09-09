const fs = require('fs');
let code = fs.readFileSync('src/components/PengawasanClient.tsx', 'utf8');

// 1. Remove table header 'Harga Total'
code = code.replace('<th className="px-6 py-4">Harga Total</th>', '');

// 2. Remove table cell 'hargaTotal'
const tdHargaTotal = /{d\.hargaTotal \? \ : '-'}/;
code = code.replace(tdHargaTotal, '');
// Wait, we need to remove the whole <td> wrapping it.
code = code.replace(/<td className="px-6 py-4">\s*\{d\.hargaTotal [\s\S]*?<\/td>/, '');

// 3. Remove form field 'Harga Total Pembelian'
const formHargaTotal = /<div>\s*<label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Harga Total Pembelian \(Rp\)<\/label>[\s\S]*?<\/div>/;
code = code.replace(formHargaTotal, '');

fs.writeFileSync('src/components/PengawasanClient.tsx', code);
