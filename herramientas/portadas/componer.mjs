// Compone la portada de cada caso con dispositivos y la exporta:
//   out/<slug>.webp  1600×1000  (tarjetas y página del caso; 2× para pantallas retina)
//   out/<slug>.jpg   1200×750   (vista previa en WhatsApp/redes, que no siempre aceptan WebP)
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CAP = resolve('cap');
const PANT = process.env.GYM_PANTALLAS; // capturas de la app Android de GymMachine
const portadas = {
  evaluafacil: { lap: process.env.EF_PANEL, tel: `${CAP}/evaluafacil-tel.png` },
  bazargirl: { lap: `${CAP}/bazargirl-lap.png`, tel: `${CAP}/bazargirl-tel.png` },
  cafeluna: { lap: `${CAP}/cafeluna-lap.png`, tel: `${CAP}/cafeluna-tel.png` },
  mediconsulta: { lap: `${CAP}/mediconsulta-lap.png` },
  aglaia: { lap: `${CAP}/aglaia-lap.png`, tel: `${CAP}/aglaia-tel.png` },
  rawssport: { lap: `${CAP}/rawssport-lap.png`, tel: `${CAP}/rawssport-tel.png` },
  koncafe: { lap: `${CAP}/koncafe-lap.png`, tel: `${CAP}/koncafe-tel.png` },
  gymmachine: { tres: [`${PANT}/12-miembro-dieta.jpg`, `${PANT}/11-miembro-rutina.jpg`, `${PANT}/30-dueno-inicio.jpg`] },
};

// Dispositivos (mismos que los visores de demo). pos = { left, top, w, rot }
const laptop = (src, { left, top, w }) => `
<div class="lap" style="left:${left}px;top:${top}px;width:${w}px">
  <div class="pantalla"><img src="file://${src}"></div>
  <div class="base"><i></i></div>
</div>`;
const telefono = (src, { left, top, w, rot = 0 }, clase = '') =>
  `<div class="tel ${clase}" style="left:${left}px;top:${top}px;width:${w}px;transform:rotate(${rot}deg)"><img src="file://${src}"></div>`;

const css = `
*{margin:0;box-sizing:border-box}
body{width:1600px;height:1000px;background:#ece9e4;overflow:hidden;position:relative}
.lap{position:absolute}
.lap .pantalla{background:#0b0b10;border-radius:26px 26px 0 0;padding:20px 20px 26px;box-shadow:0 0 0 2px #2a2a33 inset}
.lap .pantalla img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;border-radius:6px}
.lap .base{height:26px;margin:0 -64px;background:linear-gradient(#d7d4ce,#b9b5ae);border-radius:0 0 22px 22px;position:relative;box-shadow:0 26px 50px -22px rgba(0,0,0,.45)}
.lap .base i{position:absolute;left:50%;top:0;width:180px;height:10px;margin-left:-90px;background:#a8a49d;border-radius:0 0 10px 10px}
.tel{position:absolute;padding:12px;border-radius:52px;background:#0b0b10;box-shadow:0 0 0 2px #2a2a33 inset,0 30px 60px -24px rgba(0,0,0,.5)}
.tel img{display:block;width:100%;aspect-ratio:390/844;object-fit:cover;object-position:top;border-radius:40px}
.tel.g img{aspect-ratio:540/1200}
`;

function html(p) {
  let cuerpo;
  if (p.tres) {
    cuerpo = telefono(p.tres[0], { left: 230, top: 200, w: 360, rot: -4 }, 'g')
      + telefono(p.tres[2], { left: 1010, top: 200, w: 360, rot: 4 }, 'g')
      + telefono(p.tres[1], { left: 605, top: 80, w: 390 }, 'g');
  } else if (p.tel) {
    cuerpo = laptop(p.lap, { left: 150, top: 160, w: 1080 }) + telefono(p.tel, { left: 1140, top: 290, w: 300 });
  } else {
    cuerpo = laptop(p.lap, { left: 210, top: 130, w: 1180 });
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${cuerpo}</body></html>`;
}

mkdirSync('out', { recursive: true });
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--allow-file-access-from-files'] });
const pg = await b.newPage();
await pg.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
for (const [slug, p] of Object.entries(portadas)) {
  const faltan = [p.lap, p.tel, ...(p.tres || [])].filter((x) => x && !existsSync(x));
  if (faltan.length) { console.log('✗', slug, 'falta', faltan); continue; }
  writeFileSync(resolve(`tmp-${slug}.html`), html(p));
  await pg.goto(`file://${resolve(`tmp-${slug}.html`)}`, { waitUntil: 'load' });
  await pg.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await pg.screenshot({ path: `out/${slug}.webp`, type: 'webp', quality: 84 });
  await pg.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 0.75 });
  await pg.screenshot({ path: `out/${slug}.jpg`, type: 'jpeg', quality: 84 });
  await pg.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 });
  console.log('🖼 ', slug);
}
await b.close();
