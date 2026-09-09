const fs = require('fs');
let code = fs.readFileSync('src/app/actions/sppgPengawasan.ts', 'utf8');

const stokFunc = `
export async function getKartuStok(sppgId?: number) {
  try {
    const { sppgId: userSppgId, isAdmin } = await getSessionData();
    const targetSppgId = isAdmin ? sppgId : userSppgId;

    const whereClause = targetSppgId ? eq(sppgPembelianBahan.sppgId, targetSppgId) : undefined;
    
    // Get all IN
    const inData = await db.query.sppgPembelianBahan.findMany({
      where: whereClause,
      with: { jenisPangan: true }
    });
    
    // Get all OUT
    const outClause = targetSppgId ? eq(sppgPemakaianBahan.sppgId, targetSppgId) : undefined;
    const outData = await db.query.sppgPemakaianBahan.findMany({
      where: outClause,
      with: { jenisPangan: true }
    });
    
    // Calculate Balance
    const stokMap = new Map();
    
    inData.forEach(d => {
      if (!d.jenisPangan) return;
      const key = d.jenisPangan.id;
      if (!stokMap.has(key)) {
        stokMap.set(key, { id: key, nama: d.jenisPangan.namaBahan, satuan: d.satuan || 'Kg', totalIn: 0, totalOut: 0, sisa: 0 });
      }
      const vol = parseFloat(String(d.volume)) || 0;
      stokMap.get(key).totalIn += vol;
      stokMap.get(key).sisa += vol;
    });
    
    outData.forEach(d => {
      if (!d.jenisPangan) return;
      const key = d.jenisPangan.id;
      if (!stokMap.has(key)) {
        stokMap.set(key, { id: key, nama: d.jenisPangan.namaBahan, satuan: d.satuan || 'Kg', totalIn: 0, totalOut: 0, sisa: 0 });
      }
      const vol = parseFloat(String(d.volume)) || 0;
      stokMap.get(key).totalOut += vol;
      stokMap.get(key).sisa -= vol;
    });
    
    return Array.from(stokMap.values()).sort((a, b) => b.sisa - a.sisa);
  } catch (error) {
    console.error('Error getKartuStok:', error);
    return [];
  }
}
`;

code += stokFunc;
fs.writeFileSync('src/app/actions/sppgPengawasan.ts', code);
