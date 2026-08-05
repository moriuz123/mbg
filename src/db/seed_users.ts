import { auth } from "../lib/auth";
import { db } from "./index";
import { user } from "./schema";
import { eq } from "drizzle-orm";

async function seedUsers() {
  console.log("Seeding users...");

  const roles = [
    { email: "admin@lebak.go.id", role: "admin_dinas", name: "Admin Dinas" },
    { email: "sppg@lebak.go.id", role: "sppg", name: "Operator SPPG" },
    { email: "penggilingan@lebak.go.id", role: "operator_penggilingan", name: "Operator Penggilingan" },
    { email: "sekolah@lebak.go.id", role: "operator_sekolah", name: "Operator Sekolah" }
  ];

  for (const acc of roles) {
    try {
      // Create user via Better Auth
      const res = await auth.api.signUpEmail({
        body: {
          email: acc.email,
          password: "password123",
          name: acc.name,
        }
      });
      
      console.log(`Created account for ${acc.email}`);

      // Update role manually since sign up sets default
      await db.update(user).set({ role: acc.role }).where(eq(user.email, acc.email));
      console.log(`Updated role to ${acc.role} for ${acc.email}`);
    } catch (e) {
      console.error(`Failed to create ${acc.email}:`, e);
    }
  }
  
  console.log("Done!");
}

seedUsers().catch(console.error).finally(() => process.exit(0));
