// Uji merah-hijau untuk pustaka kontras WCAG dan data token (TTN-DSG-002).
import test from 'node:test';
import assert from 'node:assert/strict';
import { luminans, rasio, periksaSemua, muatToken } from './kontras.mjs';
import { formatIdr } from './idr.mjs';

test('rasio hitam-putih = 21', () => {
  assert.equal(Math.round(rasio('#000000', '#ffffff') * 100) / 100, 21);
});

test('rasio simetris dan warna sama = 1', () => {
  assert.equal(rasio('#1e7a3c', '#1e7a3c'), 1);
  assert.equal(rasio('#1e7a3c', '#ffffff'), rasio('#ffffff', '#1e7a3c'));
});

test('luminans putih = 1, hitam = 0', () => {
  assert.equal(luminans('#ffffff'), 1);
  assert.equal(luminans('#000000'), 0);
});

test('semua pasangan token memenuhi minimum WCAG AA', () => {
  const hasil = periksaSemua();
  const gagal = hasil.filter((h) => !h.lolos);
  assert.deepEqual(gagal, [], 'pasangan gagal: ' + JSON.stringify(gagal));
  assert.ok(hasil.length >= 20, 'terlalu sedikit pasangan diperiksa');
});

test('setiap sinyal punya padanan teks dan ikon bentuk (bukan warna saja)', () => {
  const { sinyal } = muatToken();
  const wajib = ['seimbang', 'waspada', 'defisit', 'akurasi-terbatas'];
  for (const k of wajib) {
    assert.ok(sinyal[k], `sinyal ${k} hilang`);
    assert.ok(sinyal[k].teks && sinyal[k].teks.length > 0, `teks ${k}`);
    assert.ok(sinyal[k].bentuk && sinyal[k].bentuk.length > 0, `bentuk ${k}`);
  }
  const bentuk = wajib.filter((k) => k !== 'akurasi-terbatas').map((k) => sinyal[k].bentuk);
  assert.equal(new Set(bentuk).size, bentuk.length, 'bentuk sinyal utama harus berbeda');
});

test('format IDR pemisah titik', () => {
  assert.equal(formatIdr(42500), '42.500');
  assert.equal(formatIdr(1250000), '1.250.000');
  assert.equal(formatIdr(0), '0');
  assert.equal(formatIdr(999), '999');
  assert.equal(formatIdr(42500, { awalan: true }), 'Rp 42.500');
  assert.equal(formatIdr(-1500), '-1.500');
  assert.throws(() => formatIdr(42.5), /integer/);
});

test('build token menghasilkan CSS variable dan objek Compose untuk semua warna', async () => {
  const { execSync } = await import('node:child_process');
  const { readFileSync } = await import('node:fs');
  execSync('npm run build:tokens', { stdio: 'pipe' });
  const css = readFileSync('dist/titeny.css', 'utf8');
  const kt = readFileSync('dist/compose/TitenyWarna.kt', 'utf8');
  const { warna } = muatToken();
  for (const [nama, hex] of Object.entries(warna)) {
    assert.ok(css.includes(`--ttn-${nama}: ${hex};`), `CSS tanpa --ttn-${nama}`);
    const ktNama = 'ttn' + nama.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
    assert.ok(kt.includes(`val ${ktNama} = Color(0xff${hex.slice(1)})`), `Kotlin tanpa ${ktNama}`);
  }
  assert.ok(css.includes('--ttn-ukuran-angka-besar: 32px;'));
});
