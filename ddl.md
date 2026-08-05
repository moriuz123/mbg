-- ==== WILAYAH ====
CREATE TABLE kecamatan (
kecamatan_id SERIAL PRIMARY KEY,
nama_kecamatan VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE desa (
desa_id SERIAL PRIMARY KEY,
kecamatan_id INT NOT NULL REFERENCES kecamatan(kecamatan_id),
nama_desa VARCHAR(100) NOT NULL
);

-- ==== YAYASAN & SPPG ====
CREATE TABLE yayasan (
yayasan_id SERIAL PRIMARY KEY,
nama_yayasan VARCHAR(200) NOT NULL,
alamat TEXT,
kontak VARCHAR(50)
);

CREATE TABLE sppg (
sppg_id SERIAL PRIMARY KEY,
id_sppg_code VARCHAR(20) UNIQUE,
nama_sppg VARCHAR(200) NOT NULL,
desa_id INT REFERENCES desa(desa_id),
yayasan_id INT REFERENCES yayasan(yayasan_id),
alamat TEXT,
status_operasional VARCHAR(50) NOT NULL DEFAULT 'Belum Operasional',
tanggal_operasional DATE,
bpjs_kesehatan BOOLEAN DEFAULT FALSE,
nama_ka_sppg VARCHAR(150),
no_hp_ka_sppg VARCHAR(20),
jumlah_relawan INT DEFAULT 0,
jumlah_penjamah_makanan INT DEFAULT 0,
jumlah_bpjs_tk INT DEFAULT 0,
chef_bersertifikat_bnsp INT DEFAULT 0,
keterangan TEXT,
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE sppg_sertifikasi (
sertifikasi_id SERIAL PRIMARY KEY,
sppg_id INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
jenis_sertifikasi VARCHAR(30) NOT NULL CHECK (jenis_sertifikasi IN
('IKL','SLHS','HACCP','HALAL','IPAL','ISO')),
status BOOLEAN DEFAULT FALSE,
tanggal_berlaku DATE,
keterangan TEXT,
UNIQUE (sppg_id, jenis_sertifikasi)
);

-- ==== KATEGORI PENERIMA ====
CREATE TABLE kategori_penerima (
kategori_id SERIAL PRIMARY KEY,
nama_kategori VARCHAR(60) NOT NULL UNIQUE,
urutan INT DEFAULT 0
-- isi awal: KB, TK, RA, PAUD, SD/MI, SMP/MTS, SMA/SMK/MA,
-- Posyandu Bumil, Posyandu Busui, Posyandu Balita, Santri, ATS
);

-- ==== MASTER SEKOLAH/LEMBAGA PENERIMA (BARU) ====
CREATE TABLE sekolah (
sekolah_id SERIAL PRIMARY KEY,
nama_sekolah VARCHAR(200) NOT NULL,
npsn VARCHAR(20), -- Nomor Pokok Sekolah Nasional (optional)
kategori_id INT NOT NULL REFERENCES kategori_penerima(kategori_id),
desa_id INT REFERENCES desa(desa_id),
kecamatan_id INT REFERENCES kecamatan(kecamatan_id),
alamat_sekolah TEXT,
nama_kepala_sekolah VARCHAR(150),
no_hp_kepala_sekolah VARCHAR(20),
email_sekolah VARCHAR(100),
jumlah_siswa_laki INT DEFAULT 0,
jumlah_siswa_perempuan INT DEFAULT 0,
jumlah_siswa_total INT GENERATED ALWAYS AS (jumlah_siswa_laki + jumlah_siswa_perempuan) STORED,
tahun_ajaran_last VARCHAR(10), -- tahun ajaran terakhir data
keterangan TEXT,
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sekolah_npsn ON sekolah(npsn);
CREATE INDEX idx_sekolah_nama ON sekolah(nama_sekolah);
CREATE INDEX idx_sekolah_desa ON sekolah(desa_id);
CREATE INDEX idx_sekolah_kategori ON sekolah(kategori_id);

-- ==== PENERIMA MANFAAT DI SPPG (SAAT INI/AKTIF) ====
CREATE TABLE sppg_penerima_manfaat (
id SERIAL PRIMARY KEY,
sppg_id INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
sekolah_id INT NOT NULL REFERENCES sekolah(sekolah_id),
tahun_ajaran VARCHAR(10), -- tahun aktif peneriman MBG di SPPG ini
jumlah_laki INT DEFAULT 0, -- jumlah siswa laki yang menerima MBG
jumlah_perempuan INT DEFAULT 0, -- jumlah siswa perempuan yang menerima MBG
jumlah_total INT GENERATED ALWAYS AS (jumlah_laki + jumlah_perempuan) STORED,
status VARCHAR(30) DEFAULT 'Aktif', -- Aktif, Selesai, Cuti, Ditangguhkan
tanggal_mulai DATE NOT NULL, -- kapan mulai menerima dari SPPG ini
tanggal_selesai DATE, -- kapan selesai (NULL jika masih aktif)
catatan TEXT,
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now(),
UNIQUE (sppg_id, sekolah_id, tahun_ajaran)
);

CREATE INDEX idx_penerima_sppg ON sppg_penerima_manfaat(sppg_id);
CREATE INDEX idx_penerima_sekolah ON sppg_penerima_manfaat(sekolah_id);
CREATE INDEX idx_penerima_status ON sppg_penerima_manfaat(status);

-- ==== RIWAYAT PENERIMAAN MBG PER SEKOLAH (BARU) ====
-- Tabel ini mencatat semua sekolah yang pernah/sedang menerima MBG
-- (bisa dari SPPG mana saja)
CREATE TABLE sekolah_penerimaan_mbg (
id SERIAL PRIMARY KEY,
sekolah_id INT NOT NULL REFERENCES sekolah(sekolah_id) ON DELETE CASCADE,
sppg_id INT NOT NULL REFERENCES sppg(sppg_id),
status VARCHAR(30) NOT NULL DEFAULT 'Aktif'
CHECK (status IN ('Aktif','Selesai','Tertunda','Berhenti','Cuti')),
tanggal_mulai_mbg DATE NOT NULL, -- tanggal mulai menerima MBG
tanggal_selesai_mbg DATE, -- tanggal selesai (NULL jika aktif)
tahun_ajaran VARCHAR(10),
jumlah_hari_operasional INT, -- jumlah hari sekolah buka/teroperasi dalam periode
catatan_status TEXT, -- alasan berhenti, atau catatan lainnya
created_at TIMESTAMP DEFAULT now(),
updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_penerimaan_sekolah ON sekolah_penerimaan_mbg(sekolah_id);
CREATE INDEX idx_penerimaan_sppg ON sekolah_penerimaan_mbg(sppg_id);
CREATE INDEX idx_penerimaan_tanggal ON sekolah_penerimaan_mbg(tanggal_mulai_mbg);
CREATE INDEX idx_penerimaan_status ON sekolah_penerimaan_mbg(status);

-- ==== SUPPLY CHAIN (BAHAN BAKU) ====
CREATE TABLE pemasok (
pemasok_id SERIAL PRIMARY KEY,
nama_pemasok VARCHAR(150) NOT NULL,
alamat_pemasok TEXT,
kontak VARCHAR(50)
);

CREATE TABLE jenis_pangan (
jenis_pangan_id SERIAL PRIMARY KEY,
nama_bahan VARCHAR(100) NOT NULL UNIQUE,
kategori VARCHAR(50),
satuan_default VARCHAR(20) DEFAULT 'Kilogram'
);

CREATE TABLE supply_chain_kebutuhan (
id SERIAL PRIMARY KEY,
sppg_id INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
jenis_pangan_id INT NOT NULL REFERENCES jenis_pangan(jenis_pangan_id),
pemasok_id INT REFERENCES pemasok(pemasok_id),
kebutuhan_per_bulan NUMERIC(12,2) NOT NULL,
satuan VARCHAR(20) DEFAULT 'Kilogram',
periode DATE NOT NULL DEFAULT date_trunc('month', now()),
created_at TIMESTAMP DEFAULT now()
);

-- ==== MODUL PENGGILINGAN ====
CREATE TABLE penggilingan (
penggilingan_id SERIAL PRIMARY KEY,
nama_penggilingan VARCHAR(150) NOT NULL,
alamat TEXT,
kecamatan_id INT REFERENCES kecamatan(kecamatan_id),
penanggung_jawab VARCHAR(150),
no_hp VARCHAR(20),
kapasitas_terpasang_kg_minggu NUMERIC(12,2),
status VARCHAR(30) DEFAULT 'Aktif',
created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_sumber_gabah (
id SERIAL PRIMARY KEY,
penggilingan_id INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
minggu_mulai DATE NOT NULL,
minggu_selesai DATE NOT NULL,
sumber_gabah VARCHAR(200) NOT NULL,
volume_kg NUMERIC(12,2) NOT NULL,
harga_beli_per_kg NUMERIC(12,2),
catatan TEXT,
created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_produksi (
id SERIAL PRIMARY KEY,
penggilingan_id INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
minggu_mulai DATE NOT NULL,
minggu_selesai DATE NOT NULL,
kapasitas_realisasi_kg NUMERIC(12,2) NOT NULL,
rendemen_persen NUMERIC(5,2),
catatan TEXT,
created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_distribusi (
id SERIAL PRIMARY KEY,
penggilingan_id INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
minggu_mulai DATE NOT NULL,
minggu_selesai DATE NOT NULL,
volume_kg NUMERIC(12,2) NOT NULL,
tujuan_tipe VARCHAR(20) NOT NULL CHECK (tujuan_tipe IN ('SPPG','Pasar','Lainnya')),
sppg_tujuan_id INT REFERENCES sppg(sppg_id),
lokasi_lain VARCHAR(200),
catatan TEXT,
created_at TIMESTAMP DEFAULT now()
);

-- ==== USER & AKSES ====
CREATE TABLE users (
user_id SERIAL PRIMARY KEY,
nama VARCHAR(150) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password_hash TEXT NOT NULL,
role VARCHAR(30) NOT NULL CHECK (role IN
('admin_dinas','operator_kecamatan','operator_penggilingan','operator_sekolah','publik')),
kecamatan_id INT REFERENCES kecamatan(kecamatan_id),
penggilingan_id INT REFERENCES penggilingan(penggilingan_id),
sekolah_id INT REFERENCES sekolah(sekolah_id),
created_at TIMESTAMP DEFAULT now()
);

-- ==== PENGADUAN PUBLIK ====
CREATE TABLE pengaduan (
id SERIAL PRIMARY KEY,
nama_pelapor VARCHAR(150),
kontak VARCHAR(50),
sppg_id INT REFERENCES sppg(sppg_id),
sekolah_id INT REFERENCES sekolah(sekolah_id),
isi_pengaduan TEXT NOT NULL,
status VARCHAR(30) DEFAULT 'Baru',
tanggal TIMESTAMP DEFAULT now(),
tanggapan TEXT
);

-- ==== AUDIT LOG (OPTIONAL) ====
CREATE TABLE audit_log (
audit_id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(user_id),
tabel_nama VARCHAR(50) NOT NULL,
record_id INT NOT NULL,
aksi VARCHAR(20) CHECK (aksi IN ('INSERT','UPDATE','DELETE')),
data_lama JSONB,
data_baru JSONB,
tanggal TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_tabel ON audit_log(tabel_nama);
