# Skema Database — Sistem MBG Kabupaten Lebak (Improved)

Versi perbaikan dengan **Master Sekolah/Lembaga** dan tracking status penerimaan MBG.

Diagram ERD: `erd-mbg-lebak-improved.mermaid`

---

## A. Perubahan Utama

### 1. **Tambah Tabel Master Sekolah/Lembaga** (`sekolah`)
Sebelumnya, sekolah hanya tersimpan sebagai teks dalam `sppg_penerima_manfaat.nama_lembaga`. Sekarang:
- Setiap sekolah punya ID unik (`sekolah_id`)
- Dapat direferensikan dari berbagai tabel
- Mencegah duplikasi & memudahkan tracking

### 2. **Pisahkan Tabel Penerima Manfaat & Status Penerimaan MBG**
- `sekolah` = data master sekolah (nama, alamat, NPSN, kepala sekolah, dsb)
- `sppg_penerima_manfaat` = penerima di SPPG tertentu (saat ini/aktif)
- `sekolah_penerimaan_mbg` = **riwayat** kapan sekolah menerima MBG (tanggal mulai, selesai, status)

### 3. **Tambah Tracking Status Penerimaan MBG per Sekolah**
- `status` = Aktif, Selesai, Tertunda, Berhenti, dsb
- `tanggal_mulai_mbg` = kapan sekolah pertama kali terima MBG
- `tanggal_selesai_mbg` = kapan program selesai (bisa NULL jika masih jalan)
- `catatan` = alasan berhenti, masalah, dsb

---

## B. DDL (PostgreSQL) — Versi Diperbaiki

