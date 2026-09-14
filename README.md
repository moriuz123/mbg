# 🚀 Digitalisasi Supply Chain MBG Pemkab Lebak

Sistem Informasi Manajemen Rantai Pasok (Supply Chain) untuk program Makan Bergizi Gratis (MBG) Pemerintah Kabupaten Lebak. Sistem ini melacak pergerakan logistik secara komprehensif (End-to-End) mulai dari hulu (Sumber Gabah dan Penggilingan Mitra), SPPG (Satuan Pelayanan Pengguna Gizi), hingga ke hilir (Verifikasi penerimaan di Sekolah dan Posyandu).

---

## 📋 Prasyarat Umum
Sebelum memulai di perangkat baru, pastikan terpasang:
1. **Node.js**: v20.x atau lebih baru (Termasuk `npm` v10+)
2. **Git**: [git-scm.com](https://git-scm.com/)
3. **Docker & Docker Compose**: Wajib untuk menjalankan database PostgreSQL lokal / server full docker.

---

## 🖥️ Bagian 1: Lingkungan Development (Lokal)

### 1. Kloning Repositori
```bash
git clone https://github.com/moriuz123/mbg.git
cd mbg
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file bernama `.env` (atau `.env.local`) di *root* direktori proyek:
```env
# Database URL mengarah ke Container Docker PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mbg"

# Rahasia & URL Autentikasi BetterAuth (Server & Client)
BETTER_AUTH_SECRET="super_secret_key_mbg_lebak_local_dev_2026"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Port aplikasi
PORT=3000
```

### 4. Menjalankan Database PostgreSQL (Docker)
Jalankan kontainer *database* di latar belakang:
```bash
docker-compose up -d db
```

### 5. Restore Backup Terbaru ke Database Docker
Tersedia file backup database terbaru (dengan dummy user & menu) `mbg_backup_20260914_094230.sql`. Pulihkan struktur & data ke database Docker:
```bash
docker exec -i mbg-db-1 psql -U postgres -d mbg < mbg_backup_20260914_094230.sql
```
*(Atau Anda bisa menggunakan `npm run db:push` untuk migrasi skema dari nol).*

### 6. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Aplikasi dapat diakses di: **[http://localhost:3000](http://localhost:3000)**

---

## 🏭 Bagian 2: Deployment Server Production (VPS / Full Docker)

Untuk lingkungan *Production* (seperti server VPS/Cloud Pemerintah Daerah), disarankan menggunakan skema *Full Containerization*. 

### 1. Menyiapkan Variabel Environment Production
Buat file `.env.production` (atau sesuaikan variabel di dalam server OS):
```env
DATABASE_URL="postgres://postgres:postgres@db:5432/mbg"
BETTER_AUTH_SECRET="ganti_dengan_secret_key_yang_sangat_rahasia"
BETTER_AUTH_URL="https://mbg.lebak.go.id" # Ganti dengan domain asli
NEXT_PUBLIC_APP_URL="https://mbg.lebak.go.id"
REDIS_URL="redis://redis:6379"
```

### 2. Menjalankan Seluruh Sistem (Build & Up)
Gunakan konfigurasi produksi (`docker-compose.prod.yml`). Perintah ini akan mem-*build* aplikasi Next.js ke mode produksi (*standalone*) dan menjalankan semuanya di latar belakang secara terisolasi:
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Merestart atau Menghentikan Sistem
- Merestart: `docker-compose -f docker-compose.prod.yml restart`
- Menghentikan: `docker-compose -f docker-compose.prod.yml down`

---

## ☁️ Bagian 3: Deploy ke Vercel Menggunakan Supabase (Alternatif Cloud)

Jika Anda lebih memilih hosting Serverless Vercel & Supabase Cloud PostgreSQL, gunakan panduan berikut:

### 1. Setup Database di Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com), klik **New Project**, pilih Region terdekat.
2. Dapatkan Connection String URI di menu **Project Settings ➔ Database** (Pilih Transaction Pooler Port `6543`).
3. Restore Backup Data (`mbg_backup_20260914_094230.sql`) via menu **SQL Editor** di Supabase dengan cara *copy-paste* lalu klik **Run**, atau via Terminal `psql`.

### 2. Deploy ke Vercel
1. Masuk ke [Vercel Dashboard](https://vercel.com) dan buat **Add New... Project** dari repositori GitHub.
2. Tambahkan **Environment Variables** berikut di Vercel:
   - `DATABASE_URL` (Server): `postgresql://postgres.[REF]:[PASS]@...supabase.com:6543/postgres?sslmode=require`
   - `BETTER_AUTH_SECRET` (Server): `String_Random_Unik_Kuat`
   - `BETTER_AUTH_URL` (Server): `https://domain-vercel-anda.vercel.app`
   - `NEXT_PUBLIC_APP_URL` (Public Client): `https://domain-vercel-anda.vercel.app` (Wajib agar Auth di Client berjalan lancar).
3. Klik **Deploy**.

---

## 🔐 Informasi Akun Dummy (Testing)
Data berikut disertakan di dalam backup `mbg_backup_20260914_094230.sql` (Password untuk semua akun: **`password123`**):

**1. Admin Dinas:** `admin@lebak.go.id`
**2. Operator Sekolah:**
- PAUD Alhidayah: `sekolah1@mbg.lebak.go.id`
- SDN 1 MCB: `sekolah2@mbg.lebak.go.id`
- SDN 2 MCB: `sekolah3@mbg.lebak.go.id`
- SMPN 1 Rangkasbitung: `sekolah4@mbg.lebak.go.id`
**3. Operator Posyandu:**
- Posyandu Tulip 4 & 5: `posyandu1@mbg.lebak.go.id`
