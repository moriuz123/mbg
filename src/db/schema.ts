import { pgTable, text, timestamp, boolean, integer, date, numeric, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique(),
  displayUsername: text("displayUsername"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: text("role").default("publik").notNull(), // admin_dinas, operator_sppg, operator_penggilingan, operator_sekolah, operator_posyandu
  sppgId: integer("sppg_id"),
  kecamatanId: integer("kecamatan_id"),
  penggilinganId: integer("penggilingan_id"),
  sekolahId: integer("sekolah_id"),
  posyanduId: integer("posyandu_id"),
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
  id: integer("kecamatan_id").primaryKey().generatedAlwaysAsIdentity(),
  namaKecamatan: text("nama_kecamatan").notNull().unique(),
});

export const desa = pgTable("desa", {
  id: integer("desa_id").primaryKey().generatedAlwaysAsIdentity(),
  kecamatanId: integer("kecamatan_id").notNull().references(() => kecamatan.id),
  namaDesa: text("nama_desa").notNull(),
});

// ==== YAYASAN & SPPG ====
export const yayasan = pgTable("yayasan", {
  id: integer("yayasan_id").primaryKey().generatedAlwaysAsIdentity(),
  namaYayasan: text("nama_yayasan").notNull(),
  desaId: integer("desa_id").references(() => desa.id),
  kecamatanId: integer("kecamatan_id").references(() => kecamatan.id),
  alamat: text("alamat"),
  kontak: text("kontak"),
});

