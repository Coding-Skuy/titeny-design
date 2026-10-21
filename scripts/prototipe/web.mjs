// Prototipe 3 papan web (petani/vendor/CEO) + Landing Peran + Masuk, target 360 px. Data = contoh ilustrasi.
import { esc, formatIdr, lencana, banner, tabel, detailTabel, grafikGaris, navPeran, varian, halaman, bannerTimeout, bannerMemuat } from './lib.mjs';

const kepalaHalaman = (judul, sub) => `<header class="header"><span class="merek">Titeny</span><span class="ket">Papan insight · ${esc(sub)}</span></header><h1>${esc(judul)}</h1>`;
const catatContoh = '<p class="ket">Data pada prototipe ini adalah contoh ilustrasi, bukan data nyata. Ambang status ditetapkan backend; desain hanya memetakan status ke warna + teks + bentuk.</p>';
const stempel = '<p class="ket">Diperbarui <time datetime="2026-10-04T04:10:00+07:00">4 Okt 2026 04.10</time> · cache 6 jam</p>';

const bulat100 = (v) => Math.round(v / 100) * 100;

// ---------------------------------------------------------------- PETANI
function kartuHarga() {
  const p50 = [43100, 44200, 45900, 46300, 45800, 44900, 44000];
  const nilai = [42500, ...p50];
  const lo = [42500, ...p50.map((v, i) => bulat100(v * (0.97 - i * 0.006)))];
  const hi = [42500, ...p50.map((v, i) => bulat100(v * (1.03 + i * 0.008)))];
  const x = ['Ini', 'H+1', '', 'H+3', '', 'H+5', '', 'H+7'];
  const svg = grafikGaris({
    id: 'grafik-harga',
    judul: 'Harga cabai merah hari ini dan prediksi H+1 sampai H+7 dengan rentang P10 sampai P90',
    tabelId: 'tabel-harga',
    xLabel: x,
    fmtY: (v) => formatIdr(Math.round(v / 100) * 100),
    panel: { y0: 40000, y1: 50000, tinggi: 150, pita: { lo, hi }, seri: [{ nama: 'Prediksi (P50)', nilai, kelas: 'gl', putus: true, titik: true, label: 'Prediksi P50' }] },
  });
  const baris = ['Hari ini', 'H+1', 'H+2', 'H+3', 'H+4', 'H+5', 'H+6', 'H+7'].map((h, i) => [h, formatIdr(nilai[i]), formatIdr(lo[i]), formatIdr(hi[i])]);
  const t = tabel({ id: 'tabel-harga', caption: 'Harga cabai merah (Rp/kg): hari ini dan prediksi', kepala: ['Hari', 'P50', 'P10', 'P90'], baris, kanan: [1, 2, 3] });
  return `<section class="kartu" id="kartu-harga" aria-labelledby="h-harga"><h2 id="h-harga">Harga</h2>
<p class="ket">Cabai merah · Kab. A · Rp/kg</p>
<p class="angka-besar">42.500 <span class="ket">hari ini</span></p>
${svg}
<ul class="legenda"><li>━ ━ Prediksi (P50), titik = nilai harian</li><li>▒ Rentang P10–P90</li></ul>
${detailTabel('Tabel data grafik (teks alternatif)', t)}
</section>`;
}

function kartuKeputusan(kode = 'tahan-3-hari', tambahan = '', sufiks = '') {
  const alasan = {
    'tahan-3-hari': 'Harga H+3 diprediksi 45.900, naik 8% dari hari ini (42.500), kepercayaan sedang.',
    'jual-sekarang': 'Harga diprediksi turun lebih dari 8% dalam 3 hari; jual lebih awal mengurangi risiko.',
    'cicil-jual': 'Perubahan harga di bawah 8%; jual bertahap menyebar risiko.',
  }[kode];
  return `<section class="kartu" id="kartu-keputusan${sufiks}" aria-labelledby="h-keputusan${sufiks}"><h2 id="h-keputusan${sufiks}">Keputusan</h2>
<p>${lencana(kode)} ${tambahan}</p><p>${esc(alasan)}</p></section>`;
}

