// Prototipe 5 layar desktop analis Windows (jendela min 1120x720). Data = contoh ilustrasi.
import { esc, lencana, banner, tabel, varian, halaman } from './lib.mjs';

const CSS = ['../prototipe.css', '../desktop.css'];
const LAYAR = [
  ['antrean-validasi', 'Antrean Validasi'],
  ['tahan-prediksi', 'Tahan Prediksi'],
  ['bandingkan-model', 'Bandingkan Model'],
  ['kelola-rekomendasi', 'Kelola Rekomendasi'],
  ['ekspor', 'Ekspor'],
];

const LURING = 'Luring — data 2026-10-03 23.00';

function kerangka(aktif, judul, isi, { luring = false } = {}) {
  const nav = LAYAR.map(([k, t], i) => `<li><a href="${k}.html"${k === aktif ? ' aria-current="page"' : ''}>${i + 1}. ${t}</a></li>`).join('');
  const status = luring
    ? `<span class="lencana f-info"><b aria-hidden="true">ℹ</b> ${LURING}</span>`
    : `<span class="lencana f-hijau"><b aria-hidden="true">●</b> Daring</span><span class="ket">Disegarkan 4 Okt 2026 23.10 · polling prediksi 15 menit, antrean 5 menit</span>`;
  return `<div class="app"><header class="bar-atas"><span class="merek">Titeny Analis</span>${status}<span class="spasi"></span><span class="ket">Analis · token berlaku 8 jam</span><button class="tombol sekunder" type="button">Segarkan <kbd>Ctrl+R</kbd></button></header>
<nav class="samping" aria-label="Layar analis"><ol>${nav}</ol></nav>
<main class="utama"><h1>${esc(judul)}</h1><p class="ket">Data pada prototipe ini adalah contoh ilustrasi, bukan data nyata.</p>${isi}</main>
<footer class="bar-shortcut" aria-label="Pintasan keyboard"><span><kbd>Ctrl+R</kbd> Segarkan</span><span><kbd>Ctrl+E</kbd> Ekspor</span><span><kbd>Esc</kbd> Kembali</span></footer></div>`;
}
const bungkus = (aktif, judul, isi, o) => halaman({ judul: `${judul} — Titeny Analis (prototipe 1120×720)`, css2: CSS, isi: kerangka(aktif, judul, isi, o) });
const bannerLuring = () => banner('luring', 'Menampilkan cache terakhir. Aksi tulis (setuju, koreksi, tolak, tahan) diantre dan terkirim saat daring dengan kunci idempoten <code>aksi_id</code>.', LURING);

// ------------------------------------------------------------ 1 ANTREAN
const flag = [
  ['evt_20261004_000123', 'Harga di luar rentang', 'Cabai merah · Jakarta Timur 01', '41.000', 'perlu'],
  ['evt_20261004_000131', 'Stok selisih > 1%', 'Bawang merah · Bogor 02', '1,8%', 'perlu'],
  ['evt_20261004_000140', 'Panen outlier', 'Kubis · Kab. E', '48 ton', 'perlu'],
  ['evt_20261004_000152', 'Harga di luar rentang', 'Tomat · Jakarta Timur 01', '25.000', 'antre'],
  ['evt_20261003_000988', 'Stok selisih > 1%', 'Kentang · Bandung 01', '2,4%', 'selesai'],
];
const stFlag = { perlu: lencana('waspada', 'Perlu verifikasi'), antre: lencana('luring', 'Antre kirim'), selesai: lencana('seimbang', 'Divalidasi') };