export const sppg = pgTable("sppg", {
  id: integer("sppg_id").primaryKey().generatedAlwaysAsIdentity(),
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
  jumlahPenjamahMakanan: integer("jumlah_penjamah_makanan").default(0),
  jumlahBpjsTk: integer("jumlah_bpjs_tk").default(0),
  chefBersertifikatBnsp: integer("chef_bersertifikat_bnsp").default(0),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sppgSertifikasi = pgTable("sppg_sertifikasi", {
  id: integer("sertifikasi_id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  jenisSertifikasi: text("jenis_sertifikasi").notNull(), // IKL, SLHS, HACCP, HALAL, IPAL, ISO
  status: boolean("status").default(false),
  tanggalBerlaku: date("tanggal_berlaku"),
  keterangan: text("keterangan"),
}, (table) => {
  return {
    uniqueSppgSertifikasi: uniqueIndex("sppg_sertifikasi_unique").on(table.sppgId, table.jenisSertifikasi),
  };
});

// ==== KATEGORI PENERIMA ====
export const kategoriPenerima = pgTable("kategori_penerima", {
  id: integer("kategori_id").primaryKey().generatedAlwaysAsIdentity(),
  namaKategori: text("nama_kategori").notNull().unique(),
  urutan: integer("urutan").default(0),
});

// ==== STANDAR MENU GIZI ====
export const standarMenuGizi = pgTable("standar_menu_gizi", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  namaMenu: text("nama_menu").notNull(),
  deskripsi: text("deskripsi"),
  jenisMakan: text("jenis_makan").default("Siang"), // 'Pagi' atau 'Siang'
  kaloriKkal: integer("kalori_kkal"),
  proteinGram: numeric("protein_gram", { precision: 5, scale: 2 }),
  karbohidratGram: numeric("karbohidrat_gram", { precision: 5, scale: 2 }),
  lemakGram: numeric("lemak_gram", { precision: 5, scale: 2 }),
  kategoriTargetId: integer("kategori_target_id").references(() => kategoriPenerima.id), // Menu spesifik per kategori (SD, SMP, dll)
  status: text("status").default("Aktif"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==== MASTER SEKOLAH/LEMBAGA PENERIMA ====
export const sekolah = pgTable("sekolah", {
  id: integer("sekolah_id").primaryKey().generatedAlwaysAsIdentity(),
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
}, (table) => {
  return {
    npsnIdx: index("idx_sekolah_npsn").on(table.npsn),
    namaIdx: index("idx_sekolah_nama").on(table.namaSekolah),
    desaIdx: index("idx_sekolah_desa").on(table.desaId),
    kategoriIdx: index("idx_sekolah_kategori").on(table.kategoriId),
  };
});

// ==== PENERIMA MANFAAT DI SPPG (SAAT INI/AKTIF) ====
export const sppgPenerimaManfaat = pgTable("sppg_penerima_manfaat", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
}, (table) => {
  return {
    sppgIdx: index("idx_penerima_sppg").on(table.sppgId),
    sekolahIdx: index("idx_penerima_sekolah").on(table.sekolahId),
    statusIdx: index("idx_penerima_status").on(table.status),
    uniqueSppgSekolahTahun: uniqueIndex("sppg_penerima_manfaat_unique").on(table.sppgId, table.sekolahId, table.tahunAjaran),
  };
});

// ==== RIWAYAT PENERIMAAN MBG PER SEKOLAH ====
export const sekolahPenerimaanMbg = pgTable("sekolah_penerimaan_mbg", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
}, (table) => {
  return {
    sekolahIdx: index("idx_penerimaan_sekolah").on(table.sekolahId),
    sppgIdx: index("idx_penerimaan_sppg").on(table.sppgId),
    tanggalIdx: index("idx_penerimaan_tanggal").on(table.tanggalMulaiMbg),
    statusIdx: index("idx_penerimaan_status").on(table.status),
  };
});

// ==== POSYANDU ====
export const posyandu = pgTable("posyandu", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  namaPosyandu: text("nama_posyandu").notNull(),
  desaId: integer("desa_id").references(() => desa.id),
  kecamatanId: integer("kecamatan_id").references(() => kecamatan.id),
  alamatPosyandu: text("alamat_posyandu"),
  namaKetuaKader: text("nama_ketua_kader"),
  noHpKetuaKader: text("no_hp_ketua_kader"),
  jumlahBusui: integer("jumlah_busui").default(0),
  jumlahBalita: integer("jumlah_balita").default(0),
  jumlahBumil: integer("jumlah_bumil").default(0),
  jumlahTotal: integer("jumlah_total").default(0),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    namaIdx: index("idx_posyandu_nama").on(table.namaPosyandu),
    desaIdx: index("idx_posyandu_desa").on(table.desaId),
  };
});

export const sppgPosyanduManfaat = pgTable("sppg_posyandu_manfaat", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  posyanduId: integer("posyandu_id").notNull().references(() => posyandu.id),
  jumlahBusui: integer("jumlah_busui").default(0),
  jumlahBalita: integer("jumlah_balita").default(0),
  jumlahBumil: integer("jumlah_bumil").default(0),
  jumlahTotal: integer("jumlah_total").default(0),
  status: text("status").default("Aktif"),
  tanggalMulai: date("tanggal_mulai").notNull(),
  tanggalSelesai: date("tanggal_selesai"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    sppgIdx: index("idx_posyandu_penerima_sppg").on(table.sppgId),
    posyanduIdx: index("idx_posyandu_penerima_posyandu").on(table.posyanduId),
    uniqueSppgPosyandu: uniqueIndex("sppg_posyandu_manfaat_unique").on(table.sppgId, table.posyanduId),
  };
});

export const posyanduPenerimaanMbg = pgTable("posyandu_penerimaan_mbg", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  posyanduId: integer("posyandu_id").notNull().references(() => posyandu.id, { onDelete: 'cascade' }),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id),
  status: text("status").default("Aktif").notNull(),
  tanggalMulaiMbg: date("tanggal_mulai_mbg").notNull(),
  tanggalSelesaiMbg: date("tanggal_selesai_mbg"),
  catatanStatus: text("catatan_status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    posyanduIdx: index("idx_posyandu_penerimaan_posyandu").on(table.posyanduId),
    sppgIdx: index("idx_posyandu_penerimaan_sppg").on(table.sppgId),
  };
});

