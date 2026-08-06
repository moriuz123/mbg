DO $$
DECLARE
    sppg_id1 INTEGER;
    kat_paud INTEGER;
    kat_sd INTEGER;
    kat_smp INTEGER;
    sch_1 INTEGER;
    sch_2 INTEGER;
    sch_3 INTEGER;
BEGIN
    SELECT sppg_id INTO sppg_id1 FROM sppg LIMIT 1 OFFSET 0;
    
    SELECT kategori_id INTO kat_paud FROM kategori_penerima WHERE nama_kategori ILIKE '%PAUD%' OR nama_kategori ILIKE '%TK%' LIMIT 1;
    SELECT kategori_id INTO kat_sd FROM kategori_penerima WHERE nama_kategori ILIKE '%SD%' LIMIT 1;
    SELECT kategori_id INTO kat_smp FROM kategori_penerima WHERE nama_kategori ILIKE '%SMP%' LIMIT 1;
    
    IF sppg_id1 IS NOT NULL THEN
        INSERT INTO sekolah (nama_sekolah, kategori_id) VALUES ('TK Dummy 1', kat_paud) RETURNING sekolah_id INTO sch_1;
        
        INSERT INTO sekolah (nama_sekolah, kategori_id) VALUES ('SD Dummy 1', kat_sd) RETURNING sekolah_id INTO sch_2;
        
        INSERT INTO sekolah (nama_sekolah, kategori_id) VALUES ('SMP Dummy 1', kat_smp) RETURNING sekolah_id INTO sch_3;
        
        INSERT INTO sppg_penerima_manfaat (sppg_id, sekolah_id, tahun_ajaran, jumlah_laki, jumlah_perempuan, jumlah_total, status, tanggal_mulai)
        VALUES 
            (sppg_id1, sch_1, '2025/2026', 45, 50, 95, 'Aktif', CURRENT_DATE),
            (sppg_id1, sch_2, '2025/2026', 150, 160, 310, 'Aktif', CURRENT_DATE),
            (sppg_id1, sch_3, '2025/2026', 200, 215, 415, 'Aktif', CURRENT_DATE);
    END IF;
END $$;
