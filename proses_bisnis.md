# 📊 Flowchart Proses Bisnis - MBG Kabupaten Lebak

Dokumen ini berisi alur proses bisnis (*Business Process Flowchart*) end-to-end untuk **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**, mulai dari perencanaan sasaran, rantai pasok bahan segar, pengawasan mutu food safety, produksi dapur, pengiriman, verifikasi penerimaan dua arah, hingga penanganan aduan publik.

---

## 🔄 Diagram Flowchart Proses Bisnis (Mermaid)

```mermaid
flowchart TD
    %% ==========================================
    %% PHASE 1: PERENCANAAN & TARGETING
    %% ==========================================
    subgraph PERENCANAAN ["📋 1. PERENCANAAN & PENETAPAN SASARAN"]
        A1["Badan Gizi Nasional (BGN) & Admin Dinas"] -->|Penetapan Kuota & Anggaran| A2["Master Sekolah & Posyandu Sasaran"]
        A1 -->|Penyusunan & Pengesahan| A3["Standar Menu Gizi (Kalori, Protein, Karbo)"]
        A2 --> A4["Alokasi Wilayah Layanan Dapur SPPG"]
    end

    %% ==========================================
    %% PHASE 2: RANTAI PASOK & SUPPLIER
    %% ==========================================
    subgraph LOGISTIK ["🌾 2. PENGADAAN & RANTAI PASOK LOKAL"]
        B1["Petani / Peternak / UMKM Lokal Lebak"] -->|Pasok Sayur, Telur, Daging, Buah| B2["Pemasok Terdaftar"]
        B3["Penggilingan Padi Lokal Lebak"] -->|Pasok Beras Terstandar| B2
        B2 -->|Pengiriman Bahan Baku Segar| B4["Dapur SPPG (Satuan Pelayanan Pemenuhan Gizi)"]
        B4 -->|Pencatatan Pembelian Stock In| DB1[("Tabel sppg_pembelian_bahan")]
    end

    %% ==========================================
    %% PHASE 3: QUALITY CONTROL & RAPID TEST
    %% ==========================================
    subgraph INSPEKSI ["🔬 3. QUALITY CONTROL & UJI RAPID TEST"]
        B4 -->|Pengambilan Sampel Bahan| C1["Petugas Penguji Dapur SPPG"]
        C1 -->|Pemeriksaan Laboratorium| C2{"Uji Rapid Test Food Safety"}
        C2 -->|Cek Master Parameter| C3["Master Parameter Uji (Formalin, Boraks, E.Coli, Pestisida)"]
        
        C2 -->|Hasil: TIDAK AMAN / POSITIF| C4["❌ PENOLAKAN BAHAN"]
        C4 -->|Retur Pemasok / Dibuang| C5["Catat Tindakan Lanjut Penolakan"]
        
        C2 -->|Hasil: AMAN / BEBAS| C6["✅ BAHAN DISETUJUI DIOLAH"]
        C2 -->|Log Pengujian Harian| DB2[("Tabel sppg_uji_rapid_test")]
    end

    %% ==========================================
    %% PHASE 4: PENGOLAHAN & MEMASAK
    %% ==========================================
    subgraph DAPUR ["🍳 4. PENGOLAHAN MENU & PENGEMASAN"]
        C6 --> D1["Chef Bersertifikat BNSP & Penjamah Makanan"]
        A3 -.->|Acuan Resep Gizi| D1
        D1 -->|Proses Memasak Higienis| D2["Pengemasan Porsi Steril (Lunch Box)"]
        D1 -->|Pencatatan Pemakaian Stock Out| DB3[("Tabel sppg_pemakaian_bahan")]
    end

    %% ==========================================
    %% PHASE 5: DISTRIBUSI & LOGISTIK
    %% ==========================================
    subgraph DISTRIBUSI ["🚚 5. DISTRIBUSI ARMADA TERKONTROL"]
        D2 --> E1["Kurir / Fleet Logistik SPPG"]
        E1 -->|Pengiriman Tepat Waktu| E2["Penerima Sekolah (PAUD, SD, SMP, SMA)"]
        E1 -->|Pengiriman Tepat Waktu| E3["Penerima Posyandu (Bumil, Busui, Balita)"]
        E1 -->|Input Laporan Pengiriman| DB4[("Tabel sppg_laporan_aktifitas")]
    end

    %% ==========================================
    %% PHASE 6: VERIFIKASI DUA ARAH
    %% ==========================================
    subgraph VERIFIKASI ["✅ 6. VERIFIKASI DUA ARAH (DITERIMA)"]
        E2 -->|Cek Fisik & Porsi| F1["Operator Sekolah (Guru)"]
        E3 -->|Cek Fisik & Porsi| F2["Operator Posyandu (Kader)"]
        
        F1 -->|Input Verifikasi Digital| F3{"Kondisi Makanan Diterima?"}
        F2 -->|Input Verifikasi Digital| F3
        
        F3 -->|Lengkap & Baik| F4["VERIFIKASI SUKSES (Diterima Lengkap)"]
        F3 -->|Rusak / Basi / Kurang| F5["VERIFIKASI BERMASALAH (Catat Klaim)"]
        
        F4 --> DB5[("Tabel sekolah/posyandu_laporan_aktifitas")]
        F5 --> DB5
    end

    %% ==========================================
    %% PHASE 7: MONITORING & PENGADUAN PUBLIK
    %% ==========================================
    subgraph EVALUASI ["📣 7. PENGAWASAN & LAYANAN PENGADUAN PUBLIK"]
        G1["Masyarakat / Orang Tua / Kader"] -->|Web Form Direct| G2["Portal Pengaduan MBG"]
        G1 -->|WhatsApp Bot +6281944114581| G3["LAPOR RUHAY! Pemkab Lebak"]
        G1 -->|Portal Nasional| G4["SPAN-LAPOR.GO.ID"]
        
        G2 --> DB6[("Tabel pengaduan")]
        G3 -.-> DB6
        G4 -.-> DB6
        
        DB6 --> H1["Dashboard Monitoring Admin Dinas Gizi"]
        F5 -.->|Notifikasi Warning| H1
        H1 -->|Inspeksi / Evaluasi SPPG| A1
    end
```

