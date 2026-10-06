const XLSX = require('xlsx');
const postgres = require('postgres');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/mbg';
const sql = postgres(connectionString, { prepare: false });

const PWD_HASH = '1230640d3cb5426b2aa410fd25316081:96e820ce3f03dff2f4973f1c513b1e8d6bf076221251d17dfda103b5ab7fd88e2c1f1540849969d5f01ef1bfd5ede73b447e2f91b662a62fa9c3215f0ba75644';

function normalizeString(str) {
  if (!str) return '';
  return String(str).replace(/[\u200E\u200F\u2060\uFEFF]/g, '').trim();
}

function parseSchoolCell(cellValue, defaultCategory) {
  if (!cellValue || cellValue === '-' || cellValue === 0 || cellValue === '0') return [];
  const text = normalizeString(cellValue);
  const formatted = text.replace(/([0-9\)])\s{3,}([A-Za-z0-9])/g, '$1\n$2');
  const lines = formatted.split(/\n+/);
  const result = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line || line === '-') continue;
    line = line.replace(/^\d+[\.\)]\s*/, '').trim();
    if (!line) continue;
    
    let name = line;
    let count = 0;
    
    const parenMatch = line.match(/^(.*?)\s*\((\d+)\)\s*$/);
    const colonMatch = line.match(/^(.*?)\s*:\s*(\d+)\s*$/);
    const jmlMatch = line.match(/^(.*?)\s*(?:JUMLAH|Jumlah|jml)\s*:?\s*(\d+)\s*$/i);
    
    if (parenMatch) {
      name = parenMatch[1].trim();
      count = parseInt(parenMatch[2], 10);
    } else if (colonMatch) {
      name = colonMatch[1].trim();
      count = parseInt(colonMatch[2], 10);
    } else if (jmlMatch) {
      name = jmlMatch[1].trim();
      count = parseInt(jmlMatch[2], 10);
    }
    
    let cat = defaultCategory;
    const upper = name.toUpperCase();
    if (upper.startsWith('TK ') || upper.startsWith('TKN ') || upper.includes(' TK ')) cat = 'TK';
    else if (upper.startsWith('KB ') || upper.includes(' KB ')) cat = 'KB';
    else if (upper.startsWith('RA ') || upper.includes(' RA ')) cat = 'RA';
    else if (upper.startsWith('PAUD ') || upper.includes(' PAUD ')) cat = 'PAUD';
    else if (upper.startsWith('SDN ') || upper.startsWith('SD ') || upper.startsWith('SDIT ') || upper.startsWith('MI ') || upper.startsWith('MIS ')) cat = 'SD/MI';
    else if (upper.startsWith('SMPN ') || upper.startsWith('SMP ') || upper.startsWith('MTS ') || upper.startsWith('MTSS ')) cat = 'SMP/MTS';
    else if (upper.startsWith('SMAN ') || upper.startsWith('SMA ') || upper.startsWith('SMKN ') || upper.startsWith('SMK ') || upper.startsWith('SMKS ') || upper.startsWith('MA ')) cat = 'SMA/SMK/MA';
    
    result.push({ name, count, category: cat });
  }
  return result;
}

function parsePosyanduRow(row) {
  const bumilText = normalizeString(row[16]);
  const busuiText = normalizeString(row[17]);
  const balitaText = normalizeString(row[18]);
  
  function parseLines(text) {
    if (!text || text === '-' || text === '0' || text === 'undefined') return {};
    const formatted = text.replace(/([0-9\)])\s{3,}([A-Za-z0-9])/g, '$1\n$2');
    const lines = formatted.split(/\n+/);
    const map = {};
    for (let line of lines) {
      line = line.trim().replace(/^\d+[\.\)]\s*/, '');
      if (!line) continue;
      let name = line;
      let count = 0;
      const parenMatch = line.match(/^(.*?)\s*\((\d+)\)\s*$/);
      const colonMatch = line.match(/^(.*?)\s*:\s*(\d+)\s*$/);
      const jmlMatch = line.match(/^(.*?)\s*(?:JUMLAH|Jumlah|jml)\s*:?\s*(\d+)\s*$/i);
      if (parenMatch) {
        name = parenMatch[1].trim();
        count = parseInt(parenMatch[2], 10);
      } else if (colonMatch) {
        name = colonMatch[1].trim();
        count = parseInt(colonMatch[2], 10);
      } else if (jmlMatch) {
        name = jmlMatch[1].trim();
        count = parseInt(jmlMatch[2], 10);
      }
      
      if (name.toUpperCase().includes('TULIP')) {
        name = 'Posyandu Tulip 4 & 5';
      } else if (name.toUpperCase().includes('MELATI 1')) {
        name = 'Posyandu Melati 1 sd 12';
      }
      map[name] = (map[name] || 0) + count;
    }
    return map;
  }
  
  const bumil = parseLines(bumilText);
  const busui = parseLines(busuiText);
  const balita = parseLines(balitaText);
  
  const allNames = Array.from(new Set([...Object.keys(bumil), ...Object.keys(busui), ...Object.keys(balita)]));
  return allNames.map(name => {
    const cBumil = bumil[name] || 0;
    const cBusui = busui[name] || 0;
    const cBalita = balita[name] || 0;
    return {
      name,
      bumil: cBumil,
      busui: cBusui,
      balita: cBalita,
      total: cBumil + cBusui + cBalita
    };
  });
}

