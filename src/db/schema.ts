import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull().references(() => user.id),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// --- APPLICATION TABLES ---

export const masterDistributor = pgTable("master_distributor", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterJenisPangan = pgTable("master_jenis_pangan", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterParameterUji = pgTable("master_parameter_uji", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const penggilinganGabah = pgTable("penggilingan_gabah", {
  id: text("id").primaryKey(),
  sumber: text("sumber").notNull(),
  volume: text("volume").notNull(),
  periode: text("periode").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const penggilinganDistribusi = pgTable("penggilingan_distribusi", {
  id: text("id").primaryKey(),
  tujuan: text("tujuan").notNull(),
  volume: text("volume").notNull(),
  tanggal: text("tanggal").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sppgBahan = pgTable("sppg_bahan", {
  id: text("id").primaryKey(),
  jenis: text("jenis").notNull(),
  volumeBeli: text("volumeBeli").notNull(),
  volumePakai: text("volumePakai").notNull(),
  sumber: text("sumber").notNull(),
  cp: text("cp").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sppgRapidTest = pgTable("sppg_rapid_test", {
  id: text("id").primaryKey(),
  tanggal: text("tanggal").notNull(),
  bahan: text("bahan").notNull(),
  parameter: text("parameter").notNull(),
  hasil: text("hasil").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterSumberGabah = pgTable("master_sumber_gabah", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterLokusSppg = pgTable("master_lokus_sppg", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
