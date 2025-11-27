# 🚀 Langkah Selanjutnya: Setup Jenkins & Deployment

Dokumen ini adalah panduan lanjutan khusus untuk mengatur **Jenkins** agar bisa melakukan deployment otomatis ke server Anda (`103.191.92.246`).

---

## 1. Persiapan di Server (VPS)

Login ke server Anda via terminal/PuTTY:
```bash
ssh root@103.191.92.246
```

### A. Install Nginx (Web Server)
Jika belum terinstall, jalankan:
```bash
sudo apt update
sudo apt install nginx -y
```
Pastikan Nginx berjalan:
```bash
systemctl status nginx
```

### B. Siapkan Folder Tujuan
Buat folder untuk menyimpan file website ApoSmart:
```bash
mkdir -p /var/www/aposmart
# Berikan izin akses (opsional, sesuaikan dengan user)
chmod -R 755 /var/www/aposmart
```

### C. Konfigurasi Nginx
Buat file konfigurasi server block:
```bash
nano /etc/nginx/sites-available/aposmart
```
Isi dengan konfigurasi berikut:
```nginx
server {
    listen 80;
    server_name 103.191.92.246; # Atau nama domain Anda jika sudah ada

    root /var/www/aposmart;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
Simpan (Ctrl+X, Y, Enter). Lalu aktifkan:
```bash
ln -s /etc/nginx/sites-available/aposmart /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default # Hapus default config jika perlu
nginx -t # Cek error
systemctl restart nginx
```

---

## 2. Persiapan SSH Keys (Agar Jenkins Bisa Masuk ke Server)

Agar Jenkins bisa mengirim file ke server tanpa password setiap saat, kita gunakan **SSH Key**.

### A. Generate SSH Key (Di Server Jenkins)
Jika Jenkins diinstall di server yang sama, Anda bisa skip generate dan langsung pakai key user jenkins. Tapi asumsi standar, kita buat key baru.
Di terminal server:
```bash
# 1. Generate key baru (jangan pakai passphrase agar otomatis)
ssh-keygen -t rsa -b 4096 -f ~/.ssh/jenkins_key -N ""

# 2. Lihat Private Key (Ini yang akan dimasukkan ke Jenkins)
cat ~/.ssh/jenkins_key
# COPY SEMUA ISI DARI -----BEGIN OPENSSH PRIVATE KEY----- SAMPAI AKHIR

# 3. Masukkan Public Key ke Authorized Keys (Agar key tadi valid untuk login)
cat ~/.ssh/jenkins_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

---

## 3. Konfigurasi di Dashboard Jenkins

Buka Jenkins di browser: `http://103.191.92.246:9090/`

### A. Install Plugin yang Dibutuhkan
1.  Masuk ke **Manage Jenkins** -> **Plugins** -> **Available Plugins**.
2.  Cari dan Install:
    *   **NodeJS Plugin** (untuk build npm)
    *   **SSH Agent Plugin** (untuk deploy via SSH)
    *   **GitHub Integration** (jika belum ada)

### B. Konfigurasi NodeJS
1.  Masuk ke **Manage Jenkins** -> **Tools**.
2.  Scroll ke **NodeJS**.
3.  Klik **Add NodeJS**.
4.  Name: `NodeJS` (Harus sama persis dengan yang di `Jenkinsfile`).
5.  Version: Pilih versi terbaru LTS (misal NodeJS 20.x).
6.  Klik **Save**.

### C. Masukkan Credential SSH Key
1.  Masuk ke **Manage Jenkins** -> **Credentials**.
2.  Klik **System** -> **Global credentials (unrestricted)**.
3.  Klik **+ Add Credentials**.
4.  Isi form:
    *   **Kind**: SSH Username with private key
    *   **ID**: `vps-ssh-key` (Harus sama dengan `SSH_CREDENTIAL_ID` di `Jenkinsfile`)
    *   **Username**: `root` (atau user server Anda)
    *   **Private Key**: Pilih **Enter directly**, lalu **Add**. Paste Private Key yang tadi Anda copy (dari langkah 2.A.2).
    *   **Passphrase**: Kosongkan.
5.  Klik **Create**.

---

## 4. Buat Pipeline Job

1.  Di Dashboard Jenkins, klik **New Item**.
2.  Masukkan nama: `ApoSmart-Deploy`.
3.  Pilih **Pipeline**, klik **OK**.
4.  Scroll ke bagian **Pipeline**.
5.  **Definition**: Pilih `Pipeline script from SCM`.
6.  **SCM**: Pilih `Git`.
7.  **Repository URL**: Masukkan URL GitHub Anda (misal `https://github.com/USERNAME/aposmart.git`).
8.  **Branch Specifier**: `*/main`.
9.  **Script Path**: `Jenkinsfile` (biarkan default).
10. Klik **Save**.

---

## 5. Jalankan & Test

1.  Klik **Build Now** di menu kiri.
2.  Lihat progress di **Build History** (klik nomor build #1).
3.  Klik **Console Output** untuk melihat log.
4.  Jika sukses, buka browser dan akses IP Server Anda (`http://103.191.92.246`). Website ApoSmart harusnya muncul!

---

## 6. Setup Database & Environment (PENTING)

Di `Jenkinsfile` saat ini, proses build mungkin gagal jika tidak ada `.env` untuk Supabase.
Cara mengatasinya:
1.  Di server, buat file `.env` manual di folder workspace Jenkins (ribet).
2.  **ATAU (Disarankan)**: Edit `Jenkinsfile` di GitHub Anda, uncomment bagian pembuatan file `.env` di stage 'Build Application' dan isi dengan URL & Key Supabase Anda yang asli.

```groovy
sh 'echo "VITE_SUPABASE_URL=https://blabla.supabase.co" > .env'
sh 'echo "VITE_SUPABASE_ANON_KEY=eyJh..." > .env'
```
*(Jangan lupa commit & push perubahan Jenkinsfile ini ke GitHub)*
