import { auth } from "./src/lib/auth";
import { db } from "./src/db/index";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const accounts = [
    { email: "paud.alhidayah@lebak.go.id", name: "Kepsek PAUD Alhidayah", role: "operator_sekolah", sekolahId: 1 },
    { email: "sdn1.mcb@lebak.go.id", name: "Kepsek SDN 1 MCB", role: "operator_sekolah", sekolahId: 2 },
    { email: "sdn2.mcb@lebak.go.id", name: "Kepsek SDN 2 MCB", role: "operator_sekolah", sekolahId: 3 },
    { email: "smpn1.rangkas@lebak.go.id", name: "Kepsek SMPN 1 Rangkas", role: "operator_sekolah", sekolahId: 4 },
    { email: "posyandu.tulip@lebak.go.id", name: "Kader Posyandu Tulip", role: "operator_posyandu", posyanduId: 1 }
  ];

  for (const acc of accounts) {
    try {
      // Create user
      const res = await auth.api.signUpEmail({
        body: {
          email: acc.email,
          password: "password123",
          name: acc.name,
        }
      });
      console.log(`Created account for ${acc.email}`);
      
      // Update role and relation
      const updateData: any = { role: acc.role };
      if (acc.sekolahId) updateData.sekolahId = acc.sekolahId;
      if (acc.posyanduId) updateData.posyanduId = acc.posyanduId;
      
      await db.update(user).set(updateData).where(eq(user.email, acc.email));
      console.log(`Updated role and relation for ${acc.email}`);
    } catch (e: any) {
      console.error(`Error for ${acc.email}: ${e.message}`);
    }
  }
}
main().then(() => process.exit(0));
