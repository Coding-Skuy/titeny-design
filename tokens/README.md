# Token desain Titeny v1.0.0

Sumber kebenaran token untuk `titeny-web` (CSS variable) dan `titeny-app-kmp` (Compose). Rujukan requirement: `produk/10-papan-insight.md` §2-§4 di Titeny-TownHall.

| Berkas | Isi |
|---|---|
| `colors.json` | Palet (format DTCG `$value`). Nama = nama variabel web sementara `--ttn-*` |
| `typography.json` | Keluarga huruf, ukuran, bobot, tinggi baris, radius, ruang |
| `sinyal.spec.json` | Pemetaan status -> warna + **teks** + **bentuk** (bukan warna saja) |
| `kontras.json` | Pasangan teks/latar yang diverifikasi skrip kontras |

Bangun: `npm run build:tokens` menghasilkan `dist/titeny.css` (`:root { --ttn-* }`) dan `dist/compose/TitenyWarna.kt` (`object TitenyWarna`, properti `ttnHijauLatar`, dst.). Uji: `npm test` (kontras WCAG AA, kelengkapan sinyal, format IDR, keluaran build); laporan rinci: `npm run test:kontras`.

## Sinyal (teks + bentuk wajib)

| Status | Teks | Bentuk | Teks/ikon | Latar | Sumber |
|---|---|---|---|---|---|
| seimbang | Seimbang | ● | `hijau` | `hijau-latar` | §2 hijau seimbang |
| waspada | Waspada | ▲ | `kuning` | `kuning-latar` | §2 kuning waspada |
| defisit | Defisit | ■ | `merah` | `merah-latar` | §2 merah defisit |
| akurasi-terbatas | Akurasi terbatas | ▲ | `kuning` | `kuning-latar` | §4 lencana kuning |
| estimasi | Estimasi — transaksi kemarin belum masuk | ◆ | `netral` | `netral-latar` | §4 |
| data-kurang | Data harga belum cukup | ○ | `netral` | `netral-latar` | §4 |
| luring | Luring | ℹ | `info` | `info-latar` | kontrak desktop §2 |

Lencana keputusan petani (`JUAL SEKARANG` merah ■, `TAHAN 3 HARI` hijau ●, `CICIL JUAL` kuning ▲) dan status rekomendasi (`Baru` info, `Dikerjakan` kuning, `Selesai` hijau) ada di `sinyal.spec.json`. Aturan: warna tidak pernah satu-satunya pembawa makna; setiap lencana menampilkan teks dan bentuk. Peta matriks CEO 5x12 menampilkan teks singkat di setiap sel (`+`/`~`/`−` bersama bentuk) selain warna.

## Kontras

Skrip `scripts/kontras.mjs` menghitung rasio WCAG 2.2 (rumus luminans relatif) untuk 35 pasangan di `kontras.json`: teks 4,5:1; fokus, batas kontrol, dan grafik 3:1. Hasil terakhir: 35/35 lolos (terendah `garis-kuat`/`kartu` 4,53; `teks` pada semua latar 11,72-15,03). `garis` (#d5d9d0) sengaja dekoratif dan tidak boleh menjadi satu-satunya batas kontrol.

## Tipografi

Inter -> system-ui -> Segoe UI (desktop Windows) -> Roboto. Badan 15 px (minimum 360 px), keterangan 13 px (bukan untuk status), judul 24 px, angka besar 32 px, sel tabel padat 14 px. Kolom angka memakai `font-variant-numeric: tabular-nums` dan rata kanan. Compose: px -> sp.

## Format angka IDR

Sumber: `produk/10-papan-insight.md` §3 dan `KONTEKS-LINTAS-DIVISI.md` bagian 6 (uang integer IDR).

- Pemisah ribuan titik, tanpa pecahan: `42.500`, `1.250.000`. Desimal non-uang (persen, MAPE) pakai koma: `8,5%`.
- Awalan `Rp ` (dengan spasi) hanya pada angka tunggal yang berdiri sendiri (KPI besar); sel tabel dengan judul kolom "(Rp)" tanpa awalan.
- Negatif memakai tanda minus `-1.500` (U+002D), bukan kurung.
- Satuan menempel dengan spasi: `120 kg`, `+8%`.
- Waktu: ISO-8601 Asia/Jakarta di data; tampilan `3 Okt 2026 23.00` (jam dipisah titik, sesuai banner luring kontrak desktop).
- Implementasi acuan dan uji: `scripts/idr.mjs` (hanya untuk menguji spesifikasi; klien menulis sendiri).

## Versi

Perubahan makna warna sinyal atau pengubahan nama/hapus token = mayor (catat di `CHANGELOG.md` dan ADR). Menambah token = minor. v0.2.0: penggantian palet sementara awal (`titeny.hijau-panen`, dst.) dengan nama `--ttn-*` yang selaras web; tidak ditemukan pemakaian nama lama di clone titeny-web maupun titeny-app-kmp saat PR ini dibuat.
