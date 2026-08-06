import { db } from '../src/db';
import { user, account, penggilingan } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

async function seedPenggilingan() {
  console.log("Seeding penggilingan users...");

  const hashPassword = async (pwd: string) => {
    return await bcrypt.hash(pwd, 10);
  };

  const passwordHash = await hashPassword('password123');

  // Seed Penggilingan users
  const pabriks = await db.select().from(penggilingan);
  for (const p of pabriks) {
    const email = `penggilingan${p.id}@mbg.lebak.go.id`;
    
    // Check if user exists
    const existing = await db.select().from(user).where(eq(user.email, email));
    if (existing.length === 0) {
      const userId = crypto.randomUUID();
      await db.insert(user).values({
        id: userId,
        name: `Admin ${p.namaPenggilingan}`,
        email: email,
        emailVerified: true,
        role: 'operator_penggilingan',
        penggilinganId: p.id,
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
      console.log(`Created user for Penggilingan: ${email}`);
    } else {
      console.log(`User already exists for Penggilingan: ${email}`);
    }
  }

  console.log("Seeding complete!");
}

seedPenggilingan().catch(console.error);
