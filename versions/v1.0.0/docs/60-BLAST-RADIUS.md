> Versi: v1.0.0 | Status: disetujui | Menggantikan: -

# 60-BLAST-RADIUS — titeny-design

Mengacu: Titeny-TownHall v1.0.0 (`https://github.com/Coding-Skuy/Titeny-TownHall/tree/main/platform/versions/v1.0.0`), [`townhall-roadmap.md` bagian 2](https://github.com/Coding-Skuy/ChefGenie-TownHall/blob/main/townhall-roadmap.md) (baris Titeny: point of concern "11 event; MAPE H+1 <= 8%"; batas context "12 komoditas x 8 pasar; read-only ke DB sumber") dan [`KONTEKS-LINTAS-DIVISI.md` bagian 8-9](https://github.com/Coding-Skuy/ChefGenie-TownHall/blob/main/KONTEKS-LINTAS-DIVISI.md).

## Pernyataan read-only

Repo ini tidak menulis ke DB sumber. Titeny hanya membaca dari Lumbung, TitipO, dan Pasaree (lewat event/konektor SELECT); satu-satunya basis tulis adalah DB `titeny`.

## Yang BOLEH disentuh repo ini

`tokens/`, `src/` (spesifikasi flow/screen), `sd.config.json`, README dengan link Figma; menerbitkan token ke konsumen.

## Yang DILARANG

- Memuat kode produk, kunci, atau data produksi.
- Mengubah makna warna sinyal tanpa persetujuan analis; menerbitkan token yang melanggar kontras AA.
- Mendesain app mobile khusus di v1.0.0 (mobile V1 hanya baca via web responsif).
- Mengubah flow besar tanpa PRD/FSD versi baru di TownHall.

## Kontrak

- **Dikonsumsi**: PRD/FSD TownHall (flow, layar, graf navigasi); kontrak desktop `produk/22-kontrak-desktop-windows.md`.
- **Diproduksi**: Token ke `titeny-web` dan `titeny-app-kmp`; spesifikasi screen dan flow; link Figma di README.
- Modul bersama `:shared:pantry-resep` adalah milik Pawonee dan tidak dipakai atau diubah oleh Titeny. `pedaree.stok.v1` adalah kontrak bilateral Pedaree-TitipO dan bukan bagian registry Titeny (11 event terkunci).

## Radius Dampak per Perubahan

| Perubahan | Dampak | Batas penahan |
|---|---|---|
| Warna sinyal | Keterbacaan 3 papan ikut berubah | Uji kontras AA + teks bukan warna saja |
| Tipografi/angka | Format IDR ikut berubah | Uji 360 px dan tabel alternatif grafik |
| Build token | Web dan desktop ikut berubah | Versi token dicatat per rilis konsumen |

## Rollback

Setiap rilis menyimpan token sebelumnya. Rollback berarti menerbitkan ulang token lama dan memverifikasi satu halaman tiap papan tampil benar.

## Batasan

Dokumen ini hanya mengatur radius repo `titeny-design`. Dampak repo lain ada di dokumen blast-radius repo tersebut. Insiden DB sumber diteruskan ke pemilik sumber.
