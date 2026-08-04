import { db } from "../src/db";
import { user } from "../src/db/schema";
import { auth } from "../src/lib/auth";

async function createUsers() {
  console.log("Creating default users for each role...");
  
  const usersToCreate = [
    { email: "superadmin@mbg.go.id", name: "Super Admin", role: "super_admin", password: "password123" },
    { email: "sppg.cibadak@mbg.go.id", name: "Admin SPPG Cibadak", role: "sppg", password: "password123" },
    { email: "penggilingan.berkah@mbg.go.id", name: "Mitra Penggilingan Berkah", role: "penggilingan_gabah", password: "password123" },
  ];

  for (const u of usersToCreate) {
    try {
      // Using better-auth to properly hash passwords and create user+account
      const newUser = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: u.password,
          name: u.name,
        }
      });
      
      // Update role manually since better-auth sign up might not take custom fields easily without plugin
      if (newUser && newUser.user) {
        await db.execute(`UPDATE "user" SET role = '${u.role}' WHERE id = '${newUser.user.id}'`);
        console.log(`Created user ${u.email} with role ${u.role}`);
      }
    } catch (e) {
      console.error(`Failed to create ${u.email}:`, e);
    }
  }
  process.exit(0);
}
createUsers();
