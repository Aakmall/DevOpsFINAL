# 🚀 Langkah Selanjutnya untuk Menyelesaikan Final Project

Dokumen ini berisi panduan praktis langkah demi langkah yang harus Anda lakukan **SEKARANG** untuk menyelesaikan proyek ApoSmart sesuai dengan kriteria penilaian dosen.

---

## 1. Konfigurasi Database (Supabase)

Karena kode aplikasi sudah diubah untuk menggunakan Supabase, Anda harus membuat tabel-tabel yang diperlukan di database Supabase Anda.

**Langkah-langkah:**
1.  Buka [Supabase Dashboard](https://supabase.com/dashboard).
2.  Buat Project baru.
3.  Masuk ke menu **SQL Editor**.
4.  Copy dan Paste kode SQL berikut, lalu klik **Run**:

```sql
-- 1. Buat Tabel Categories
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Buat Tabel Suppliers
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Buat Tabel Medicines
CREATE TABLE medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT, -- Menyimpan nama kategori untuk simplifikasi
  stock INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  expiryDate DATE,
  supplier TEXT, -- Menyimpan nama supplier untuk simplifikasi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Masukkan Data Dummy (Opsional, agar tidak kosong)
INSERT INTO categories (name, color) VALUES 
('Pain Relief', '#3B82F6'),
('Antibiotic', '#10B981'),
('Supplement', '#F59E0B');

INSERT INTO suppliers (name, contact, email, address) VALUES 
('PT Pharma Indo', '08123456789', 'contact@pharmaindo.com', 'Jakarta'),
('PT Medika Jaya', '08198765432', 'info@medikajaya.com', 'Bandung');
```

---

## 2. Koneksi Aplikasi ke Database

Agar aplikasi di laptop/server Anda bisa terhubung ke Supabase:

1.  Di Supabase Dashboard, masuk ke **Project Settings** -> **API**.
2.  Salin **Project URL** dan **anon public key**.
3.  Di folder proyek Anda, rename file `.env.example` menjadi `.env`.
4.  Isi file `.env` dengan data yang Anda salin:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 3. Upload ke GitHub (Source Code Management)

Anda perlu meng-upload kode ini ke repository GitHub Anda.

1.  Buka terminal di folder proyek.
2.  Jalankan perintah berikut:
    ```bash
    git init
    git add .
    git commit -m "Final Project: ApoSmart Complete Features"
    git branch -M main
    git remote add origin https://github.com/USERNAME_ANDA/aposmart.git
    git push -u origin main
    ```
    *(Ganti `USERNAME_ANDA` dengan username GitHub Anda)*

---

## 4. Setup Server & Jenkins (DevOps)

Bagian ini dilakukan di **VPS / Server Ubuntu** Anda.

### A. Persiapan Server
1.  **Install Nginx & Node.js**:
    ```bash
    sudo apt update
    sudo apt install nginx nodejs npm
    ```
2.  **Install Jenkins**:
    Ikuti panduan resmi instalasi Jenkins untuk Ubuntu.
3.  **Install Certbot (SSL)**:
    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

### B. Konfigurasi Jenkins Pipeline
1.  Buka Dashboard Jenkins (`http://IP_SERVER:8080`).
2.  Buat **New Item** -> **Pipeline**.
3.  Di bagian **Pipeline Script**, gunakan script dari `REPORT.md` (Bagian 4).
4.  Pastikan Jenkins memiliki akses ke server (SSH keys) jika melakukan deployment via `rsync` atau copy file.

### C. Konfigurasi Domain & SSL
1.  Beli domain di Niagahoster.
2.  Arahkan **A Record** domain ke IP Public VPS Anda.
3.  Di server, jalankan Certbot untuk mengaktifkan HTTPS:
    ```bash
    sudo certbot --nginx -d nama-domain-anda.com
    ```

---

## 5. Dokumentasi & Laporan

Gunakan file `REPORT.md` yang sudah saya buatkan sebagai bahan dasar laporan Anda.
1.  **Ambil Screenshot**:
    *   Halaman Dashboard.
    *   Halaman Obat (tunjukkan fitur Expiry Alert).
    *   Halaman Tambah Obat.
    *   Tampilan Jenkins (Pipeline sukses).
    *   Tampilan Supabase (Tabel data).
2.  **Masukkan ke Laporan**: Tempel screenshot tersebut ke dalam dokumen laporan (Word/PDF) yang akan diserahkan ke dosen.

---

## Checklist Akhir ✅

- [ ] Website bisa dibuka di browser (Localhost/Public IP).
- [ ] Bisa Tambah, Edit, Hapus Obat (CRUD).
- [ ] Data tersimpan di Supabase (Cek di dashboard Supabase).
- [ ] Kode ada di GitHub.
- [ ] Laporan `REPORT.md` sudah dilengkapi screenshot.

**Selamat! Proyek Anda siap didemokan.**
