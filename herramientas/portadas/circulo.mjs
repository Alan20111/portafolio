// Recorta una foto en círculo con fondo transparente (PNG 600×600) para el CV y las tarjetas.
// Uso: node circulo.mjs <entrada.jpg> <salida.png>
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync } from 'node:fs';

const [entrada, salida] = process.argv.slice(2);
const src = 'data:image/jpeg;base64,' + readFileSync(entrada).toString('base64');
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const p = await b.newPage();
const png = await p.evaluate(async (src) => {
  const i = new Image(); i.src = src; await i.decode();
  const n = 600, c = document.createElement('canvas'); c.width = c.height = n;
  const x = c.getContext('2d');
  x.beginPath(); x.arc(n / 2, n / 2, n / 2, 0, Math.PI * 2); x.closePath(); x.clip();
  x.drawImage(i, 0, 0, n, n);
  return c.toDataURL('image/png').split(',')[1];
}, src);
writeFileSync(salida, Buffer.from(png, 'base64'));
await b.close();
console.log('ok', salida);