// ==== SUPPLY CHAIN (BAHAN BAKU) ====
export const pemasok = pgTable("pemasok", {
  id: integer("pemasok_id").primaryKey().generatedAlwaysAsIdentity(),
  namaPemasok: text("nama_pemasok").notNull(),
  tipePemasok: text("tipe_pemasok"), // Koperasi, BUMDes, Perusahaan, Individu
  npwp: text("npwp"),
  picNama: text("pic_nama"),
  picKontak: text("pic_kontak"),
  email: text("email"),
  alamatPemasok: text("alamat_pemasok"),
  kecamatanId: integer("kecamatan_id"),
  desaId: integer("desa_id"),
  status: text("status").default("Aktif"),
  bankNama: text("bank_nama"),
  bankRekening: text("bank_rekening"),
  bankAtasNama: text("bank_atas_nama"),
  kontak: text("kontak"), // legacy company contact
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jenisPangan = pgTable("jenis_pangan", {
  id: integer("jenis_pangan_id").primaryKey().generatedAlwaysAsIdentity(),
  namaBahan: text("nama_bahan").notNull().unique(),
  kategori: text("kategori"),
  satuanDefault: text("satuan_default").default("Kilogram"),
});

export const komoditas = jenisPangan;

export const supplyChainKebutuhan = pgTable("supply_chain_kebutuhan", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
  id: integer("penggilingan_id").primaryKey().generatedAlwaysAsIdentity(),
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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  penggilinganId: integer("penggilingan_id").notNull().references(() => penggilingan.id, { onDelete: 'cascade' }),
  mingguMulai: date("minggu_mulai").notNull(),
  mingguSelesai: date("minggu_selesai").notNull(),
  kapasitasRealisasiKg: numeric("kapasitas_realisasi_kg", { precision: 12, scale: 2 }).notNull(),
  rendemenPersen: numeric("rendemen_persen", { precision: 5, scale: 2 }),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const penggilinganDistribusi = pgTable("penggilingan_distribusi", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  penggilinganId: integer("penggilingan_id").notNull().references(() => penggilingan.id, { onDelete: 'cascade' }),
  mingguMulai: date("minggu_mulai").notNull(),
  mingguSelesai: date("minggu_selesai").notNull(),
  volumeKg: numeric("volume_kg", { precision: 12, scale: 2 }).notNull(),
  hargaPerKg: numeric("harga_per_kg", { precision: 12, scale: 2 }),
  hargaTotal: numeric("harga_total", { precision: 12, scale: 2 }),
  tujuanTipe: text("tujuan_tipe").notNull(), // SPPG, Pasar, BULOG, Retail, Lainnya
  sppgTujuanId: integer("sppg_tujuan_id").references(() => sppg.id),
  lokasiLain: text("lokasi_lain"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==== PENGADUAN PUBLIK ====
export const pengaduan = pgTable("pengaduan", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
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
  id: integer("audit_id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").references(() => user.id),
  tabelNama: text("tabel_nama").notNull(),
  recordId: integer("record_id").notNull(),
  aksi: text("aksi"), // INSERT, UPDATE, DELETE
  // drizzle currently lacks native JSONB support in some wrappers but we can use text or json
  dataLama: text("data_lama"),
  dataBaru: text("data_baru"),
  tanggal: timestamp("tanggal").defaultNow(),
}, (table) => {
  return {
    userIdx: index("idx_audit_user").on(table.userId),
    tabelIdx: index("idx_audit_tabel").on(table.tabelNama),
  };
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

// ==== RELATIONS (ORM) ====

export const desaRelations = relations(desa, ({ one }) => ({
  kecamatan: one(kecamatan, {
    fields: [desa.kecamatanId],
    references: [kecamatan.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(user, {
    fields: [auditLog.userId],
    references: [user.id],
  }),
}));

// ==== MODUL PENGAWASAN & INVENTORI SPPG ====

// 1. Pembelian Bahan Pangan (Realisasi dari Kebutuhan)
export const sppgPembelianBahan = pgTable("sppg_pembelian_bahan", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  pemasokId: integer("pemasok_id").notNull().references(() => pemasok.id),
  jenisPanganId: integer("jenis_pangan_id").notNull().references(() => jenisPangan.id),
  tanggalPembelian: date("tanggal_pembelian").notNull(),
  mingguKe: integer("minggu_ke"), // e.g., 1, 2, 3, 4 of the month
  volume: numeric("volume", { precision: 12, scale: 2 }).notNull(),
  satuan: text("satuan").notNull().default("Kg"),
  hargaTotal: numeric("harga_total", { precision: 15, scale: 2 }),
  fotoNota: text("foto_nota"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sppgPembelianBahanRelations = relations(sppgPembelianBahan, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgPembelianBahan.sppgId],
    references: [sppg.id],
  }),
  pemasok: one(pemasok, {
    fields: [sppgPembelianBahan.pemasokId],
    references: [pemasok.id],
  }),
  jenisPangan: one(jenisPangan, {
    fields: [sppgPembelianBahan.jenisPanganId],
    references: [jenisPangan.id],
  }),
}));

// 2. Pemakaian Bahan Pangan (Stock Out)
export const sppgPemakaianBahan = pgTable("sppg_pemakaian_bahan", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  jenisPanganId: integer("jenis_pangan_id").notNull().references(() => jenisPangan.id),
  standarMenuId: integer("standar_menu_id").references(() => standarMenuGizi.id),
  tanggalPemakaian: date("tanggal_pemakaian").notNull(),
  mingguKe: integer("minggu_ke"),
  volume: numeric("volume", { precision: 12, scale: 2 }).notNull(),
  satuan: text("satuan").notNull().default("Kg"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sppgPemakaianBahanRelations = relations(sppgPemakaianBahan, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgPemakaianBahan.sppgId],
    references: [sppg.id],
  }),
  jenisPangan: one(jenisPangan, {
    fields: [sppgPemakaianBahan.jenisPanganId],
    references: [jenisPangan.id],
  }),
  standarMenuGizi: one(standarMenuGizi, {
    fields: [sppgPemakaianBahan.standarMenuId],
    references: [standarMenuGizi.id],
  }),
}));

// Master Item Parameter Uji (Rapid Test)
export const masterParameterUji = pgTable("master_parameter_uji", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  namaParameter: text("nama_parameter").notNull(), // Misal: Formalin, Boraks, E. Coli, Pestisida, Nitrit
  kategori: text("kategori").default("Kimia"), // Misal: Kimia, Mikrobiologi, Fisik
  satuan: text("satuan"), // Misal: mg/L, Negative/Positive, PPM
  ambangBatas: text("ambang_batas"), // Misal: 0 mg/L (Bebas)
  deskripsi: text("deskripsi"),
  statusAktif: boolean("status_aktif").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const masterParameterUjiRelations = relations(masterParameterUji, ({ many }) => ({
  ujiRapidTests: many(sppgUjiRapidTest),
}));

// 3. Uji Rapid Test Bahan Segar
export const sppgUjiRapidTest = pgTable("sppg_uji_rapid_test", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  jenisPanganId: integer("jenis_pangan_id").notNull().references(() => jenisPangan.id),
  parameterUjiId: integer("parameter_uji_id").references(() => masterParameterUji.id),
  tanggalUji: date("tanggal_uji").notNull(),
  parameterUji: text("parameter_uji").notNull(), // Misal: Formalin, Boraks, E.Coli
  hasilUji: text("hasil_uji").notNull(), // Aman / Tidak Aman / Peringatan
  petugasPenguji: text("petugas_penguji").notNull(),
  tindakanLanjut: text("tindakan_lanjut"), // Misal: Dibuang, Boleh Digunakan
  fotoBukti: text("foto_bukti"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sppgUjiRapidTestRelations = relations(sppgUjiRapidTest, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgUjiRapidTest.sppgId],
    references: [sppg.id],
  }),
  jenisPangan: one(jenisPangan, {
    fields: [sppgUjiRapidTest.jenisPanganId],
    references: [jenisPangan.id],
  }),
  parameterMaster: one(masterParameterUji, {
    fields: [sppgUjiRapidTest.parameterUjiId],
    references: [masterParameterUji.id],
  }),
}));

export const sppgRelations = relations(sppg, ({ one, many }) => ({
  desa: one(desa, {
    fields: [sppg.desaId],
    references: [desa.id],
  }),
  yayasan: one(yayasan, {
    fields: [sppg.yayasanId],
    references: [yayasan.id],
  }),
  sertifikasi: many(sppgSertifikasi),
  penerimaManfaat: many(sppgPenerimaManfaat),
  posyanduManfaat: many(sppgPosyanduManfaat),
}));

export const yayasanRelations = relations(yayasan, ({ one }) => ({
  desa: one(desa, {
    fields: [yayasan.desaId],
    references: [desa.id],
  }),
  kecamatan: one(kecamatan, {
    fields: [yayasan.kecamatanId],
    references: [kecamatan.id],
  }),
}));

export const sppgSertifikasiRelations = relations(sppgSertifikasi, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgSertifikasi.sppgId],
    references: [sppg.id],
  }),
}));

