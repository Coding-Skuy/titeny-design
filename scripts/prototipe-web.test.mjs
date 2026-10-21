// Uji merah-hijau TTN-DSG-003: prototipe 3 papan web terbaca pada 360 px tanpa scroll horizontal,
// keadaan wajib tergambar, dan setiap grafik punya tabel teks alternatif.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { cariChrome, ukurLebar } from './ukur.mjs';

execSync('npm run build:tokens && node scripts/bangun-prototipe.mjs web', { stdio: 'pipe' });

const papan = ['petani', 'vendor', 'ceo'];
const berkas = (p) => `src/prototipe/web/${p}.html`;
const baca = (p) => readFileSync(berkas(p), 'utf8');

test('3 berkas papan ada', () => {
  for (const p of papan) assert.ok(existsSync(berkas(p)), p);
});

test('papan petani: 4 kartu + keputusan + semua keadaan', () => {
  const h = baca('petani');
  for (const id of ['kartu-harga', 'kartu-keputusan', 'kartu-cuaca-panen', 'kartu-aksi']) assert.ok(h.includes(`id="${id}"`), id);
  for (const t of ['JUAL SEKARANG', 'TAHAN 3 HARI', 'CICIL JUAL', 'Tawarkan ke gudang', 'Data harga belum cukup', 'Akurasi terbatas', '12 detik']) assert.ok(h.includes(t), t);
});

test('papan vendor: tabel besok + peringatan + keadaan', () => {
  const h = baca('vendor');
  for (const t of ['harga besok', 'demand H+7 (kg)', 'saran stok (kg)', 'Seimbang', 'Waspada', 'Defisit', 'Estimasi — transaksi kemarin belum masuk', '12 detik']) assert.ok(h.includes(t), t);
});

test('papan CEO: matriks 5x12, kurva S10, 5 rekomendasi, tab Akurasi, keadaan', () => {
  const h = baca('ceo');
  assert.equal((h.match(/class="sel-matriks/g) ?? []).length, 60 * 1, 'sel matriks utama harus 60 (5 kab x 12 komoditas)');
  for (const t of ['Kurva omzet vs margin 30 hari', 'role="tab"', 'Akurasi', 'MAPE H+7', '12 detik']) assert.ok(h.includes(t), t);
  assert.equal((h.match(/class="rekomendasi"/g) ?? []).length, 5);
});

test('setiap grafik SVG punya tabel teks alternatif yang ditunjuk aria-describedby', () => {
  for (const p of papan) {
    const h = baca(p);
    const svg = [...h.matchAll(/<svg[^>]*role="img"[^>]*>/g)].map((m) => m[0]);
    for (const tag of svg) {
      const id = /aria-describedby="([^"]+)"/.exec(tag)?.[1];
      assert.ok(id, `${p}: svg tanpa aria-describedby`);
      assert.ok(new RegExp(`<table[^>]*id="${id}"`).test(h), `${p}: tabel ${id} tidak ada`);
    }
    if (p !== 'vendor') assert.ok(svg.length >= 1, `${p}: harus ada grafik`);
  }
});

test('status tidak hanya warna: lencana memuat teks dan bentuk', () => {
  for (const p of papan) {
    const h = baca(p);
    const lencana = [...h.matchAll(/<span class="lencana[^"]*"[^>]*>(.*?)<\/span>/g)];
    assert.ok(lencana.length > 0, p);
    for (const [, isi] of lencana) assert.ok(/[●▲■◆○ℹ]/.test(isi) && /[A-Za-z]{3,}/.test(isi.replace(/<[^>]+>/g, '')), `${p}: lencana tanpa teks+bentuk: ${isi}`);
  }
});

test('tidak ada scroll horizontal pada 360 px (Chrome headless nyata)', { skip: cariChrome() ? false : 'Chrome tidak ada' }, () => {
  for (const p of papan) {
    const r = ukurLebar(berkas(p), 360);
    assert.equal(r.iw, 360, `${p}: viewport bukan 360 (${r.iw})`);
    assert.ok(r.sw <= 360 && r.bw <= 360, `${p}: scrollWidth ${r.sw}/${r.bw} > 360, pelanggar: ${r.pelanggar.join(',')}`);
  }
});
