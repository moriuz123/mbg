import { db } from '../db';
import { sppg, sekolah, posyandu, user, account, session } from '../db/schema';
import { eq, notInArray, inArray, isNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  console.log('--- Mulai Cleanup & Sinkronisasi User ---');

  // 1. Ensure posyandu_id exists in user table (raw SQL)
  try {
    await db.execute(sql`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "posyandu_id" integer;`);
    console.log('Kolom posyandu_id berhasil dipastikan ada di tabel user.');
  } catch (err: any) {
    console.error('Gagal menambahkan kolom posyandu_id:', err.message);
  }

  // 2. Fetch Master Data
  const sppgs = await db.select({ id: sppg.id, nama: sppg.namaSppg }).from(sppg);
  const sekolahs = await db.select({ id: sekolah.id, nama: sekolah.namaSekolah }).from(sekolah);
  const posyandus = await db.select({ id: posyandu.id, nama: posyandu.namaPosyandu }).from(posyandu);

  const sppgIds = sppgs.map(s => s.id);
  const sekolahIds = sekolahs.map(s => s.id);
  const posyanduIds = posyandus.map(p => p.id);

  console.log(`Ditemukan: ${sppgIds.length} SPPG, ${sekolahIds.length} Sekolah, ${posyanduIds.length} Posyandu.`);

  // 3. Fetch All Users
  const allUsers = await db.select().from(user);
  console.log(`Total user saat ini: ${allUsers.length}`);

  const usersToDelete: string[] = [];

  // 4. Identify Invalid Users
  for (const u of allUsers) {
    if (u.role === 'sppg' || u.role === 'operator_sppg') {
      if (!u.sppgId || !sppgIds.includes(u.sppgId)) usersToDelete.push(u.id);
    } else if (u.role === 'sekolah' || u.role === 'operator_sekolah') {
      if (!u.sekolahId || !sekolahIds.includes(u.sekolahId)) usersToDelete.push(u.id);
    } else if (u.role === 'posyandu' || u.role === 'operator_posyandu') {
      if (!u.posyanduId || !posyanduIds.includes(u.posyanduId)) usersToDelete.push(u.id);
    }
  }

  // 5. Delete Invalid Users
  if (usersToDelete.length > 0) {
    console.log(`Menghapus ${usersToDelete.length} user yang usang/tidak valid...`);
    // Delete dependencies first
    await db.delete(session).where(inArray(session.userId, usersToDelete));
    await db.delete(account).where(inArray(account.userId, usersToDelete));
    // Delete users
    await db.delete(user).where(inArray(user.id, usersToDelete));
    console.log('Penghapusan selesai.');
  } else {
    console.log('Tidak ada user usang yang perlu dihapus.');
  }

  // 6. Create Missing Users
  // Refetch remaining users to check who exists
  const remainingUsers = await db.select().from(user);
  const existingSppgIds = remainingUsers.filter(u => u.sppgId).map(u => u.sppgId);
  const existingSekolahIds = remainingUsers.filter(u => u.sekolahId).map(u => u.sekolahId);
  const existingPosyanduIds = remainingUsers.filter(u => u.posyanduId).map(u => u.posyanduId);

  let createdCount = 0;
  // Helper to create user via better-auth API
  const createUser = async (role: string, targetId: number, targetName: string, idField: 'sppgId' | 'sekolahId' | 'posyanduId', prefix: string) => {
    const username = `${prefix}${targetId}`;
    const email = `${username}@mbglebak.id`;
    
    // Check if username/email already exists to avoid conflict
    const conflict = await db.select().from(user).where(sql`username = ${username} OR email = ${email}`);
    if (conflict.length > 0) return; // Skip if conflict somehow

    const payload = {
      email,
      password: 'password123',
      name: targetName,
      username,
      role
    };
    (payload as any)[idField] = targetId;

    try {
      const res = await fetch('http://localhost:3000/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        createdCount++;
      } else {
        console.error(`Gagal membuat user ${username}:`, data);
      }
    } catch (err: any) {
      console.error(`Error membuat user ${username}:`, err.message);
    }
  };
  
  for (const s of sppgs) {
    if (!existingSppgIds.includes(s.id)) {
      await createUser('operator_sppg', s.id, s.nama, 'sppgId', 'sppg');
    }
  }

  for (const s of sekolahs) {
    if (!existingSekolahIds.includes(s.id)) {
      await createUser('operator_sekolah', s.id, s.nama, 'sekolahId', 'sekolah');
    }
  }

  for (const p of posyandus) {
    if (!existingPosyanduIds.includes(p.id)) {
      await createUser('operator_posyandu', p.id, p.nama, 'posyanduId', 'posyandu');
    }
  }

  console.log(`Selesai membuat ${createdCount} user baru!`);
  
  // Update passwords script instructions
  console.log('PENTING: User dibuat langsung di database tanpa password. Untuk login, Anda mungkin perlu mereset password atau kami harus mengatur script yang menggunakan API auth untuk register.');
  process.exit(0);
}

main().catch(console.error);