export const sekolahRelations = relations(sekolah, ({ one, many }) => ({
  kategori: one(kategoriPenerima, {
    fields: [sekolah.kategoriId],
    references: [kategoriPenerima.id],
  }),
  desa: one(desa, {
    fields: [sekolah.desaId],
    references: [desa.id],
  }),
  kecamatan: one(kecamatan, {
    fields: [sekolah.kecamatanId],
    references: [kecamatan.id],
  }),
  riwayatMbg: many(sekolahPenerimaanMbg),
  sppgPenerima: many(sppgPenerimaManfaat),
}));

export const sppgPenerimaManfaatRelations = relations(sppgPenerimaManfaat, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgPenerimaManfaat.sppgId],
    references: [sppg.id],
  }),
  sekolah: one(sekolah, {
    fields: [sppgPenerimaManfaat.sekolahId],
    references: [sekolah.id],
  }),
}));

export const sekolahPenerimaanMbgRelations = relations(sekolahPenerimaanMbg, ({ one }) => ({
  sekolah: one(sekolah, {
    fields: [sekolahPenerimaanMbg.sekolahId],
    references: [sekolah.id],
  }),
  sppg: one(sppg, {
    fields: [sekolahPenerimaanMbg.sppgId],
    references: [sppg.id],
  }),
}));

