# CHANGELOG — titeny-design

Format: satu seksi per rilis, terbaru di atas. Wajib diperbarui pada setiap commit `feat:` / `fix:` / `docs:`.

## [Belum dirilis]

### Ditambahkan
- TTN-DSG-004: flow + 5 layar desktop analis Windows (`docs/flow/desktop-analis.md`), prototipe `src/prototipe/desktop/` (1120x720, tabel zebra, Kirim/Naikkan versi bersyarat, pintasan, banner luring), uji 1120 px.
- TTN-DSG-003: flow + screen 3 papan web 360 px (`docs/flow/papan-web-360.md`), prototipe HTML statis `src/prototipe/web/` (landing, masuk, petani, vendor, CEO + varian keadaan), generator `scripts/prototipe/`, pengukur lebar Chrome `scripts/ukur.mjs`, uji 360 px.
- TTN-DSG-002: token papan insight v0.2.0 — palet sinyal (hijau/kuning/merah + netral/info), tipografi, radius, ruang, `sinyal.spec.json` (teks + bentuk), format angka IDR, skrip kontras WCAG AA (35 pasangan) dan keluaran CSS `--ttn-*` serta Compose `TitenyWarna`.
- Fondasi AI-dev v1.0.0: `AGENTS.md`, `CLAUDE.md`, `docs/decisions/ADR-0001-fondasi-teknis.md`, `versions/v1.0.0/docs/40-TECHSTACK.md` dan `60-BLAST-RADIUS.md` (versi lengkap, menggantikan ringkasan awal).

### Diubah
- Palet awal `titeny.*` (hijau-panen, kuning-harga, merah-peringatan, latar, tinta) diganti nama `--ttn-*` yang selaras `titeny-web`; `sd.config.json` memakai sumber eksplisit dan `prefix: ttn`.
