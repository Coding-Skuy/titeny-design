# titeny-design

Sistem desain dasbor divisi **Titeny (AI Insight)**, org **Coding-Skuy**.

Ekosistem: [Titeny-TownHall](https://github.com/Coding-Skuy/Titeny-TownHall).

## Prasyarat (versi dipin)

- Node 22.9.0
- style-dictionary 4.0.0
- Svelte 5.2.0 (acuan komponen di `titeny-web`)

## Cara pakai

```sh
npm install
npm run build:tokens
```

Token sumber ada di `tokens/`. Hasil bangun menjadi CSS variable untuk dasbor `titeny-web` dan layar analis di `titeny-app-kmp`.

## Struktur

```text
tokens/colors.json       # palet utama
tokens/typography.json   # skala huruf
src/dashboard.md         # spesifikasi halaman dasbor
```

Prinsip: kontras tinggi untuk angka harga, satu warna aksen untuk peringatan panen, dan tata letak kartu yang sama antara web dan desktop.
