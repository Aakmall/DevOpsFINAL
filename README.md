# ApoSmart

Aplikasi pengelolaan inventaris apotek berbasis React, TypeScript, Vite, Tailwind CSS, shadcn/ui, dan Supabase.

## Fitur

- **Akun:** registrasi nama, email, dan kata sandi; login; verifikasi email sesuai konfigurasi Supabase; pemulihan sesi; logout.
- **Halaman terlindungi:** pengguna harus masuk sebelum membuka dashboard dan inventaris.
- **Inventaris:** tambah, edit, hapus, cari obat, serta tambah stok.
- **Kategori dan pemasok:** pengelolaan data serta jumlah jenis obat yang terkait.
- **Dashboard:** jumlah jenis obat, kategori, pemasok, distribusi stok, stok menipis, dan obat mendekati kedaluwarsa.
- **Laporan:** unit stok dan nilai persediaan berdasarkan `stok × harga satuan`, beserta ekspor CSV.
- **Notifikasi:** pengingat otomatis ketika stok di bawah 10 unit, obat kedaluwarsa, atau memasuki 90 hari sebelum kedaluwarsa. Status dibaca dan pengingat yang ditutup disimpan per akun pada browser tersebut.

Pada mode normal, dashboard, laporan, dan notifikasi menggunakan data inventaris Supabase tanpa data contoh atau angka penjualan buatan. Saat database kosong, aplikasi menampilkan angka nol dan panduan menambahkan data. Kesalahan koneksi ditampilkan sebagai kesalahan, bukan dianggap inventaris kosong.

## Menjalankan secara lokal

Gunakan Node.js 22.18+ dan npm.

```sh
npm ci
```

Salin `.env.example` menjadi `.env.local`, lalu isi konfigurasi proyek Supabase Anda:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
```

Variabel `VITE_*` masuk ke bundle frontend. Gunakan kunci publik Supabase; jangan gunakan kunci `service_role` atau secret key. `.env.local` mengesampingkan `.env` yang sudah ada. Restart server setelah mengubah konfigurasi.

```sh
npm run dev
```

Buka **http://localhost:8080**. Pengunjung yang belum masuk diarahkan ke `/login`; pendaftaran tersedia di `/register`.

### Pratinjau lokal tanpa login

Untuk melihat tampilan ketika Supabase belum tersedia, tambahkan ini ke `.env.local`:

```dotenv
VITE_LOCAL_PREVIEW=true
```

Jalankan `npm run dev`, lalu buka dashboard langsung. Halaman login/register tetap dapat dilihat. Sesuai kebutuhan pratinjau, mode ini berisi **10 obat contoh** dalam **4 kategori**: Nyeri & Demam (3 obat), Alergi (2 obat), Kesehatan Lambung (3 obat), serta Vitamin & Suplemen (2 obat). Daftar pemasok dan kolom pemasok setiap obat dibiarkan kosong. Harga, stok, dan tanggal kedaluwarsa adalah data contoh untuk tampilan.

Data pratinjau berada di `src/lib/preview-data.ts` dan dipakai bersama oleh halaman obat, kategori, dashboard, laporan, serta notifikasi. Mode ini tidak menghubungi database dan menonaktifkan penyimpanan serta pengiriman formulir akun. Data contoh tidak dimasukkan ke Supabase dan tidak digunakan pada mode normal.

Pada server lokal dengan pengaturan ini, tombol **Masuk** di halaman login langsung membuka dashboard tanpa perlu mengisi email atau kata sandi. Tidak ada sesi Supabase atau akun baru yang dibuat. Pada mode normal, login tetap memerlukan kredensial yang diverifikasi Supabase.

Untuk mengaktifkan autentikasi kembali, ubah `VITE_LOCAL_PREVIEW=false`, isi konfigurasi Supabase yang aktif, lalu restart server. Mode pratinjau hanya berlaku pada server pengembangan (`import.meta.env.DEV`); hasil `npm run build` tetap memerlukan login.

## Konfigurasi Supabase

1. Aktifkan penyedia **Email** dan pendaftaran pada Supabase Authentication.
2. Atur **Site URL** ke alamat aplikasi. Tambahkan `http://localhost:8080/login` dan, jika dipakai, `http://127.0.0.1:8080/login` pada daftar Redirect URLs. Tambahkan juga URL `/login` untuk domain produksi.
3. Jika konfirmasi email aktif, pengguna perlu membuka tautan email sebelum masuk. Jika konfirmasi dimatikan, sesi yang dikembalikan Supabase langsung membuka dashboard. Pengiriman email dan pembatasannya mengikuti konfigurasi Supabase.
4. Pastikan tabel di bawah tersedia. Untuk **proyek baru**, jalankan [supabase/schema.sql](supabase/schema.sql) melalui SQL Editor. Skrip membuat tabel kosong tanpa data contoh.
5. Gunakan Row Level Security (RLS) untuk membatasi API ke pengguna terautentikasi. Pelindung rute React hanya mengatur navigasi; kebijakan database tetap diperlukan. Skrip proyek baru menyediakan kebijakan inventaris bersama untuk satu apotek: semua akun terautentikasi dapat mengelola inventaris tersebut. Aplikasi belum memisahkan organisasi atau peran admin/staf. Batasi pendaftaran ke tim apotek jika memakai model inventaris bersama ini.

