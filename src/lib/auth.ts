import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
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