---

## 📝 Penjelasan Tahapan Proses Bisnis

### 1. Perencanaan & Penetapan Sasaran
- Badan Gizi Nasional (BGN) bersama Pemkab Lebak menetapkan kuota penerima dan alokasi anggaran.
- Menetapkan daftar master sekolah (PAUD s/d SMA) dan posyandu (Ibu Hamil, Ibu Menyusui, Balita).
- Mengesahkan **Standar Menu Gizi Seimbang** (target kalori, protein, karbohidrat, dan lemak).

### 2. Rantai Pasok & Pengadaan Bahan Lokal
- Petani, peternak, UMKM, dan penggilingan padi lokal Lebak terdaftar memasok bahan segar ke Dapur SPPG.
- Operator SPPG menginput data transaksi pembelian bahan baku ke tabel `sppg_pembelian_bahan` (Stock In).

### 3. Quality Control (Rapid Test Food Safety)
- Petugas Laboratorium Dapur melakukan uji rapid test terhadap cemaran **Formalin, Boraks, E. Coli, Salmonella, dan Residu Pestisida** mengacu pada `master_parameter_uji`.
- **Hasil Positif (Tidak Aman)** ➔ Bahan ditolak, diretur/dibuang, dan dicatat tindakan lanjutnya.
- **Hasil Negatif (Aman)** ➔ Bahan disetujui untuk dimasak.

### 4. Pengolahan & Pengemasan Makanan
- Chef bersertifikat BNSP memasok dan mengolah makanan sesuai standar resep gizi.
- Menginput pemakaian bahan baku ke tabel `sppg_pemakaian_bahan` (Stock Out).
- Makanan dikemas dalam porsi steril bermutu tinggi.

### 5. Distribusi Armada Terkontrol
- Kurir armada SPPG mengantar porsi makanan harian tepat waktu sebelum jam makan siang/pemberian PMT.
- SPPG mengunggah foto dokumentasi pengiriman dan laporan porsi di tabel `sppg_laporan_aktifitas`.

### 6. Verifikasi Dua Arah (Two-Way Digital Receipt)
- Operator Sekolah (Guru) dan Operator Posyandu (Kader) menerima paket makanan di lokasi.
- Mengisi konfirmasi digital (`sekolah_laporan_aktifitas` & `posyandu_laporan_aktifitas`) mengenai porsi dan kondisi makanan (*Baik*, *Rusak*, *Basi*, atau *Kurang*).

### 7. Monitoring & Layanan Pengaduan Publik
- Masyarakat dan penerima manfaat dapat mengirim aduan via **Web Form Direct**, **LAPOR RUHAY WhatsApp (+6281944114581)**, atau **SPAN-LAPOR.go.id**.
- Admin Dinas Gizi dan Supervisor memantau dashboard aduan secara real-time untuk penindakan dan evaluasi operasional dapur SPPG.