/** Panel keputusan; tombol Kirim aktif hanya bila alasan 10-140 karakter. */
function panelValidasi(id, alasan, aksi = 'koreksi_nilai') {
  const n = alasan.length;
  const valid = n >= 10 && n <= 140;
  const pesan = n === 0 ? 'Alasan wajib diisi, minimal 10 karakter.' : n < 10 ? 'Terlalu pendek, minimal 10 karakter.' : n > 140 ? 'Terlalu panjang, maksimal 140 karakter.' : 'Alasan valid.';
  const r = (v, t) => `<label><input type="radio" name="aksi-${id}" value="${v}"${aksi === v ? ' checked' : ''}> ${t}</label>`;
  return `<section class="kartu" aria-labelledby="pv-${id}"><h2 id="pv-${id}">Keputusan untuk evt_20261004_000123</h2>
<fieldset class="pilihan"><legend class="sr-saja">Aksi</legend>${r('setuju', 'setuju')}${r('koreksi_nilai', 'koreksi_nilai')}${r('tolak', 'tolak')}</fieldset>
<div class="baris-form"><label for="nv-${id}">Nilai baru (Rp/kg)</label><input id="nv-${id}" inputmode="numeric" value="41000"></div>
<div class="baris-form"><label for="al-${id}">Alasan (10–140 karakter)</label><textarea id="al-${id}" aria-describedby="ket-${id}"${valid ? '' : ' aria-invalid="true"'}>${esc(alasan)}</textarea>
<p class="hitung${valid ? '' : ' salah'}" id="ket-${id}">${n}/140 · ${pesan}</p></div>
<div class="baris-aksi"><button class="tombol" type="button" id="kirim-${id}"${valid ? '' : ' disabled aria-disabled="true"'}>Kirim keputusan</button><span class="ket">${valid ? 'Siap dikirim.' : 'Nonaktif sampai alasan valid.'}</span></div></section>`;
}

