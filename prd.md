# 📋 PRD (Product Requirements Document) & Alur Ekosistem System - MBG Lebak

Dokumen ini berisi spesifikasi kebutuhan produk (*Product Requirements Document*) dan alur kerja (*Workflow Architecture Diagram*) untuk **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**.

---

## 🔄 Diagram Alur Ekosistem MBG (End-to-End Workflow)

```mermaid
graph TD
    %% ==========================================
    %% ALUR KEBUTUHAN DAN RANTAI PASOK HULU
    %% ==========================================
    subgraph HULU ["1. RANTAI PASOK DAN LOGISTIK BAHAN SEGAR"]
        A1["Petani - Kelompok Tani - Peternak Lokal Lebak"] -->|Pasok Sayur Telur Daging| B1["Pemasok Terdaftar"]
        A2["Penggilingan Padi Lokal Lebak"] -->|Pasok Beras Terstandar| B1
        B1 -->|Input Nota Pembelian| C1["Dapur SPPG Satuan Pelayanan Pemenuhan Gizi"]
        C1 -->|Catat Stock In| DB_BUY["Tabel sppg_pembelian_bahan"]
    end

    %% ==========================================
    %% QUALITY CONTROL DAN UJI RAPID TEST
    %% ==========================================
    subgraph QC ["2. QUALITY CONTROL DAN FOOD SAFETY RAPID TEST"]
        C1 -->|Sampel Bahan Segar Masuk| D1{"Pemeriksaan Uji Rapid Test"}
        D1 -->|Formalin Boraks EColi Pestisida| D2["Master Parameter Uji"]
        D2 -->|Hasil Test: AMAN| E1["Lanjut Masak di Dapur"]
        D2 -->|Hasil Test: TIDAK AMAN| E2["Tindakan Lanjut Retur Buang"]
        D1 -->|Log Hasil Uji| DB_TEST["Tabel sppg_uji_rapid_test"]
    end

    %% ==========================================
    %% PENGOLAHAN GIZI DAN MEMASAK
    %% ==========================================
    subgraph DAPUR ["3. PENGOLAHAN STANDAR MENU GIZI"]
        E1 -->|Pilih Standar Menu| F1["Standar Menu Gizi Kalori Protein Karbo Lemak"]
        F1 -->|Chef BNSP dan Penjamah Makanan| F2["Proses Memasak Harian"]
        F2 -->|Catat Pemakaian Stock Out| DB_USE["Tabel sppg_pemakaian_bahan"]
    end

    %% ==========================================
    %% DISTRIBUSI KELUAR HILIR
    %% ==========================================
    subgraph DISTRIBUSI ["4. DISTRIBUSI ARMADA TERKONTROL"]
        F2 -->|Packing Porsi Steril| G1["Input Laporan Pengiriman SPPG"]
        G1 -->|Kirim Armada| H1["Sekolah Penerima Manfaat PAUD SD SMP SMA"]
        G1 -->|Kirim Armada| H2["Posyandu Penerima Manfaat Bumil Busui Balita"]
        G1 -->|Simpan Status Terkirim| DB_LOG["Tabel sppg_laporan_aktifitas"]
    end

    %% ==========================================
    %% VERIFIKASI DUA ARAH TWO WAY VERIFICATION
    %% ==========================================
    subgraph VERIFIKASI ["5. VERIFIKASI DUA ARAH DITERIMA DAN CEK MUTU"]
        H1 -->|Cek Jumlah dan Kondisi Makanan| I1["Form Verifikasi Digital Sekolah"]
        H2 -->|Cek Jumlah dan Kondisi Makanan| I2["Form Verifikasi Digital Posyandu"]
        I1 -->|Status Diterima Lengkap / Rusak / Basi| DB_V1["Tabel sekolah_laporan_aktifitas"]
        I2 -->|Status Diterima Lengkap / Rusak / Basi| DB_V2["Tabel posyandu_laporan_aktifitas"]
    end

    %% ==========================================
    %% UMPAN BALIK DAN LAYANAN PENGADUAN
    %% ==========================================
    subgraph ADUAN ["6. KANAL ADUAN DAN ASPIRASI PUBLIK"]
        J1["Masyarakat - Orang Tua - Kader"] -->|Web Form Direct| K1["Layanan Pengaduan MBG"]
        J1 -->|WhatsApp Bot 6281944114581| K2["LAPOR RUHAY Pemkab Lebak"]
        J1 -->|Portal SPAN-LAPOR| K3["SPAN LAPOR GO ID"]
        K1 --> DB_ADUAN["Tabel pengaduan"]
        DB_ADUAN --> L1["Dashboard Monitoring Admin Dinas Gizi dan Operator SPPG"]
        L1 -->|Tindak Lanjut dan Evaluasi| C1
    end
```

---

## 👥 Peran Pengguna (User Roles & Permissions)

1. **`admin_dinas` / `super_admin`**:
   - Mengelola master data wilayah, sekolah, posyandu, yayasan, SPPG, dan master parameter uji.
   - memantau dashboard pengawasan hulu ke hilir secara realtime.
   - Menindaklanjuti laporan pengaduan publik.
2. **`operator_sppg`**:
   - Menginput data pembelian bahan segar dan pemakaian harian.
   - Menginput log hasil uji rapid test laboratorium dapur.
   - Membuat laporan pengiriman porsi harian ke Sekolah dan Posyandu.
3. **`operator_sekolah`**:
   - Memverifikasi penerimaan paket makanan harian dari SPPG (konfirmasi porsi dan kondisi makanan).
4. **`operator_posyandu`**:
   - Memverifikasi penerimaan PMT / paket makanan harian untuk Ibu Hamil, Ibu Menyusui, dan Balita.
5. **`operator_penggilingan`**:
   - Menginput sumber gabah, produksi beras, dan realisasi pengiriman beras ke Dapur SPPG.
6. **`publik`**:
   - Mengakses direktori transparansi data SPPG, Sekolah, Posyandu, Penggilingan.
   - Mengirimkan pengaduan / masukan publik secara langsung.
