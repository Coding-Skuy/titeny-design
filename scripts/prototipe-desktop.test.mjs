// Uji merah-hijau TTN-DSG-004: prototipe 5 layar desktop analis (jendela 1120x720).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { cariChrome, ukurLebar } from './ukur.mjs';

execSync('npm run build:tokens && node scripts/bangun-prototipe.mjs desktop', { stdio: 'pipe' });

const layar = ['antrean-validasi', 'tahan-prediksi', 'bandingkan-model', 'kelola-rekomendasi', 'ekspor'];
const berkas = (l) => `src/prototipe/desktop/${l}.html`;
const baca = (l) => readFileSync(berkas(l), 'utf8');

test('5 layar ada', () => {
  for (const l of layar) assert.ok(existsSync(berkas(l)), l);
});

test('setiap layar: navigasi 5 layar, bilah shortcut, tabel zebra atau form', () => {
  for (const l of layar) {
    const h = baca(l);
    for (const n of ['Antrean Validasi', 'Tahan Prediksi', 'Bandingkan Model', 'Kelola Rekomendasi', 'Ekspor']) assert.ok(h.includes(n), `${l}: nav ${n}`);
    for (const t of ['Ctrl+R', 'Segarkan', 'Ctrl+E', 'Esc', 'Kembali']) assert.ok(h.includes(t), `${l}: shortcut ${t}`);
  }
  for (const l of ['antrean-validasi', 'tahan-prediksi', 'bandingkan-model', 'kelola-rekomendasi']) assert.ok(baca(l).includes('class="zebra"'), `${l}: zebra`);
});

test('banner luring tergambar dengan teks kontrak', () => {
  assert.ok(baca('antrean-validasi').includes('Luring — data 2026-10-03 23.00'));
});

test('tombol kirim nonaktif sampai alasan 10-140 karakter valid', () => {
  const h = baca('antrean-validasi');
  const kirim = [...h.matchAll(/<button[^>]*id="kirim-[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.equal(kirim.length, 5, 'utama(38), kosong, 9, 10, 141 karakter');
  const aktif = kirim.filter((t) => !/\bdisabled\b/.test(t));
  assert.deepEqual(aktif.map((t) => /id="([^"]+)"/.exec(t)[1]).sort(), ['kirim-10', 'kirim-valid'], 'hanya alasan 10-140 karakter yang aktif');
  for (const t of ['0/140', '9/140', '10/140', '141/140', '38/140', 'minimal 10']) assert.ok(h.includes(t), t);
});

test('Naikkan versi aktif hanya bila syarat terpenuhi', () => {
  const h = baca('bandingkan-model');
  const tombol = [...h.matchAll(/<button[^>]*id="naikkan-[^"]*"[^>]*>/g)].map((m) => m[0]);
  assert.equal(tombol.length, 2);
  assert.equal(tombol.filter((t) => /\bdisabled\b/.test(t)).length, 1);
  for (const t of ['0,5 poin', '2 poin', 'MAPE H+7']) assert.ok(h.includes(t), t);
});

test('layar tahan, rekomendasi, ekspor memuat aturan kontrak', () => {
  const t = baca('tahan-prediksi');
  for (const s of ['maks 7 hari', 'Kedaluwarsa otomatis']) assert.ok(t.includes(s), s);
  const r = baca('kelola-rekomendasi');
  for (const s of ['Penanggung jawab', 'Tanggal target']) assert.ok(r.includes(s), s);
  const e = baca('ekspor');
  for (const s of ['titeny_harga_20261004_2310.xlsx', '50.000 baris', 'SHA-256', 'CSV', 'XLSX']) assert.ok(e.includes(s), s);
});

test('status berwarna selalu bersama teks dan bentuk', () => {
  for (const l of layar) {
    const lencana = [...baca(l).matchAll(/<span class="lencana[^"]*"[^>]*>(.*?)<\/span>/g)];
    for (const [, isi] of lencana) assert.ok(/[●▲■◆○ℹ]/.test(isi) && /[A-Za-z]{3,}/.test(isi.replace(/<[^>]+>/g, '')), `${l}: ${isi}`);
  }
});

test('tidak ada scroll horizontal pada 1120 px dan tidak melebar dari jendela min', { skip: cariChrome() ? false : 'Chrome tidak ada' }, () => {
  for (const l of layar) {
    const r = ukurLebar(berkas(l), 1120, 720);
    assert.equal(r.iw, 1120, `${l}: viewport ${r.iw}`);
    assert.ok(r.sw <= 1120 && r.bw <= 1120, `${l}: scrollWidth ${r.sw}/${r.bw}, pelanggar: ${r.pelanggar.join(',')}`);
  }
});