```sql
-- ==== WILAYAH ====
CREATE TABLE kecamatan (
    kecamatan_id    SERIAL PRIMARY KEY,
    nama_kecamatan  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE desa (
    desa_id         SERIAL PRIMARY KEY,
    kecamatan_id    INT NOT NULL REFERENCES kecamatan(kecamatan_id),
    nama_desa       VARCHAR(100) NOT NULL
);

-- ==== YAYASAN & SPPG ====
CREATE TABLE yayasan (
    yayasan_id      SERIAL PRIMARY KEY,
    nama_yayasan    VARCHAR(200) NOT NULL,
    alamat          TEXT,
    kontak          VARCHAR(50)
);

CREATE TABLE sppg (
    sppg_id                     SERIAL PRIMARY KEY,
    id_sppg_code                VARCHAR(20) UNIQUE,
    nama_sppg                   VARCHAR(200) NOT NULL,
    desa_id                     INT REFERENCES desa(desa_id),
    yayasan_id                  INT REFERENCES yayasan(yayasan_id),
    alamat                      TEXT,
    status_operasional          VARCHAR(50) NOT NULL DEFAULT 'Belum Operasional',
    tanggal_operasional         DATE,
    bpjs_kesehatan              BOOLEAN DEFAULT FALSE,
    nama_ka_sppg                VARCHAR(150),
    no_hp_ka_sppg               VARCHAR(20),
    jumlah_relawan              INT DEFAULT 0,
    jumlah_penjamah_makanan     INT DEFAULT 0,
    jumlah_bpjs_tk              INT DEFAULT 0,
    chef_bersertifikat_bnsp     INT DEFAULT 0,
    keterangan                  TEXT,
    created_at                  TIMESTAMP DEFAULT now(),
    updated_at                  TIMESTAMP DEFAULT now()
);

CREATE TABLE sppg_sertifikasi (
    sertifikasi_id      SERIAL PRIMARY KEY,
    sppg_id              INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
    jenis_sertifikasi    VARCHAR(30) NOT NULL CHECK (jenis_sertifikasi IN
                          ('IKL','SLHS','HACCP','HALAL','IPAL','ISO')),
    status               BOOLEAN DEFAULT FALSE,
    tanggal_berlaku      DATE,
    keterangan           TEXT,
    UNIQUE (sppg_id, jenis_sertifikasi)
);

-- ==== KATEGORI PENERIMA ====
CREATE TABLE kategori_penerima (
    kategori_id    SERIAL PRIMARY KEY,
    nama_kategori  VARCHAR(60) NOT NULL UNIQUE,
    urutan         INT DEFAULT 0
    -- isi awal: KB, TK, RA, PAUD, SD/MI, SMP/MTS, SMA/SMK/MA,
    --           Posyandu Bumil, Posyandu Busui, Posyandu Balita, Santri, ATS
);

-- ==== MASTER SEKOLAH/LEMBAGA PENERIMA (BARU) ====
CREATE TABLE sekolah (
    sekolah_id              SERIAL PRIMARY KEY,
    nama_sekolah            VARCHAR(200) NOT NULL,
    npsn                    VARCHAR(20),                -- Nomor Pokok Sekolah Nasional (optional)
    kategori_id             INT NOT NULL REFERENCES kategori_penerima(kategori_id),
    desa_id                 INT REFERENCES desa(desa_id),
    kecamatan_id            INT REFERENCES kecamatan(kecamatan_id),
    alamat_sekolah          TEXT,
    nama_kepala_sekolah     VARCHAR(150),
    no_hp_kepala_sekolah    VARCHAR(20),
    email_sekolah           VARCHAR(100),
    jumlah_siswa_laki       INT DEFAULT 0,
    jumlah_siswa_perempuan  INT DEFAULT 0,
    jumlah_siswa_total      INT GENERATED ALWAYS AS (jumlah_siswa_laki + jumlah_siswa_perempuan) STORED,
    tahun_ajaran_last       VARCHAR(10),                -- tahun ajaran terakhir data
    keterangan              TEXT,
    created_at              TIMESTAMP DEFAULT now(),
    updated_at              TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_sekolah_npsn ON sekolah(npsn);
CREATE INDEX idx_sekolah_nama ON sekolah(nama_sekolah);
CREATE INDEX idx_sekolah_desa ON sekolah(desa_id);
CREATE INDEX idx_sekolah_kategori ON sekolah(kategori_id);

-- ==== PENERIMA MANFAAT DI SPPG (SAAT INI/AKTIF) ====
CREATE TABLE sppg_penerima_manfaat (
    id                SERIAL PRIMARY KEY,
    sppg_id           INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
    sekolah_id        INT NOT NULL REFERENCES sekolah(sekolah_id),
    tahun_ajaran      VARCHAR(10),                     -- tahun aktif peneriman MBG di SPPG ini
    jumlah_laki       INT DEFAULT 0,                   -- jumlah siswa laki yang menerima MBG
    jumlah_perempuan  INT DEFAULT 0,                   -- jumlah siswa perempuan yang menerima MBG
    jumlah_total      INT GENERATED ALWAYS AS (jumlah_laki + jumlah_perempuan) STORED,
    status            VARCHAR(30) DEFAULT 'Aktif',     -- Aktif, Selesai, Cuti, Ditangguhkan
    tanggal_mulai     DATE NOT NULL,                   -- kapan mulai menerima dari SPPG ini
    tanggal_selesai   DATE,                            -- kapan selesai (NULL jika masih aktif)
    catatan           TEXT,
    created_at        TIMESTAMP DEFAULT now(),
    updated_at        TIMESTAMP DEFAULT now(),
    UNIQUE (sppg_id, sekolah_id, tahun_ajaran)
);

CREATE INDEX idx_penerima_sppg ON sppg_penerima_manfaat(sppg_id);
CREATE INDEX idx_penerima_sekolah ON sppg_penerima_manfaat(sekolah_id);
CREATE INDEX idx_penerima_status ON sppg_penerima_manfaat(status);

-- ==== RIWAYAT PENERIMAAN MBG PER SEKOLAH (BARU) ====
-- Tabel ini mencatat semua sekolah yang pernah/sedang menerima MBG
-- (bisa dari SPPG mana saja)
CREATE TABLE sekolah_penerimaan_mbg (
    id                      SERIAL PRIMARY KEY,
    sekolah_id              INT NOT NULL REFERENCES sekolah(sekolah_id) ON DELETE CASCADE,
    sppg_id                 INT NOT NULL REFERENCES sppg(sppg_id),
    status                  VARCHAR(30) NOT NULL DEFAULT 'Aktif'
                            CHECK (status IN ('Aktif','Selesai','Tertunda','Berhenti','Cuti')),
    tanggal_mulai_mbg       DATE NOT NULL,           -- tanggal mulai menerima MBG
    tanggal_selesai_mbg     DATE,                    -- tanggal selesai (NULL jika aktif)
    tahun_ajaran            VARCHAR(10),
    jumlah_hari_operasional INT,                     -- jumlah hari sekolah buka/teroperasi dalam periode
    catatan_status          TEXT,                    -- alasan berhenti, atau catatan lainnya
    created_at              TIMESTAMP DEFAULT now(),
    updated_at              TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_penerimaan_sekolah ON sekolah_penerimaan_mbg(sekolah_id);
CREATE INDEX idx_penerimaan_sppg ON sekolah_penerimaan_mbg(sppg_id);
CREATE INDEX idx_penerimaan_tanggal ON sekolah_penerimaan_mbg(tanggal_mulai_mbg);
CREATE INDEX idx_penerimaan_status ON sekolah_penerimaan_mbg(status);

-- ==== SUPPLY CHAIN (BAHAN BAKU) ====
CREATE TABLE pemasok (
    pemasok_id       SERIAL PRIMARY KEY,
    nama_pemasok     VARCHAR(150) NOT NULL,
    alamat_pemasok   TEXT,
    kontak           VARCHAR(50)
);

CREATE TABLE jenis_pangan (
    jenis_pangan_id  SERIAL PRIMARY KEY,
    nama_bahan       VARCHAR(100) NOT NULL UNIQUE,
    kategori         VARCHAR(50),
    satuan_default   VARCHAR(20) DEFAULT 'Kilogram'
);

CREATE TABLE supply_chain_kebutuhan (
    id                    SERIAL PRIMARY KEY,
    sppg_id               INT NOT NULL REFERENCES sppg(sppg_id) ON DELETE CASCADE,
    jenis_pangan_id       INT NOT NULL REFERENCES jenis_pangan(jenis_pangan_id),
    pemasok_id            INT REFERENCES pemasok(pemasok_id),
    kebutuhan_per_bulan   NUMERIC(12,2) NOT NULL,
    satuan                VARCHAR(20) DEFAULT 'Kilogram',
    periode               DATE NOT NULL DEFAULT date_trunc('month', now()),
    created_at            TIMESTAMP DEFAULT now()
);

-- ==== MODUL PENGGILINGAN ====
CREATE TABLE penggilingan (
    penggilingan_id               SERIAL PRIMARY KEY,
    nama_penggilingan             VARCHAR(150) NOT NULL,
    alamat                        TEXT,
    kecamatan_id                  INT REFERENCES kecamatan(kecamatan_id),
    penanggung_jawab              VARCHAR(150),
    no_hp                         VARCHAR(20),
    kapasitas_terpasang_kg_minggu NUMERIC(12,2),
    status                        VARCHAR(30) DEFAULT 'Aktif',
    created_at                    TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_sumber_gabah (
    id                  SERIAL PRIMARY KEY,
    penggilingan_id     INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
    minggu_mulai        DATE NOT NULL,
    minggu_selesai      DATE NOT NULL,
    sumber_gabah        VARCHAR(200) NOT NULL,
    volume_kg           NUMERIC(12,2) NOT NULL,
    harga_beli_per_kg   NUMERIC(12,2),
    catatan             TEXT,
    created_at          TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_produksi (
    id                       SERIAL PRIMARY KEY,
    penggilingan_id          INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
    minggu_mulai             DATE NOT NULL,
    minggu_selesai           DATE NOT NULL,
    kapasitas_realisasi_kg   NUMERIC(12,2) NOT NULL,
    rendemen_persen          NUMERIC(5,2),
    catatan                  TEXT,
    created_at               TIMESTAMP DEFAULT now()
);

CREATE TABLE penggilingan_distribusi (
    id                  SERIAL PRIMARY KEY,
    penggilingan_id     INT NOT NULL REFERENCES penggilingan(penggilingan_id) ON DELETE CASCADE,
    minggu_mulai        DATE NOT NULL,
    minggu_selesai      DATE NOT NULL,
    volume_kg           NUMERIC(12,2) NOT NULL,
    tujuan_tipe         VARCHAR(20) NOT NULL CHECK (tujuan_tipe IN ('SPPG','Pasar','Lainnya')),
    sppg_tujuan_id       INT REFERENCES sppg(sppg_id),
    lokasi_lain          VARCHAR(200),
    catatan              TEXT,
    created_at           TIMESTAMP DEFAULT now()
);

-- ==== USER & AKSES ====
CREATE TABLE users (
    user_id          SERIAL PRIMARY KEY,
    nama             VARCHAR(150) NOT NULL,
    email            VARCHAR(150) NOT NULL UNIQUE,
    password_hash    TEXT NOT NULL,
    role             VARCHAR(30) NOT NULL CHECK (role IN
                      ('admin_dinas','operator_kecamatan','operator_penggilingan','operator_sekolah','publik')),
    kecamatan_id     INT REFERENCES kecamatan(kecamatan_id),
    penggilingan_id  INT REFERENCES penggilingan(penggilingan_id),
    sekolah_id       INT REFERENCES sekolah(sekolah_id),
    created_at       TIMESTAMP DEFAULT now()
);

-- ==== PENGADUAN PUBLIK ====
CREATE TABLE pengaduan (
    id              SERIAL PRIMARY KEY,
    nama_pelapor    VARCHAR(150),
    kontak          VARCHAR(50),
    sppg_id         INT REFERENCES sppg(sppg_id),
    sekolah_id      INT REFERENCES sekolah(sekolah_id),
    isi_pengaduan   TEXT NOT NULL,
    status          VARCHAR(30) DEFAULT 'Baru',
    tanggal         TIMESTAMP DEFAULT now(),
    tanggapan       TEXT
);

-- ==== AUDIT LOG (OPTIONAL) ====
CREATE TABLE audit_log (
    audit_id        SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users(user_id),
    tabel_nama      VARCHAR(50) NOT NULL,
    record_id       INT NOT NULL,
    aksi            VARCHAR(20) CHECK (aksi IN ('INSERT','UPDATE','DELETE')),
    data_lama       JSONB,
    data_baru       JSONB,
    tanggal         TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_tabel ON audit_log(tabel_nama);
```