function kartuCuacaPanen() {
  const hujan = tabel({ id: 'tabel-hujan', caption: 'Hujan 7 hari ke depan (mm)', kepala: ['Hari', '1', '2', '3', '4', '5', '6', '7'], baris: [['mm', '0', '2', '12', '25', '8', '0', '1']], kanan: [1, 2, 3, 4, 5, 6, 7] });
  const panen = tabel({ id: 'tabel-panen', caption: 'Panen prediksi kabupaten (ton per minggu)', kepala: ['Minggu', 'Ton'], baris: [['M+1', '12'], ['M+2', '18'], ['M+3', '25'], ['M+4', '20']], kanan: [1] });
  return `<section class="kartu" id="kartu-cuaca-panen" aria-labelledby="h-cuaca"><h2 id="h-cuaca">Cuaca dan panen</h2>
<p>Risiko hujan lebat hari ke-4: ${lencana('waspada', 'Waspada hujan lebat')}</p>
${hujan}${panen}</section>`;
}

const kartuAksi = `<section class="kartu" id="kartu-aksi" aria-labelledby="h-aksi"><h2 id="h-aksi">Tindak lanjut</h2>
<a class="tombol penuh" href="#">Tawarkan ke gudang</a>
<p class="ket" style="margin-top:8px">Membuka form TitipO/Lumbung. Titeny tidak memproses jual-beli.</p></section>`;

const filterPetani = `<form class="kartu" aria-label="Pilih komoditas dan kabupaten"><div class="baris-form"><label for="kom">Komoditas</label><select id="kom"><option>Cabai merah</option></select></div><div class="baris-form" style="margin:0"><label for="kab">Kabupaten</label><select id="kab"><option>Kab. A</option></select></div></form>`;

export function petani() {
  const utama = `${navPeran('petani')}${catatContoh}${filterPetani}${stempel}${kartuHarga()}${kartuKeputusan()}${kartuCuacaPanen()}${kartuAksi}`;
  const kurang = `<section class="kartu kosong" aria-labelledby="h-kurang"><span class="lencana f-netral"><b aria-hidden="true">○</b> Data harga belum cukup</span><h2 id="h-kurang">Prediksi belum dapat ditampilkan</h2><p>Data harga untuk komoditas ini kosong 3 hari atau lebih. Coba komoditas lain atau kembali besok.</p></section>
<p class="ket">Kartu keputusan disembunyikan sampai data cukup; kartu cuaca-panen tetap tampil.</p>`;
  const akurasi = `<section class="kartu"><h2>Keputusan</h2><p>${lencana('cicil-jual')} ${lencana('akurasi-terbatas')}</p><p>Kepercayaan prediksi rendah; perlakukan sebagai perkiraan kasar. Tabel dan rentang P10–P90 tetap ditampilkan.</p></section>`;
  const timeout = `${bannerTimeout()}<section class="kartu"><h2>Harga</h2><p class="ket">Data tersimpan 3 Okt 2026 23.00</p><p class="angka-besar">41.900</p></section>`;
  return halaman({
    judul: 'Papan petani — Titeny (prototipe 360 px)',
    isi: `<div class="halaman">${kepalaHalaman('Papan petani', 'Kapan jual / tahan?')}${utama}
${varian('Data harga belum cukup (S1 kosong ≥ 3 hari)', kurang)}
${varian('Keputusan lain: JUAL SEKARANG dan CICIL JUAL', kartuKeputusan('jual-sekarang', '', '-2') + kartuKeputusan('cicil-jual', '', '-3'))}
${varian('Akurasi terbatas (kepercayaan rendah)', akurasi)}
${varian('Memuat (batas 12 detik, bukan spinner tanpa batas)', bannerMemuat())}
${varian('Timeout 12 detik: cache terakhir + stempel waktu', timeout)}</div>`,
  });
}

// ---------------------------------------------------------------- VENDOR
const barisVendor = [
  ['Cabai merah', 43100, 140, 5, 'defisit'],
  ['Bawang merah', 38000, 210, 10, 'waspada'],
  ['Tomat', 12500, 280, 60, 'waspada'],
  ['Kentang', 16800, 175, 20, 'seimbang'],
  ['Wortel', 11200, 98, 14, 'seimbang'],
];
export const saranStok = (demand7, stok) => Math.max(0, Math.round((demand7 / 7) * 1.15 - stok));

