// Verifikasi kontras WCAG 2.2 untuk token Titeny. Jalankan: npm run test:kontras
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const baca = (p) => JSON.parse(readFileSync(join(akar, p), 'utf8'));

function rgb(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`warna tidak valid: ${hex}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function luminans(hex) {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function rasio(a, b) {
  const [la, lb] = [luminans(a), luminans(b)];
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export function muatToken() {
  const c = baca('tokens/colors.json');
  const warna = {};
  for (const [k, v] of Object.entries(c)) if (!k.startsWith('$')) warna[k] = v.$value;
  return { warna, pasangan: baca('tokens/kontras.json').pasangan, sinyal: baca('tokens/sinyal.spec.json').sinyal, spec: baca('tokens/sinyal.spec.json') };
}

export function periksaSemua() {
  const { warna, pasangan, spec } = muatToken();
  const hasil = pasangan.map(({ fg, bg, min }) => {
    if (!warna[fg] || !warna[bg]) throw new Error(`token tidak ada: ${fg}/${bg}`);
    const r = rasio(warna[fg], warna[bg]);
    return { fg, bg, min, rasio: Math.round(r * 100) / 100, lolos: r >= min };
  });
  // Setiap fg/bg yang dipakai spec sinyal wajib terdaftar sebagai pasangan teks 4.5.
  for (const grup of ['sinyal', 'keputusan-petani', 'status-rekomendasi']) {
    for (const [nama, s] of Object.entries(spec[grup])) {
      const ada = hasil.find((h) => h.fg === s.fg && h.bg === s.bg && h.min >= 4.5);
      if (!ada) hasil.push({ fg: s.fg, bg: s.bg, min: 4.5, rasio: 0, lolos: false, catatan: `${grup}.${nama} tidak punya pasangan 4.5 terdaftar` });
    }
  }
  return hasil;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const hasil = periksaSemua();
  for (const h of hasil) console.log(`${h.lolos ? 'LOLOS' : 'GAGAL'}  ${h.fg.padEnd(15)} / ${h.bg.padEnd(13)} ${String(h.rasio).padStart(5)}  (min ${h.min})${h.catatan ? ' ' + h.catatan : ''}`);
  const gagal = hasil.filter((h) => !h.lolos).length;
  console.log(`\n${hasil.length - gagal}/${hasil.length} pasangan lolos WCAG AA`);
  process.exit(gagal ? 1 : 0);
}