export function antrean() {
  const t = tabel({
    id: 'tabel-antrean',
    caption: 'Antrean flag perlu_verifikasi (5 menit polling)',
    kepala: ['event_id', 'Jenis flag', 'Komoditas · pasar', 'Nilai', 'Status', 'Aksi'],
    baris: flag.map(([e, j, k, v, s]) => [e, j, k, v, stFlag[s], '<button class="tombol sekunder" type="button">Tinjau</button>']),
  }).replace('<table id="tabel-antrean"', '<table class="zebra" id="tabel-antrean"');
  const utama = `<div class="dua-kolom"><section class="kartu" aria-labelledby="h-an"><h2 id="h-an">5 flag terbuka</h2>${t}<p class="ket">Klik baris atau <kbd>Enter</kbd> membuka detail (deep link <code>titeny://analis/flag/&lt;eventId&gt;</code>); <kbd>Esc</kbd> kembali ke daftar.</p></section>${panelValidasi('valid', 'Salah input lapak 042, nota terlampir.')}</div>`;
  const alasanKosong = panelValidasi('0', '');
  const alasan9 = panelValidasi('9', 'Salah ini');
  const alasan10 = panelValidasi('10', 'Salah ukur');
  const alasan141 = panelValidasi('141', 'x'.repeat(141));
  return bungkus('antrean-validasi', 'Antrean Validasi', `${utama}
${varian('alasan kosong (0/140): Kirim nonaktif', alasanKosong)}
${varian('alasan 9 karakter: Kirim nonaktif', alasan9)}
${varian('alasan tepat 10 karakter (batas bawah): Kirim aktif', alasan10)}
${varian('alasan 141 karakter: Kirim nonaktif', alasan141)}
${varian('mode luring: cache + aksi diantre', `${bannerLuring()}<p>${lencana('luring', 'Antre kirim')} Aksi tulis tampil di baris dengan status ini sampai terkirim.</p>`)}
${varian('antrean kosong', '<section class="kartu kosong"><span class="lencana f-hijau"><b aria-hidden="true">●</b> Antrean kosong</span><p>Tidak ada flag perlu verifikasi. Polling berikutnya dalam 5 menit.</p></section>')}`);
}
// ------------------------------------------------------------ 2 TAHAN
export function tahan() {
  const form = `<section class="kartu" aria-labelledby="h-th"><h2 id="h-th">Tahan pasangan komoditas-pasar</h2>
<div class="baris-form"><label for="th-k">Komoditas</label><select id="th-k"><option>Cabai merah</option></select></div>
<div class="baris-form"><label for="th-p">Pasar</label><select id="th-p"><option>Jakarta Timur 01</option></select></div>
<div class="baris-form"><label for="th-s">Berlaku sampai (maks 7 hari)</label><input id="th-s" value="2026-10-07"></div>
<div class="baris-form"><label for="th-a">Alasan (10–140 karakter)</label><textarea id="th-a">Sampel hanya 2 lapak.</textarea><p class="hitung" id="th-h">21/140 · Alasan valid.</p></div>
<div class="baris-aksi"><button class="tombol" type="button" id="kirim-tahan">Tahan dari papan petani</button></div></section>`;
  const t = tabel({
    id: 'tabel-tahan',
    caption: 'Penahanan aktif dan riwayat',
    kepala: ['Komoditas · pasar', 'Alasan', 'Berlaku sampai', 'Sisa', 'Status'],
    baris: [
      ['Cabai merah · Jakarta Timur 01', 'Sampel hanya 2 lapak.', '2026-10-07', '3 hari', lencana('waspada', 'Ditahan')],
      ['Tomat · Bogor 02', 'Harga outlier menunggu verifikasi.', '2026-10-05', '1 hari', lencana('waspada', 'Ditahan')],
      ['Kentang · Bandung 01', 'Data panen belum lengkap.', '2026-09-30', '0', lencana('estimasi', 'Kedaluwarsa otomatis')],
    ],
  }).replace('<table id="tabel-tahan"', '<table class="zebra" id="tabel-tahan"');
  const isi = `<div class="dua-kolom"><section class="kartu" aria-labelledby="h-tt"><h2 id="h-tt">Penahanan</h2>${t}<p class="ket">Penahanan maks 7 hari, lalu kedaluwarsa otomatis dan pasangan kembali tayang di papan petani.</p></section>${form}</div>`;
  const salah = `<section class="kartu"><h2>Tahan pasangan komoditas-pasar</h2><div class="baris-form"><label for="th-s2">Berlaku sampai (maks 7 hari)</label><input id="th-s2" value="2026-10-20" aria-invalid="true" aria-describedby="th-e2"></div>${banner('defisit', 'Tanggal melebihi 7 hari dari hari ini (maks 2026-10-11).', 'Penahanan ditolak').replace('<div class="banner', '<div id="th-e2" class="banner')}<button class="tombol" type="button" id="kirim-tahan-salah" disabled aria-disabled="true">Tahan dari papan petani</button></section>`;
  return bungkus('tahan-prediksi', 'Tahan Prediksi', `${isi}${varian('tanggal melebihi 7 hari: Kirim nonaktif', salah)}${varian('mode luring', `${bannerLuring()}<p>${lencana('luring', 'Antre kirim')} Penahanan diantre dan baru berlaku di server saat terkirim.</p>`)}`);
}

