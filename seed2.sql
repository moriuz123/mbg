-- 1. KECAMATAN
INSERT INTO kecamatan (nama_kecamatan) VALUES
('Rangkasbitung'),
('Cibadak'),
('Warunggunung')
ON CONFLICT (nama_kecamatan) DO NOTHING;

-- 2. DESA (Assuming IDs 1, 3 correspond to above)
INSERT INTO desa (kecamatan_id, nama_desa) VALUES
(1, 'Muara Ciujung Timur'),
(1, 'Cijoro Pasir'),
(2, 'Pasar Keong');

-- 3. KATEGORI PENERIMA
INSERT INTO kategori_penerima (nama_kategori) VALUES
('SD/MI'),
('SMP/MTs'),
('SMA/SMK/MA')
ON CONFLICT (nama_kategori) DO NOTHING;

-- 4. SEKOLAH
INSERT INTO sekolah (nama_sekolah, npsn, kategori_id, desa_id, kecamatan_id, alamat_sekolah, jumlah_siswa_laki, jumlah_siswa_perempuan) VALUES
('SDN 1 Rangkasbitung', '20601234', 1, 1, 'Jl. Multatuli No. 1', 150, 200),
('SMPN 1 Cibadak', '20601235', 3, 2, 'Jl. Raya Cibadak', 200, 220),
('SMAN 1 Warunggunung', '20601236', 3, 3, 'Jl. Raya Warunggunung', 300, 300);

-- 5. YAYASAN
INSERT INTO yayasan (nama_yayasan, alamat, kontak) VALUES
('Yayasan Bhakti Lebak', 'Rangkasbitung', '081234567890'),
('Yayasan Pendidikan Harapan', 'Cibadak', '081987654321'),
('Yayasan Generasi Maju', 'Warunggunung', '08122334455');

-- 6. SPPG
INSERT INTO sppg (id_sppg_code, nama_sppg, desa_id, yayasan_id, alamat, status_operasional, nama_ka_sppg, no_hp_ka_sppg, jumlah_penjamah_makanan, jumlah_bpjs_tk) VALUES
('SPPG-001', 'Dapur Umum Rangkas', 1, 'Jl. Sentral', 'Aktif', 'Hasan', '081122223333', 15, 5, 20),
('SPPG-002', 'Dapur Sehat Cibadak', 2, 'Jl. Pasar Keong', 'Aktif', 'Wati', '081133334444', 12, 4, 16),
('SPPG-003', 'Dapur Mutiara Warunggunung', 3, 'Jl. Mutiara', 'Belum Operasional', 'Dewi', '081144445555', 10, 3, 13)
ON CONFLICT (id_sppg_code) DO NOTHING;

-- 7. SPPG SERTIFIKASI
INSERT INTO sppg_sertifikasi (sppg_id, jenis_sertifikasi, status, tanggal_berlaku, keterangan) VALUES
(1, 'HALAL', true, '2028-01-01', 'Halal MUI'),
(2, 'IKL', true, '2029-01-01', 'Dinkes'),
(3, 'SLHS', false, '2025-01-01', 'Kadaluarsa')
ON CONFLICT DO NOTHING;

-- 8. SPPG PENERIMA MANFAAT
INSERT INTO sppg_penerima_manfaat (sppg_id, sekolah_id, tahun_ajaran, jumlah_laki, jumlah_perempuan) VALUES
(1, '2025/2026', 150, 200),
(2, '2025/2026', 200, 220),
(3, '2025/2026', 300, 300);

-- 9. PEMASOK
INSERT INTO pemasok (nama_pemasok, alamat_pemasok, kontak) VALUES
('PT. Pangan Nusantara', 'Tangerang', '021-998877'),
('CV. Tani Jaya', 'Lebak', '0855667788'),
('Toko Beras Sejahtera', 'Rangkasbitung', '081199998888');

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
(3, 3, 150.00, '2026-08-01');

-- 12. PENGGILINGAN
INSERT INTO penggilingan (nama_penggilingan, alamat, kecamatan_id, penanggung_jawab, kapasitas_terpasang_kg_minggu) VALUES
('Penggilingan Padi Makmur', 'Jl. Sawah Makmur', 'Supardi', 5000),
('Penggilingan Subur', 'Jl. Pertanian', 'Joko', 3000),
('Penggilingan Harapan Tani', 'Jl. Sawah Indah', 'Gatot', 4500);

-- 13. PENGGILINGAN SUMBER GABAH
INSERT INTO penggilingan_sumber_gabah (penggilingan_id, minggu_mulai, minggu_selesai, sumber_gabah, volume_kg) VALUES
(1, '2026-08-01', '2026-08-07', 'Petani Lokal Desa A'),
(2, '2026-08-01', '2026-08-07', 'KUD Harapan'),
(3, '2026-08-01', '2026-08-07', 'Kelompok Tani Sejahtera');

-- 14. PENGGILINGAN PRODUKSI
INSERT INTO penggilingan_produksi (penggilingan_id, minggu_mulai, minggu_selesai, kapasitas_realisasi_kg, rendemen_persen) VALUES
(1, '2026-08-01', '2026-08-07', 60.0),
(2, '2026-08-01', '2026-08-07', 60.0),
(3, '2026-08-01', '2026-08-07', 60.0);

-- 15. PENGGILINGAN DISTRIBUSI
INSERT INTO penggilingan_distribusi (penggilingan_id, minggu_mulai, minggu_selesai, volume_kg, tujuan_tipe, sppg_tujuan_id) VALUES
(1, '2026-08-01', '2026-08-07', 'SPPG', 1),
(2, '2026-08-01', '2026-08-07', 'SPPG', 2),
(3, '2026-08-01', '2026-08-07', 'Pasar', NULL);