export function vendor() {
  const stokForm = barisVendor.map(([k, , , stok], i) => `<div class="baris-form"><label for="stok${i}">Stok di tangan: ${esc(k)} (kg)</label><input id="stok${i}" inputmode="numeric" value="${stok}"></div>`).join('');
  const tbl = tabel({
    id: 'tabel-besok',
    caption: 'Tabel besok · Zona 3 · 5 Okt 2026',
    kepala: ['komoditas', 'harga besok', 'demand H+7 (kg)', 'saran stok (kg)'],
    lebar: ['31%', '23%', '23%', '23%'],
    kanan: [1, 2, 3],
    baris: barisVendor.map(([k, h, d, s, st]) => [`${esc(k)}<br>${lencana(st, undefined).replace('class="lencana', 'class="lencana')}`, formatIdr(h), String(d), String(saranStok(d, s))]),
  });
  const utama = `${navPeran('vendor')}${catatContoh}
<form class="kartu" aria-label="Pilih zona dan komoditas"><div class="baris-form" style="margin:0"><label for="zona">Zona</label><select id="zona"><option>Zona 3</option></select></div></form>
${stempel}
<section class="kartu" aria-labelledby="h-warn"><h2 id="h-warn">Peringatan zona</h2>
<p>${lencana('defisit', 'Defisit: cabai merah')}</p><p>${lencana('waspada', 'Waspada: bawang merah (defisit ringan), tomat (surplus)')}</p><p>${lencana('seimbang', 'Seimbang: kentang, wortel')}</p></section>
<section class="kartu" aria-labelledby="h-tabel"><h2 id="h-tabel">Besok</h2>
<p class="ket">Harga dalam Rp/kg. Saran stok = demand harian rerata × 1,15 − stok di tangan.</p>${tbl}</section>
<section class="kartu" aria-labelledby="h-stok"><h2 id="h-stok">Stok di tangan</h2><p class="ket">Disimpan di perangkat ini saja.</p>${stokForm}</section>`;
  const estimasi = `${banner('estimasi', 'Harga dan demand dihitung dari data hingga kemarin sore. Angka akan diperbarui otomatis saat data masuk.', 'Estimasi')}
<p>${lencana('estimasi')}</p><p class="ket">Teks "Estimasi — transaksi kemarin belum masuk" muncul di atas tabel dan di setiap sel angka yang terdampak ditandai "~".</p>
<table><caption>Cuplikan tabel (angka bertanda ~ = estimasi)</caption><thead><tr><th scope="col">komoditas</th><th scope="col" class="n">saran stok (kg)</th></tr></thead><tbody><tr><th scope="row">Cabai merah</th><td class="n">~18</td></tr></tbody></table>`;
  const timeout = `${bannerTimeout()}<p class="ket">Tabel besok menampilkan angka dari cache; kolom saran stok tetap dihitung ulang dari stok di tangan.</p>`;
  const kosong = `<section class="kartu kosong"><span class="lencana f-netral"><b aria-hidden="true">○</b> Data harga belum cukup</span><p>Tidak ada baris untuk zona dan komoditas yang dipilih.</p></section>`;
  return halaman({
    judul: 'Papan vendor — Titeny (prototipe 360 px)',
    isi: `<div class="halaman">${kepalaHalaman('Papan vendor', 'Stok berapa untuk besok?')}${utama}
${varian('Estimasi — transaksi kemarin belum masuk (S3 telat)', estimasi)}
${varian('Data harga belum cukup', kosong)}
${varian('Timeout 12 detik: cache terakhir + stempel waktu', timeout)}</div>`,
  });
}

// ---------------------------------------------------------------- CEO
const komoditas12 = ['Cabai merah', 'Cabai rawit', 'Bawang merah', 'Bawang putih', 'Tomat', 'Kentang', 'Wortel', 'Kubis', 'Buncis', 'Jagung', 'Telur', 'Beras'];
const kab5 = ['A', 'B', 'C', 'D', 'E'];
const statusSel = (i, j) => {
  const v = ((i * 7 + j * 13 + 5) % 41) - 20;
  const st = v <= -10 ? 'defisit' : v <= -3 ? 'waspada' : v >= 15 ? 'waspada' : 'seimbang';
  return { v, st };
};
const warnaSel = { seimbang: 'hijau', waspada: 'kuning', defisit: 'merah' };
const tanda = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : '0');

