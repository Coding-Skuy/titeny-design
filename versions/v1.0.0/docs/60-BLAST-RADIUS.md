> Versi: v1.0.0 | Status: disetujui | Menggantikan: -

# 60-BLAST-RADIUS — titeny-design

Mengacu: Titeny-TownHall v1.0.0 (https://github.com/Coding-Skuy/Titeny-TownHall/tree/main/versions/v1.0.0).

## Pernyataan read-only

Repo ini tidak menulis ke DB sumber. Repo token tidak memiliki koneksi database sama sekali; ia hanya menerbitkan token ke `titeny-web` dan `titeny-app-kmp`. Tidak ada tulis ke DB Lumbung, TitipO, Pasaree, maupun DB `titeny`.

## Radius Dampak per Perubahan

| Perubahan | Dampak | Batas penahan |
|---|---|---|
| Warna sinyal | Keterbacaan 3 papan ikut berubah | Uji kontras AA + teks bukan warna saja |
| Tipografi/angka | Format IDR ikut berubah | Uji 360 px dan tabel alternatif grafik |
| Build token | Web dan desktop ikut berubah | Versi token dicatat per rilis konsumen |

## Larangan Eksplisit

- Dilarang mengubah makna warna sinyal tanpa persetujuan analis.
- Dilarang mengirim token yang merusak kontras AA.
- Dilarang menyimpan rahasia apa pun di repo token.

## Rollback

Setiap rilis menyimpan token sebelumnya. Rollback berarti menerbitkan ulang token lama dan memverifikasi satu halaman tiap papan tampil benar.

## Batasan

Batasan dokumen ini: hanya radius repo desain. Dampak visual web ada di `titeny-web`, dampak desktop di `titeny-app-kmp`.
