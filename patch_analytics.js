const fs = require('fs');

let code = fs.readFileSync('src/app/actions/sppgPengawasan.ts', 'utf8');

const analyticsCode = `
export async function getAdminLogisticsAnalytics() {
  try {
    const { isAdmin } = await getSessionData();
    if (!isAdmin) return null;

    // 1. Kapasitas Pembelian Mingguan & Pemetaan Sumber
    const pembelianList = await db.query.sppgPembelianBahan.findMany({
      with: {
        pemasok: {
          with: { kabupaten: true }
        },
        jenisPangan: true
      }
    });

    let totalPembelianVolume = 0;
    let volumeDalamLebak = 0;
    let volumeLuarLebak = 0;
    const trenPembelianMingguan: Record<string, number> = {};
    const pemasokDalamLebak = new Set<string>();
    const pemasokLuarLebak = new Set<string>();

    pembelianList.forEach(p => {
      const vol = parseFloat(String(p.volume)) || 0;
      totalPembelianVolume += vol;

      // Tren Mingguan (using minggu_ke or just month-year from tanggal)
      const weekKey = p.mingguKe ? \`Minggu \${p.mingguKe}\` : (p.tanggalPembelian ? p.tanggalPembelian.substring(0, 7) : 'Unknown');
      trenPembelianMingguan[weekKey] = (trenPembelianMingguan[weekKey] || 0) + vol;

      // Peta Sumber (Dalam vs Luar Lebak)
      const kab = p.pemasok?.kabupaten;
      const isLuarLebak = kab?.isLuarBanten || (kab && kab.namaKabupaten !== 'Kabupaten Lebak');
      
      const pemasokName = p.pemasok?.namaPemasok || 'Pemasok Tanpa Nama';

      if (isLuarLebak && p.pemasokId) {
        volumeLuarLebak += vol;
        pemasokLuarLebak.add(pemasokName);
      } else {
        // Includes null kabupaten (Default Lebak)
        volumeDalamLebak += vol;
        if (p.pemasokId) pemasokDalamLebak.add(pemasokName);
      }
    });

    // 2. Realisasi Pemakaian Mingguan
    const pemakaianList = await db.query.sppgPemakaianBahan.findMany();
    let totalPemakaianVolume = 0;
    const trenPemakaianMingguan: Record<string, number> = {};

    pemakaianList.forEach(p => {
      const vol = parseFloat(String(p.volume)) || 0;
      totalPemakaianVolume += vol;
      const dateStr = p.tanggalPemakaian ? p.tanggalPemakaian.substring(0, 7) : 'Unknown';
      trenPemakaianMingguan[dateStr] = (trenPemakaianMingguan[dateStr] || 0) + vol;
    });

    // 3. Tracking Hasil Uji Rapid Bermasalah
    const ujiList = await db.query.sppgUjiRapidTest.findMany({
      with: {
        sppg: true,
        jenisPangan: true,
        pembelian: {
          with: { pemasok: true }
        }
      }
    });

    const ujiBermasalah = ujiList.filter(u => 
      u.hasilUji !== 'Aman / Negatif' || 
      u.tindakanLanjut === 'Ditolak / Retur' ||
      (u.hasilUji || '').toLowerCase().includes('positif') ||
      (u.hasilUji || '').toLowerCase().includes('bahaya')
    ).map(u => ({
      id: u.id,
      tanggalUji: u.tanggalUji,
      sppgNama: u.sppg?.namaSppg,
      bahan: u.jenisPangan?.namaBahan,
      parameter: u.parameterUji || u.parameterMaster,
      hasil: u.hasilUji,
      tindakan: u.tindakanLanjut,
      pemasok: u.pembelian?.pemasok?.namaPemasok || 'Tidak Diketahui'
    })).sort((a, b) => new Date(b.tanggalUji).getTime() - new Date(a.tanggalUji).getTime());

    return {
      totalPembelianVolume,
      totalPemakaianVolume,
      volumeDalamLebak,
      volumeLuarLebak,
      persentaseLokal: totalPembelianVolume > 0 ? ((volumeDalamLebak / totalPembelianVolume) * 100).toFixed(1) : '0',
      pemasokDalamLebak: Array.from(pemasokDalamLebak),
      pemasokLuarLebak: Array.from(pemasokLuarLebak),
      trenPembelianMingguan,
      trenPemakaianMingguan,
      ujiBermasalah
    };

  } catch (error) {
    console.error('Error getAdminLogisticsAnalytics:', error);
    return null;
  }
}
`;

if (!code.includes('export async function getAdminLogisticsAnalytics')) {
  code += '\n' + analyticsCode;
  fs.writeFileSync('src/app/actions/sppgPengawasan.ts', code);
}
