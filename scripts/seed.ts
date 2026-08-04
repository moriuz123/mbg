import { db } from "../src/db";
import { sppg, sppgPenerimaManfaat, sppgSupplyChain } from "../src/db/schema";
import * as XLSX from "xlsx";
import crypto from "crypto";
import 'dotenv/config';

async function seed() {
  console.log("Seeding started...");

  // Parse SPPG Excel
  const sppgFile = "./datanya/SPPG KABUPATEN LEBAK.xlsx";
  const sppgWb = XLSX.readFile(sppgFile);
  
  for (const sheetName of sppgWb.SheetNames) {
    const ws = sppgWb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
    
    // Find header row (usually row index 3, but let's find 'NO' or 'DESA')
    let headerIdx = -1;
    for (let i = 0; i < Math.min(10, data.length); i++) {
      if (data[i] && data[i].includes('NAMA SPPG')) {
        headerIdx = i;
        break;
      }
    }

    if (headerIdx !== -1) {
      for (let i = headerIdx + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[2]) continue; // Nama SPPG is at idx 2 if NO, DESA, NAMA SPPG

        // Check if SPPG ID is already used to avoid conflicts, or just blindly insert
        const namaSppg = String(row[2]).trim();
        const idSppg = row[3] ? String(row[3]).trim() : `SPPG-${Date.now()}-${i}`;
        
        const sppgId = crypto.randomUUID();

        try {
          await db.insert(sppg).values({
            id: sppgId,
            idSppg: idSppg,
            namaSppg: namaSppg,
            desa: row[1] ? String(row[1]) : '',
            namaYayasan: row[4] ? String(row[4]) : '',
            alamatSppg: row[5] ? String(row[5]) : '',
            statusOperasional: row[6] ? String(row[6]) : '',
            tanggalOperasional: row[7] ? String(row[7]) : '',
            bpjs: row[8] ? String(row[8]) : '',
            namaKasppg: row[9] ? String(row[9]) : '',
            noHpKasppg: row[10] ? String(row[10]) : '',
            jumlahPenerimaManfaat: row[11] ? String(row[11]) : '',
            bpjsTk: row[25] ? String(row[25]) : '',
            penjamahMakanan: row[26] ? String(row[26]) : '',
            chefBersertifikatBnsp: row[27] ? String(row[27]) : '',
            ikl: row[28] ? String(row[28]) : '',
            slhs: row[29] ? String(row[29]) : '',
            haccp: row[30] ? String(row[30]) : '',
            halal: row[31] ? String(row[31]) : '',
            ipal: row[32] ? String(row[32]) : '',
            isoo: row[33] ? String(row[33]) : '',
            jumlahRelawan: row[34] ? String(row[34]) : '',
          });
          console.log(`Inserted SPPG: ${namaSppg}`);
        } catch (e) {
          console.error(`Error inserting ${namaSppg}:`, e);
        }
      }
    }
  }

  console.log("SPPG Seeding completed!");

  const scFile = "./datanya/REKAP DATA SUPPLY CHAIN.xlsx";
  const scWb = XLSX.readFile(scFile);
  const scWs = scWb.Sheets[scWb.SheetNames[0]];
  const scData = XLSX.utils.sheet_to_json(scWs, { header: 1 }) as string[][];

  let scHeaderIdx = -1;
  for (let i = 0; i < Math.min(10, scData.length); i++) {
    if (scData[i] && scData[i].includes('NAMA SPPG')) {
      scHeaderIdx = i;
      break;
    }
  }

  if (scHeaderIdx !== -1) {
    for (let i = scHeaderIdx + 1; i < scData.length; i++) {
      const row = scData[i];
      if (!row || !row[1]) continue;

      // 1: NAMA SPPG, 2: JENIS PANGAN, 3: NAMA PEMASOK, 4: ALAMAT PEMASOK, 5: KEBUTUHAN, 6: SATUAN
      const targetSppgName = String(row[1]).trim();
      
      const targetSppg = await db.query.sppg.findFirst({
        where: (s, { ilike }) => ilike(s.namaSppg, `%${targetSppgName}%`)
      });

      const assignedId = targetSppg ? targetSppg.id : '00000000-0000-0000-0000-000000000000'; // Default unknown if not found

      try {
        await db.insert(sppgSupplyChain).values({
          id: crypto.randomUUID(),
          sppgId: assignedId,
          jenisPanganSegar: row[2] ? String(row[2]) : '',
          namaPemasok: row[3] ? String(row[3]) : '',
          alamatPemasok: row[4] ? String(row[4]) : '',
          kebutuhanPerBulan: row[5] ? String(row[5]) : '',
          satuan: row[6] ? String(row[6]) : '',
        });
        console.log(`Inserted Supply Chain for: ${targetSppgName}`);
      } catch (e) {
        console.error(`Error inserting Supply Chain for ${targetSppgName}:`, e);
      }
    }
  }

  console.log("Supply Chain Seeding completed!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
