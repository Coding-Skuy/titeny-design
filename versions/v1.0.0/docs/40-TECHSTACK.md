> Versi: v1.0.0 | Status: disetujui | Menggantikan: -

# 40-TECHSTACK — titeny-design

Mengacu: Titeny-TownHall v1.0.0 (https://github.com/Coding-Skuy/Titeny-TownHall/tree/main/versions/v1.0.0).

## Konteks TownHall

Stack divisi dikunci di TownHall v1.0.0: web Bun latest + Svelte 5 + SvelteKit Kit 2 + TypeScript latest; analis-desktop KMP Windows; backend Rust axum 0.8.4; model dan pipeline Python 3.12. Repo ini adalah token desain bersama untuk web dan analis-desktop.

## Stack Repo Ini

| Lapisan | Pilihan | Versi target | STATUS |
|---|---|---|---|
| Token | style-dictionary | 4.0.0 via `sd.config.json` | defined |
| Konsumen web | Svelte 5 + SvelteKit Kit 2 + TS latest | token warna sinyal + tipografi IDR | defined |
| Konsumen desktop | KMP Windows Compose | token warna yang sama | defined |
| Aksesibilitas | Kontras AA, grafik selalu punya tabel teks | — | defined |

Token sinyal identik di kedua platform: hijau seimbang, kuning waspada/akuras terbatas, merah defisit. Papan 360 px tanpa scroll horizontal. Angka IDR bertitik (42.500).

## Perintah

```bash
npm run build:tokens
```

## Batasan

Batasan dokumen ini: hanya token dan panduan pakai. Repo ini tidak menulis ke DB sumber dan tidak menyimpan data apa pun. Perubahan token sinyal wajib disetujui analis karena memengaruhi keterbacaan keputusan.
