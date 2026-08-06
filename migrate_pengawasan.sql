CREATE TABLE IF NOT EXISTS "sppg_pembelian_bahan" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "sppg_id" integer NOT NULL,
  "pemasok_id" integer NOT NULL,
  "jenis_pangan_id" integer NOT NULL,
  "tanggal_pembelian" date NOT NULL,
  "minggu_ke" integer,
  "volume" numeric(12, 2) NOT NULL,
  "satuan" text NOT NULL DEFAULT 'Kg',
  "harga_total" numeric(15, 2),
  "foto_nota" text,
  "catatan" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sppg_pemakaian_bahan" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "sppg_id" integer NOT NULL,
  "jenis_pangan_id" integer NOT NULL,
  "standar_menu_id" integer,
  "tanggal_pemakaian" date NOT NULL,
  "minggu_ke" integer,
  "volume" numeric(12, 2) NOT NULL,
  "satuan" text NOT NULL DEFAULT 'Kg',
  "catatan" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sppg_uji_rapid_test" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "sppg_id" integer NOT NULL,
  "jenis_pangan_id" integer NOT NULL,
  "tanggal_uji" date NOT NULL,
  "parameter_uji" text NOT NULL,
  "hasil_uji" text NOT NULL,
  "petugas_penguji" text NOT NULL,
  "tindakan_lanjut" text,
  "foto_bukti" text,
  "created_at" timestamp DEFAULT now()
);

ALTER TABLE "sppg_pembelian_bahan" ADD CONSTRAINT "sppg_pembelian_bahan_sppg_id_fkey" FOREIGN KEY ("sppg_id") REFERENCES "sppg"("sppg_id") ON DELETE cascade;
ALTER TABLE "sppg_pembelian_bahan" ADD CONSTRAINT "sppg_pembelian_bahan_pemasok_id_fkey" FOREIGN KEY ("pemasok_id") REFERENCES "pemasok"("pemasok_id") ON DELETE no action;
ALTER TABLE "sppg_pembelian_bahan" ADD CONSTRAINT "sppg_pembelian_bahan_jenis_pangan_id_fkey" FOREIGN KEY ("jenis_pangan_id") REFERENCES "jenis_pangan"("jenis_pangan_id") ON DELETE no action;

ALTER TABLE "sppg_pemakaian_bahan" ADD CONSTRAINT "sppg_pemakaian_bahan_sppg_id_fkey" FOREIGN KEY ("sppg_id") REFERENCES "sppg"("sppg_id") ON DELETE cascade;
ALTER TABLE "sppg_pemakaian_bahan" ADD CONSTRAINT "sppg_pemakaian_bahan_jenis_pangan_id_fkey" FOREIGN KEY ("jenis_pangan_id") REFERENCES "jenis_pangan"("jenis_pangan_id") ON DELETE no action;
ALTER TABLE "sppg_pemakaian_bahan" ADD CONSTRAINT "sppg_pemakaian_bahan_standar_menu_id_fkey" FOREIGN KEY ("standar_menu_id") REFERENCES "standar_menu_gizi"("id") ON DELETE no action;

ALTER TABLE "sppg_uji_rapid_test" ADD CONSTRAINT "sppg_uji_rapid_test_sppg_id_fkey" FOREIGN KEY ("sppg_id") REFERENCES "sppg"("sppg_id") ON DELETE cascade;
ALTER TABLE "sppg_uji_rapid_test" ADD CONSTRAINT "sppg_uji_rapid_test_jenis_pangan_id_fkey" FOREIGN KEY ("jenis_pangan_id") REFERENCES "jenis_pangan"("jenis_pangan_id") ON DELETE no action;