function matriks() {
  const kepala = `<span></span>${kab5.map((k) => `<span class="kepala-matriks">Kab. ${k}</span>`).join('')}`;
  const baris = komoditas12
    .map((k, i) => `<span class="baris-matriks">${esc(k)}</span>${kab5.map((kb, j) => { const { v, st } = statusSel(i, j); const bentuk = { seimbang: '●', waspada: '▲', defisit: '■' }[st]; const nama = { seimbang: 'Seimbang', waspada: 'Waspada', defisit: 'Defisit' }[st]; return `<span class="sel-matriks f-${warnaSel[st]}" role="img" aria-label="${esc(k)}, Kab. ${kb}: ${nama}, selisih ${tanda(v)} persen"><b aria-hidden="true">${bentuk}</b>${tanda(v)}</span>`; }).join('')}`)
    .join('');
  const alt = tabel({
    id: 'tabel-matriks',
    caption: 'Selisih suplai-demand (%) dan status per komoditas dan kabupaten',
    kepala: ['Komoditas', ...kab5.map((k) => `Kab. ${k}`)],
    kanan: [1, 2, 3, 4, 5],
    baris: komoditas12.map((k, i) => [esc(k), ...kab5.map((_, j) => { const { v, st } = statusSel(i, j); return `${tanda(v)} ${{ seimbang: 'Seimbang', waspada: 'Waspada', defisit: 'Defisit' }[st].slice(0, 3)}.`; })]),
  });
  return `<section class="kartu" id="kartu-matriks" aria-labelledby="h-matriks"><h2 id="h-matriks">Peta surplus / defisit</h2>
<p class="ket">5 kabupaten × 12 komoditas, ditampilkan transposisi (baris = komoditas) agar muat 360 px. Angka = selisih suplai-demand (%).</p>
<div class="matriks" role="group" aria-label="Matriks surplus defisit">${kepala}${baris}</div>
<ul class="legenda"><li>${lencana('seimbang')}</li><li>${lencana('waspada')}</li><li>${lencana('defisit')}</li></ul>
${detailTabel('Tabel data matriks (teks alternatif)', alt)}</section>`;
}

function kurvaS10() {
  const hari = Array.from({ length: 30 }, (_, i) => i + 1);
  const omzet = hari.map((h) => Math.round(520 + h * 4 + 35 * Math.sin(h / 3) + (h > 12 ? 25 : 0)));
  const margin = hari.map((h) => +(18 - h * 0.05 + 2.5 * Math.cos(h / 4) - (h > 21 ? 1.2 : 0)).toFixed(1));
  const x = hari.map((h) => (h === 1 || h % 7 === 0 ? String(h) : ''));
  const a = grafikGaris({
    id: 'grafik-s10',
    judul: 'Omzet harian (juta rupiah) dan margin (persen) 30 hari terakhir dengan dua anotasi intervensi',
    tabelId: 'tabel-s10',
    xLabel: x,
    fmtY: (v) => String(Math.round(v)),
    tickY: 2,
    anotasi: [{ i: 11, nomor: 1 }, { i: 20, nomor: 2 }],
    panel: { y0: 500, y1: 700, tinggi: 90, seri: [{ nama: 'Omzet', nilai: omzet, kelas: 'gl', label: 'Omzet (juta Rp)' }] },
    bawah: 6,
  });
  const b = grafikGaris({
    id: 'grafik-s10-margin',
    judul: 'Margin harian (persen) 30 hari terakhir',
    tabelId: 'tabel-s10',
    xLabel: x,
    fmtY: (v) => v.toFixed(0) + '%',
    tickY: 2,
    anotasi: [{ i: 11, nomor: 1 }, { i: 20, nomor: 2 }],
    panel: { y0: 12, y1: 22, tinggi: 90, seri: [{ nama: 'Margin', nilai: margin, kelas: 'gr', putus: true, label: 'Margin (%)' }] },
    atas: 12,
  });
  const t = tabel({
    id: 'tabel-s10',
    caption: 'Omzet (juta Rp) dan margin (%) per hari, 30 hari terakhir',
    kepala: ['Hari', 'Omzet', 'Margin'],
    kanan: [1, 2],
    baris: hari.map((h, i) => [String(h), String(omzet[i]), margin[i].toFixed(1).replace('.', ',')]),
  });
  return `<section class="kartu" id="kartu-s10" aria-labelledby="h-s10"><h2 id="h-s10">Kurva omzet vs margin 30 hari</h2>
<p class="ket">Atas: omzet (garis solid). Bawah: margin (garis putus-putus). Angka dalam lingkaran = intervensi.</p>
${a}${b}
<ol class="ket" style="padding-left:20px;margin:8px 0 0"><li>Hari 12: promo kubis Kab. C.</li><li>Hari 21: pasok tambahan cabai merah Kab. A.</li></ol>
${detailTabel('Tabel data grafik (teks alternatif)', t)}</section>`;
}