export const supplyChainKebutuhanRelations = relations(supplyChainKebutuhan, ({ one }) => ({
  sppg: one(sppg, {
    fields: [supplyChainKebutuhan.sppgId],
    references: [sppg.id],
  }),
  jenisPangan: one(jenisPangan, {
    fields: [supplyChainKebutuhan.jenisPanganId],
    references: [jenisPangan.id],
  }),
  pemasok: one(pemasok, {
    fields: [supplyChainKebutuhan.pemasokId],
    references: [pemasok.id],
  }),
}));

export const penggilinganRelations = relations(penggilingan, ({ one, many }) => ({
  kecamatan: one(kecamatan, {
    fields: [penggilingan.kecamatanId],
    references: [kecamatan.id],
  }),
  sumberGabah: many(penggilinganSumberGabah),
  produksi: many(penggilinganProduksi),
  distribusi: many(penggilinganDistribusi),
}));

export const penggilinganSumberGabahRelations = relations(penggilinganSumberGabah, ({ one }) => ({
  penggilingan: one(penggilingan, {
    fields: [penggilinganSumberGabah.penggilinganId],
    references: [penggilingan.id],
  }),
}));

export const penggilinganProduksiRelations = relations(penggilinganProduksi, ({ one }) => ({
  penggilingan: one(penggilingan, {
    fields: [penggilinganProduksi.penggilinganId],
    references: [penggilingan.id],
  }),
}));

export const penggilinganDistribusiRelations = relations(penggilinganDistribusi, ({ one }) => ({
  penggilingan: one(penggilingan, {
    fields: [penggilinganDistribusi.penggilinganId],
    references: [penggilingan.id],
  }),
  sppgTujuan: one(sppg, {
    fields: [penggilinganDistribusi.sppgTujuanId],
    references: [sppg.id],
  }),
}));

