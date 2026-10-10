# SyahrulProject — Website Jurusan TKJ

Website statis responsif berbahasa Indonesia tentang jurusan Teknik Komputer dan Jaringan (TKJ) di SMK Binong Permai. Dibuat dengan HTML, CSS, dan JavaScript tanpa framework atau proses build.

## File
- `index.html` — struktur dan konten website
- `style.css` — tampilan biru modern profesional dan layout responsif
- `script.js` — menu mobile, tombol kembali ke atas, dan tahun otomatis
- `assets/favicon.svg` — ikon tab browser

## Cara menerbitkan melalui GitHub Pages
1. Masuk ke [GitHub](https://github.com/) dan buat repository baru, misalnya `syahrulproject-tkj`.
2. Pilih **Public** (atau gunakan opsi sesuai akun dan kebutuhan), lalu buat repository.
3. Unggah semua isi folder ini ke **root** repository. Pastikan `index.html` berada langsung di root, bukan di dalam folder tambahan.
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/(root)`, lalu klik **Save**.
7. Tunggu beberapa menit. Alamat situs biasanya berbentuk `https://USERNAME.github.io/syahrulproject-tkj/`. Ganti `USERNAME` dengan username GitHub kamu.
8. Jika belum muncul, muat ulang halaman Settings → Pages dan periksa tab **Actions** untuk status deployment.

## Mengubah konten
- Ubah judul atau teks di `index.html`.
- Ubah warna, jarak, atau tampilan di `style.css`.
- Ubah interaksi di `script.js`.
- Setelah mengubah file, commit perubahan ke branch `main`; GitHub Pages akan memperbarui situs.

## Catatan
- Situs ini tidak membutuhkan API key, backend, atau database.
- Google Fonts membutuhkan koneksi internet; jika tidak tersedia, font sistem akan digunakan.
- Kontak yang ditampilkan di halaman dapat dilihat publik. Pastikan kamu nyaman membagikannya.
- Materi TKJ ditulis sebagai contoh umum; kurikulum dan praktik aktual dapat berbeda antar sekolah.
