import { db } from './src/db';
import { standarKecukupanGizi, kategoriPenerima } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Seeding AKG data...');

  const kat = await db.select().from(kategoriPenerima);
  const getKatId = (name: string) => kat.find(k => k.namaKategori === name)?.id;

  const akgData = [
    // PAUD/TK/RA (Makan Pagi)
    {
      kategoriId: getKatId('KB')!, jenisMakan: 'Pagi',
      minEnergiKkal: '280', maxEnergiKkal: '350',
      minProteinGram: '5', maxProteinGram: '6.3',
      minLemakGram: '10', maxLemakGram: '12.5',
      minKarbohidratGram: '44', maxKarbohidratGram: '55'
    },
    {
      kategoriId: getKatId('TK')!, jenisMakan: 'Pagi',
      minEnergiKkal: '280', maxEnergiKkal: '350',
      minProteinGram: '5', maxProteinGram: '6.3',
      minLemakGram: '10', maxLemakGram: '12.5',
      minKarbohidratGram: '44', maxKarbohidratGram: '55'
    },
    {
      kategoriId: getKatId('RA')!, jenisMakan: 'Pagi',
      minEnergiKkal: '280', maxEnergiKkal: '350',
      minProteinGram: '5', maxProteinGram: '6.3',
      minLemakGram: '10', maxLemakGram: '12.5',
      minKarbohidratGram: '44', maxKarbohidratGram: '55'
    },
    {
      kategoriId: getKatId('PAUD')!, jenisMakan: 'Pagi',
      minEnergiKkal: '280', maxEnergiKkal: '350',
      minProteinGram: '5', maxProteinGram: '6.3',
      minLemakGram: '10', maxLemakGram: '12.5',
      minKarbohidratGram: '44', maxKarbohidratGram: '55'
    },

    // SD/MI (Makan Pagi - Kelas 1-3)
    {
      kategoriId: getKatId('SD/MI')!, jenisMakan: 'Pagi',
      minEnergiKkal: '330', maxEnergiKkal: '413',
      minProteinGram: '8', maxProteinGram: '10',
      minLemakGram: '11', maxLemakGram: '13.8',
      minKarbohidratGram: '50', maxKarbohidratGram: '62.5'
    },
    // SD/MI (Makan Siang - Kelas 4-6)
    {
      kategoriId: getKatId('SD/MI')!, jenisMakan: 'Siang',
      minEnergiKkal: '585', maxEnergiKkal: '683',
      minProteinGram: '15.8', maxProteinGram: '18.4',
      minLemakGram: '19.5', maxLemakGram: '22.8',
      minKarbohidratGram: '87', maxKarbohidratGram: '101.5'
    },

    // SMP/MTS (Makan Siang)
    {
      kategoriId: getKatId('SMP/MTS')!, jenisMakan: 'Siang',
      minEnergiKkal: '668', maxEnergiKkal: '779',
      minProteinGram: '20.3', maxProteinGram: '23.6',
      minLemakGram: '22.5', maxLemakGram: '26.3',
      minKarbohidratGram: '97.5', maxKarbohidratGram: '113.8'
    },

    // SMA/SMK/MA (Makan Siang)
    {
      kategoriId: getKatId('SMA/SMK/MA')!, jenisMakan: 'Siang',
      minEnergiKkal: '713', maxEnergiKkal: '831',
      minProteinGram: '21', maxProteinGram: '24.5',
      minLemakGram: '23.3', maxLemakGram: '27.1',
      minKarbohidratGram: '105', maxKarbohidratGram: '122.5'
    },

    // Posyandu Bumil (Ibu Hamil - Makan Siang)
    {
      kategoriId: getKatId('Posyandu Bumil')!, jenisMakan: 'Siang',
      minEnergiKkal: '738', maxEnergiKkal: '861',
      minProteinGram: '23', maxProteinGram: '26.8',
      minLemakGram: '18.7', maxLemakGram: '21.8',
      minKarbohidratGram: '115.5', maxKarbohidratGram: '134.8'
    },

    // Posyandu Busui (Ibu Menyusui - Makan Siang)
    {
      kategoriId: getKatId('Posyandu Busui')!, jenisMakan: 'Siang',
      minEnergiKkal: '770', maxEnergiKkal: '898',
      minProteinGram: '23.3', maxProteinGram: '27.1',
      minLemakGram: '18.7', maxLemakGram: '21.8',
      minKarbohidratGram: '120', maxKarbohidratGram: '140'
    },

    // Posyandu Balita (Makan Pagi)
    {
      kategoriId: getKatId('Posyandu Balita')!, jenisMakan: 'Pagi',
      minEnergiKkal: '275', maxEnergiKkal: '344',
      minProteinGram: '4.5', maxProteinGram: '5.6',
      minLemakGram: '9.5', maxLemakGram: '11.9',
      minKarbohidratGram: '43.5', maxKarbohidratGram: '54.4'
    },
    // Posyandu Balita (Makan Siang)
    {
      kategoriId: getKatId('Posyandu Balita')!, jenisMakan: 'Siang',
      minEnergiKkal: '413', maxEnergiKkal: '481',
      minProteinGram: '6.7', maxProteinGram: '7.8',
      minLemakGram: '14.2', maxLemakGram: '16.6',
      minKarbohidratGram: '65.2', maxKarbohidratGram: '76.1'
    }
  ];

  await db.delete(standarKecukupanGizi);
  
  for (const akg of akgData) {
    await db.insert(standarKecukupanGizi).values(akg);
  }

  console.log('AKG Data seeded successfully!');
  process.exit(0);
}

seed().catch(console.error);