// ==== LAPORAN AKTIFITAS SPPG ====
export const sppgLaporanAktifitas = pgTable("sppg_laporan_aktifitas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgId: integer("sppg_id").notNull().references(() => sppg.id, { onDelete: 'cascade' }),
  sekolahId: integer("sekolah_id").references(() => sekolah.id, { onDelete: 'cascade' }),
  posyanduId: integer("posyandu_id").references(() => posyandu.id, { onDelete: 'cascade' }),
  tanggal: date("tanggal").notNull(),
  standarMenuId: integer("standar_menu_id").notNull().references(() => standarMenuGizi.id),
  jumlahPorsi: integer("jumlah_porsi"),
  status: text("status").default("Terkirim"), // Terkirim, Diterima, Bermasalah
  catatan: text("catatan"),
  fotoDokumentasi: text("foto_dokumentasi"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sppgLaporanAktifitasRelations = relations(sppgLaporanAktifitas, ({ one, many }) => ({
  sppg: one(sppg, {
    fields: [sppgLaporanAktifitas.sppgId],
    references: [sppg.id],
  }),
  sekolah: one(sekolah, {
    fields: [sppgLaporanAktifitas.sekolahId],
    references: [sekolah.id],
  }),
  posyandu: one(posyandu, {
    fields: [sppgLaporanAktifitas.posyanduId],
    references: [posyandu.id],
  }),
  standarMenuGizi: one(standarMenuGizi, {
    fields: [sppgLaporanAktifitas.standarMenuId],
    references: [standarMenuGizi.id],
  }),
  verifikasiSekolah: many(sekolahLaporanAktifitas),
  verifikasiPosyandu: many(posyanduLaporanAktifitas),
}));

// ==== VERIFIKASI DUA ARAH (LAPORAN PENERIMAAN OLEH SEKOLAH) ====
export const sekolahLaporanAktifitas = pgTable("sekolah_laporan_aktifitas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgLaporanId: integer("sppg_laporan_id").notNull().references(() => sppgLaporanAktifitas.id, { onDelete: 'cascade' }),
  sekolahId: integer("sekolah_id").notNull().references(() => sekolah.id, { onDelete: 'cascade' }),
  tanggalDiterima: timestamp("tanggal_diterima").defaultNow().notNull(),
  statusDiterima: text("status_diterima").notNull().default("Diterima Lengkap"), // Diterima Lengkap, Diterima Sebagian, Ditolak
  jumlahPorsiDiterima: integer("jumlah_porsi_diterima"),
  kondisiMakanan: text("kondisi_makanan").default("Baik"), // Baik, Rusak, Basi, Kurang
  catatan: text("catatan"),
  fotoDokumentasi: text("foto_dokumentasi"),
  diverifikasiOleh: text("diverifikasi_oleh"), // Nama guru/petugas
  createdAt: timestamp("created_at").defaultNow(),
});

export const sekolahLaporanAktifitasRelations = relations(sekolahLaporanAktifitas, ({ one }) => ({
  laporanSppg: one(sppgLaporanAktifitas, {
    fields: [sekolahLaporanAktifitas.sppgLaporanId],
    references: [sppgLaporanAktifitas.id],
  }),
  sekolah: one(sekolah, {
    fields: [sekolahLaporanAktifitas.sekolahId],
    references: [sekolah.id],
  }),
}));

// ==== VERIFIKASI DUA ARAH (LAPORAN PENERIMAAN OLEH POSYANDU) ====
export const posyanduLaporanAktifitas = pgTable("posyandu_laporan_aktifitas", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  sppgLaporanId: integer("sppg_laporan_id").notNull().references(() => sppgLaporanAktifitas.id, { onDelete: 'cascade' }),
  posyanduId: integer("posyandu_id").notNull().references(() => posyandu.id, { onDelete: 'cascade' }),
  tanggalDiterima: timestamp("tanggal_diterima").defaultNow().notNull(),
  statusDiterima: text("status_diterima").notNull().default("Diterima Lengkap"), // Diterima Lengkap, Diterima Sebagian, Ditolak
  jumlahPorsiDiterima: integer("jumlah_porsi_diterima"),
  kondisiMakanan: text("kondisi_makanan").default("Baik"), // Baik, Rusak, Basi, Kurang
  catatan: text("catatan"),
  fotoDokumentasi: text("foto_dokumentasi"),
  diverifikasiOleh: text("diverifikasi_oleh"), // Nama kader/petugas
  createdAt: timestamp("created_at").defaultNow(),
});

export const posyanduLaporanAktifitasRelations = relations(posyanduLaporanAktifitas, ({ one }) => ({
  laporanSppg: one(sppgLaporanAktifitas, {
    fields: [posyanduLaporanAktifitas.sppgLaporanId],
    references: [sppgLaporanAktifitas.id],
  }),
  posyandu: one(posyandu, {
    fields: [posyanduLaporanAktifitas.posyanduId],
    references: [posyandu.id],
  }),
}));

