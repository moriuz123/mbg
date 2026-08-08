# 🗄️ Dokumentasi Skema Database MBG Lebak

Dokumen ini menjelaskan struktur data, tabel, tipe kolom, dan relasi antar-entitas dalam **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**.

---

## 📌 Ringkasan Modul Database

Database terdiri dari **28 tabel utama** yang terbagi dalam 11 kelompok modul operasional:

1. **Autentikasi & Pengguna (BetterAuth)**: `user`, `session`, `account`, `verification`
2. **Wilayah Administratif**: `kecamatan`, `desa`
3. **Yayasan & SPPG**: `yayasan`, `sppg`, `sppg_sertifikasi`
4. **Gizi & Standar Menu**: `kategori_penerima`, `standar_menu_gizi`
5. **Penerima Manfaat Sekolah**: `sekolah`, `sppg_penerima_manfaat`, `sekolah_penerimaan_mbg`
6. **Penerima Manfaat Posyandu**: `posyandu`, `sppg_posyandu_manfaat`, `posyandu_penerimaan_mbg`
7. **Rantai Pasok & Pemasok**: `pemasok`, `jenis_pangan`, `supply_chain_kebutuhan`
8. **Penggilingan Padi**: `penggilingan`, `penggilingan_sumber_gabah`, `penggilingan_produksi`, `penggilingan_distribusi`
9. **Inventori & Pengawasan Mutu**: `sppg_pembelian_bahan`, `sppg_pemakaian_bahan`, `master_parameter_uji`, `sppg_uji_rapid_test`
10. **Laporan & Verifikasi Dua Arah**: `sppg_laporan_aktifitas`, `sekolah_laporan_aktifitas`, `posyandu_laporan_aktifitas`
11. **Pengaduan & Sistem**: `pengaduan`, `audit_log`, `pengumuman`, `sys_menu`, `navigation_menu`, `site_setting`

---

## 📐 Rincian Tabel Per Modul

### 1. Autentikasi & Pengguna (`user`, `session`, `account`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`user`** | `id` (PK)<br>`email` (UQ)<br>`username`<br>`role`<br>`sppg_id`<br>`sekolah_id`<br>`posyandu_id` | `TEXT`<br>`TEXT`<br>`TEXT`<br>`TEXT`<br>`INT`<br>`INT`<br>`INT` | Menyimpan kredensial dan peran pengguna (`admin_dinas`, `operator_sppg`, `operator_sekolah`, `operator_posyandu`, `operator_penggilingan`, `publik`). |
| **`session`** | `id` (PK)<br>`token`<br>`userId` (FK) | `TEXT`<br>`TEXT`<br>`TEXT` | Sesi login pengguna (BetterAuth). |

---

### 2. Wilayah Administratif (`kecamatan`, `desa`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`kecamatan`** | `kecamatan_id` (PK)<br>`nama_kecamatan` | `INT IDENTITY`<br>`TEXT` | Daftar 28 Kecamatan di Kabupaten Lebak. |
| **`desa`** | `desa_id` (PK)<br>`kecamatan_id` (FK)<br>`nama_desa` | `INT IDENTITY`<br>`INT`<br>`TEXT` | Desa / Kelurahan di Kabupaten Lebak. |

---

### 3. Yayasan & Dapur SPPG (`yayasan`, `sppg`, `sppg_sertifikasi`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`sppg`** | `sppg_id` (PK)<br>`id_sppg_code`<br>`nama_sppg`<br>`desa_id` (FK)<br>`status_operasional`<br>`chef_bersertifikat_bnsp` | `INT IDENTITY`<br>`TEXT`<br>`TEXT`<br>`INT`<br>`TEXT`<br>`INT` | Satuan Pelayanan Pemenuhan Gizi (SPPG) / Dapur Umum MBG. |
| **`sppg_sertifikasi`**| `sertifikasi_id` (PK)<br>`sppg_id` (FK)<br>`jenis_sertifikasi`<br>`status` | `INT IDENTITY`<br>`INT`<br>`TEXT`<br>`BOOL` | Status sertifikasi dapur (IKL, SLHS, HACCP, HALAL, IPAL, ISO). |

---

### 4. Standar Menu & Nutrisi Gizi (`standar_menu_gizi`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`standar_menu_gizi`**| `id` (PK)<br>`nama_menu`<br>`kalori_kkal`<br>`protein_gram`<br>`karbohidrat_gram`<br>`lemak_gram` | `INT IDENTITY`<br>`TEXT`<br>`INT`<br>`NUMERIC(5,2)`<br>`NUMERIC(5,2)`<br>`NUMERIC(5,2)` | Standar komposisi gizi dan kalori menu makanan harian. |

