# titeny-design

Sistem desain dasbor divisi **Titeny (AI Insight)**, org **Coding-Skuy**.

Ekosistem: [Titeny-TownHall](https://github.com/Coding-Skuy/Titeny-TownHall).

## Prasyarat (versi dipin)

- Node 22.9.0 (diuji juga pada Node 24)
- style-dictionary 4.0.0
- Svelte 5.2.0 (acuan komponen di `titeny-web`)

## Cara pakai

```sh
npm install
npm run build:tokens   # dist/titeny.css dan dist/compose/TitenyWarna.kt
npm test               # kontras WCAG AA, sinyal, format IDR, keluaran build
```

Token sumber ada di `tokens/` (dokumentasi: [`tokens/README.md`](./tokens/README.md)). Hasil bangun menjadi CSS variable `--ttn-*` untuk `titeny-web` dan `object TitenyWarna` untuk `titeny-app-kmp`.

## Struktur

```text
tokens/colors.json        # palet + sinyal (DTCG)
tokens/typography.json    # huruf, ukuran, radius, ruang
tokens/sinyal.spec.json   # status -> warna + teks + bentuk
tokens/kontras.json       # pasangan yang diuji AA
tokens/README.md          # sinyal, kontras, format IDR, versi
scripts/                  # verifikasi kontras dan format IDR
docs/flow/                # flow + screen (papan-web-360.md)
src/prototipe/            # prototipe HTML statis (web/), dibangun dari scripts/prototipe
src/dashboard.md          # spesifikasi dasbor awal
```

Prinsip: kontras tinggi untuk angka harga, status selalu warna + teks + bentuk, dan tata letak kartu yang sama antara web dan desktop.

## Daftar tautan Figma

| Artefak | Tiket | Figma | Sumber desain-sebagai-kode |
|---|---|---|---|
| Token (warna sinyal, tipografi) | TTN-DSG-002 | **Belum dibuat** — butuh akun Figma pemilik tim; tidak dapat dibuat oleh agen | [`tokens/`](./tokens/) |
| Flow + screen 3 papan web 360 px | TTN-DSG-003 | **Belum dibuat** (sama) | [`docs/flow/papan-web-360.md`](./docs/flow/papan-web-360.md), [`src/prototipe/web/`](./src/prototipe/web/) |

Selama berkas Figma belum ada, sumber kebenaran visual adalah berkas di repo ini. Baris tautan Figma akan diisi oleh manusia yang membuat berkasnya; jangan mengisi tautan karangan.
