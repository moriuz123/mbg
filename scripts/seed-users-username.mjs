import pg from 'pg';

const { Client } = pg;
const client = new Client({
  connectionString: 'postgres://postgres:postgres@localhost:5432/mbg'
});

async function run() {
  await client.connect();
  
  // Register SPPG
  const sppgRes = await client.query('SELECT sppg_id, nama_sppg FROM sppg');
  for (const s of sppgRes.rows) {
    const email = `sppg${s.sppg_id}@mbg.lebak.go.id`;
    const username = `sppg${s.sppg_id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${s.nama_sppg}` })
    });
    const data = await res.json();
    if (data.user) {
      await client.query('UPDATE "user" SET role = $1, sppg_id = $2 WHERE id = $3', ['operator_sppg', s.sppg_id, data.user.id]);
    } else {
      console.error(data);
    }
  }

  // Register Sekolah
  const sekolahRes = await client.query('SELECT sekolah_id, nama_sekolah FROM sekolah LIMIT 5');
  for (const s of sekolahRes.rows) {
    const email = `sekolah${s.sekolah_id}@mbg.lebak.go.id`;
    const username = `sekolah${s.sekolah_id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${s.nama_sekolah}` })
    });
    const data = await res.json();
    if (data.user) {
      await client.query('UPDATE "user" SET role = $1, sekolah_id = $2 WHERE id = $3', ['operator_sekolah', s.sekolah_id, data.user.id]);
    } else {
      console.error(data);
    }
  }

  // Register Penggilingan
  const penggilinganRes = await client.query('SELECT penggilingan_id, nama_penggilingan FROM penggilingan');
  for (const p of penggilinganRes.rows) {
    const email = `penggilingan${p.penggilingan_id}@mbg.lebak.go.id`;
    const username = `penggilingan${p.penggilingan_id}`;
    console.log(`Registering ${username}...`);
    const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password: 'password123', name: `Admin ${p.nama_penggilingan}` })
    });
    const data = await res.json();
    if (data.user) {
      await client.query('UPDATE "user" SET role = $1, penggilingan_id = $2 WHERE id = $3', ['operator_penggilingan', p.penggilingan_id, data.user.id]);
    } else {
      console.error(data);
    }
  }

  await client.end();
  console.log('Done!');
}

run().catch(console.error);