---

## C. Mapping Migrasi Data Excel

### Dari `SPPG_KABUPATEN_LEBAK.xlsx`

#### 1. **Migrasi ke `sekolah` (Master)**
Pertama kali, lakukan deduplikasi nama sekolah dari semua sheet kecamatan:

```sql
-- Contoh: dari daftar penerima manfaat di Excel, buat daftar unik sekolah
INSERT INTO sekolah (nama_sekolah, kategori_id, desa_id, kecamatan_id, tahun_ajaran_last)
SELECT DISTINCT 
    TRIM(regexp_split_to_table(nama_lembaga, ',')) AS nama_sekolah,
    kategori_id,
    desa_id,
    kecamatan_id,
    '2025/2026'
FROM (
    -- parsing dari Excel, contoh: "SDN 1 Kerta", "SDN 2 Kerta" dsb
) AS parsed
WHERE nama_sekolah NOT IN (SELECT nama_sekolah FROM sekolah);
```

#### 2. **Migrasi ke `sppg_penerima_manfaat`**
Setelah master sekolah ada, baru referensikan:

| Kolom Excel | Tabel Tujuan | Kolom |
|---|---|---|
| SPPG | `sppg_penerima_manfaat` | `sppg_id` (join ke `sppg.nama_sppg`) |
| NAMA SEKOLAH (dari daftar penerima) | `sppg_penerima_manfaat` | `sekolah_id` (join ke `sekolah.nama_sekolah`) |
| Jumlah penerima L/P | `sppg_penerima_manfaat` | `jumlah_laki`, `jumlah_perempuan` |
| Tahun ajaran | `sppg_penerima_manfaat` | `tahun_ajaran` |
| Status operasional SPPG | `sppg_penerima_manfaat.status` | Set ke 'Aktif' jika operasional |

