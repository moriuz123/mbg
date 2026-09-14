# SDSUCI / MBG production deployment fixes

Perbaikan untuk deployment `sdsuci.lebakkab.go.id`:

- Docker web hanya dipublish ke `127.0.0.1:3200`.
- PostgreSQL dan Redis tidak dipublish ke host.
- `Dockerfile.prod` memakai `npm ci --legacy-peer-deps` untuk dependency graph repository saat ini.
- Build production tidak menjalankan `drizzle-kit push`; migrasi/schema tidak diubah otomatis.
- `package.json` script `build` diubah menjadi `next build`; `db:push` tetap tersedia sebagai perintah terpisah.
- Perbaikan field `sppgLaporanId` pada verifikasi sekolah.
- Query pemakaian bahan mengambil relation `sppg`.
- Rapid test memvalidasi `sppgId` sebelum insert.
- Query tracking rapid test mengambil `parameterMaster` dan memakai `namaParameter` sebagai fallback.
- `VerifiedDelivery.kondisiMakanan` menerima `null`, sesuai data database.
- Array `months` pada `AdminDinasDashboard` diberi tipe eksplisit agar tidak terinfer sebagai `never[]`.
- `tsconfig.json` difokuskan ke source aplikasi `src/` sehingga script maintenance/seed di root tidak ikut type-check build Next.js.
- `.env` tidak disertakan dalam paket perbaikan; gunakan `.env` production yang sudah ada di server.


## v3 - Build-time prerender/auth fix
- Route group `(admin)` dan `(public)` dipaksa dynamic (`force-dynamic`, `revalidate=0`) agar query PostgreSQL tidak dijalankan saat `next build`.
- Docker builder memakai `BETTER_AUTH_SECRET` khusus build agar Better Auth tidak menolak default secret. Secret ini bukan secret production; environment runtime dari Compose tetap mengambil `.env` server.
- Database tidak perlu diekspos atau tersedia pada tahap image build.

## v4 build/runtime fixes
- Root layout is `force-dynamic` so production DB/auth queries are not executed during `next build`.
- Better Auth uses a build-only fallback only when `MBG_BUILD_MODE=1`; runtime still requires `BETTER_AUTH_SECRET`.
- Production `/api/seed` is disabled (404).
- Missing session role falls back to `publik`, never `super_admin`.
