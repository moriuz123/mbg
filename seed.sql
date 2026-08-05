-- 1. KECAMATAN
INSERT INTO kecamatan (kode_wilayah, nama_kecamatan, luas_km2, populasi) VALUES
('36.02.01', 'Rangkasbitung'.11, 134560),
('36.02.02', 'Cibadak'.20, 67890),
('36.02.03', 'Warunggunung'.40, 54321)
ON CONFLICT DO NOTHING;

-- 2. DESA
INSERT INTO desa (kecamatan_id, kode_wilayah, nama_desa, kode_pos) VALUES
(1, '36.02.01.2001', 'Muara Ciujung Timur', '42314'),
(1, '36.02.01.2002', 'Cijoro Pasir', '42316'),
(2, '36.02.02.2001', 'Pasar Keong', '42318')
ON CONFLICT DO NOTHING;

-- 3. KATEGORI SEKOLAH
INSERT INTO kategori_sekolah (nama_kategori) VALUES
('SD/MI'),
('SMP/MTs'),
('SMA/SMK/MA')
ON CONFLICT DO NOTHING;

-- 4. SEKOLAH
INSERT INTO sekolah (npsn, nama_sekolah, kategori_id, kecamatan_id, desa_id, alamat, jumlah_siswa, jumlah_guru, status) VALUES
('20601234', 'SDN 1 Rangkasbitung', 1, 1, 'Jl. Multatuli No. 1', 350, 20, 'Aktif'),
('20601235', 'SMPN 1 Cibadak', 2, 3, 'Jl. Raya Cibadak', 420, 25, 'Aktif'),
('20601236', 'SMAN 1 Warunggunung', 3, 3, 'Jl. Raya Warunggunung', 600, 40, 'Aktif')
ON CONFLICT (npsn) DO NOTHING;

-- 5. YAYASAN
INSERT INTO yayasan (nama_yayasan, ketua_yayasan, kontak, alamat_kantor, status_verifikasi) VALUES
('Yayasan Bhakti Lebak', 'Budi Santoso', '081234567890', 'Rangkasbitung', 'Terverifikasi'),
('Yayasan Pendidikan Harapan', 'Siti Aminah', '081987654321', 'Cibadak', 'Terverifikasi'),
('Yayasan Generasi Maju', 'Ahmad Hidayat', '08122334455', 'Warunggunung', 'Proses')
ON CONFLICT DO NOTHING;

-- 6. SPPG
INSERT INTO sppg (id_sppg_code, nama_sppg, desa_id, yayasan_id, alamat, status_operasional, nama_ka_sppg, no_hp_ka_sppg, jumlah_penjamah_makanan, jumlah_bpjs_tk) VALUES
('SPPG-001', 'Dapur Umum Rangkas', 1, 'Jl. Sentral', 'Aktif', 'Hasan', '081122223333', 15, 5, 20),
('SPPG-002', 'Dapur Sehat Cibadak', 2, 'Jl. Pasar Keong', 'Aktif', 'Wati', '081133334444', 12, 4, 16),
('SPPG-003', 'Dapur Mutiara Warunggunung', 3, 'Jl. Mutiara', 'Non-Aktif', 'Dewi', '081144445555', 10, 3, 13)
ON CONFLICT (id_sppg_code) DO NOTHING;

-- 7. SPPG SERTIFIKASI
INSERT INTO sppg_sertifikasi (sppg_id, jenis_sertifikasi, nomor_sertifikat, masa_berlaku, status) VALUES
(1, 'Laik Higiene', 'LH-2026-001', '2028-01-01', 'Aktif'),
(2, 'Halal', 'HL-2026-002', '2029-01-01', 'Aktif'),
(3, 'Laik Higiene', 'LH-2026-003', '2025-01-01', 'Kadaluarsa')
ON CONFLICT DO NOTHING;

-- 8. SPPG PENERIMA MANFAAT
INSERT INTO sppg_penerima_manfaat (sppg_id, sekolah_id, jarak_km, waktu_tempuh_menit) VALUES
(1, 2.5, 10),
(2, 5.0, 20),
(3, 1.2, 5)
ON CONFLICT DO NOTHING;

-- 9. PEMASOK
INSERT INTO pemasok (nama_pemasok, alamat_pemasok, kontak) VALUES
('PT. Pangan Nusantara', 'Tangerang', '021-998877'),
('CV. Tani Jaya', 'Lebak', '0855667788'),
('Toko Beras Sejahtera', 'Rangkasbitung', '081199998888')
ON CONFLICT DO NOTHING;

-- 10. JENIS PANGAN
INSERT INTO jenis_pangan (nama_bahan, kategori, satuan_default) VALUES
('Beras Medium', 'Karbohidrat', 'Kilogram') ON CONFLICT (nama_bahan) DO NOTHING;
INSERT INTO jenis_pangan (nama_bahan, kategori, satuan_default) VALUES
('Telur Ayam', 'Protein Hewani', 'Kilogram') ON CONFLICT (nama_bahan) DO NOTHING;
INSERT INTO jenis_pangan (nama_bahan, kategori, satuan_default) VALUES
('Kacang Hijau', 'Kacang-kacangan', 'Kilogram') ON CONFLICT (nama_bahan) DO NOTHING;

-- 11. SUPPLY CHAIN KEBUTUHAN
INSERT INTO supply_chain_kebutuhan (sppg_id, jenis_pangan_id, pemasok_id, kebutuhan_per_bulan, periode) VALUES
(1, 1, 500.00, '2026-08-01'),
(2, 2, 300.00, '2026-08-01'),
(3, 3, 150.00, '2026-08-01')
ON CONFLICT DO NOTHING;

-- 12. PENGGILINGAN
INSERT INTO penggilingan (nama_penggilingan, alamat, kecamatan_id, penanggung_jawab, kapasitas_terpasang_kg_minggu) VALUES
('Penggilingan Padi Makmur', 'Jl. Sawah Makmur', 'Supardi', 5000),
('Penggilingan Subur', 'Jl. Pertanian', 'Joko', 3000),
('Penggilingan Harapan Tani', 'Jl. Sawah Indah', 'Gatot', 4500)
ON CONFLICT DO NOTHING;

-- 13. PENGGILINGAN SUMBER GABAH
INSERT INTO penggilingan_sumber_gabah (penggilingan_id, minggu_mulai, minggu_selesai, sumber_gabah, volume_kg) VALUES
(1, '2026-08-01', '2026-08-07', 'Petani Lokal Desa A'),
(2, '2026-08-01', '2026-08-07', 'KUD Harapan'),
(3, '2026-08-01', '2026-08-07', 'Kelompok Tani Sejahtera')
ON CONFLICT DO NOTHING;

-- 14. PENGGILINGAN PRODUKSI
INSERT INTO penggilingan_produksi (penggilingan_id, minggu_mulai, minggu_selesai, kapasitas_realisasi_kg, rendemen_persen) VALUES
(1, '2026-08-01', '2026-08-07', 60.0),
(2, '2026-08-01', '2026-08-07', 60.0),
(3, '2026-08-01', '2026-08-07', 60.0)
ON CONFLICT DO NOTHING;

-- 15. PENGGILINGAN DISTRIBUSI
INSERT INTO penggilingan_distribusi (penggilingan_id, minggu_mulai, minggu_selesai, volume_kg, tujuan_tipe, sppg_tujuan_id) VALUES
(1, '2026-08-01', '2026-08-07', 'SPPG', 1),
(2, '2026-08-01', '2026-08-07', 'SPPG', 2),
(3, '2026-08-01', '2026-08-07', 'Pasar', NULL)
ON CONFLICT DO NOTHING;
