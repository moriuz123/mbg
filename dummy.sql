DO $$
DECLARE
    sppg_id1 INTEGER;
    sppg_id2 INTEGER;
    sppg_id3 INTEGER;
    sekolah_id1 INTEGER;
    sekolah_id2 INTEGER;
    sekolah_id3 INTEGER;
BEGIN
    SELECT sppg_id INTO sppg_id1 FROM sppg LIMIT 1 OFFSET 0;
    SELECT sppg_id INTO sppg_id2 FROM sppg LIMIT 1 OFFSET 1;
    SELECT sppg_id INTO sppg_id3 FROM sppg LIMIT 1 OFFSET 2;
    
    SELECT sekolah_id INTO sekolah_id1 FROM sekolah LIMIT 1 OFFSET 0;
    SELECT sekolah_id INTO sekolah_id2 FROM sekolah LIMIT 1 OFFSET 1;
    SELECT sekolah_id INTO sekolah_id3 FROM sekolah LIMIT 1 OFFSET 2;
    
    IF sppg_id1 IS NOT NULL AND sekolah_id1 IS NOT NULL THEN
        INSERT INTO sppg_laporan_aktifitas (sppg_id, sekolah_id, tanggal, menu, jumlah_porsi, status, catatan)
        VALUES 
            (sppg_id1, sekolah_id1, CURRENT_DATE, 'Nasi, Ayam Goreng, Sayur Sop, Tempe, Buah Pisang', 120, 'Terkirim', 'Pengiriman tepat waktu'),
            (COALESCE(sppg_id2, sppg_id1), COALESCE(sekolah_id2, sekolah_id1), CURRENT_DATE, 'Nasi, Ikan Bakar, Sayur Lodeh, Tahu, Jeruk', 85, 'Diterima', 'Diterima oleh pihak sekolah dalam kondisi baik'),
            (COALESCE(sppg_id3, sppg_id1), COALESCE(sekolah_id3, sekolah_id1), CURRENT_DATE, 'Nasi, Telur Dadar, Tumis Kangkung, Kerupuk, Semangka', 150, 'Bermasalah', 'Terlambat 15 menit karena kendala cuaca'),
            (sppg_id1, COALESCE(sekolah_id2, sekolah_id1), CURRENT_DATE - INTERVAL '1 day', 'Nasi, Daging Rendang, Sayur Nangka, Apel', 85, 'Terkirim', 'Ok');
    END IF;
END $$;
