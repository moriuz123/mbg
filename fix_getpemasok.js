const fs = require('fs');
let code = fs.readFileSync('src/app/actions/masterData.ts', 'utf8');

code = code.replace(/export async function getPemasok\(\) \{ return await db\.query\.pemasok\.findMany\(\{ with: \{ kabupaten: true \}, orderBy: \[desc\(pemasok\.id\)\] \}\); \}\n\/\/ \n  return await db\.query\.pemasok\.findMany\(\{\n    orderBy: \[desc\(pemasok\.id\)\],\n  \}\);\n\}/, 
`export async function getPemasok() {
  return await db.query.pemasok.findMany({
    with: { kabupaten: true },
    orderBy: [desc(pemasok.id)],
  });
}`);

fs.writeFileSync('src/app/actions/masterData.ts', code);
