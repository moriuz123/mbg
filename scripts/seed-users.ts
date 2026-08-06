import { db } from '../src/db';
import { user, account, sppg, sekolah } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

// A simple bcrypt hash replacement or use better-auth compatible password.
// For Better-Auth with credentials, we can just install 'bcryptjs' to hash.
import bcrypt from 'bcryptjs';

async function seed() {
  console.log("Seeding users...");

  const hashPassword = async (pwd: string) => {
    return await bcrypt.hash(pwd, 10);
  };

  const passwordHash = await hashPassword('password123');

  // Seed SPPG users
  const sppgs = await db.select().from(sppg);
  for (const s of sppgs) {
    const email = `sppg${s.id}@mbg.lebak.go.id`;
    
    // Check if user exists
    const existing = await db.select().from(user).where(eq(user.email, email));
    if (existing.length === 0) {
      const userId = crypto.randomUUID();
      await db.insert(user).values({
        id: userId,
        name: `Operator ${s.namaSppg}`,
        email: email,
        emailVerified: true,
        role: 'operator_sppg',
        sppgId: s.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: email,
        providerId: 'credential',
        userId: userId,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created user for SPPG: ${email}`);
    }
  }

  // Seed Sekolah users (Limit to first 5 for speed)
  const sekolahs = await db.select().from(sekolah).limit(5);
  for (const s of sekolahs) {
    const email = `sekolah${s.id}@mbg.lebak.go.id`;
    
    const existing = await db.select().from(user).where(eq(user.email, email));
    if (existing.length === 0) {
      const userId = crypto.randomUUID();
      await db.insert(user).values({
        id: userId,
        name: `Operator ${s.namaSekolah}`,
        email: email,
        emailVerified: true,
        role: 'operator_sekolah',
        sekolahId: s.id,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await db.insert(account).values({
        id: crypto.randomUUID(),
        accountId: email,
        providerId: 'credential',
        userId: userId,
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created user for Sekolah: ${email}`);
    }
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);
