// Pembantu pembuat prototipe statis (HTML murni, tanpa JS). Data di sini adalah CONTOH ILUSTRASI, bukan data nyata.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatIdr } from '../idr.mjs';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const spec = JSON.parse(readFileSync(join(akar, 'tokens/sinyal.spec.json'), 'utf8'));
export { formatIdr };

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Cari definisi status di semua grup spec. */
export function status(kode) {
  for (const g of ['sinyal', 'keputusan-petani', 'status-rekomendasi']) if (spec[g][kode]) return spec[g][kode];
  throw new Error(`status tidak dikenal: ${kode}`);
}

/** Lencana: bentuk + teks + warna (status tidak pernah hanya warna). */
export function lencana(kode, teksKustom) {
  const s = status(kode);
  return `<span class="lencana f-${s.fg}"><b aria-hidden="true">${s.bentuk}</b> ${esc(teksKustom ?? s.teks)}</span>`;
}

export function banner(kode, isi, judul) {
  const s = status(kode);
  return `<div class="banner f-${s.fg}" role="status"><b aria-hidden="true">${s.bentuk}</b><div>${judul ? `<strong>${esc(judul)}</strong>` : ''}<p>${isi}</p></div></div>`;
}

export function tabel({ id, caption, kepala, baris, kanan = [], lebar = [] }) {
  const cg = lebar.length ? `<colgroup>${lebar.map((w) => `<col style="width:${w}">`).join('')}</colgroup>` : '';
  const th = kepala.map((k, i) => `<th scope="col"${kanan.includes(i) ? ' class="n"' : ''}>${k}</th>`).join('');
  const tr = baris.map((r) => `<tr>${r.map((c, i) => `<${i === 0 ? 'th scope="row"' : 'td'}${kanan.includes(i) ? ' class="n"' : ''}>${c}</${i === 0 ? 'th' : 'td'}>`).join('')}</tr>`).join('');
  return `<table${id ? ` id="${id}"` : ''}>${caption ? `<caption>${esc(caption)}</caption>` : ''}${cg}<thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

export function detailTabel(ringkasan, tabelHtml, terbuka = false) {
  return `<details${terbuka ? ' open' : ''}><summary>${esc(ringkasan)}</summary>${tabelHtml}</details>`;
}

/**
 * Grafik garis SVG. panel = { y0, y1 (rentang), tinggi, seri:[{nama,nilai[],kelas,putus,label}], pita:{lo[],hi[]} }
 * Seri dibedakan lewat gaya garis (solid vs putus-putus) dan label langsung, bukan warna saja.
 */
export function grafikGaris({ id, judul, tabelId, xLabel, panel, lebar = 328, kiri = 58, kanan = 16, atas = 12, bawah = 30, fmtY = (v) => String(v), tickY = 4, anotasi = [] }) {
  const t = panel.tinggi ?? 150;
  const H = atas + t + bawah;
  const n = panel.seri[0].nilai.length;
  const px = (i) => kiri + (i * (lebar - kiri - kanan)) / (n - 1);
  const py = (v) => atas + t - ((v - panel.y0) / (panel.y1 - panel.y0)) * t;
  const kisi = [];
  for (let k = 0; k <= tickY; k++) {
    const v = panel.y0 + ((panel.y1 - panel.y0) * k) / tickY;
    kisi.push(`<line class="kisi" x1="${kiri}" x2="${lebar - kanan}" y1="${py(v).toFixed(1)}" y2="${py(v).toFixed(1)}"/><text x="${kiri - 6}" y="${(py(v) + 4).toFixed(1)}" text-anchor="end">${esc(fmtY(v))}</text>`);
  }
  const xs = xLabel.map((l, i) => (l === '' ? '' : `<text x="${px(i).toFixed(1)}" y="${atas + t + 18}" text-anchor="middle">${esc(l)}</text>`)).join('');
  const pita = panel.pita
    ? `<polygon class="pita" points="${panel.pita.hi.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')} ${panel.pita.lo.map((v, i) => [px(i), py(v)]).reverse().map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}"/>`
    : '';
  const seri = panel.seri
    .map((s) => {
      const pts = s.nilai.map((v, i) => `${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
      const titik = s.titik ? s.nilai.map((v, i) => `<circle class="titik" cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="3.5"/>`).join('') : '';
      const lbl = s.label ? `<text class="${s.kelas === 'gr' ? 'label-gr' : 'label-gl'}" x="${kiri + 6}" y="${atas + 14}" text-anchor="start">${esc(s.label)}</text>` : '';
      return `<polyline class="${s.kelas ?? 'gl'}${s.putus ? ' putus' : ''}" points="${pts}"/>${titik}${lbl}`;
    })
    .join('');
  const an = anotasi
    .map((a) => `<g><line class="kisi" x1="${px(a.i).toFixed(1)}" x2="${px(a.i).toFixed(1)}" y1="${atas}" y2="${atas + t}" stroke-dasharray="2 3"/><circle cx="${px(a.i).toFixed(1)}" cy="${atas + 8}" r="9" fill="var(--ttn-kartu)" stroke="var(--ttn-teks)"/><text x="${px(a.i).toFixed(1)}" y="${atas + 12}" text-anchor="middle" style="fill:var(--ttn-teks);font-weight:600">${a.nomor}</text></g>`)
    .join('');
  return `<svg class="grafik" id="${id}" viewBox="0 0 ${lebar} ${H}" role="img" aria-label="${esc(judul)}" aria-describedby="${tabelId}" focusable="false"><line class="sumbu" x1="${kiri}" x2="${kiri}" y1="${atas}" y2="${atas + t}"/><line class="sumbu" x1="${kiri}" x2="${lebar - kanan}" y1="${atas + t}" y2="${atas + t}"/>${kisi.join('')}${pita}${seri}${an}${xs}</svg>`;
}

