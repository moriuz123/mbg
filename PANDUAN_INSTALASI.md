# Panduan Instalasi MBG Lebak

Repositori ini berisi kode sumber untuk platform **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak**. Berikut adalah panduan lengkap untuk melakukan instalasi dan menjalankan proyek ini di perangkat lain.

## 🛠️ Prasyarat (Prerequisites)
Sebelum memulai instalasi, pastikan perangkat baru Anda sudah terinstal:
1. **Node.js** (Minimal versi 18.x atau lebih baru)
2. **Git** (Untuk melakukan *clone* repositori)
3. **Docker Desktop / Docker Engine** (Untuk menjalankan database PostgreSQL secara instan)

---

## 🚀 Langkah Instalasi

### 1. Unduh (Clone) Repositori
Buka Terminal / Command Prompt pada perangkat tujuan, lalu jalankan perintah berikut:
```bash
git clone https://github.com/moriuz123/mbg.git
cd mbg
```

### 2. Instalasi Dependensi Node.js
Pastikan Anda berada di dalam direktori `mbg`, kemudian unduh semua paket yang dibutuhkan:
```bash
npm install
```

### 3. Menjalankan Database (via Docker)
Sistem ini menggunakan PostgreSQL. Cara paling mudah untuk menjalankannya adalah melalui *Docker Compose* bawaan.
Jalankan perintah ini untuk menyalakan wadah (*container*) database:
```bash
docker compose up -d db redis
```
*(Perintah ini akan mengunduh image PostgreSQL dan Redis lalu menjalankannya di latar belakang secara otomatis).*

### 4. Konfigurasi Environment (Variabel Lingkungan)
Buat sebuah file baru bernama `.env` di folder utama (sejajar dengan `package.json`), lalu isi dengan konfigurasi berikut:
```env
# URL Koneksi Database ke Docker lokal
DATABASE_URL="postgres://postgres:postgres@localhost:5432/mbg"

# Rahasia Autentikasi (Bisa diisi teks acak untuk pengembangan lokal)
BETTER_AUTH_SECRET="secret_for_local_development_only"
```

### 5. Mengembalikan (Restore) Backup Database
Sistem membutuhkan struktur tabel dan data awal. Anda bisa melakukan *restore* dari file cadangan (*backup*) terbaru, misal: `backup_mbg_db_20260807.sql`.

Untuk memulihkan data tersebut ke dalam Docker Database, jalankan perintah ini (sesuaikan nama file `.sql` nya):
```bash
docker exec -i mbg-db-1 psql -U postgres -d mbg < backup_mbg_db_20260807.sql
```
*(Pastikan file backup `.sql` tersebut berada di direktori yang sama dengan tempat Anda menjalankan terminal, atau gunakan struktur path yang tepat).*

### 6. Menjalankan Server Aplikasi
Setelah dependensi terpasang dan database siap, Anda bisa menjalankan server pengembangan (Development Server):
```bash
npm run dev
```

### 7. Selesai 🎉
Buka peramban (browser) Anda dan akses URL berikut:
**http://localhost:3000**

Aplikasi MBG Lebak sekarang seharusnya sudah berjalan normal di perangkat baru Anda!

---

## 📝 Catatan Tambahan (Troubleshooting)
- Jika saat dijalankan muncul peringatan "*Hydration Mismatch*", silakan lakukan muat ulang paksa (*Hard Refresh*) pada browser (`Ctrl+Shift+R`).
- Jika Anda melakukan perubahan skema database di kemudian hari, jalankan `npm run db:push` untuk menerapkan perubahan skema ke database PostgreSQL.
