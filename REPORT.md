# Laporan Final Project DevOps: ApoSmart

## 0. Judul Project
**ApoSmart: Sistem Manajemen Inventaris Apotek Cerdas**

## 1. Deskripsi Sistem
ApoSmart adalah sistem aplikasi web berbasis React dan Supabase yang dirancang untuk membantu apotek mengelola inventaris obat, kategori, dan pemasok secara efisien. Sistem ini menyediakan fungsi CRUD (Create, Read, Update, Delete) lengkap dan fitur pemantauan kedaluwarsa obat.

### Fitur Utama:
- **Manajemen Obat**: Menambah, mengedit, menghapus, dan mencari data obat.
- **Peringatan Kedaluwarsa**: Indikator visual otomatis untuk obat yang akan kedaluwarsa dalam 90 hari.
- **Manajemen Stok**: Update stok cepat dan status stok (Low Stock/Out of Stock).
- **Manajemen Kategori & Supplier**: Pengelolaan data referensi untuk obat.
- **Dashboard**: Ringkasan status inventaris.

### Teknologi Stack:
- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Shadcn UI.
- **Backend/Database**: Supabase (PostgreSQL).
- **DevOps**: Jenkins (CI/CD), GitHub, Linux Server (Ubuntu).

## 2. Database Schema (Minimal 3 Tabel)
Sistem menggunakan database PostgreSQL (via Supabase) dengan tabel-tabel berikut:

1.  **medicines**
    *   `id` (UUID, Primary Key)
    *   `name` (Text)
    *   `category` (Text)
    *   `stock` (Integer)
    *   `price` (Integer)
    *   `expiryDate` (Date)
    *   `supplier` (Text)

2.  **categories**
    *   `id` (UUID, Primary Key)
    *   `name` (Text)
    *   `description` (Text)

3.  **suppliers**
    *   `id` (UUID, Primary Key)
    *   `name` (Text)
    *   `contact` (Text)
    *   `address` (Text)

## 3. Source Code Management (GitHub)
Source code dikelola menggunakan Git dan di-push ke GitHub.
*   **Repository**: [Link Repository GitHub Anda]
*   **Branching**: Menggunakan branch `main` untuk production dan `dev` untuk pengembangan.
*   **Webhook**: Dikonfigurasi untuk memicu build Jenkins secara otomatis saat ada push ke branch `main`.

## 4. Automated Deploy (Jenkins)
Deployment otomatis dilakukan menggunakan Jenkins Pipeline.

**Langkah-langkah Pipeline:**
1.  **Checkout**: Mengambil kode terbaru dari GitHub.
2.  **Install Dependencies**: Menjalankan `npm install`.
3.  **Build**: Menjalankan `npm run build` untuk menghasilkan file statis.
4.  **Deploy**: Menyalin folder `dist` ke direktori web server (Nginx/Apache) di `/var/www/aposmart`.

**Contoh Jenkinsfile:**
```groovy
pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/username/aposmart.git'
            }
        }
        stage('Install') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'rsync -av --delete dist/ user@server_ip:/var/www/aposmart'
            }
        }
    }
}
```

## 5. Automated Testing (Jenkins)
Pengujian otomatis dijalankan sebelum deployment.
*   **Unit Testing**: Menggunakan Vitest/Jest untuk menguji komponen React.
*   **Linting**: Menggunakan ESLint untuk memeriksa kualitas kode.

**Stage Testing di Jenkins:**
```groovy
stage('Test') {
    steps {
        sh 'npm run lint'
        // sh 'npm run test' // Jika ada unit test
    }
}
```

## 6. Automated Monitoring (Jenkins)
Monitoring dilakukan dengan memeriksa status server dan aplikasi secara berkala.
*   **Health Check**: Script sederhana untuk mengecek apakah endpoint HTTP merespons dengan status 200.
*   **Notifikasi**: Mengirim email atau pesan Slack jika build gagal atau server down.

## 7. Automated Backup Database (Jenkins)
Backup database PostgreSQL dilakukan secara terjadwal (Cron job di Jenkins).
*   **Command**: `pg_dump` untuk mengambil dump database.
*   **Storage**: File backup disimpan di server backup atau cloud storage (AWS S3/Google Drive).

**Contoh Script Backup:**
```bash
pg_dump -h db.supabase.co -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

## 8. Domain Name (Niagahoster)
Domain `aposmart.com` (contoh) didaftarkan melalui Niagahoster.
*   **DNS Management**: Mengarahkan A Record ke Public IP server VPS.

## 9. SSL Certificate (Let's Encrypt)
Keamanan HTTPS diimplementasikan menggunakan Certbot (Let's Encrypt).
*   **Instalasi**: `sudo apt install certbot python3-certbot-nginx`
*   **Generate Sertifikat**: `sudo certbot --nginx -d aposmart.com`
*   **Auto-renew**: Cron job otomatis memperbarui sertifikat setiap 90 hari.

## 10. Firewall Security
Konfigurasi UFW (Uncomplicated Firewall) untuk mengamankan server.
*   **Port 22 (SSH)**: Dibuka untuk akses remote admin (bisa dibatasi IP).
*   **Port 80 (HTTP)**: Dibuka untuk redirect ke HTTPS.
*   **Port 443 (HTTPS)**: Dibuka untuk akses web aman.
*   **Port 9090 (Jenkins)**: Dibuka untuk akses dashboard Jenkins (opsional, sebaiknya via VPN/Tunnel).

**Perintah Konfigurasi:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 9090
sudo ufw enable
```

## 11. Kreativitas & Fitur Menarik
**Fitur Expiry Alert**:
Sistem secara cerdas menghitung selisih hari antara tanggal sekarang dan tanggal kedaluwarsa obat.
*   Jika < 90 hari: Menampilkan badge "Expiring in X days" berwarna kuning.
*   Jika lewat tanggal: Menampilkan badge "Expired" berwarna merah.
Fitur ini sangat krusial untuk mencegah kerugian akibat obat kedaluwarsa.

## 12. Penanganan Error & Validasi
*   **Frontend Validation**: Form menggunakan validasi input (required fields, tipe data).
*   **API Error Handling**: `try-catch` block pada setiap request Supabase untuk menangkap kegagalan jaringan atau database, menampilkan pesan error yang user-friendly menggunakan `Toast` notification.
*   **Loading States**: Menampilkan spinner saat data sedang dimuat.

## 13. Kerapihan Kode
*   **Struktur Modular**: Kode dipisah menjadi `pages`, `components`, `lib`, dan `hooks`.
*   **TypeScript**: Menggunakan tipe data statis untuk mencegah runtime error.
*   **Clean Code**: Penamaan variabel deskriptif dan fungsi yang fokus pada satu tugas.

## 14. Kesimpulan
Proyek ini mendemonstrasikan integrasi penuh antara pengembangan aplikasi modern (React/Supabase) dengan praktik DevOps (CI/CD, Security, Monitoring). Sistem ApoSmart siap digunakan untuk lingkungan produksi dengan standar keamanan dan keandalan yang baik.