async function main() {
  console.log('🚀 Reading Excel file...');
  const workbook = XLSX.readFile('/app/docs/data sppg pilot projek.xls');
  const sheet = workbook.Sheets['Sheet1'];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // Map category names to IDs
  const catRows = await sql`SELECT kategori_id, nama_kategori FROM kategori_penerima`;
  const catMap = {};
  catRows.forEach(c => { catMap[c.nama_kategori] = c.kategori_id; });
  console.log('Kategori Map:', catMap);

  // Metadata SPPG
  const sppgConfigs = [
    {
      sppg_id: 1,
      no: 1,
      rowIdx: 3,
      desa_id: 296, // Pasar Keong
      kecamatan_id: 3, // Cibadak
      defaultCode: 'SPPG-CIBADAK-01'
    },
    {
      sppg_id: 2,
      no: 2,
      rowIdx: 4,
      desa_id: 283, // Cibuah
      kecamatan_id: 4, // Warunggunung
      defaultCode: 'F02FDYHJ'
    },
    {
      sppg_id: 3,
      no: 3,
      rowIdx: 5,
      desa_id: 324, // Aweh
      kecamatan_id: 26, // Kalanganyar
      defaultCode: 'V8YJWA3W'
    },
    {
      sppg_id: 4,
      no: 4,
      rowIdx: 6,
      desa_id: 309, // Muara Ciujung Timur
      kecamatan_id: 2, // Rangkasbitung
      defaultCode: 'WBAV2N4K'
    },
    {
      sppg_id: 5,
      no: 5,
      rowIdx: 7,
      desa_id: 320, // Muara Ciujung Barat
      kecamatan_id: 2, // Rangkasbitung
      defaultCode: 'VYHRF3PX'
    }
  ];

  const parsedSppgs = [];
  for (const cfg of sppgConfigs) {
    const row = data[cfg.rowIdx];
    const namaSppg = normalizeString(row[2]);
    const idSppgCode = row[3] ? normalizeString(row[3]) : cfg.defaultCode;
    const yayasanNama = normalizeString(row[4]);
    const alamat = normalizeString(row[5]);
    const statusOperasional = normalizeString(row[6]) || 'Sudah Operasional';
    const kaSppg = normalizeString(row[7]);
    
    const schools = [];
    schools.push(...parseSchoolCell(row[9], 'KB'));
    schools.push(...parseSchoolCell(row[10], 'TK'));
    schools.push(...parseSchoolCell(row[11], 'RA'));
    schools.push(...parseSchoolCell(row[12], 'PAUD'));
    schools.push(...parseSchoolCell(row[13], 'SD/MI'));
    schools.push(...parseSchoolCell(row[14], 'SMP/MTS'));
    schools.push(...parseSchoolCell(row[15], 'SMA/SMK/MA'));
    
    const posyandus = parsePosyanduRow(row);
    
    parsedSppgs.push({
      ...cfg,
      namaSppg,
      idSppgCode,
      yayasanNama,
      alamat,
      statusOperasional,
      kaSppg,
      schools,
      posyandus
    });
  }

  console.log('📊 Parsed 5 SPPGs.');
  let totalSchools = 0;
  let totalPosyandus = 0;
  parsedSppgs.forEach(s => {
    totalSchools += s.schools.length;
    totalPosyandus += s.posyandus.length;
    console.log(`- SPPG ${s.sppg_id}: ${s.namaSppg} (${s.schools.length} sekolah, ${s.posyandus.length} posyandu)`);
  });
  console.log(`Total: ${totalSchools} sekolah, ${totalPosyandus} posyandu`);

  // Start Transaction
  console.log('⚡ Starting Database Transaction...');
  await sql.begin(async (tx) => {
    // 1. Ensure Yayasan exists
    for (const s of parsedSppgs) {
      const existing = await tx`SELECT yayasan_id FROM yayasan WHERE nama_yayasan = ${s.yayasanNama}`;
      let yId;
      if (existing.length > 0) {
        yId = existing[0].yayasan_id;
      } else {
        const ins = await tx`
          INSERT INTO yayasan (nama_yayasan, desa_id, kecamatan_id, alamat)
          VALUES (${s.yayasanNama}, ${s.desa_id}, ${s.kecamatan_id}, ${s.alamat})
          RETURNING yayasan_id
        `;
        yId = ins[0].yayasan_id;
      }
      s.yayasan_id = yId;
    }

    // 2. Update SPPGs (sppg_id 1 to 5)
    for (const s of parsedSppgs) {
      await tx`
        UPDATE sppg SET
          nama_sppg = ${s.namaSppg},
          id_sppg_code = ${s.idSppgCode},
          desa_id = ${s.desa_id},
          yayasan_id = ${s.yayasan_id},
          alamat = ${s.alamat},
          status_operasional = ${s.statusOperasional},
          nama_ka_sppg = ${s.kaSppg},
          updated_at = NOW()
        WHERE sppg_id = ${s.sppg_id}
      `;
      
      // Update SPPG User Account
      await tx`
        UPDATE "user" SET
          name = ${'Operator ' + s.namaSppg},
          sppg_id = ${s.sppg_id},
          "updatedAt" = NOW()
        WHERE username = ${'sppg' + s.sppg_id}
      `;
      const sppgUser = await tx`SELECT id FROM "user" WHERE username = ${'sppg' + s.sppg_id}`;
      if (sppgUser.length > 0) {
        await tx`UPDATE account SET password = ${PWD_HASH} WHERE "userId" = ${sppgUser[0].id}`;
      }
      console.log(`✓ Updated SPPG ${s.sppg_id}: ${s.namaSppg}`);
    }

    // 3. Delete dependent tables for schools & posyandu
    const adminUser = await tx`SELECT id FROM "user" WHERE username = 'admin'`;
    if (adminUser.length > 0) {
      await tx`UPDATE account SET password = ${PWD_HASH} WHERE "userId" = ${adminUser[0].id}`;
      console.log('✓ Ensured admin password is password123');
    }

    console.log('🧹 Cleaning old penerima manfaat & activity reports...');
    await tx`DELETE FROM sekolah_laporan_aktifitas`;
    await tx`DELETE FROM posyandu_laporan_aktifitas`;
    await tx`DELETE FROM sppg_laporan_aktifitas`;
    await tx`DELETE FROM sppg_penerima_manfaat`;
    await tx`DELETE FROM sppg_posyandu_manfaat`;
    await tx`DELETE FROM sekolah_penerimaan_mbg`;
    await tx`DELETE FROM posyandu_penerimaan_mbg`;
    await tx`DELETE FROM sekolah`;
    await tx`DELETE FROM posyandu`;

    // Restart sequences
    await tx`ALTER TABLE sekolah ALTER COLUMN sekolah_id RESTART WITH 1`;
    await tx`ALTER TABLE posyandu ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE sppg_penerima_manfaat ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE sppg_posyandu_manfaat ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE sekolah_penerimaan_mbg ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE posyandu_penerimaan_mbg ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE sppg_laporan_aktifitas ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE sekolah_laporan_aktifitas ALTER COLUMN id RESTART WITH 1`;
    await tx`ALTER TABLE posyandu_laporan_aktifitas ALTER COLUMN id RESTART WITH 1`;

    // 4. Clean up old sekolah & posyandu user accounts
    console.log('🧹 Cleaning old operator sekolah & posyandu user accounts...');
    const oldUsers = await tx`SELECT id FROM "user" WHERE role IN ('operator_sekolah', 'operator_posyandu')`;
    for (const u of oldUsers) {
      await tx`DELETE FROM account WHERE "userId" = ${u.id}`;
      await tx`DELETE FROM session WHERE "userId" = ${u.id}`;
      await tx`DELETE FROM "user" WHERE id = ${u.id}`;
    }

    // 5. Insert all Schools & Create User Accounts
    console.log('🏫 Inserting schools and user accounts...');
    let currentSekolahId = 1;
    const now = new Date();

    for (const s of parsedSppgs) {
      for (const sch of s.schools) {
        const kId = catMap[sch.category] || catMap['SD/MI'] || 5;
        
        let dId = s.desa_id;
        const upper = sch.name.toUpperCase();
        if (upper.includes('PANANCANGAN')) dId = 298;
        else if (upper.includes('PASAR KEONG')) dId = 296;
        else if (upper.includes('CISANGU')) dId = 300;
        else if (upper.includes('PASIRTANGKIL')) dId = 279;
        else if (upper.includes('BAROS')) dId = 284;
        else if (upper.includes('SINDANG SARI') || upper.includes('SINDANGSARI')) dId = 285;
        else if (upper.includes('PASIRKUPA') || upper.includes('PASIR KUPA')) dId = 323;
        else if (upper.includes('SUKAMEKARSARI')) dId = 325;
        else if (upper.includes('KALANGANYAR')) dId = 326;
        else if (upper.includes('RANGKASBITUNG BARAT')) dId = 308;
        else if (upper.includes('MUARA CIUJUNG TIMUR')) dId = 309;
        else if (upper.includes('MUARA CIUJUNG BARAT')) dId = 320;

        const insertedSekolah = await tx`
          INSERT INTO sekolah (
            nama_sekolah,
            kategori_id,
            desa_id,
            kecamatan_id,
            jumlah_siswa_laki,
            jumlah_siswa_perempuan,
            jumlah_siswa_total,
            tahun_ajaran_last,
            keterangan
          ) VALUES (
            ${sch.name},
            ${kId},
            ${dId},
            ${s.kecamatan_id},
            ${Math.floor(sch.count / 2)},
            ${Math.ceil(sch.count / 2)},
            ${sch.count},
            '2026/2027',
            ${'Penerima Manfaat SPPG ' + s.namaSppg}
          ) RETURNING sekolah_id
        `;
        const sekId = insertedSekolah[0].sekolah_id;

        // Link to SPPG in sppg_penerima_manfaat
        await tx`
          INSERT INTO sppg_penerima_manfaat (
            sppg_id,
            sekolah_id,
            tahun_ajaran,
            jumlah_laki,
            jumlah_perempuan,
            jumlah_total,
            status,
            tanggal_mulai,
            status_verifikasi
          ) VALUES (
            ${s.sppg_id},
            ${sekId},
            '2026/2027',
            ${Math.floor(sch.count / 2)},
            ${Math.ceil(sch.count / 2)},
            ${sch.count},
            'Aktif',
            '2026-01-01',
            'Terverifikasi'
          )
        `;

        // Link in sekolah_penerimaan_mbg
        await tx`
          INSERT INTO sekolah_penerimaan_mbg (
            sekolah_id,
            sppg_id,
            status,
            tanggal_mulai_mbg,
            tahun_ajaran,
            jumlah_hari_operasional
          ) VALUES (
            ${sekId},
            ${s.sppg_id},
            'Aktif',
            '2026-01-01',
            '2026/2027',
            20
          )
        `;

        // Create User Account
        const username = `sekolah${currentSekolahId}`;
        const email = `sekolah${currentSekolahId}@mbg.lebak.go.id`;
        const userId = `sekolah_user_${currentSekolahId}_${Date.now()}`;
        const accountId = `account_sekolah_${currentSekolahId}_${Date.now()}`;

        await tx`
          INSERT INTO "user" (
            id,
            name,
            username,
            email,
            "emailVerified",
            role,
            sekolah_id,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${userId},
            ${sch.name},
            ${username},
            ${email},
            false,
            'operator_sekolah',
            ${sekId},
            ${now},
            ${now}
          )
        `;

        await tx`
          INSERT INTO account (
            id,
            "accountId",
            "providerId",
            "userId",
            password,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${accountId},
            ${userId},
            'credential',
            ${userId},
            ${PWD_HASH},
            ${now},
            ${now}
          )
        `;

        currentSekolahId++;
      }
    }
    console.log(`✓ Inserted ${currentSekolahId - 1} schools & users.`);

    // 6. Insert all Posyandus & Create User Accounts
    console.log('🏥 Inserting posyandus and user accounts...');
    let currentPosyanduId = 1;

    for (const s of parsedSppgs) {
      for (const pos of s.posyandus) {
        const insertedPosyandu = await tx`
          INSERT INTO posyandu (
            nama_posyandu,
            desa_id,
            kecamatan_id,
            jumlah_bumil,
            jumlah_busui,
            jumlah_balita,
            jumlah_total,
            keterangan
          ) VALUES (
            ${pos.name},
            ${s.desa_id},
            ${s.kecamatan_id},
            ${pos.bumil},
            ${pos.busui},
            ${pos.balita},
            ${pos.total},
            ${'Penerima Manfaat SPPG ' + s.namaSppg}
          ) RETURNING id
        `;
        const posId = insertedPosyandu[0].id;

        // Link in sppg_posyandu_manfaat
        await tx`
          INSERT INTO sppg_posyandu_manfaat (
            sppg_id,
            posyandu_id,
            jumlah_bumil,
            jumlah_busui,
            jumlah_balita,
            jumlah_total,
            status,
            tanggal_mulai,
            status_verifikasi
          ) VALUES (
            ${s.sppg_id},
            ${posId},
            ${pos.bumil},
            ${pos.busui},
            ${pos.balita},
            ${pos.total},
            'Aktif',
            '2026-01-01',
            'Terverifikasi'
          )
        `;

        // Link in posyandu_penerimaan_mbg
        await tx`
          INSERT INTO posyandu_penerimaan_mbg (
            posyandu_id,
            sppg_id,
            status,
            tanggal_mulai_mbg
          ) VALUES (
            ${posId},
            ${s.sppg_id},
            'Aktif',
            '2026-01-01'
          )
        `;

        // Create User Account
        const username = `posyandu${currentPosyanduId}`;
        const email = `posyandu${currentPosyanduId}@mbg.lebak.go.id`;
        const userId = `posyandu_user_${currentPosyanduId}_${Date.now()}`;
        const accountId = `account_posyandu_${currentPosyanduId}_${Date.now()}`;

        await tx`
          INSERT INTO "user" (
            id,
            name,
            username,
            email,
            "emailVerified",
            role,
            posyandu_id,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${userId},
            ${pos.name},
            ${username},
            ${email},
            false,
            'operator_posyandu',
            ${posId},
            ${now},
            ${now}
          )
        `;

        await tx`
          INSERT INTO account (
            id,
            "accountId",
            "providerId",
            "userId",
            password,
            "createdAt",
            "updatedAt"
          ) VALUES (
            ${accountId},
            ${userId},
            'credential',
            ${userId},
            ${PWD_HASH},
            ${now},
            ${now}
          )
        `;

        currentPosyanduId++;
      }
    }
    console.log(`✓ Inserted ${currentPosyanduId - 1} posyandus & users.`);

    // 7. Seed active daily delivery & verification for SPPG 1..5
    console.log('📦 Seeding active delivery reports & two-way verification...');
    
    // Ensure standard menu exists for each SPPG
    for (let spId = 1; spId <= 5; spId++) {
      const existingMenu = await tx`SELECT id FROM standar_menu_gizi WHERE sppg_id = ${spId} LIMIT 1`;
      if (existingMenu.length === 0) {
        await tx`
          INSERT INTO standar_menu_gizi (
            nama_menu, deskripsi, sppg_id, jenis_makan, kalori_kkal, protein_gram, karbohidrat_gram, lemak_gram, status
          ) VALUES (
            'Nasi Ayam Semur & Sayur Sehat',
            'Paket menu makan bergizi seimbang lengkap dengan lauk hewani, nabati, sayur, dan buah.',
            ${spId},
            'Siang',
            650,
            24.50,
            75.00,
            18.00,
            'Aktif'
          )
        `;
      }
    }

    // Pick first school per SPPG for verified delivery today
    for (const s of parsedSppgs) {
      const menuForSppg = await tx`SELECT id FROM standar_menu_gizi WHERE sppg_id = ${s.sppg_id} LIMIT 1`;
      const menuId = menuForSppg.length > 0 ? menuForSppg[0].id : 1;

      const firstSchool = await tx`
        SELECT s.sekolah_id, s.nama_sekolah, s.jumlah_siswa_total 
        FROM sekolah s
        JOIN sppg_penerima_manfaat pm ON pm.sekolah_id = s.sekolah_id
        WHERE pm.sppg_id = ${s.sppg_id}
        LIMIT 1
      `;
      if (firstSchool.length > 0) {
        const sch = firstSchool[0];
        const lapIns = await tx`
          INSERT INTO sppg_laporan_aktifitas (
            sppg_id,
            sekolah_id,
            tanggal,
            standar_menu_id,
            jumlah_porsi,
            status,
            foto_dokumentasi,
            catatan,
            status_verifikasi
          ) VALUES (
            ${s.sppg_id},
            ${sch.sekolah_id},
            CURRENT_DATE,
            ${menuId},
            ${sch.jumlah_siswa_total || 200},
            'Diterima',
            ${'https://placehold.co/600x400/EEE/31343C?text=Pengiriman+SPPG+' + s.sppg_id},
            'Pengiriman makanan bergizi pilot project',
            'Terverifikasi'
          ) RETURNING id
        `;
        const lapId = lapIns[0].id;

        await tx`
          INSERT INTO sekolah_laporan_aktifitas (
            sppg_laporan_id,
            sekolah_id,
            tanggal_diterima,
            status_diterima,
            jumlah_porsi_diterima,
            kondisi_makanan,
            catatan,
            status_verifikasi,
            diverifikasi_oleh
          ) VALUES (
            ${lapId},
            ${sch.sekolah_id},
            NOW(),
            'Diterima Lengkap',
            ${sch.jumlah_siswa_total || 200},
            'Baik',
            'Makanan telah diterima lengkap dan sesuai standar gizi.',
            'Terverifikasi',
            ${`Operator ${sch.nama_sekolah}`}
          )
        `;
      }

      // If SPPG has posyandu, seed 1 delivery
      const firstPos = await tx`
        SELECT p.id, p.nama_posyandu, p.jumlah_total 
        FROM posyandu p
        JOIN sppg_posyandu_manfaat pm ON pm.posyandu_id = p.id
        WHERE pm.sppg_id = ${s.sppg_id}
        LIMIT 1
      `;
      if (firstPos.length > 0) {
        const pos = firstPos[0];
        const lapPosIns = await tx`
          INSERT INTO sppg_laporan_aktifitas (
            sppg_id,
            posyandu_id,
            tanggal,
            standar_menu_id,
            jumlah_porsi,
            status,
            foto_dokumentasi,
            catatan,
            status_verifikasi
          ) VALUES (
            ${s.sppg_id},
            ${pos.id},
            CURRENT_DATE,
            ${menuId},
            ${pos.jumlah_total || 50},
            'Diterima',
            ${'https://placehold.co/600x400/EEE/31343C?text=Posyandu+SPPG+' + s.sppg_id},
            'Pengiriman paket gizi posyandu (bumil, busui, balita)',
            'Terverifikasi'
          ) RETURNING id
        `;
        const lapPosId = lapPosIns[0].id;

        await tx`
          INSERT INTO posyandu_laporan_aktifitas (
            sppg_laporan_id,
            posyandu_id,
            tanggal_diterima,
            status_diterima,
            jumlah_porsi_diterima,
            kondisi_makanan,
            catatan,
            status_verifikasi,
            diverifikasi_oleh
          ) VALUES (
            ${lapPosId},
            ${pos.id},
            NOW(),
            'Diterima Lengkap',
            ${pos.jumlah_total || 50},
            'Baik',
            'Paket makanan bergizi posyandu diterima dalam kondisi segar.',
            'Terverifikasi',
            ${`Kader ${pos.nama_posyandu}`}
          )
        `;
      }
    }
    console.log('✓ Successfully created sample verified delivery reports.');
  });

  console.log('🎉 ALL DATA SYNCED SUCCESSFULLY!');
}

main()
  .catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  })
  .finally(() => {
    sql.end();
  });
