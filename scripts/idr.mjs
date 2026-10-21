// Implementasi acuan format angka IDR (pemisah titik) untuk menguji spesifikasi tokens/format-angka.md.
// Bukan kode produk: klien (titeny-web, titeny-app-kmp) memiliki implementasinya sendiri.
export function formatIdr(n, { awalan = false } = {}) {
  if (!Number.isInteger(n)) throw new Error('uang harus integer IDR (tanpa pecahan)');
  const neg = n < 0 ? '-' : '';
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${neg}${awalan ? 'Rp ' : ''}${s}`;
}