const rek = [
  ['Tambah pasok cabai merah ke Kab. A', 'Defisit 3 hari berturut-turut', 'baru'],
  ['Alihkan stok tomat dari Kab. C ke Kab. B', 'Surplus Kab. C, defisit Kab. B', 'dikerjakan'],
  ['Tahan penawaran bawang merah Kab. D', 'Harga diprediksi turun 8%', 'baru'],
  ['Jadwalkan panen kubis Kab. E lebih awal', 'Prediksi panen M+2 melonjak', 'dikerjakan'],
  ['Audit data harga jagung Kab. B', 'Akurasi terbatas 2 minggu', 'selesai'],
];
function rekomendasi() {
  return `<section class="kartu" id="kartu-rekomendasi" aria-labelledby="h-rek"><h2 id="h-rek">5 rekomendasi prioritas</h2>
${rek.map(([j, a, s], i) => `<article class="rekomendasi" aria-label="Rekomendasi ${i + 1}"><h3>${i + 1}. ${esc(j)}</h3><p class="ket">${esc(a)}</p><p>${lencana(s)}</p><a class="tombol sekunder" href="#" aria-label="Ubah status rekomendasi ${i + 1}">Ubah status</a></article>`).join('')}</section>`;
}

const tabRingkasan = (aktif) => `<div class="tab" role="tablist" aria-label="Bagian papan CEO"><button role="tab" id="tab-ringkasan" aria-selected="${aktif === 'ringkasan'}" aria-controls="panel-ringkasan">Ringkasan</button><button role="tab" id="tab-akurasi" aria-selected="${aktif === 'akurasi'}" aria-controls="panel-akurasi">Akurasi</button></div>`;

function tabAkurasi() {
  const mape = komoditas12.map((k, i) => [k, ...[0, 1, 2, 3].map((w) => +(6 + ((i * 5 + w * 3) % 9) + (i % 4 === 0 ? 1.5 : 0)).toFixed(1))]);
  const t = tabel({
    id: 'tabel-akurasi',
    caption: 'MAPE H+7 (%) per komoditas, 4 minggu terakhir (target ≤ 12%)',
    kepala: ['Komoditas', 'M−3', 'M−2', 'M−1', 'Ini'],
    kanan: [1, 2, 3, 4],
    baris: mape.map(([k, ...v]) => [esc(k) + (v[3] > 12 ? `<br>${lencana('waspada', 'Di atas target')}` : ''), ...v.map((x) => x.toFixed(1).replace('.', ','))]),
  });
  return `<section class="kartu" id="panel-akurasi" role="tabpanel" aria-labelledby="tab-akurasi"><h2>Jejak akurasi</h2><p class="ket">MAPE H+7 per komoditas. Lencana muncul bila minggu ini di atas target 12%.</p>${t}</section>`;
}

