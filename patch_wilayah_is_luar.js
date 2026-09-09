const fs = require('fs');
let code = fs.readFileSync('src/app/actions/wilayah.ts', 'utf8');

code = code.replace(/createKabupaten\(data: { namaKabupaten: string }\)/, 'createKabupaten(data: { namaKabupaten: string, isLuarBanten?: boolean })');
code = code.replace(/updateKabupaten\(id: number, data: { namaKabupaten: string }\)/, 'updateKabupaten(id: number, data: { namaKabupaten: string, isLuarBanten?: boolean })');

fs.writeFileSync('src/app/actions/wilayah.ts', code);
