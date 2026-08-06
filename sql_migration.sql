ALTER TABLE sppg_laporan_aktifitas ADD COLUMN posyandu_id integer REFERENCES posyandu(id) ON DELETE CASCADE;
ALTER TABLE sppg_laporan_aktifitas ALTER COLUMN sekolah_id DROP NOT NULL;

CREATE TABLE posyandu_laporan_aktifitas (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sppg_laporan_id integer NOT NULL REFERENCES sppg_laporan_aktifitas(id) ON DELETE CASCADE,
  posyandu_id integer NOT NULL REFERENCES posyandu(id) ON DELETE CASCADE,
  tanggal_diterima timestamp without time zone NOT NULL DEFAULT now(),
  status_diterima text NOT NULL DEFAULT 'Diterima Lengkap',
  jumlah_porsi_diterima integer,
  kondisi_makanan text DEFAULT 'Baik',
  catatan text,
  foto_dokumentasi text,
  diverifikasi_oleh text,
  created_at timestamp without time zone DEFAULT now()
);
