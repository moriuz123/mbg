import { db } from "./index";
import { kecamatan, desa } from "./schema";
import { eq } from "drizzle-orm";

async function fetchLebakWilayah() {
  console.log("Fetching districts from API...");
  const resDistricts = await fetch('https://emsifa.github.io/api-wilayah-indonesia/api/districts/3602.json');
  const districts: any[] = await resDistricts.json();

  console.log(`Found ${districts.length} kecamatan. Syncing to DB...`);

  let insertedKecamatan = 0;
  let insertedDesa = 0;

  for (const dist of districts) {
    // Formatting name (e.g. "MALINGPING" -> "Malingping")
    const namaKec = dist.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    // Insert or update Kecamatan
    const kecResult = await db.insert(kecamatan)
      .values({ namaKecamatan: namaKec })
      .onConflictDoUpdate({
        target: kecamatan.namaKecamatan,
        set: { namaKecamatan: namaKec } // dummy update to get returning
      })
      .returning();

    let kecId;
    if (kecResult.length > 0) {
      kecId = kecResult[0].id;
      insertedKecamatan++;
    } else {
      // If returning didn't work (which happens on conflict do nothing), fetch it
      const existing = await db.select().from(kecamatan).where(eq(kecamatan.namaKecamatan, namaKec)).limit(1);
      kecId = existing[0].id;
    }

    // Fetch villages for this district
    console.log(`Fetching villages for ${namaKec}...`);
    const resVillages = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/villages/${dist.id}.json`);
    const villages: any[] = await resVillages.json();

    const desaValues = villages.map(v => {
      const namaDes = v.name.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      return {
        namaDesa: namaDes,
        kecamatanId: kecId
      };
    });

    if (desaValues.length > 0) {
      for (const d of desaValues) {
        try {
          await db.insert(desa).values(d).onConflictDoNothing();
          insertedDesa++;
        } catch (e) {
          // ignore unique constraint
        }
      }
    }
  }

  console.log(`Successfully synced ${insertedKecamatan} Kecamatan and ${insertedDesa} Desa/Kelurahan.`);
}

fetchLebakWilayah().catch(e => {
  console.error(e);
  process.exit(1);
});
