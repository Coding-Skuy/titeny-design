# Spesifikasi halaman dasbor Titeny

Tujuan: petani dan analis melihat harga, panen, dan stok dalam satu layar.

## Kartu 1 — Harga 7 hari

- Grafik garis dari `GET /insight/harga?komoditas=X`.
- Warna garis memakai `kuning-harga`.
- Angka memakai `angka-besar`.

## Kartu 2 — Panen

- Hitung mundur `siap_dalam_hari` dari `titeny-ai-models`.
- Latar hijau muda bila siap <= 14 hari, merah muda bila lewat.

## Kartu 3 — Stok Lumbung

- Total dari event `lumbung.stok.masuk` dikurangi `lumbung.stok.keluar`.
- Tabel ringkas 5 baris terakhir.

Implementasi acuan ada di `titeny-web/src/routes/+page.svelte`. Versi desktop mengikuti tata letak yang sama di `titeny-app-kmp`.