#### 3. **Migrasi ke `sekolah_penerimaan_mbg` (History)**
Buat riwayat untuk setiap sekolah yang menerima MBG:

```sql
INSERT INTO sekolah_penerimaan_mbg 
    (sekolah_id, sppg_id, status, tanggal_mulai_mbg, tahun_ajaran)
SELECT 
    s.sekolah_id,
    spm.sppg_id,
    'Aktif',
    CURRENT_DATE,  -- atau bisa diisikan manual sesuai data historis
    '2025/2026'
FROM sppg_penerima_manfaat spm
JOIN sekolah s ON s.sekolah_id = spm.sekolah_id;
```

### Dari `REKAP_DATA_SUPPLY_CHAIN.xlsx`

⚠️ **Perhatian**: Jangan berubah dari migrasi original, tapi sekarang jika ada kolom penerima manfaat, gunakan `sekolah_id` sebagai referensi.

---

## D. Contoh Query — Dashboard Tracking MBG per Sekolah

### 1. **Daftar Sekolah yang Sudah Menerima MBG**
```sql
SELECT 
    s.sekolah_id,
    s.nama_sekolah,
    s.npsn,
    s.jumlah_siswa_total,
    spm.status AS status_penerimaan,
    sp.sppg_id,
    p.nama_sppg,
    spm.tanggal_mulai AS mulai_terima,
    COALESCE(spm.tanggal_selesai, 'Masih Aktif') AS selesai_terima
FROM sekolah s
JOIN sekolah_penerimaan_mbg spm ON s.sekolah_id = spm.sekolah_id
JOIN sppg p ON p.sppg_id = spm.sppg_id
WHERE spm.status = 'Aktif'
ORDER BY p.nama_sppg, s.nama_sekolah;
```

