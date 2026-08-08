# 📐 Entity Relationship Diagram (ERD) - MBG Lebak

Dokumen ini berisi Diagram ERD (*Entity Relationship Diagram*) lengkap untuk seluruh entitas database **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**.

---

```mermaid
erDiagram
    %% ==========================================
    %% 1. AUTENTIKASI & WILAYAH ADMINISTRATIF
    %% ==========================================
    user ||--o{ session : "owns"
    user ||--o{ account : "has"
    kecamatan ||--o{ desa : "contains"
    kecamatan ||--o{ sekolah : "located_in"
    kecamatan ||--o{ posyandu : "located_in"
    kecamatan ||--o{ penggilingan : "located_in"
    kecamatan ||--o{ pemasok : "located_in"
    desa ||--o{ sppg : "located_in"
    desa ||--o{ sekolah : "located_in"
    desa ||--o{ posyandu : "located_in"
    desa ||--o{ pemasok : "located_in"
    yayasan ||--o{ sppg : "manages"

    %% ==========================================
    %% 2. SPPG & SERTIFIKASI
    %% ==========================================
    sppg ||--o{ sppg_sertifikasi : "holds"
    sppg ||--o{ sppg_penerima_manfaat : "allocates_school"
    sppg ||--o{ sppg_posyandu_manfaat : "allocates_posyandu"
    sekolah ||--o{ sppg_penerima_manfaat : "assigned_to"
    posyandu ||--o{ sppg_posyandu_manfaat : "assigned_to"

    sekolah ||--o{ sekolah_penerimaan_mbg : "history_log"
    posyandu ||--o{ posyandu_penerimaan_mbg : "history_log"
    sppg ||--o{ sekolah_penerimaan_mbg : "serves"
    sppg ||--o{ posyandu_penerimaan_mbg : "serves"

    %% ==========================================
    %% 3. STANDAR MENU & KATEGORI PENERIMA
    %% ==========================================
    kategori_penerima ||--o{ sekolah : "classifies"
    kategori_penerima ||--o{ standar_menu_gizi : "targets"

    %% ==========================================
    %% 4. INVENTORI & MUTU FOOD SAFETY
    %% ==========================================
    pemasok ||--o{ sppg_pembelian_bahan : "supplies"
    jenis_pangan ||--o{ sppg_pembelian_bahan : "item_purchased"
    sppg ||--o{ sppg_pembelian_bahan : "buys"

    jenis_pangan ||--o{ sppg_pemakaian_bahan : "consumed"
    standar_menu_gizi ||--o{ sppg_pemakaian_bahan : "used_in_recipe"
    sppg ||--o{ sppg_pemakaian_bahan : "uses_stock"

    master_parameter_uji ||--o{ sppg_uji_rapid_test : "defines_test"
    jenis_pangan ||--o{ sppg_uji_rapid_test : "tested_food"
    sppg ||--o{ sppg_uji_rapid_test : "conducts_rapid_test"

    sppg ||--o{ supply_chain_kebutuhan : "plans_demand"
    jenis_pangan ||--o{ supply_chain_kebutuhan : "needed_food"
    pemasok ||--o{ supply_chain_kebutuhan : "selected_supplier"

    %% ==========================================
    %% 5. MODUL PENGGILINGAN PADI
    %% ==========================================
    penggilingan ||--o{ penggilingan_sumber_gabah : "sources"
    penggilingan ||--o{ penggilingan_produksi : "mills"
    penggilingan ||--o{ penggilingan_distribusi : "dispatches"
    sppg ||--o{ penggilingan_distribusi : "receives_rice"

    %% ==========================================
    %% 6. LAPORAN AKTIFITAS & VERIFIKASI DUA ARAH
    %% ==========================================
    sppg ||--o{ sppg_laporan_aktifitas : "dispatches_meals"
    sekolah ||--o{ sppg_laporan_aktifitas : "meal_target_school"
    posyandu ||--o{ sppg_laporan_aktifitas : "meal_target_posyandu"
    standar_menu_gizi ||--o{ sppg_laporan_aktifitas : "served_menu"

    sppg_laporan_aktifitas ||--o{ sekolah_laporan_aktifitas : "school_verification"
    sppg_laporan_aktifitas ||--o{ posyandu_laporan_aktifitas : "posyandu_verification"
    sekolah ||--o{ sekolah_laporan_aktifitas : "verifies"
    posyandu ||--o{ posyandu_laporan_aktifitas : "verifies"

    %% ==========================================
    %% 7. PENGADUAN, AUDIT, & PENGUMUMAN
    %% ==========================================
    sppg ||--o{ pengaduan : "reported_target"
    sekolah ||--o{ pengaduan : "reported_target"
    user ||--o{ audit_log : "performs_action"
    user ||--o{ pengumuman : "author"
    sppg ||--o{ pengumuman : "published_by"

    %% ==========================================
    %% ENTITY DEFINITIONS WITH ATTRIBUTES
    %% ==========================================

    user {
        string id PK
        string name
        string email UQ
        string role
        int sppg_id FK
        int sekolah_id FK
        int posyandu_id FK
        int penggilingan_id FK
    }

    sppg {
        int sppg_id PK
        string id_sppg_code UQ
        string nama_sppg
        int desa_id FK
        int yayasan_id FK
        string status_operasional
        int chef_bersertifikat_bnsp
    }

    sekolah {
        int sekolah_id PK
        string nama_sekolah
        string npsn
        int kategori_id FK
        int desa_id FK
        int kecamatan_id FK
        int jumlah_siswa_total
    }

    posyandu {
        int id PK
        string nama_posyandu
        int desa_id FK
        int kecamatan_id FK
        int jumlah_busui
        int jumlah_balita
        int jumlah_bumil
        int jumlah_total
    }

    master_parameter_uji {
        int id PK
        string nama_parameter
        string kategori
        string ambang_batas
        boolean status_aktif
    }

    sppg_uji_rapid_test {
        int id PK
        int sppg_id FK
        int jenis_pangan_id FK
        int parameter_uji_id FK
        date tanggal_uji
        string parameter_uji
        string hasil_uji
        string petugas_penguji
    }

    sppg_laporan_aktifitas {
        int id PK
        int sppg_id FK
        int sekolah_id FK
        int posyandu_id FK
        date tanggal
        int standar_menu_id FK
        int jumlah_porsi
        string status
    }

    sekolah_laporan_aktifitas {
        int id PK
        int sppg_laporan_id FK
        int sekolah_id FK
        timestamp tanggal_diterima
        string status_diterima
        string kondisi_makanan
        string diverifikasi_oleh
    }

    posyandu_laporan_aktifitas {
        int id PK
        int sppg_laporan_id FK
        int posyandu_id FK
        timestamp tanggal_diterima
        string status_diterima
        string kondisi_makanan
        string diverifikasi_oleh
    }
```