---

### 5. Sekolah & Posyandu Penerima Manfaat (`sekolah`, `posyandu`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`sekolah`** | `sekolah_id` (PK)<br>`npsn`<br>`nama_sekolah`<br>`kategori_id` (FK)<br>`jumlah_siswa_total` | `INT IDENTITY`<br>`TEXT`<br>`TEXT`<br>`INT`<br>`INT` | Data Sekolah sasaran (PAUD, SD, SMP, SMA). |
| **`posyandu`** | `id` (PK)<br>`nama_posyandu`<br>`jumlah_busui`<br>`jumlah_balita`<br>`jumlah_bumil`<br>`jumlah_total` | `INT IDENTITY`<br>`TEXT`<br>`INT`<br>`INT`<br>`INT`<br>`INT` | Posyandu sasaran (Ibu Hamil, Ibu Menyusui, Balita). |

---

### 6. Pengawasan Mutu & Rapid Test (`master_parameter_uji`, `sppg_uji_rapid_test`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`master_parameter_uji`** | `id` (PK)<br>`nama_parameter`<br>`kategori`<br>`ambang_batas`<br>`status_aktif` | `INT IDENTITY`<br>`TEXT`<br>`TEXT`<br>`TEXT`<br>`BOOL` | Master standar parameter uji keamanan pangan (Formalin, Boraks, E. Coli, Pestisida). |
| **`sppg_uji_rapid_test`** | `id` (PK)<br>`sppg_id` (FK)<br>`jenis_pangan_id` (FK)<br>`parameter_uji_id` (FK)<br>`hasil_uji` | `INT IDENTITY`<br>`INT`<br>`INT`<br>`INT`<br>`TEXT` | Log pengujian harian bahan makanan segar di dapur SPPG. |

---

### 7. Laporan & Verifikasi Dua Arah (`sppg_laporan_aktifitas`, `sekolah_laporan_aktifitas`, `posyandu_laporan_aktifitas`)

| Tabel | Kolom Utama | Tipe Data | Keterangan |
| :--- | :--- | :--- | :--- |
| **`sppg_laporan_aktifitas`** | `id` (PK)<br>`sppg_id` (FK)<br>`sekolah_id` (FK)<br>`posyandu_id` (FK)<br>`tanggal`<br>`jumlah_porsi` | `INT IDENTITY`<br>`INT`<br>`INT`<br>`INT`<br>`DATE`<br>`INT` | Pelaporan pengiriman paket makanan harian dari Dapur SPPG. |
| **`sekolah_laporan_aktifitas`**| `id` (PK)<br>`sppg_laporan_id` (FK)<br>`status_diterima`<br>`kondisi_makanan` | `INT IDENTITY`<br>`INT`<br>`TEXT`<br>`TEXT` | Konfirmasi penerimaan dan kondisi makanan oleh pihak Sekolah. |
| **`posyandu_laporan_aktifitas`**| `id` (PK)<br>`sppg_laporan_id` (FK)<br>`status_diterima`<br>`kondisi_makanan` | `INT IDENTITY`<br>`INT`<br>`TEXT`<br>`TEXT` | Konfirmasi penerimaan dan kondisi makanan oleh Kader Posyandu. |

---

## 🔗 Pemetaan Kunci Asing (Foreign Keys Summary)

- `desa.kecamatan_id` ➔ `kecamatan.kecamatan_id`
- `sppg.desa_id` ➔ `desa.desa_id`
- `sppg.yayasan_id` ➔ `yayasan.yayasan_id`
- `sekolah.kategori_id` ➔ `kategori_penerima.kategori_id`
- `sppg_penerima_manfaat.sppg_id` ➔ `sppg.sppg_id`
- `sppg_penerima_manfaat.sekolah_id` ➔ `sekolah.sekolah_id`
- `sppg_posyandu_manfaat.sppg_id` ➔ `sppg.sppg_id`
- `sppg_posyandu_manfaat.posyandu_id` ➔ `posyandu.id`
- `sppg_uji_rapid_test.parameter_uji_id` ➔ `master_parameter_uji.id`
- `sppg_laporan_aktifitas.standar_menu_id` ➔ `standar_menu_gizi.id`
- `sekolah_laporan_aktifitas.sppg_laporan_id` ➔ `sppg_laporan_aktifitas.id`
- `posyandu_laporan_aktifitas.sppg_laporan_id` ➔ `sppg_laporan_aktifitas.id`