### 2. **Sekolah yang Belum Menerima MBG**
```sql
SELECT 
    s.sekolah_id,
    s.nama_sekolah,
    s.npsn,
    k.nama_kategori,
    s.jumlah_siswa_total,
    d.nama_desa,
    kec.nama_kecamatan
FROM sekolah s
JOIN kategori_penerima k ON k.kategori_id = s.kategori_id
LEFT JOIN desa d ON d.desa_id = s.desa_id
LEFT JOIN kecamatan kec ON kec.kecamatan_id = s.kecamatan_id
WHERE s.sekolah_id NOT IN (
    SELECT DISTINCT sekolah_id FROM sekolah_penerimaan_mbg
)
ORDER BY kec.nama_kecamatan, d.nama_desa, s.nama_sekolah;
```

### 3. **Statistik Penerimaan MBG per SPPG**
```sql
SELECT 
    p.nama_sppg,
    COUNT(DISTINCT spm.sekolah_id) AS jumlah_sekolah,
    SUM(spm.jumlah_total) AS total_siswa_penerima,
    COUNT(DISTINCT spm.tahun_ajaran) AS tahun_ajaran_aktif
FROM sppg p
LEFT JOIN sppg_penerima_manfaat spm ON p.sppg_id = spm.sppg_id
    AND spm.status = 'Aktif'
GROUP BY p.sppg_id, p.nama_sppg
ORDER BY total_siswa_penerima DESC;
```

### 4. **Riwayat Penerimaan MBG per Sekolah (Timeline)**
```sql
SELECT 
    s.nama_sekolah,
    p.nama_sppg,
    spm.status,
    spm.tanggal_mulai_mbg,
    spm.tanggal_selesai_mbg,
    (spm.tanggal_selesai_mbg - spm.tanggal_mulai_mbg) AS durasi_hari,
    spm.catatan_status
FROM sekolah_penerimaan_mbg spm
JOIN sekolah s ON s.sekolah_id = spm.sekolah_id
JOIN sppg p ON p.sppg_id = spm.sppg_id
WHERE s.sekolah_id = ? -- ganti dengan sekolah_id tertentu
ORDER BY spm.tanggal_mulai_mbg DESC;
```

### 5. **Dashboard: Ringkasan Status Penerimaan MBG per Desa**
```sql
SELECT 
    d.nama_desa,
    kec.nama_kecamatan,
    COUNT(DISTINCT s.sekolah_id) AS total_sekolah,
    COUNT(DISTINCT CASE WHEN spm.sekolah_id IS NOT NULL THEN s.sekolah_id END) AS sekolah_penerima_mbg,
    ROUND(
        100.0 * COUNT(DISTINCT CASE WHEN spm.sekolah_id IS NOT NULL THEN s.sekolah_id END) 
        / COUNT(DISTINCT s.sekolah_id), 
        1
    ) AS persen_coverage
FROM desa d
LEFT JOIN kecamatan kec ON kec.kecamatan_id = d.kecamatan_id
LEFT JOIN sekolah s ON s.desa_id = d.desa_id
LEFT JOIN sekolah_penerimaan_mbg spm ON spm.sekolah_id = s.sekolah_id 
    AND spm.status = 'Aktif'
GROUP BY d.desa_id, d.nama_desa, kec.nama_kecamatan
ORDER BY kec.nama_kecamatan, persen_coverage DESC;
```