// ------------------------------------------------------------ 3 MODEL
const komoditas12 = ['Cabai merah', 'Cabai rawit', 'Bawang merah', 'Bawang putih', 'Tomat', 'Kentang', 'Wortel', 'Kubis', 'Buncis', 'Jagung', 'Telur', 'Beras'];
function barisModel(buruk = false) {
  return komoditas12.map((k, i) => {
    const jalan = 9 + (i % 5) * 0.8;
    let delta = -(0.3 + (i % 4) * 0.2);
    if (buruk && i === 3) delta = 2.4;
    const kand = jalan + delta;
    const st = delta > 2 ? lencana('defisit', 'Memburuk > 2 poin') : delta > 0 ? lencana('waspada', 'Sedikit memburuk') : lencana('seimbang', 'Membaik');
    const f = (v) => v.toFixed(1).replace('.', ',');
    return [k, f(jalan), f(kand), (delta > 0 ? '+' : '−') + f(Math.abs(delta)), st];
  });
}
function modelTabel(buruk) {
  return tabel({ caption: 'MAPE H+7 (%) versi berjalan vs kandidat, backtest 90 hari', kepala: ['Komoditas', 'Berjalan', 'Kandidat', 'Selisih (poin)', 'Status'], kanan: [1, 2, 3], baris: barisModel(buruk) }).replace('<table', '<table class="zebra"');
}
function syarat(ok1, ok2) {
  const li = (ok, t) => `<li>${ok ? lencana('seimbang', 'Terpenuhi') : lencana('defisit', 'Belum')} ${t}</li>`;
  return `<ul class="checklist">${li(ok1, 'MAPE H+7 turun ≥ 0,5 poin (rerata semua komoditas)')}${li(ok2, 'Tidak ada komoditas memburuk lebih dari 2 poin')}</ul>`;
}
export function model() {
  const aktif = `<section class="kartu" aria-labelledby="h-nv"><h2 id="h-nv">Syarat naikkan versi</h2>${syarat(true, true)}<button class="tombol" type="button" id="naikkan-aktif">Naikkan versi ke kandidat</button></section>`;
  const nonaktif = `<section class="kartu" aria-labelledby="h-nv2"><h2 id="h-nv2">Syarat naikkan versi</h2>${syarat(true, false)}<button class="tombol" type="button" id="naikkan-nonaktif" disabled aria-disabled="true">Naikkan versi ke kandidat</button><p class="ket">Nonaktif: Bawang putih memburuk 2,4 poin (batas 2 poin).</p></section>`;
  return bungkus('bandingkan-model', 'Bandingkan Model', `<div class="dua-kolom"><section class="kartu" aria-labelledby="h-bm"><h2 id="h-bm">Versi berjalan v1.0.0 vs kandidat v1.1.0-rc1</h2>${modelTabel(false)}</section>${aktif}</div>
${varian('syarat tidak terpenuhi: Naikkan versi nonaktif', `<div class="dua-kolom"><section class="kartu"><h2>Kandidat v1.1.0-rc2</h2>${modelTabel(true)}</section>${nonaktif}</div>`)}
${varian('mode luring', `${bannerLuring()}<p class="ket">Tabel dari cache; Naikkan versi nonaktif saat luring (aksi ini tidak diantre).</p>`)}`);
}

// ------------------------------------------------------------ 4 REKOMENDASI
export function rekomendasi() {
  const rek = [
    ['Tambah pasok cabai merah ke Kab. A', 'baru', '', ''],
    ['Alihkan stok tomat dari Kab. C ke Kab. B', 'dikerjakan', 'Sari Wulandari', '2026-10-08'],
    ['Tahan penawaran bawang merah Kab. D', 'baru', '', ''],
    ['Jadwalkan panen kubis Kab. E lebih awal', 'dikerjakan', 'Budi Santoso', '2026-10-10'],
    ['Audit data harga jagung Kab. B', 'selesai', 'Sari Wulandari', '2026-10-03'],
  ];
  const t = tabel({
    id: 'tabel-rek',
    caption: '5 rekomendasi prioritas',
    kepala: ['#', 'Rekomendasi', 'Status', 'Penanggung jawab', 'Tanggal target', 'Aksi'],
    baris: rek.map(([j, s, p, d], i) => [String(i + 1), j, lencana(s), p || '<span class="ket">— belum ditetapkan</span>', d || '<span class="ket">—</span>', '<button class="tombol sekunder" type="button">Ubah</button>']),
  }).replace('<table id="tabel-rek"', '<table class="zebra" id="tabel-rek"');
  const form = `<section class="kartu" aria-labelledby="h-fr"><h2 id="h-fr">Ubah rekomendasi 1</h2>
<div class="baris-form"><label for="rk-s">Status</label><select id="rk-s"><option>Dikerjakan</option></select></div>
<div class="baris-form"><label for="rk-p">Penanggung jawab (nama)</label><input id="rk-p" value="Sari Wulandari"></div>
<div class="baris-form"><label for="rk-d">Tanggal target (YYYY-MM-DD, konkret)</label><input id="rk-d" value="2026-10-08"></div>
<button class="tombol" type="button" id="simpan-rek">Simpan</button></section>`;
  const salah = `<section class="kartu"><h2>Ubah rekomendasi 3</h2><div class="baris-form"><label for="rk-p2">Penanggung jawab (nama)</label><input id="rk-p2" value="" aria-invalid="true" aria-describedby="rk-e"></div>${banner('defisit', 'Nama penanggung jawab dan tanggal target konkret wajib diisi untuk status Dikerjakan.', 'Belum dapat disimpan').replace('<div class="banner', '<div id="rk-e" class="banner')}<button class="tombol" type="button" id="simpan-rek-salah" disabled aria-disabled="true">Simpan</button></section>`;
  return bungkus('kelola-rekomendasi', 'Kelola Rekomendasi', `<div class="dua-kolom"><section class="kartu" aria-labelledby="h-kr"><h2 id="h-kr">Daftar rekomendasi</h2>${t}</section>${form}</div>${varian('data wajib belum lengkap: Simpan nonaktif', salah)}${varian('mode luring', `${bannerLuring()}<p>${lencana('luring', 'Antre kirim')} Perubahan status diantre.</p>`)}`);
}