export const navPeran = (aktif) =>
  `<nav aria-label="Pemilih peran"><ul class="nav-peran">${[
    ['petani', 'Petani'],
    ['vendor', 'Vendor'],
    ['ceo', 'CEO'],
  ]
    .map(([k, t]) => `<li><a href="${k}.html"${k === aktif ? ' aria-current="page"' : ''}>${t}</a></li>`)
    .join('')}</ul></nav>`;

export const varian = (judul, isi) => `<section class="varian" aria-label="Varian: ${esc(judul)}"><h2 class="varian-judul">Varian keadaan: ${esc(judul)}</h2>${isi}</section>`;

export function halaman({ judul, isi, css = '../../../dist/titeny.css', css2 = '../prototipe.css', lebarMin = '' }) {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(judul)}</title>
<link rel="stylesheet" href="${css}">
<link rel="stylesheet" href="${css2}">
${lebarMin ? `<style>body{min-width:${lebarMin}}</style>` : ''}
</head>
<body>
${isi}
</body>
</html>
`;
}

/** Banner timeout 12 detik: cache terakhir + stempel waktu (tanpa spinner tanpa batas). */
export const bannerTimeout = (stempel = '3 Okt 2026 23.00') =>
  banner('luring', `Data belum termuat setelah 12 detik. Menampilkan data tersimpan terakhir: <time datetime="2026-10-03T23:00:00+07:00">${esc(stempel)}</time>. <a href="#" class="tombol sekunder" style="margin-top:8px;display:flex">Coba lagi</a>`, 'Menampilkan data tersimpan');

export const bannerMemuat = () =>
  `<div class="kartu" aria-busy="true"><p><strong>Memuat…</strong> <span class="ket">Maksimal 12 detik, lalu tampil data tersimpan.</span></p><div class="progres" role="progressbar" aria-label="Memuat, maksimal 12 detik"><i></i></div><div class="skeleton" style="width:60%"></div><div class="skeleton" style="width:85%"></div></div>`;
