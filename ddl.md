# 📄 DDL (Data Definition Language) PostgreSQL - MBG Lebak

File DDL ini berisi perintah SQL lengkap untuk membuat seluruh struktur tabel, tipe data, kunci utama (*primary key*), kunci asing (*foreign key*), indeks, dan *unique constraint* pada database PostgreSQL **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**.

---

```sql
-- ========================================================
-- 1. MODUL AUTENTIKASI & PENGGUNA (BETTER-AUTH)
-- ========================================================

CREATE TABLE IF NOT EXISTS "user" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT UNIQUE,
    "displayUsername" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'publik',
    "sppg_id" INTEGER,
    "kecamatan_id" INTEGER,
    "penggilingan_id" INTEGER,
    "sekolah_id" INTEGER,
    "posyandu_id" INTEGER,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
    "id" TEXT PRIMARY KEY,
    "expiresAt" TIMESTAMP NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
    "id" TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP,
    "updatedAt" TIMESTAMP
);

-- ========================================================
-- 2. MODUL WILAYAH ADMINISTRATIF KABUPATEN LEBAK
-- ========================================================

CREATE TABLE IF NOT EXISTS "kecamatan" (
    "kecamatan_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_kecamatan" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "desa" (
    "desa_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "kecamatan_id" INTEGER NOT NULL REFERENCES "kecamatan"("kecamatan_id") ON DELETE RESTRICT,
    "nama_desa" TEXT NOT NULL
);

-- ========================================================
-- 3. MODUL YAYASAN & SPPG (SATUAN PELAYANAN PEMENUHAN GIZI)
-- ========================================================

CREATE TABLE IF NOT EXISTS "yayasan" (
    "yayasan_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_yayasan" TEXT NOT NULL,
    "desa_id" INTEGER REFERENCES "desa"("desa_id"),
    "kecamatan_id" INTEGER REFERENCES "kecamatan"("kecamatan_id"),
    "alamat" TEXT,
    "kontak" TEXT
);

CREATE TABLE IF NOT EXISTS "sppg" (
    "sppg_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "id_sppg_code" TEXT UNIQUE,
    "nama_sppg" TEXT NOT NULL,
    "desa_id" INTEGER REFERENCES "desa"("desa_id"),
    "yayasan_id" INTEGER REFERENCES "yayasan"("yayasan_id"),
    "alamat" TEXT,
    "status_operasional" TEXT NOT NULL DEFAULT 'Belum Operasional',
    "tanggal_operasional" DATE,
    "bpjs_kesehatan" BOOLEAN DEFAULT FALSE,
    "nama_ka_sppg" TEXT,
    "no_hp_ka_sppg" TEXT,
    "jumlah_penjamah_makanan" INTEGER DEFAULT 0,
    "jumlah_bpjs_tk" INTEGER DEFAULT 0,
    "chef_bersertifikat_bnsp" INTEGER DEFAULT 0,
    "keterangan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "sppg_sertifikasi" (
    "sertifikasi_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "jenis_sertifikasi" TEXT NOT NULL,
    "status" BOOLEAN DEFAULT FALSE,
    "tanggal_berlaku" DATE,
    "keterangan" TEXT,
    CONSTRAINT "sppg_sertifikasi_unique" UNIQUE ("sppg_id", "jenis_sertifikasi")
);

-- ========================================================
-- 4. MODUL KATEGORI & STANDAR MENU GIZI
-- ========================================================

CREATE TABLE IF NOT EXISTS "kategori_penerima" (
    "kategori_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_kategori" TEXT NOT NULL UNIQUE,
    "urutan" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "standar_menu_gizi" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_menu" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kalori_kkal" INTEGER,
    "protein_gram" NUMERIC(5, 2),
    "karbohidrat_gram" NUMERIC(5, 2),
    "lemak_gram" NUMERIC(5, 2),
    "kategori_target_id" INTEGER REFERENCES "kategori_penerima"("kategori_id"),
    "status" TEXT DEFAULT 'Aktif',
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 5. MODUL SEKOLAH PENERIMA MANFAAT
-- ========================================================

CREATE TABLE IF NOT EXISTS "sekolah" (
    "sekolah_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_sekolah" TEXT NOT NULL,
    "npsn" TEXT,
    "kategori_id" INTEGER NOT NULL REFERENCES "kategori_penerima"("kategori_id"),
    "desa_id" INTEGER REFERENCES "desa"("desa_id"),
    "kecamatan_id" INTEGER REFERENCES "kecamatan"("kecamatan_id"),
    "alamat_sekolah" TEXT,
    "nama_kepala_sekolah" TEXT,
    "no_hp_kepala_sekolah" TEXT,
    "email_sekolah" TEXT,
    "jumlah_siswa_laki" INTEGER DEFAULT 0,
    "jumlah_siswa_perempuan" INTEGER DEFAULT 0,
    "jumlah_siswa_total" INTEGER,
    "tahun_ajaran_last" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_sekolah_npsn" ON "sekolah"("npsn");
CREATE INDEX IF NOT EXISTS "idx_sekolah_nama" ON "sekolah"("nama_sekolah");
CREATE INDEX IF NOT EXISTS "idx_sekolah_desa" ON "sekolah"("desa_id");
CREATE INDEX IF NOT EXISTS "idx_sekolah_kategori" ON "sekolah"("kategori_id");

CREATE TABLE IF NOT EXISTS "sppg_penerima_manfaat" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "sekolah_id" INTEGER NOT NULL REFERENCES "sekolah"("sekolah_id"),
    "tahun_ajaran" TEXT,
    "jumlah_laki" INTEGER DEFAULT 0,
    "jumlah_perempuan" INTEGER DEFAULT 0,
    "jumlah_total" INTEGER,
    "status" TEXT DEFAULT 'Aktif',
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE,
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT "sppg_penerima_manfaat_unique" UNIQUE ("sppg_id", "sekolah_id", "tahun_ajaran")
);

CREATE INDEX IF NOT EXISTS "idx_penerima_sppg" ON "sppg_penerima_manfaat"("sppg_id");
CREATE INDEX IF NOT EXISTS "idx_penerima_sekolah" ON "sppg_penerima_manfaat"("sekolah_id");
CREATE INDEX IF NOT EXISTS "idx_penerima_status" ON "sppg_penerima_manfaat"("status");

CREATE TABLE IF NOT EXISTS "sekolah_penerimaan_mbg" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sekolah_id" INTEGER NOT NULL REFERENCES "sekolah"("sekolah_id") ON DELETE CASCADE,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id"),
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tanggal_mulai_mbg" DATE NOT NULL,
    "tanggal_selesai_mbg" DATE,
    "tahun_ajaran" TEXT,
    "jumlah_hari_operasional" INTEGER,
    "catatan_status" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 6. MODUL POSYANDU PENERIMA MANFAAT (BALITA, BUMIL, BUSUI)
-- ========================================================

CREATE TABLE IF NOT EXISTS "posyandu" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_posyandu" TEXT NOT NULL,
    "desa_id" INTEGER REFERENCES "desa"("desa_id"),
    "kecamatan_id" INTEGER REFERENCES "kecamatan"("kecamatan_id"),
    "alamat_posyandu" TEXT,
    "nama_ketua_kader" TEXT,
    "no_hp_ketua_kader" TEXT,
    "jumlah_busui" INTEGER DEFAULT 0,
    "jumlah_balita" INTEGER DEFAULT 0,
    "jumlah_bumil" INTEGER DEFAULT 0,
    "jumlah_total" INTEGER DEFAULT 0,
    "keterangan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_posyandu_nama" ON "posyandu"("nama_posyandu");
CREATE INDEX IF NOT EXISTS "idx_posyandu_desa" ON "posyandu"("desa_id");

CREATE TABLE IF NOT EXISTS "sppg_posyandu_manfaat" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "posyandu_id" INTEGER NOT NULL REFERENCES "posyandu"("id"),
    "jumlah_busui" INTEGER DEFAULT 0,
    "jumlah_balita" INTEGER DEFAULT 0,
    "jumlah_bumil" INTEGER DEFAULT 0,
    "jumlah_total" INTEGER DEFAULT 0,
    "status" TEXT DEFAULT 'Aktif',
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE,
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT "sppg_posyandu_manfaat_unique" UNIQUE ("sppg_id", "posyandu_id")
);

CREATE TABLE IF NOT EXISTS "posyandu_penerimaan_mbg" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "posyandu_id" INTEGER NOT NULL REFERENCES "posyandu"("id") ON DELETE CASCADE,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id"),
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "tanggal_mulai_mbg" DATE NOT NULL,
    "tanggal_selesai_mbg" DATE,
    "catatan_status" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 7. MODUL SUPPLY CHAIN & PEMASOK
-- ========================================================

CREATE TABLE IF NOT EXISTS "pemasok" (
    "pemasok_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_pemasok" TEXT NOT NULL,
    "tipe_pemasok" TEXT,
    "npwp" TEXT,
    "pic_nama" TEXT,
    "pic_kontak" TEXT,
    "email" TEXT,
    "alamat_pemasok" TEXT,
    "kecamatan_id" INTEGER REFERENCES "kecamatan"("kecamatan_id"),
    "desa_id" INTEGER REFERENCES "desa"("desa_id"),
    "status" TEXT DEFAULT 'Aktif',
    "bank_nama" TEXT,
    "bank_rekening" TEXT,
    "bank_atas_nama" TEXT,
    "kontak" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "jenis_pangan" (
    "jenis_pangan_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_bahan" TEXT NOT NULL UNIQUE,
    "kategori" TEXT,
    "satuan_default" TEXT DEFAULT 'Kilogram'
);

CREATE TABLE IF NOT EXISTS "supply_chain_kebutuhan" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "jenis_pangan_id" INTEGER NOT NULL REFERENCES "jenis_pangan"("jenis_pangan_id"),
    "pemasok_id" INTEGER REFERENCES "pemasok"("pemasok_id"),
    "kebutuhan_per_bulan" NUMERIC(12, 2) NOT NULL,
    "satuan" TEXT DEFAULT 'Kilogram',
    "periode" DATE NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 8. MODUL PENGGILINGAN PADI & BERAS
-- ========================================================

CREATE TABLE IF NOT EXISTS "penggilingan" (
    "penggilingan_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_penggilingan" TEXT NOT NULL,
    "alamat" TEXT,
    "kecamatan_id" INTEGER REFERENCES "kecamatan"("kecamatan_id"),
    "penanggung_jawab" TEXT,
    "no_hp" TEXT,
    "kapasitas_terpasang_kg_minggu" NUMERIC(12, 2),
    "status" TEXT DEFAULT 'Aktif',
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "penggilingan_sumber_gabah" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "penggilingan_id" INTEGER NOT NULL REFERENCES "penggilingan"("penggilingan_id") ON DELETE CASCADE,
    "minggu_mulai" DATE NOT NULL,
    "minggu_selesai" DATE NOT NULL,
    "sumber_gabah" TEXT NOT NULL,
    "volume_kg" NUMERIC(12, 2) NOT NULL,
    "harga_beli_per_kg" NUMERIC(12, 2),
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "penggilingan_produksi" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "penggilingan_id" INTEGER NOT NULL REFERENCES "penggilingan"("penggilingan_id") ON DELETE CASCADE,
    "minggu_mulai" DATE NOT NULL,
    "minggu_selesai" DATE NOT NULL,
    "kapasitas_realisasi_kg" NUMERIC(12, 2) NOT NULL,
    "rendemen_persen" NUMERIC(5, 2),
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "penggilingan_distribusi" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "penggilingan_id" INTEGER NOT NULL REFERENCES "penggilingan"("penggilingan_id") ON DELETE CASCADE,
    "minggu_mulai" DATE NOT NULL,
    "minggu_selesai" DATE NOT NULL,
    "volume_kg" NUMERIC(12, 2) NOT NULL,
    "tujuan_tipe" TEXT NOT NULL,
    "sppg_tujuan_id" INTEGER REFERENCES "sppg"("sppg_id"),
    "lokasi_lain" TEXT,
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 9. MODUL INVENTORI & UJI MUTU RAPID TEST
-- ========================================================

CREATE TABLE IF NOT EXISTS "sppg_pembelian_bahan" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "pemasok_id" INTEGER NOT NULL REFERENCES "pemasok"("pemasok_id"),
    "jenis_pangan_id" INTEGER NOT NULL REFERENCES "jenis_pangan"("jenis_pangan_id"),
    "tanggal_pembelian" DATE NOT NULL,
    "minggu_ke" INTEGER,
    "volume" NUMERIC(12, 2) NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'Kg',
    "harga_total" NUMERIC(15, 2),
    "foto_nota" TEXT,
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "sppg_pemakaian_bahan" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "jenis_pangan_id" INTEGER NOT NULL REFERENCES "jenis_pangan"("jenis_pangan_id"),
    "standar_menu_id" INTEGER REFERENCES "standar_menu_gizi"("id"),
    "tanggal_pemakaian" DATE NOT NULL,
    "minggu_ke" INTEGER,
    "volume" NUMERIC(12, 2) NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'Kg',
    "catatan" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "master_parameter_uji" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_parameter" TEXT NOT NULL,
    "kategori" TEXT DEFAULT 'Kimia',
    "satuan" TEXT,
    "ambang_batas" TEXT,
    "deskripsi" TEXT,
    "status_aktif" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "sppg_uji_rapid_test" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "jenis_pangan_id" INTEGER NOT NULL REFERENCES "jenis_pangan"("jenis_pangan_id"),
    "parameter_uji_id" INTEGER REFERENCES "master_parameter_uji"("id"),
    "tanggal_uji" DATE NOT NULL,
    "parameter_uji" TEXT NOT NULL,
    "hasil_uji" TEXT NOT NULL,
    "petugas_penguji" TEXT NOT NULL,
    "tindakan_lanjut" TEXT,
    "foto_bukti" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 10. MODUL LAPORAN AKTIFITAS & VERIFIKASI DUA ARAH
-- ========================================================

CREATE TABLE IF NOT EXISTS "sppg_laporan_aktifitas" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_id" INTEGER NOT NULL REFERENCES "sppg"("sppg_id") ON DELETE CASCADE,
    "sekolah_id" INTEGER REFERENCES "sekolah"("sekolah_id") ON DELETE CASCADE,
    "posyandu_id" INTEGER REFERENCES "posyandu"("id") ON DELETE CASCADE,
    "tanggal" DATE NOT NULL,
    "standar_menu_id" INTEGER NOT NULL REFERENCES "standar_menu_gizi"("id"),
    "jumlah_porsi" INTEGER,
    "status" TEXT DEFAULT 'Terkirim',
    "catatan" TEXT,
    "foto_dokumentasi" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "sekolah_laporan_aktifitas" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_laporan_id" INTEGER NOT NULL REFERENCES "sppg_laporan_aktifitas"("id") ON DELETE CASCADE,
    "sekolah_id" INTEGER NOT NULL REFERENCES "sekolah"("sekolah_id") ON DELETE CASCADE,
    "tanggal_diterima" TIMESTAMP NOT NULL DEFAULT NOW(),
    "status_diterima" TEXT NOT NULL DEFAULT 'Diterima Lengkap',
    "jumlah_porsi_diterima" INTEGER,
    "kondisi_makanan" TEXT DEFAULT 'Baik',
    "catatan" TEXT,
    "foto_dokumentasi" TEXT,
    "diverifikasi_oleh" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "posyandu_laporan_aktifitas" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "sppg_laporan_id" INTEGER NOT NULL REFERENCES "sppg_laporan_aktifitas"("id") ON DELETE CASCADE,
    "posyandu_id" INTEGER NOT NULL REFERENCES "posyandu"("id") ON DELETE CASCADE,
    "tanggal_diterima" TIMESTAMP NOT NULL DEFAULT NOW(),
    "status_diterima" TEXT NOT NULL DEFAULT 'Diterima Lengkap',
    "jumlah_porsi_diterima" INTEGER,
    "kondisi_makanan" TEXT DEFAULT 'Baik',
    "catatan" TEXT,
    "foto_dokumentasi" TEXT,
    "diverifikasi_oleh" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW()
);

-- ========================================================
-- 11. MODUL PENGADUAN, AUDIT, & CMS
-- ========================================================

CREATE TABLE IF NOT EXISTS "pengaduan" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "nama_pelapor" TEXT,
    "kontak" TEXT,
    "sppg_id" INTEGER REFERENCES "sppg"("sppg_id"),
    "sekolah_id" INTEGER REFERENCES "sekolah"("sekolah_id"),
    "isi_pengaduan" TEXT NOT NULL,
    "status" TEXT DEFAULT 'Baru',
    "tanggal" TIMESTAMP DEFAULT NOW(),
    "tanggapan" TEXT
);

CREATE TABLE IF NOT EXISTS "audit_log" (
    "audit_id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "user_id" TEXT REFERENCES "user"("id"),
    "tabel_nama" TEXT NOT NULL,
    "record_id" INTEGER NOT NULL,
    "aksi" TEXT,
    "data_lama" TEXT,
    "data_baru" TEXT,
    "tanggal" TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_audit_user" ON "audit_log"("user_id");
CREATE INDEX IF NOT EXISTS "idx_audit_tabel" ON "audit_log"("tabel_nama");

CREATE TABLE IF NOT EXISTS "pengumuman" (
    "id" INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "author_id" TEXT NOT NULL REFERENCES "user"("id"),
    "sppg_id" INTEGER REFERENCES "sppg"("sppg_id"),
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);
```
