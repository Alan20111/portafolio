// Captura cada proyecto en tamaño teléfono (390×844) y laptop (1440×900) a 2× para las portadas.
// temas: true → el sitio tiene modo claro y oscuro: la laptop se captura en oscuro y el teléfono en claro.
// Uso: node capturar.mjs [slug ...]   (sin argumentos captura todos)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const LOCAL = 'http://localhost:4173';
const objetivos = [
  { slug: 'evaluafacil', tel: 'https://www.evaluafacil.mx/' }, // laptop: captura del panel docente (la app pide sesión)
  { slug: 'bazargirl', tel: 'https://bazargirl.pages.dev/', lap: 'https://bazargirl.pages.dev/', bajar: true, temas: true }, // catálogo real: se baja hasta los productos
  { slug: 'cafeluna', tel: 'https://cafeluna.pages.dev/t', lap: 'https://cafeluna.pages.dev/admin' },
  { slug: 'mediconsulta', lap: `${LOCAL}/demos/mediconsulta/` },
  { slug: 'aglaia', tel: 'https://aglaianails.pages.dev/', lap: 'https://aglaianails.pages.dev/', temas: true },
  { slug: 'rawssport', tel: 'https://rawssport.pages.dev/', lap: 'https://rawssport.pages.dev/', temas: true, telScroll: 520 }, // el hero es oscuro en ambos temas: el teléfono baja a los productos
  { slug: 'koncafe', tel: `${LOCAL}/demos/koncafe/app-cliente`, lap: `${LOCAL}/demos/koncafe/dashboard` },
];

mkdirSync('cap', { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true, args: ['--hide-scrollbars'],
});
async function toma(url, archivo, movil, bajar, tema, scrollY = 0) {
  const p = await browser.newPage();
  await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: tema || 'light' }]);
  await p.setViewport(movil ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1.5 });
  if (movil) await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1');
  try { await p.goto(url, { waitUntil: 'networkidle0', timeout: 45000 }); } catch (e) { console.log('  (timeout de red, sigo)', url); }
  await new Promise((r) => setTimeout(r, 2500));
  if (bajar) { const y = await p.evaluate(() => { const c = [...document.querySelectorAll('img')].find((i) => i.getBoundingClientRect().top > 250 && i.naturalWidth > 100); return c ? c.getBoundingClientRect().top + scrollY - 160 : 0; }); await p.evaluate((y) => scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 1500)); }
  if (scrollY) { await p.evaluate((y) => scrollTo(0, y), scrollY); await new Promise((r) => setTimeout(r, 1200)); }
  await p.evaluate(() => { const v = document.getElementById('volver-demo'); if (v) v.remove(); });
  await p.screenshot({ path: archivo });
  await p.close();
  console.log('📸', archivo);
}
const solo = process.argv.slice(2);
for (const o of objetivos.filter((x) => !solo.length || solo.includes(x.slug))) {
  if (o.tel) await toma(o.tel, `cap/${o.slug}-tel.png`, true, o.bajar, 'light', o.telScroll);
  if (o.lap) await toma(o.lap, `cap/${o.slug}-lap.png`, false, o.bajar, o.temas ? 'dark' : 'light');
}
await browser.close();
