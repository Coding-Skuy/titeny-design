// Membangun prototipe statis ke src/prototipe/<set>/*.html. Pemakaian: node scripts/bangun-prototipe.mjs web|desktop|semua
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const akar = join(dirname(fileURLToPath(import.meta.url)), '..');
const set = process.argv[2] ?? 'semua';

async function tulis(nama, modul) {
  const dir = join(akar, 'src/prototipe', nama);
  mkdirSync(dir, { recursive: true });
  for (const [k, fn] of Object.entries(modul)) writeFileSync(join(dir, `${k}.html`), fn());
  console.log(`${nama}: ${Object.keys(modul).length} berkas`);
}

if (set === 'web' || set === 'semua') await tulis('web', (await import('./prototipe/web.mjs')).halamanWeb);
if (set === 'desktop' || set === 'semua') {
  try {
    await tulis('desktop', (await import('./prototipe/desktop.mjs')).halamanDesktop);
  } catch (e) {
    if (set === 'desktop' || e.code !== 'ERR_MODULE_NOT_FOUND') throw e;
  }
}
