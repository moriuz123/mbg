import { db } from './src/db/index';
import { sql } from 'drizzle-orm';

async function main() {
  const res = await db.execute(sql`
    SELECT 
      p.penggilingan_id,
      p.nama_penggilingan,
      p.kapasitas_terpasang_kg_minggu as kapasitas,
      
      COALESCE(SUM(CASE WHEN sg.lokasi_wilayah LIKE 'Dalam%' THEN CAST(sg.volume_kg AS NUMERIC) ELSE 0 END), 0) as gabah_dalam,
      COALESCE(SUM(CASE WHEN sg.lokasi_wilayah LIKE 'Luar%' THEN CAST(sg.volume_kg AS NUMERIC) ELSE 0 END), 0) as gabah_luar,
      
      COALESCE(SUM(CASE WHEN d.wilayah_distribusi LIKE 'Dalam%' THEN CAST(d.volume_kg AS NUMERIC) ELSE 0 END), 0) as beras_dalam,
      COALESCE(SUM(CASE WHEN d.wilayah_distribusi LIKE 'Luar%' THEN CAST(d.volume_kg AS NUMERIC) ELSE 0 END), 0) as beras_luar

    FROM penggilingan p
    LEFT JOIN penggilingan_sumber_gabah sg ON p.penggilingan_id = sg.penggilingan_id
    LEFT JOIN penggilingan_distribusi d ON p.penggilingan_id = d.penggilingan_id
    GROUP BY p.penggilingan_id, p.nama_penggilingan, p.kapasitas_terpasang_kg_minggu
    ORDER BY p.nama_penggilingan ASC
  `);
  console.log(res);
  process.exit(0);
}
main();
