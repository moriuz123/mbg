const fs = require('fs');
const code = fs.readFileSync('src/app/actions/wilayah.ts', 'utf8');

const importsRe = /import { (.*?) } from \"@\/db\/schema\";/;
const match = code.match(importsRe);
let newCode = code;
if(match && !match[1].includes('kabupaten')) {
    const newImports = match[1] + ', kabupaten';
    newCode = code.replace(importsRe, `import { ${newImports} } from \"@/db/schema\";`);
}

if (!newCode.includes('getKabupaten')) {
    const kabupatenSection = `
// --- KABUPATEN ---
export async function getKabupaten() {
  return await db.query.kabupaten.findMany({
    orderBy: [desc(kabupaten.id)]
  });
}

export async function createKabupaten(data: { namaKabupaten: string }) {
  try {
    await db.insert(kabupaten).values(data);
    revalidatePath('/admin/master-data/kabupaten');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal membuat data kabupaten. Mungkin nama sudah ada.' };
  }
}

export async function updateKabupaten(id: number, data: { namaKabupaten: string }) {
  try {
    await db.update(kabupaten).set(data).where(eq(kabupaten.id, id));
    revalidatePath('/admin/master-data/kabupaten');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal mengupdate data kabupaten.' };
  }
}

export async function deleteKabupaten(id: number) {
  try {
    await db.delete(kabupaten).where(eq(kabupaten.id, id));
    revalidatePath('/admin/master-data/kabupaten');
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Gagal menghapus kabupaten. Pastikan tidak ada kecamatan yang terikat.' };
  }
}
`;
    newCode += kabupatenSection;
}

fs.writeFileSync('src/app/actions/wilayah.ts', newCode);