export function ceo() {
  const utama = `${navPeran('ceo')}${catatContoh}${stempel}${tabRingkasan('ringkasan')}<div id="panel-ringkasan" role="tabpanel" aria-labelledby="tab-ringkasan">${matriks()}${kurvaS10()}${rekomendasi()}</div>`;
  const akurasi = `${tabRingkasan('akurasi')}${tabAkurasi()}`;
  const dialog = `<section class="kartu" role="dialog" aria-label="Ubah status rekomendasi 1"><h2>Ubah status rekomendasi 1</h2><div class="rek-dialog"><div class="baris-form"><label for="st">Status baru</label><select id="st"><option>Dikerjakan</option></select></div><div class="baris-form"><label for="cat">Catatan (wajib)</label><textarea id="cat" aria-describedby="cat-ket"></textarea><p class="ket" id="cat-ket">Catatan wajib diisi sebelum menyimpan.</p></div><button class="tombol penuh" disabled>Simpan</button></div></section>`;
  const timeout = `${bannerTimeout()}<p class="ket">CEO memakai revalidasi 15 menit; peta dan rekomendasi tampil dari cache dengan stempel waktu.</p>`;
  const kurang = `<section class="kartu kosong"><span class="lencana f-netral"><b aria-hidden="true">○</b> Data harga belum cukup</span><p>Sel matriks dengan data kurang tampil “○ —” bukan warna; baris tetap dapat dibuka.</p></section>`;
  return halaman({
    judul: 'Papan CEO — Titeny (prototipe 360 px)',
    isi: `<div class="halaman">${kepalaHalaman('Papan CEO', 'Margin aman? Intervensi di mana?')}${utama}
${varian('Tab Akurasi (jejak MAPE H+7 4 minggu)', akurasi)}
${varian('Ubah status rekomendasi dengan catatan', dialog)}
${varian('Data kurang pada sel matriks', kurang)}
${varian('Memuat (batas 12 detik)', bannerMemuat())}
${varian('Timeout 12 detik: cache terakhir + stempel waktu', timeout)}</div>`,
  });
}

// ---------------------------------------------------------------- LANDING + MASUK
export function landing() {
  const kartu = (k, judul, tanya, akses) => `<a class="kartu" href="masuk.html#${k}" style="display:block;color:inherit;text-decoration:none"><h2>${judul}</h2><p>${tanya}</p><p class="ket">${akses}</p><span class="tombol penuh">Buka papan ${judul.toLowerCase()}</span></a>`;
  return halaman({
    judul: 'Pilih peran — Titeny (prototipe 360 px)',
    isi: `<div class="halaman">${kepalaHalaman('Pilih peran', 'Landing Peran')}${kartu('petani', 'Petani', 'Kapan jual atau tahan?', 'Tautan + PIN zona')}${kartu('vendor', 'Vendor', 'Stok berapa untuk besok?', 'Tautan + PIN zona')}${kartu('ceo', 'CEO / Operasional', 'Margin aman? Intervensi di mana?', 'Akun + OTP')}</div>`,
  });
}

export function masuk() {
  const pin = `<section class="kartu" id="petani" aria-labelledby="h-pin"><h2 id="h-pin">Masuk petani / vendor</h2><div class="baris-form"><label for="pin">PIN zona (6 digit)</label><input id="pin" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-describedby="pin-ket"><p class="ket" id="pin-ket">PIN dari tautan yang Anda terima.</p></div><button class="tombol penuh">Masuk</button></section>`;
  const pinSalah = `<section class="kartu"><h2>Masuk petani / vendor</h2><div class="baris-form"><label for="pin2">PIN zona (6 digit)</label><input id="pin2" inputmode="numeric" value="12345" aria-invalid="true" aria-describedby="pin-err"></div>${banner('defisit', 'PIN harus 6 digit angka dan sesuai zona.', 'PIN tidak valid').replace('<div class="banner', '<div id="pin-err" class="banner')}<button class="tombol penuh">Masuk</button></section>`;
  const ceoForm = `<section class="kartu" id="ceo" aria-labelledby="h-ceo"><h2 id="h-ceo">Masuk CEO</h2><div class="baris-form"><label for="surel">Akun</label><input id="surel" type="email" autocomplete="username"></div><div class="baris-form"><label for="otp">Kode OTP</label><input id="otp" inputmode="numeric" maxlength="6" autocomplete="one-time-code"></div><button class="tombol penuh">Masuk</button></section>`;
  return halaman({
    judul: 'Masuk — Titeny (prototipe 360 px)',
    isi: `<div class="halaman">${kepalaHalaman('Masuk', 'Akses per peran')}${pin}${varian('PIN salah', pinSalah)}${varian('CEO: akun + OTP', ceoForm)}</div>`,
  });
}

export const halamanWeb = { landing, masuk, petani, vendor, ceo };
