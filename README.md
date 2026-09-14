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
