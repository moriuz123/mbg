import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(",") : undefined,
  trustHost: true,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "publik",
      },
      sppgId: { type: "number", required: false, fieldName: "sppg_id" },
      kecamatanId: { type: "number", required: false, fieldName: "kecamatan_id" },
      penggilinganId: { type: "number", required: false, fieldName: "penggilingan_id" },
      sekolahId: { type: "number", required: false, fieldName: "sekolah_id" },
      posyanduId: { type: "number", required: false, fieldName: "posyandu_id" },
    },
  },
  plugins: [
    username()
  ]
});
