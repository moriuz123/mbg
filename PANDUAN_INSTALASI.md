# 🚀 Panduan Instalasi & Migrasi Perangkat / Production MBG Lebak

Repositori ini berisi kode sumber untuk platform **Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak** (Next.js 15, Drizzle ORM, BetterAuth, PostgreSQL, Redis, TailwindCSS).

Dokumen ini menyediakan panduan lengkap untuk:
1. 🖥️ **Pindah Perangkat Pengembang (Dev Environment)**:
   - **Metode A**: Menggunakan Docker (Rekomendasi Utama)
   - **Metode B**: Tanpa Docker (Local Node.js + Local PostgreSQL/Supabase)
2. ☁️ **Pendeployan ke Vercel Menggunakan Database Supabase (Production)**

---

## 🖥️ Bagian 1: Pindah Perangkat Pengembang (Development Setup)

### 📋 Prasyarat Umum
Sebelum memulai di perangkat baru, pastikan terpasang:
- **Git**: [git-scm.com](https://git-scm.com/)
- **Node.js**: v20.x atau lebih baru (Termasuk `npm` v10+)
- **Docker Desktop / Docker Engine** *(Opsional, wajib jika memilih Metode A)*

---

### 🐳 METODE A: Menggunakan Docker (Paling Praktis)

Metode ini akan menjalankan **Next.js App**, **PostgreSQL**, dan **Redis** secara terisolasi menggunakan Docker Compose.

#### 1. Clone Repositori
```bash
git clone https://github.com/moriuz123/mbg.git
cd mbg
```

#### 2. Buat File Environment (`.env`)
Buat file `.env` di direktori utama proyek (`/mbg/.env`):
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

#### 3. Jalankan Container Docker Compose
```bash
docker compose up -d
```
*(Perintah ini akan menyalakan wadah container `mbg-db-1`, `mbg-redis-1`, dan `mbg-frontend-1`).*

#### 4. Restore Data Backup Terbaru ke Database Docker
Tersedia file backup database terbaru `backup_mbg_db_20260808.sql`. Pulihkan struktur & data awal ke container database Docker:
```bash
docker exec -i mbg-db-1 psql -U postgres -d mbg < backup_mbg_db_20260808.sql
```

#### 5. Akses Aplikasi
Aplikasi langsung berjalan di browser pada alamat:
👉 **`http://localhost:3000`**

---

### 💻 METODE B: Tanpa Docker (Non-Docker / Native Node.js)

Metode ini cocok jika Anda memilih menjalankan Node.js secara langsung via terminal dan menghubungkannya ke PostgreSQL lokal (atau database cloud Supabase dev).

#### 1. Clone Repositori & Install Dependensi
```bash
git clone https://github.com/moriuz123/mbg.git
cd mbg
npm install
```

#### 2. Menyiapkan Database PostgreSQL Lokal / Cloud
Pastikan PostgreSQL service di komputer Anda sudah berjalan dan buat database bernama `mbg`:
```sql
CREATE DATABASE mbg;
```

#### 3. Restorasi File Backup Database
Jalankan perintah `psql` untuk mengimpor file `backup_mbg_db_20260808.sql` ke database lokal:
```bash
psql -U postgres -d mbg -f backup_mbg_db_20260808.sql
```
*(Atau jika menggunakan Windows Command Prompt / PowerShell, jalankan `cmd /c "psql -U postgres -d mbg < backup_mbg_db_20260808.sql"`).*

#### 4. Buat File `.env`
Buat file `.env` di folder root proyek:
```env
# Ganti user, password, host, port, dan dbname sesuai instalasi lokal PostgreSQL Anda
DATABASE_URL="postgresql://postgres:password_anda@localhost:5432/mbg"

BETTER_AUTH_SECRET="super_secret_key_mbg_lebak_local_dev_2026"
BETTER_AUTH_URL="http://localhost:3000"
```

#### 5. Jalankan Server Dev Node.js
```bash
npm run dev
```
Buka browser dan buka **`http://localhost:3000`**.

---

## ☁️ Bagian 2: Deploy ke Vercel Menggunakan Database Supabase (Production)

Arsitektur produksi MBG Lebak disarankan menggunakan **Vercel** untuk hosting Next.js Serverless & **Supabase PostgreSQL** sebagai basis data cloud.

### 🌐 LANGKAH 1: Setup Database di Supabase

1. **Buat Project Baru di Supabase**:
   - Masuk ke [Supabase Dashboard](https://supabase.com).
   - Klik **New Project**, pilih Region terdekat (misal `Singapore` / `Jakarta`), dan masukkan password database yang kuat.

2. **Dapatkan Connection String (DATABASE_URL)**:
   - Masuk ke menu **Project Settings** ➔ **Database**.
   - Di bagian **Connection String**, pilih mode **URI** (Transaction Pooler Port `6543` atau Direct Connection Port `5432`).
   - Format Connection String:
     ```text
     postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
     ```

3. **Restore Backup Data (`backup_mbg_db_20260808.sql`) ke Supabase**:
   - **Opsi A (Via Terminal CLI)**:
     ```bash
     psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require" -f backup_mbg_db_20260808.sql
     ```
   - **Opsi B (Via Supabase SQL Editor)**:
     Buka menu **SQL Editor** di Supabase Dashboard, lalu *copy-paste* isi file `backup_mbg_db_20260808.sql` dan klik **Run**.

---

### ⚡ LANGKAH 2: Deploy ke Vercel

1. **Import Repositori GitHub ke Vercel**:
   - Masuk ke [Vercel Dashboard](https://vercel.com).
   - Klik **Add New...** ➔ **Project**.
   - Pilih repositori `moriuz123/mbg` dari akun GitHub Anda.

2. **Konfigurasi Project & Environment Variables**:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Pada bagian **Environment Variables**, tambahkan variabel berikut:

   | Variable Key | Scope / Tipe | Nilai / Value | Keterangan |
   | :--- | :--- | :--- | :--- |
   | `DATABASE_URL` | **Server Only** | `postgresql://postgres.[REF]:[PASS]@...supabase.com:6543/postgres?sslmode=require` | Connection String Supabase PostgreSQL |
   | `BETTER_AUTH_SECRET` | **Server Only** | `String_Random_Unik_Min_32_Karakter` | Kunci enkripsi autentikasi BetterAuth |
   | `BETTER_AUTH_URL` | **Server Only** | `https://mbg-lebak.vercel.app` (atau domain produksi Anda) | URL domain backend server BetterAuth |
   | `NEXT_PUBLIC_APP_URL` | **Client & Server (Public)** | `https://mbg-lebak.vercel.app` (atau domain produksi Anda) | **Wajib di Vercel!** URL domain publik yang dibaca oleh komponen React Client (`authClient`) |

   > 💡 **PENTING mengenai Prefiks `NEXT_PUBLIC_` di Next.js / Vercel:**
   > - Variabel dengan prefiks `NEXT_PUBLIC_` (seperti `NEXT_PUBLIC_APP_URL`) **dapat diakses oleh browser/React Client Component**. Variabel ini wajib diisi agar fungsi Login/Register/Auth di frontend dapat menemukan URL domain Vercel Anda secara akurat.
   > - Variabel tanpa `NEXT_PUBLIC_` (seperti `DATABASE_URL` dan `BETTER_AUTH_SECRET`) **tersimpan aman di Serverless Function Vercel** dan tidak akan pernah bocor ke browser pengguna.

3. **Deploy Project**:
   - Klik tombol **Deploy**.
   - Vercel akan otomatis melakukan proses *Build* Next.js App dan menampilkannya secara langsung secara global.

---

## 🛠️ Perintah Utama & Perawatan (Maintenance)

- **Menyinkronkan Skema Database Baru**:
  Jika Anda mengubah file `src/db/schema.ts` di masa mendatang, jalankan:
  ```bash
  npx drizzle-kit push
  ```
- **Membuat Backup Database Baru**:
  ```bash
  docker exec -t mbg-db-1 pg_dump -U postgres -d mbg > backup_mbg_db_YYYYMMDD.sql
  ```
- **Mengecek Log Container Docker**:
  ```bash
  docker logs --tail 50 mbg-frontend-1
  ```

---

*Hak Cipta © 2026 Sistem Informasi Makan Bergizi Gratis (MBG) Kabupaten Lebak.*
