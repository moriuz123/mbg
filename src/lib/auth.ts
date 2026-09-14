import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

// During `next build`, Next imports route modules even though database/auth are runtime-only.
// A build-only secret prevents Better Auth from aborting module analysis.
// The runner image does NOT set MBG_BUILD_MODE, so production still requires BETTER_AUTH_SECRET.
const resolvedAuthSecret = process.env.BETTER_AUTH_SECRET ||
  (process.env.MBG_BUILD_MODE === "1"
    ? "4d84a7f2b6c94c64b1e951604a52af25821f4196fb42c2a1d9fe40b39eacf117"
    : undefined);

export const auth = betterAuth({
  secret: resolvedAuthSecret,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(",") : undefined,
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
      sppgId: {
        type: "number",
        required: false,
      },
      kecamatanId: {
        type: "number",
        required: false,
      },
      penggilinganId: {
        type: "number",
        required: false,
      },
      sekolahId: {
        type: "number",
        required: false,
      },
      posyanduId: {
        type: "number",
        required: false,
      },
    },
  },
  plugins: [
    username()
  ]
});
