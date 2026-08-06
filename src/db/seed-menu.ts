import { db } from "./index";
import { kategoriPenerima, standarMenuGizi } from "./schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Seeding Standar Menu Gizi Dummy...");

  const kategoris = await db.select().from(kategoriPenerima);
  if (kategoris.length === 0) {
    console.error("Kategori Penerima kosong. Tolong seed kategori terlebih dahulu.");
    process.exit(1);
  }

  const dummyMenus = [
    {
      namaMenu: "Menu Makan Siang Sehat (Ayam)",
      deskripsi: "Nasi putih, ayam bumbu kecap, sayur sop, buah pisang, dan susu.",
      kaloriKkal: 650,
      proteinGram: "25.5",
      karbohidratGram: "80.0",
      lemakGram: "15.0",
    },
    {
      namaMenu: "Menu Makan Siang Sehat (Telur)",
      deskripsi: "Nasi putih, telur balado, tumis buncis tempe, buah pepaya, dan susu.",
      kaloriKkal: 600,
      proteinGram: "22.0",
      karbohidratGram: "75.0",
      lemakGram: "18.0",
    },
    {
      namaMenu: "Menu Makan Siang Sehat (Ikan)",
      deskripsi: "Nasi putih, ikan kembung goreng, sayur asem, buah jeruk, dan susu.",
      kaloriKkal: 620,
      proteinGram: "28.0",
      karbohidratGram: "78.0",
      lemakGram: "14.0",
    },
    {
      namaMenu: "Menu Tambahan Ibu Hamil",
      deskripsi: "Kacang hijau rebus, susu kehamilan, telur rebus.",
      kaloriKkal: 400,
      proteinGram: "18.0",
      karbohidratGram: "45.0",
      lemakGram: "10.0",
    },
    {
      namaMenu: "Menu PMT Balita",
      deskripsi: "Bubur ayam lengkap dengan sayuran dan telur.",
      kaloriKkal: 350,
      proteinGram: "15.0",
      karbohidratGram: "40.0",
      lemakGram: "12.0",
    }
  ];

  for (const kat of kategoris) {
    console.log(`Seeding menu untuk kategori: ${kat.namaKategori}`);
    
    // Pilih menu berdasarkan nama kategori
    let menusToInsert = [];
    if (kat.namaKategori.toLowerCase().includes("ibu hamil") || kat.namaKategori.toLowerCase().includes("bumil")) {
      menusToInsert = [dummyMenus[3]];
    } else if (kat.namaKategori.toLowerCase().includes("balita") || kat.namaKategori.toLowerCase().includes("busui")) {
      menusToInsert = [dummyMenus[4], dummyMenus[0]]; // Beri sedikit variasi
    } else {
      // SD, SMP, SMA, PAUD
      menusToInsert = [dummyMenus[0], dummyMenus[1], dummyMenus[2]];
    }

    for (const menu of menusToInsert) {
      await db.insert(standarMenuGizi).values({
        ...menu,
        kategoriTargetId: kat.id,
        status: "Aktif",
      });
      console.log(` - Inserted: ${menu.namaMenu}`);
    }
  }

  console.log("Seeding Standar Menu Gizi Selesai!");
}

main().catch((err) => {
  console.error("Error seeding standar menu gizi:", err);
  process.exit(1);
});