export const posyanduRelations = relations(posyandu, ({ one, many }) => ({
  desa: one(desa, {
    fields: [posyandu.desaId],
    references: [desa.id],
  }),
  kecamatan: one(kecamatan, {
    fields: [posyandu.kecamatanId],
    references: [kecamatan.id],
  }),
  posyanduManfaat: many(sppgPosyanduManfaat),
  riwayatMbg: many(posyanduPenerimaanMbg),
}));

export const sppgPosyanduManfaatRelations = relations(sppgPosyanduManfaat, ({ one }) => ({
  sppg: one(sppg, {
    fields: [sppgPosyanduManfaat.sppgId],
    references: [sppg.id],
  }),
  posyandu: one(posyandu, {
    fields: [sppgPosyanduManfaat.posyanduId],
    references: [posyandu.id],
  }),
}));

export const posyanduPenerimaanMbgRelations = relations(posyanduPenerimaanMbg, ({ one }) => ({
  posyandu: one(posyandu, {
    fields: [posyanduPenerimaanMbg.posyanduId],
    references: [posyandu.id],
  }),
  sppg: one(sppg, {
    fields: [posyanduPenerimaanMbg.sppgId],
    references: [sppg.id],
  }),
}));

export const pengaduanRelations = relations(pengaduan, ({ one }) => ({
  sppg: one(sppg, {
    fields: [pengaduan.sppgId],
    references: [sppg.id],
  }),
  sekolah: one(sekolah, {
    fields: [pengaduan.sekolahId],
    references: [sekolah.id],
  }),
}));

// ==== DYNAMIC FRONTEND ====
export const navigationMenu = pgTable("navigation_menu", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  urutan: integer("urutan").default(0),
  status: text("status").default("Aktif").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteSetting = pgTable("site_setting", {
  key: text("key").primaryKey(), // e.g., 'hero_bg_image', 'site_title'
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==== PENGUMUMAN ====
export const pengumuman = pgTable("pengumuman", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  judul: text("judul").notNull(),
  isi: text("isi").notNull(),
  authorId: text("author_id").notNull().references(() => user.id),
  sppgId: integer("sppg_id").references(() => sppg.id), // If created by SPPG
  status: text("status").default("Aktif").notNull(), // Aktif, Draft, Arsip
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pengumumanRelations = relations(pengumuman, ({ one }) => ({
  author: one(user, {
    fields: [pengumuman.authorId],
    references: [user.id],
  }),
  sppg: one(sppg, {
    fields: [pengumuman.sppgId],
    references: [sppg.id],
  }),
}));

// ==== STANDAR KECUKUPAN GIZI (AKG) ====
export const standarKecukupanGizi = pgTable("standar_kecukupan_gizi", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  kategoriId: integer("kategori_id").notNull().references(() => kategoriPenerima.id, { onDelete: 'cascade' }),
  jenisMakan: text("jenis_makan").notNull(), // 'Pagi' atau 'Siang'
  minEnergiKkal: numeric("min_energi_kkal", { precision: 7, scale: 2 }).notNull(),
  maxEnergiKkal: numeric("max_energi_kkal", { precision: 7, scale: 2 }).notNull(),
  minProteinGram: numeric("min_protein_gram", { precision: 6, scale: 2 }).notNull(),
  maxProteinGram: numeric("max_protein_gram", { precision: 6, scale: 2 }).notNull(),
  minLemakGram: numeric("min_lemak_gram", { precision: 6, scale: 2 }).notNull(),
  maxLemakGram: numeric("max_lemak_gram", { precision: 6, scale: 2 }).notNull(),
  minKarbohidratGram: numeric("min_karbohidrat_gram", { precision: 6, scale: 2 }).notNull(),
  maxKarbohidratGram: numeric("max_karbohidrat_gram", { precision: 6, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const standarKecukupanGiziRelations = relations(standarKecukupanGizi, ({ one }) => ({
  kategori: one(kategoriPenerima, {
    fields: [standarKecukupanGizi.kategoriId],
    references: [kategoriPenerima.id],
  }),
}));

export const kategoriPenerimaRelations = relations(kategoriPenerima, ({ many }) => ({
  standarKecukupanGizi: many(standarKecukupanGizi),
}));