---

## E. Catatan Implementasi

### **Perubahan Aplikasi/Form Input**

1. **Form Input Sekolah (Master)**
   - Operator dinas/kecamatan: form untuk tambah/edit `sekolah` (nama, NPSN, kategori, desa, dsb)
   - Fitur: cari duplikat, validasi NPSN unik (opsional)
   - Akses: admin dinas, operator kecamatan

2. **Form Pendaftaran Penerima MBG di SPPG**
   - Operator SPPG: pilih sekolah dari dropdown `sekolah` (bukan input teks bebas)
   - Isi jumlah siswa L/P yang menerima MBG
   - Sistem otomatis insert ke `sekolah_penerimaan_mbg` saat di-save
   - Akses: operator SPPG / operator kecamatan

3. **Dashboard Monitoring**
   - Tab 1: "Sekolah Aktif Menerima MBG" (query D.1)
   - Tab 2: "Sekolah Belum Tercover" (query D.2)
   - Tab 3: "Statistik per SPPG" (query D.3)
   - Tab 4: "Riwayat Penerimaan" (query D.4)
   - Tab 5: "Coverage per Desa" (query D.5)

### **Business Logic (Aplikasi)**

1. Saat sekolah ditambahkan ke `sppg_penerima_manfaat` (hubungi SPPG), otomatis insert/update `sekolah_penerimaan_mbg`:
   ```javascript
   if (!exists in sekolah_penerimaan_mbg) {
       insert new record with status='Aktif', tanggal_mulai_mbg=TODAY
   } else if (status='Selesai') {
       update ke status='Aktif', clear tanggal_selesai_mbg
   }
   ```

2. Saat sekolah dihapus dari `sppg_penerima_manfaat` (SPPG stop melayani), update `sekolah_penerimaan_mbg`:
   ```javascript
   update sekolah_penerimaan_mbg 
   set status='Berhenti', tanggal_selesai_mbg=TODAY, catatan_status='...'
   where sekolah_id=? and sppg_id=?
   ```

3. Validasi: tidak boleh ada duplikasi (sppg_id, sekolah_id) aktif dalam periode sama.

### **Data Integrity**

- UNIQUE constraint pada `(sppg_id, sekolah_id, tahun_ajaran)` di `sppg_penerima_manfaat`
- Foreign key cascade pada sekolah (opsional: jika sekolah dihapus, history tetap; atau set ON DELETE RESTRICT)
- Timestamp `updated_at` untuk audit trail

---

## F. Perbandingan Struktur Lama vs Baru

| Aspek | Lama | Baru |
|---|---|---|
| **Data Sekolah** | Hanya teks di `nama_lembaga` | Master table `sekolah` dengan ID unik |
| **Tracking Penerimaan** | Implisit (ada di `sppg_penerima_manfaat`) | Eksplisit di `sekolah_penerimaan_mbg` |
| **Sekolah Belum Tercover** | Sulit diquery | Mudah: NOT IN dari `sekolah_penerimaan_mbg` |
| **Riwayat MBG** | Tidak tercatat | Tercatat lengkap dengan status & tanggal |
| **Duplikasi Sekolah** | Mungkin terjadi | Diminimalkan dengan master table |
| **Dashboard Coverage** | Terbatas | Bisa tracking per desa, per kecamatan, per kategori |

---

## G. Referensi Website MBG Sumedang

Untuk inspirasi fitur, lihat: `https://web.sumedangkab.go.id/mbg/`

Fitur yang bisa diadopsi:
- Dashboard sekolah aktif vs target
- Map visualisasi coverage per desa
- Export report per SPPG
- Notif sekolah yang belum ada pengajuan
