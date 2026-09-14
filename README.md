# Digitalisasi Supply Chain MBG Pemkab Lebak

Sistem Informasi Manajemen Rantai Pasok (Supply Chain) untuk program Makan Bergizi Gratis (MBG) Pemerintah Kabupaten Lebak. Sistem ini melacak pergerakan logistik secara komprehensif (End-to-End) mulai dari hulu (Sumber Gabah dan Penggilingan Mitra), SPPG (Satuan Pelayanan Pengguna Gizi), hingga ke hilir (Verifikasi penerimaan di Sekolah dan Posyandu).

## 🚀 Teknologi yang Digunakan
- **Framework:** [Next.js 15 (Turbopack)](https://nextjs.org/)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **Database:** PostgreSQL (via Docker)
- **ORM:** Drizzle ORM
- **Autentikasi:** Better Auth

---

## 📋 Prasyarat Instalasi
Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:
1. **Node.js** (versi 18.x atau lebih baru)
2. **Git**
3. **Docker** & **Docker Compose** (untuk menjalankan database PostgreSQL lokal)

---

## ⚙️ Panduan Instalasi (Langkah demi Langkah)

### 1. Kloning Repositori
Clone proyek ini ke mesin lokal Anda menggunakan Git:
```bash
git clone https://github.com/moriuz123/mbg.git
cd mbg
```

### 2. Instalasi Dependensi
Jalankan perintah berikut untuk menginstal semua *library* dan paket NPM yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file baru bernama `.env.local` di *root* direktori proyek, lalu isi dengan konfigurasi database dan autentikasi berikut:
```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/mbg"
BETTER_AUTH_SECRET="secret_for_local_development_only"
```
*(Catatan: Sesuaikan kredensial di atas jika Anda menggunakan konfigurasi database yang berbeda di *production*)*.

### 4. Menjalankan Database PostgreSQL (Docker)
Jika Anda menggunakan Docker, jalankan kontainer *database* di latar belakang:
```bash
docker-compose up -d
```
*(Ini akan menjalankan kontainer dengan nama `mbg-db-1` di port `5432`)*.

### 5. Migrasi Skema Database (Drizzle)
Sinkronkan skema kode (Drizzle) ke dalam database PostgreSQL yang baru saja berjalan:
```bash
npm run db:push
```

### 6. Menjalankan Server Pengembangan (Dev Server)
Jalankan aplikasi Next.js dalam mode pengembangan menggunakan Turbopack:
```bash
npm run dev
```
Aplikasi sekarang dapat diakses melalui browser di: **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Informasi Akun Dummy (Testing)
Untuk mempermudah proses *testing* fitur verifikasi dan dashboard, beberapa akun dummy (dengan *password*: **`password123`**) telah disediakan:

**1. Admin Dinas:**
- Email: `admin@lebak.go.id`

**2. Operator Sekolah (Contoh: SPPG Lebak Rangkasbitung):**
- PAUD Alhidayah: `sekolah1@mbg.lebak.go.id`
- SDN 1 MCB: `sekolah2@mbg.lebak.go.id`
- SDN 2 MCB: `sekolah3@mbg.lebak.go.id`
- SMPN 1 Rangkasbitung: `sekolah4@mbg.lebak.go.id`

**3. Operator Posyandu:**
- Posyandu Tulip 4 & 5: `posyandu1@mbg.lebak.go.id`

---

## 📂 Manajemen Database Tambahan
- **Melihat Data GUI (Drizzle Studio):** `npm run db:studio` (Berjalan di port `4983`)
- **Build untuk Produksi:** `npm run build` dan `npm run start`

---
*Dikembangkan untuk digitalisasi ketahanan pangan dan logistik wilayah Kabupaten Lebak.*

---

## 🏭 Panduan Deployment Server Production (Full Docker)

Untuk lingkungan *Production* (seperti server VPS/Cloud Pemerintah Daerah), disarankan menggunakan skema *Full Containerization*. Dengan metode ini, baik Database (PostgreSQL), Caching (Redis), maupun Aplikasi Web (Next.js) berjalan di dalam Docker agar lebih stabil, mudah diperbarui, dan kebal dari masalah *downtime* saat server *restart*.

### 1. Menyiapkan Variabel Environment
Buat file `.env.production` (atau sesuaikan variabel di dalam server):
```bash
DATABASE_URL="postgres://postgres:postgres@db:5432/mbg"
BETTER_AUTH_SECRET="ganti_dengan_secret_key_yang_sangat_rahasia"
BETTER_AUTH_URL="https://mbg.lebak.go.id" # Ganti dengan domain asli
REDIS_URL="redis://redis:6379"
```

### 2. Menjalankan Seluruh Sistem (Build & Up)
Gunakan konfigurasi produksi yang telah disiapkan (`docker-compose.prod.yml`). Perintah ini akan mem-*build* aplikasi Next.js ke mode produksi (*standalone*) dan menjalankan semuanya di latar belakang:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Migrasi Skema Database ke Server Production
Karena aplikasi Next.js berjalan di dalam *container*, Anda dapat menggunakan `npx` atau masuk ke dalam *container* web untuk mem-push skema:

```bash
docker-compose -f docker-compose.prod.yml exec web npx drizzle-kit push
```

### 4. Menghentikan atau Merestart Sistem
Jika sewaktu-waktu Anda perlu merestart seluruh layanan:
```bash
docker-compose -f docker-compose.prod.yml restart
```
Untuk menghentikan secara total:
```bash
docker-compose -f docker-compose.prod.yml down
```

### 🌟 Kenapa Setup Ini Lebih Baik?
1. **Otomatisasi Restart:** Semua *services* memiliki label `restart: always` atau `unless-stopped`. Jika server mati tiba-tiba, aplikasi otomatis menyala saat server hidup kembali.
2. **Ukuran Image Ringan:** Konfigurasi Next.js menggunakan `output: 'standalone'` sehingga *image* Docker sangat kecil dan cepat melakukan proses *boot*.
3. **Isolasi Penuh:** Tidak perlu repot *install* Node.js versi tertentu di OS server Anda, semuanya sudah dipaketkan rapi di dalam Docker.