// ------------------------------------------------------------ 5 EKSPOR
export function ekspor() {
  const form = `<section class="kartu" aria-labelledby="h-ek"><h2 id="h-ek">Buat ekspor</h2>
<fieldset class="pilihan"><legend class="sr-saja">Jenis data</legend><label><input type="radio" name="jenis" checked> Harga H+7</label><label><input type="radio" name="jenis"> Demand</label><label><input type="radio" name="jenis"> Panen</label><label><input type="radio" name="jenis"> Jejak akurasi</label></fieldset>
<fieldset class="pilihan"><legend class="sr-saja">Format</legend><label><input type="radio" name="fmt"> CSV</label><label><input type="radio" name="fmt" checked> XLSX</label></fieldset>
<p>Nama berkas: <code>titeny_harga_20261004_2310.xlsx</code></p>
<p class="ket">Maksimal 50.000 baris per berkas; data lebih besar dipecah otomatis menjadi beberapa berkas bernomor.</p>
<button class="tombol" type="button" id="ekspor-mulai">Ekspor <kbd>Ctrl+E</kbd></button></section>`;
  const t = tabel({
    id: 'tabel-jejak-ekspor',
    caption: 'Jejak ekspor (dicatat untuk audit Lumbung keuangan)',
    kepala: ['Waktu', 'Nama berkas', 'Baris', 'SHA-256 (awal…akhir)'],
    kanan: [2],
    baris: [
      ['2026-10-03 22.40', 'titeny_demand_20261003_2240.csv', '12.480', '3f9a1c…c21e07'],
      ['2026-10-02 16.05', 'titeny_akurasi_20261002_1605.xlsx', '1.140', '8b04de…91a3f2'],
    ],
  }).replace('<table id="tabel-jejak-ekspor"', '<table class="zebra" id="tabel-jejak-ekspor"');
  return bungkus('ekspor', 'Ekspor', `<div class="dua-kolom">${form}<section class="kartu" aria-labelledby="h-je"><h2 id="h-je">Riwayat</h2>${t}<p class="ket">Hash contoh ilustrasi. Ekspor massal hanya tersedia di desktop, tidak di web.</p></section></div>
${varian('ekspor berjalan dan selesai', `<p>${lencana('seimbang', 'Selesai')} titeny_harga_20261004_2310.xlsx · 8.400 baris · SHA-256 tercatat.</p>`)}
${varian('melebihi 50.000 baris', banner('waspada', 'Data 120.000 baris dipecah menjadi 3 berkas (maks 50.000 baris per berkas).', 'Ekspor dipecah'))}
${varian('mode luring', `${bannerLuring()}<p class="ket">Ekspor memakai cache lokal; baris diberi keterangan "data 2026-10-03 23.00" di berkas.</p>`)}`);
}

export const halamanDesktop = { 'antrean-validasi': antrean, 'tahan-prediksi': tahan, 'bandingkan-model': model, 'kelola-rekomendasi': rekomendasi, ekspor };
