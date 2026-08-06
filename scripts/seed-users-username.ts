import { db } from '../src/db';
import { user, sppg, sekolah, penggilingan } from '../src/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  // Register SPPG
  const sppgs = await db.select().from(sppg);
  for (const s of sppgs) {
    const email = `sppg${s.id}@mbg.lebak.go.id`;
    const username = `sppg${s.id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${s.namaSppg}` })
    });
    const data = await res.json();
    if (data.user) {
      await db.update(user).set({ role: 'operator_sppg', sppgId: s.id }).where(eq(user.id, data.user.id));
    } else {
      console.error(data);
    }
  }

  // Register Sekolah
  const sekolahs = await db.select().from(sekolah).limit(5);
  for (const s of sekolahs) {
    const email = `sekolah${s.id}@mbg.lebak.go.id`;
    const username = `sekolah${s.id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${s.namaSekolah}` })
    });
    const data = await res.json();
    if (data.user) {
      await db.update(user).set({ role: 'operator_sekolah', sekolahId: s.id }).where(eq(user.id, data.user.id));
    } else {
      console.error(data);
    }
  }

  // Register Penggilingan
  const penggilingans = await db.select().from(penggilingan);
  for (const p of penggilingans) {
    const email = `penggilingan${p.id}@mbg.lebak.go.id`;
    const username = `penggilingan${p.id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${p.namaPenggilingan}` })
    });
    const data = await res.json();
    if (data.user) {
      await db.update(user).set({ role: 'operator_penggilingan', penggilinganId: p.id }).where(eq(user.id, data.user.id));
    } else {
      console.error(data);
    }
  }

  console.log('Done!');
}

run().catch(console.error);
