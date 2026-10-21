// Mengukur lebar tata letak sebuah halaman statis pada viewport sebenarnya (iframe 360 px) dengan Chrome headless.
// Chrome headless membatasi jendela >= 500 px, jadi halaman dimuat di dalam iframe selebar target.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, basename, resolve } from 'node:path';

const KANDIDAT = [
  process.env.CHROME_BIN,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export function cariChrome() {
  return KANDIDAT.find((p) => existsSync(p)) ?? null;
}

const SKRIP = `<script>
(function(){
  function lapor(){
    var k=[].slice.call(document.querySelectorAll('body *')).filter(function(e){var r=e.getBoundingClientRect();return r.right>innerWidth+0.5&&r.width>0;}).slice(0,5).map(function(e){return e.tagName.toLowerCase()+(e.className?'.'+e.className:'');});
    parent.postMessage(JSON.stringify({iw:innerWidth,sw:document.documentElement.scrollWidth,bw:document.body.scrollWidth,pelanggar:k}),'*');
  }
  if(document.readyState==='complete')lapor();else addEventListener('load',lapor);
})();
</script>`;

/** @returns {{iw:number, sw:number, bw:number, pelanggar:string[]}} */
export function ukurLebar(berkasHtml, lebar = 360, tinggi = 900) {
  const chrome = cariChrome();
  if (!chrome) throw new Error('Chrome tidak ditemukan (set CHROME_BIN)');
  const sumber = resolve(berkasHtml);
  const dir = dirname(sumber);
  const salinan = join(dir, `.ukur-${basename(sumber)}`);
  const pembungkus = join(dir, `.ukur-wrap-${basename(sumber)}`);
  const html = readFileSync(sumber, 'utf8').replace('</body>', `${SKRIP}</body>`);
  writeFileSync(salinan, html);
  writeFileSync(
    pembungkus,
    `<!doctype html><body style="margin:0"><iframe src="${basename(salinan)}" width="${lebar}" height="${tinggi}" style="border:0"></iframe><script>addEventListener('message',function(e){document.body.setAttribute('data-hasil',e.data)})</script></body>`,
  );
  try {
    const profil = mkdtempSync(join(tmpdir(), 'ttn-chrome-'));
    const keluar = execFileSync(
      chrome,
      ['--headless=new', '--disable-gpu', '--no-sandbox', `--user-data-dir=${profil}`, '--window-size=900,1000', '--virtual-time-budget=800', '--dump-dom', `file://${pembungkus}`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 },
    );
    const m = /data-hasil="([^"]*)"/.exec(keluar);
    if (!m) throw new Error('tidak ada hasil ukur untuk ' + berkasHtml);
    return JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  } finally {
    for (const f of [salinan, pembungkus]) {
      try { execFileSync('rm', ['-f', f]); } catch {}
    }
  }
}