Untuk **database yang sudah ada**, cocokkan skema dan audit seluruh kebijakan RLS terlebih dahulu. Skrip proyek baru tidak mengganti kebijakan lama, menghapus baris database, atau menentukan mana data uji dan mana data operasional.

| Tabel | Kolom yang digunakan aplikasi |
| --- | --- |
| `medicines` | `id`, `name`, `category` (nama kategori), `supplier` (nama pemasok), `stock`, `price`, `expirydate` |
| `categories` | `id`, `name`, `color` |
| `suppliers` | `id`, `name`, `contact`, `email`, `address` |

Nama pengguna disimpan sebagai metadata `full_name` pada Supabase Auth. Aplikasi tidak menyimpan kata sandi sendiri. Notifikasi dihitung dari inventaris sehingga tidak memerlukan tabel notifikasi.

Referensi: [Password-based Auth](https://supabase.com/docs/guides/auth/passwords), [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Perintah pengembangan

```sh
npm run dev                              # Server pengembangan pada port 8080
npm run build                            # Build produksi ke dist/
npm run preview                          # Pratinjau build pada port 4173
npx tsc --noEmit -p tsconfig.app.json     # Pemeriksaan TypeScript
npm test                                 # Semua pengujian lokal (unit dan autentikasi)
npm run test:auth                        # Uji formulir, rute autentikasi, dan mode pratinjau
npm run lint                             # Pemeriksaan ESLint seluruh proyek
```

Untuk hosting SPA, arahkan URL aplikasi yang tidak cocok dengan file statis ke `index.html`, agar membuka atau me-refresh `/login`, `/register`, dan halaman inventaris langsung tetap berfungsi. Konfigurasi `VITE_*` harus tersedia saat build, termasuk pada Jenkins.

## Struktur proyek

```text
src/
  components/auth/       Tata letak autentikasi, input kata sandi, pelindung rute
  components/layout/     Navigasi dan akun pengguna
  components/medicines/  Formulir dan tabel inventaris
  contexts/              Sesi Supabase Auth
  hooks/                 Akses sesi dan pengambilan ringkasan inventaris
  lib/                   Klien Supabase, penanganan error, perhitungan inventaris
  pages/                 Login, Register, Dashboard, Medicines, dan halaman lainnya
supabase/schema.sql      Skema kosong dan RLS untuk proyek baru
tests/                   Pengujian logika inventaris dan pesan autentikasi
```

## Batas fitur saat ini

- Penjualan, pembelian, laba, dan riwayat perubahan stok belum dicatat sebagai transaksi. Laporan hanya menunjukkan kondisi inventaris saat ini.
- Unggah gambar obat dan ekspor PDF/Excel belum tersedia; ekspor inventaris menggunakan CSV.
- Belum ada fitur lupa kata sandi, undangan staf, atau pembatasan akses berdasarkan peran.
- Pembersihan data dummy dilakukan pada kode aplikasi. Data pada database yang sudah ada tidak dihapus otomatis karena tidak memiliki penanda data dummy.
