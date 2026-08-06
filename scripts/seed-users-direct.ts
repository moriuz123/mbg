import { db } from '../src/db';
import { user, account, sppg, sekolah, penggilingan } from '../src/db/schema';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashPassword = async (pwd: string) => {
    return await bcrypt.hash(pwd, 10);
  };
  const passwordHash = await hashPassword('password123');

  // SPPG 5
  const s5 = crypto.randomUUID();
  await db.insert(user).values({ id: s5, name: 'Dapur Umum Rangkas', email: 'sppg5@mbg.lebak.go.id', username: 'sppg5', emailVerified: true, role: 'operator_sppg', sppgId: 5, createdAt: new Date(), updatedAt: new Date() });
  await db.insert(account).values({ id: crypto.randomUUID(), accountId: 'sppg5', providerId: 'credential', userId: s5, password: passwordHash, createdAt: new Date(), updatedAt: new Date() });

  // Sekolah 1
  const se1 = crypto.randomUUID();
  await db.insert(user).values({ id: se1, name: 'SDN 1 Rangkasbitung', email: 'sekolah1@mbg.lebak.go.id', username: 'sekolah1', emailVerified: true, role: 'operator_sekolah', sekolahId: 1, createdAt: new Date(), updatedAt: new Date() });
  await db.insert(account).values({ id: crypto.randomUUID(), accountId: 'sekolah1', providerId: 'credential', userId: se1, password: passwordHash, createdAt: new Date(), updatedAt: new Date() });

  // Penggilingan 1
  const p1 = crypto.randomUUID();
  await db.insert(user).values({ id: p1, name: 'Pabrik Beras Makmur Jaya', email: 'penggilingan1@mbg.lebak.go.id', username: 'penggilingan1', emailVerified: true, role: 'operator_penggilingan', penggilinganId: 1, createdAt: new Date(), updatedAt: new Date() });
  await db.insert(account).values({ id: crypto.randomUUID(), accountId: 'penggilingan1', providerId: 'credential', userId: p1, password: passwordHash, createdAt: new Date(), updatedAt: new Date() });

  console.log('Seeded users directly!');
}

seed().catch(console.error);
