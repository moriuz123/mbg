import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: text("role").default("super_admin").notNull(), // super_admin, sppg, penggilingan_gabah
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

// --- APPLICATION TABLES (Updated for SPPG & Supply Chain) ---

export const sppg = pgTable("sppg", {
  id: text("id").primaryKey(),
  idSppg: text("id_sppg").notNull(), // Kode unik SPPG (misal: VYHRF3PX)
  namaSppg: text("nama_sppg").notNull(),
  desa: text("desa"),
  namaYayasan: text("nama_yayasan"),
  alamatSppg: text("alamat_sppg"),
  statusOperasional: text("status_operasional"),
  tanggalOperasional: text("tanggal_operasional"),
  bpjs: text("bpjs"),
  bpjsTk: text("bpjs_tk"),
  namaKasppg: text("nama_kasppg"),
  noHpKasppg: text("no_hp_kasppg"),
  jumlahPenerimaManfaat: text("jumlah_penerima_manfaat"), // Bisa diubah ke integer jika data valid
  jumlahRelawan: text("jumlah_relawan"),
  penjamahMakanan: text("penjamah_makanan"),
  chefBersertifikatBnsp: text("chef_bersertifikat_bnsp"),
  ikl: text("ikl"),
  slhs: text("slhs"),
  haccp: text("haccp"),
  halal: text("halal"),
  ipal: text("ipal"),
  isoo: text("isoo"),
  keterangan: text("keterangan"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sppgPenerimaManfaat = pgTable("sppg_penerima_manfaat", {
  id: text("id").primaryKey(),
  sppgId: text("sppg_id").notNull().references(() => sppg.id),
  kategori: text("kategori").notNull(), // KB, TK, SD/MI, SMP/MTS, SMA/SMK/MA, POSYANDU, dll
  keterangan: text("keterangan"), // Nama sekolah/posyandu & jumlah
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sppgSupplyChain = pgTable("sppg_supply_chain", {
  id: text("id").primaryKey(),
  sppgId: text("sppg_id").notNull().references(() => sppg.id),
  jenisPanganSegar: text("jenis_pangan_segar").notNull(), // Beras, Ayam, dll
  namaPemasok: text("nama_pemasok").notNull(),
  alamatPemasok: text("alamat_pemasok"),
  kebutuhanPerBulan: text("kebutuhan_per_bulan"),
  satuan: text("satuan"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterDistributor = pgTable("master_distributor", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterSekolah = pgTable("master_sekolah", {
  id: text("id").primaryKey(),
  namaSekolah: text("nama_sekolah").notNull(),
  jenjang: text("jenjang").notNull(), // SD, SMP, SMA, PAUD
  alamat: text("alamat").notNull(),
  jumlahSiswa: text("jumlah_siswa").notNull(),
  sppgId: text("sppg_id").references(() => sppg.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterPemasok = pgTable("master_pemasok", {
  id: text("id").primaryKey(),
  namaPemasok: text("nama_pemasok").notNull(),
  kategori: text("kategori").notNull(), // Petani, Koperasi, PT, CV, dll
  alamat: text("alamat"),
  kontak: text("kontak"),
  status: text("status").default("Aktif").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterJenisPangan = pgTable("master_jenis_pangan", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sysMenu = pgTable("sys_menu", {
  id: text("id").primaryKey(),
  namaModul: text("nama_modul").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  hakAkses: text("hak_akses").notNull(), // e.g. "super_admin,sppg"
  status: text("status").default("Aktif").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sppgRapidTest = pgTable("sppg_rapid_test", {
  id: text("id").primaryKey(),
  sppgId: text("sppg_id").references(() => sppg.id),
  tanggal: text("tanggal").notNull(),
  bahan: text("bahan").notNull(),
  parameter: text("parameter").notNull(),
  hasil: text("hasil").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const penggilingan_gabah = pgTable("penggilingan_gabah", {
  id: text("id").primaryKey(),
  namaPemilik: text("nama_pemilik").notNull(),
  namaPerusahaan: text("nama_perusahaan").notNull(),
  alamat: text("alamat").notNull(),
  kapasitasGiling: text("kapasitas_giling").notNull(),
  legalitas: text("legalitas"),
  statusKerjasama: text("status_kerjasama").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const penggilingan_distribusi = pgTable("penggilingan_distribusi", {
  id: text("id").primaryKey(),
  penggilinganId: text("penggilingan_id").references(() => penggilingan_gabah.id),
  sppgId: text("sppg_id").references(() => sppg.id),
  tanggal: text("tanggal").notNull(),
  jumlah: text("jumlah").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
