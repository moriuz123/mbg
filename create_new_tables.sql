CREATE TABLE IF NOT EXISTS "pengumuman" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "judul" TEXT NOT NULL,
  "isi" TEXT NOT NULL,
  "author_id" TEXT NOT NULL REFERENCES "user"("id"),
  "sppg_id" INT REFERENCES "sppg"("sppg_id"),
  "status" TEXT DEFAULT 'Aktif' NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);
