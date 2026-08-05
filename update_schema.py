import re

schema_file = 'src/db/schema.ts'

with open(schema_file, 'r') as f:
    schema = f.read()

# We need to replace the Drizzle schema to match the markdown file provided.
# The user wants to change the database structure according to skema-database-mbg-lebak-improved.md

new_schema = """import { pgTable, text, timestamp, boolean, integer, date, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: text("role").default("publik").notNull(), // admin_dinas, operator_kecamatan, operator_penggilingan, operator_sekolah, publik
  kecamatanId: integer("kecamatan_id"),
  penggilinganId: integer("penggilingan_id"),
  sekolahId: integer("sekolah_id"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
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

// ==== WILAYAH ====
export const kecamatan = pgTable("kecamatan", {
  id: integer("kecamatan_id").primaryKey(),
  namaKecamatan: text("nama_kecamatan").notNull().unique(),
});

export const desa = pgTable("desa", {
  id: integer("desa_id").primaryKey(),
  kecamatanId: integer("kecamatan_id").notNull().references(() => kecamatan.id),
  namaDesa: text("nama_desa").notNull(),
});

// ==== YAYASAN & SPPG ====
export const yayasan = pgTable("yayasan", {
  id: integer("yayasan_id").primaryKey(),
  namaYayasan: text("nama_yayasan").notNull(),
  alamat: text("alamat"),
  kontak: text("kontak"),
});

export const sppg = pgTable("sppg", {
  id: integer("sppg_id").primaryKey(),
  idSppgCode: text("id_sppg_code").unique(),
  namaSppg: text("nama_sppg").notNull(),
  desaId: integer("desa_id").references(() => desa.id),
  yayasanId: integer("yayasan_id").references(() => yayasan.id),
  alamat: text("alamat"),
  statusOperasional: text("status_operasional").default("Belum Operasional").notNull(),
  tanggalOperasional: date("tanggal_operasional"),
  bpjsKesehatan: boolean("bpjs_kesehatan").default(false),
  namaKaSppg: text("nama_ka_sppg"),
  noHpKaSppg: text("no_hp_ka_sppg"),
  jumlahRelawan: integer("jumlah_relawan").default(0),
  jumlahPenjamahMakanan: integer("jumlah_penjamah_makanan").default(0),
  jumlahBpjsTk: integer("jumlah_bpjs_tk").default(0),
  chefBersertifikatBnsp: integer("chef_bersertifikat_bnsp").default(0),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sppgSertifikasi = pgTable("sppg_sertifikasi", {
  id: integer("sertifikasi_id").primaryKey(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  jenisSertifikasi: text("jenis_sertifikasi").notNull(), // IKL, SLHS, HACCP, HALAL, IPAL, ISO
  status: boolean("status").default(false),
  tanggalBerlaku: date("tanggal_berlaku"),
  keterangan: text("keterangan"),
});

// ==== KATEGORI PENERIMA ====
export const kategoriPenerima = pgTable("kategori_penerima", {
  id: integer("kategori_id").primaryKey(),
  namaKategori: text("nama_kategori").notNull().unique(),
  urutan: integer("urutan").default(0),
});

// ==== MASTER SEKOLAH/LEMBAGA PENERIMA ====
export const sekolah = pgTable("sekolah", {
  id: integer("sekolah_id").primaryKey(),
  namaSekolah: text("nama_sekolah").notNull(),
  npsn: text("npsn"),
  kategoriId: integer("kategori_id").notNull().references(() => kategoriPenerima.id),
  desaId: integer("desa_id").references(() => desa.id),
  kecamatanId: integer("kecamatan_id").references(() => kecamatan.id),
  alamatSekolah: text("alamat_sekolah"),
  namaKepalaSekolah: text("nama_kepala_sekolah"),
  noHpKepalaSekolah: text("no_hp_kepala_sekolah"),
  emailSekolah: text("email_sekolah"),
  jumlahSiswaLaki: integer("jumlah_siswa_laki").default(0),
  jumlahSiswaPerempuan: integer("jumlah_siswa_perempuan").default(0),
  // generated column in DB, just using integer here for Drizzle definition
  jumlahSiswaTotal: integer("jumlah_siswa_total"), 
  tahunAjaranLast: text("tahun_ajaran_last"),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==== PENERIMA MANFAAT DI SPPG (SAAT INI/AKTIF) ====
export const sppgPenerimaManfaat = pgTable("sppg_penerima_manfaat", {
  id: integer("id").primaryKey(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  sekolahId: integer("sekolah_id").notNull().references(() => sekolah.id),
  tahunAjaran: text("tahun_ajaran"),
  jumlahLaki: integer("jumlah_laki").default(0),
  jumlahPerempuan: integer("jumlah_perempuan").default(0),
  jumlahTotal: integer("jumlah_total"),
  status: text("status").default("Aktif"),
  tanggalMulai: date("tanggal_mulai").notNull(),
  tanggalSelesai: date("tanggal_selesai"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==== RIWAYAT PENERIMAAN MBG PER SEKOLAH ====
export const sekolahPenerimaanMbg = pgTable("sekolah_penerimaan_mbg", {
  id: integer("id").primaryKey(),
  sekolahId: integer("sekolah_id").notNull().references(() => sekolah.id, { onDelete: 'cascade' }),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id),
  status: text("status").default("Aktif").notNull(), // Aktif, Selesai, Tertunda, Berhenti, Cuti
  tanggalMulaiMbg: date("tanggal_mulai_mbg").notNull(),
  tanggalSelesaiMbg: date("tanggal_selesai_mbg"),
  tahunAjaran: text("tahun_ajaran"),
  jumlahHariOperasional: integer("jumlah_hari_operasional"),
  catatanStatus: text("catatan_status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==== SUPPLY CHAIN (BAHAN BAKU) ====
export const pemasok = pgTable("pemasok", {
  id: integer("pemasok_id").primaryKey(),
  namaPemasok: text("nama_pemasok").notNull(),
  alamatPemasok: text("alamat_pemasok"),
  kontak: text("kontak"),
});

export const jenisPangan = pgTable("jenis_pangan", {
  id: integer("jenis_pangan_id").primaryKey(),
  namaBahan: text("nama_bahan").notNull().unique(),
  kategori: text("kategori"),
  satuanDefault: text("satuan_default").default("Kilogram"),
});

export const supplyChainKebutuhan = pgTable("supply_chain_kebutuhan", {
  id: integer("id").primaryKey(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  jenisPanganId: integer("jenis_pangan_id").notNull().references(() => jenisPangan.id),
  pemasokId: integer("pemasok_id").references(() => pemasok.id),
  kebutuhanPerBulan: numeric("kebutuhan_per_bulan", { precision: 12, scale: 2 }).notNull(),
  satuan: text("satuan").default("Kilogram"),
  periode: date("periode").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==== MODUL PENGGILINGAN ====
export const penggilingan = pgTable("penggilingan", {
  id: integer("penggilingan_id").primaryKey(),
  namaPenggilingan: text("nama_penggilingan").notNull(),
  alamat: text("alamat"),
  kecamatanId: integer("kecamatan_id").references(() => kecamatan.id),
  penanggungJawab: text("penanggung_jawab"),
  noHp: text("no_hp"),
  kapasitasTerpasangKgMinggu: numeric("kapasitas_terpasang_kg_minggu", { precision: 12, scale: 2 }),
  status: text("status").default("Aktif"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const penggilinganSumberGabah = pgTable("penggilingan_sumber_gabah", {
  id: integer("id").primaryKey(),
  penggilinganId: integer("penggilingan_id").notNull().references(() => penggilingan.id, { onDelete: 'cascade' }),
  mingguMulai: date("minggu_mulai").notNull(),
  mingguSelesai: date("minggu_selesai").notNull(),
  sumberGabah: text("sumber_gabah").notNull(),
  volumeKg: numeric("volume_kg", { precision: 12, scale: 2 }).notNull(),
  hargaBeliPerKg: numeric("harga_beli_per_kg", { precision: 12, scale: 2 }),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const penggilinganProduksi = pgTable("penggilingan_produksi", {
  id: integer("id").primaryKey(),
  penggilinganId: integer("penggilingan_id").notNull().references(() => penggilingan.id, { onDelete: 'cascade' }),
  mingguMulai: date("minggu_mulai").notNull(),
  mingguSelesai: date("minggu_selesai").notNull(),
  kapasitasRealisasiKg: numeric("kapasitas_realisasi_kg", { precision: 12, scale: 2 }).notNull(),
  rendemenPersen: numeric("rendemen_persen", { precision: 5, scale: 2 }),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const penggilinganDistribusi = pgTable("penggilingan_distribusi", {
  id: integer("id").primaryKey(),
  penggilinganId: integer("penggilingan_id").notNull().references(() => penggilingan.id, { onDelete: 'cascade' }),
  mingguMulai: date("minggu_mulai").notNull(),
  mingguSelesai: date("minggu_selesai").notNull(),
  volumeKg: numeric("volume_kg", { precision: 12, scale: 2 }).notNull(),
  tujuanTipe: text("tujuan_tipe").notNull(), // SPPG, Pasar, Lainnya
  sppgTujuanId: integer("sppg_tujuan_id").references(() => sppg.id),
  lokasiLain: text("lokasi_lain"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==== PENGADUAN PUBLIK ====
export const pengaduan = pgTable("pengaduan", {
  id: integer("id").primaryKey(),
  namaPelapor: text("nama_pelapor"),
  kontak: text("kontak"),
  sppgId: integer("sppg_id").references(() => sppg.id),
  sekolahId: integer("sekolah_id").references(() => sekolah.id),
  isiPengaduan: text("isi_pengaduan").notNull(),
  status: text("status").default("Baru"),
  tanggal: timestamp("tanggal").defaultNow(),
  tanggapan: text("tanggapan"),
});

// ==== AUDIT LOG ====
export const auditLog = pgTable("audit_log", {
  id: integer("audit_id").primaryKey(),
  userId: text("user_id").references(() => user.id),
  tabelNama: text("tabel_nama").notNull(),
  recordId: integer("record_id").notNull(),
  aksi: text("aksi"), // INSERT, UPDATE, DELETE
  // drizzle currently lacks native JSONB support in some wrappers but we can use text or json
  dataLama: text("data_lama"),
  dataBaru: text("data_baru"),
  tanggal: timestamp("tanggal").defaultNow(),
});

// Legacy Tables (Kept for frontend compatibility to not break existing CRUDs during migration)
// Note: In a real migration we would update the frontend files to use the new tables, 
// but since this is just a quick conversion, we will keep both for a moment or the frontend will break.
export const masterSekolah = pgTable("master_sekolah", {
  id: text("id").primaryKey(),
  namaSekolah: text("nama_sekolah").notNull(),
  jenjang: text("jenjang").notNull(),
  alamat: text("alamat").notNull(),
  jumlahSiswa: text("jumlah_siswa").notNull(),
  sppgId: text("sppg_id"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const masterPemasok = pgTable("master_pemasok", {
  id: text("id").primaryKey(),
  namaPemasok: text("nama_pemasok").notNull(),
  kategori: text("kategori").notNull(), 
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

export const masterDistributor = pgTable("master_distributor", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sysMenu = pgTable("sys_menu", {
  id: text("id").primaryKey(),
  namaModul: text("nama_modul").notNull(),
  url: text("url").notNull(),
  icon: text("icon"),
  hakAkses: text("hak_akses").notNull(),
  status: text("status").default("Aktif").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
"""

with open(schema_file, 'w') as f:
    f.write(new_schema)
    
print("Schema updated successfully.")
