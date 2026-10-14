> Versi: v1.0.0 | Status: disetujui | Menggantikan: -

# 40-TECHSTACK — titeny-design

Mengacu: Titeny-TownHall v1.0.0 (`https://github.com/Coding-Skuy/Titeny-TownHall/tree/main/platform/versions/v1.0.0`). Stack pengikat divisi: [`FSD/30-kontrak.md`](https://github.com/Coding-Skuy/Titeny-TownHall/blob/main/platform/versions/v1.0.0/FSD/30-kontrak.md).

## Konteks TownHall

Stack divisi dikunci di TownHall v1.0.0: web Bun + Svelte 5 + SvelteKit 2 + TypeScript; analis-desktop KMP Windows (Kotlin, Compose Multiplatform, Navigation3); backend Rust Axum 0.8; model dan pipeline Python 3.12. Repo ini: Sistem desain Titeny: token (warna sinyal, tipografi, angka IDR), flow, screen papan web dan desktop analis, serta tautan Figma; tidak memuat kode produk.

## Stack Repo Ini

| Lapisan | Pilihan | Versi target | STATUS |
|---|---|---|---|
| Token | style-dictionary via `sd.config.json` | 4.0.0 | defined |
| Runtime build | Node | 22.9.0 | defined |
| Konsumen web | Svelte 5 + SvelteKit 2 + TypeScript | token warna sinyal + tipografi IDR | defined |
| Konsumen desktop | Compose Multiplatform (Windows) | token warna yang sama | defined |
| Desain | Figma (link terdaftar di README) | - | defined |
| Aksesibilitas | Kontras AA + tabel teks alternatif | - | defined |

## Perintah

```bash
npm install
npm run build:tokens
```

## Token Sinyal Terkunci

| Sinyal | Arti | Syarat |
|---|---|---|
| Hijau | Seimbang / aman | disertai teks status |
| Kuning | Waspada; lencana "Akurasi terbatas" | disertai teks status |
| Merah | Defisit / peringatan | disertai teks status |

Token sinyal identik di web dan desktop. Perubahan makna warna sinyal wajib disetujui analis dan dicatat sebagai versi token baru.

## Batasan

Dokumen ini hanya mengatur stack repo `titeny-design`. Perubahan versi pustaka atau stack dicatat sebagai ADR baru di `docs/decisions/` dan dilaporkan ke TownHall. Titeny read-only terhadap DB sumber; satu-satunya basis tulis adalah DB `titeny`.
