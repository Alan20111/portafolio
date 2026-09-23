// Componentes compartidos del sitio. Cada función devuelve HTML listo para insertar.
// `base` es la ruta a la raíz desde la página que los usa: '' en la principal, '../' en /casos/.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitio } from './datos.mjs';
import { fuentesHead } from './estilos.mjs';

export const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const wa = (texto = sitio.mensajeWhatsApp) => `https://wa.me/${sitio.telefonoE164}?text=${encodeURIComponent(texto)}`;
export const waCaso = (c) => wa(`Hola Alan, vi el caso de ${c.nombre} y quiero algo parecido para mi negocio`);

// /img/ y /assets/ se sirven con caché de un año (vercel.json): la URL lleva una huella del archivo
export const v = (rel) => {
  try { return `${rel}?v=${createHash('sha1').update(readFileSync(join(raiz, rel))).digest('hex').slice(0, 8)}`; } catch { return rel; }
};

export const ESTADOS = {
  produccion: { txt: 'En producción', cls: 'e-prod' },
  entregado: { txt: 'Entregado', cls: 'e-prod' },
  propuesta: { txt: 'Propuesta', cls: 'e-prop' },
  demo: { txt: 'Demo en vivo', cls: 'e-demo' },
  academico: { txt: 'Académico', cls: 'e-acad' },
};
export const nombrePdf = (c) => `Caso-${c.nombre.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}.pdf`;

/* ---------- Iconos ---------- */
export const ico = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.54 0 8.23 3.7 8.23 8.24 0 4.54-3.7 8.23-8.23 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  sol: '<svg class="sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  luna: '<svg class="luna" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
  gh: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
};

/* ---------- <head> común: metadatos, tema sin parpadeo, fuentes ---------- */
export const cabecera = ({ titulo, descripcion, canonical, og, base = '', tipo = 'website', extra = '' }) => `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="${tipo}"><meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="Alan Méndez · Software a medida">
<meta property="og:title" content="${esc(titulo)}"><meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#171721" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f5f5f7" media="(prefers-color-scheme: light)">
<script>try{var t=localStorage.getItem('tema');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}</script>
<link rel="icon" href="${base}img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="${base}img/icon-180.png">
${fuentesHead}
${extra}`;

/* ---------- Barra de navegación ---------- */
export const navegacion = ({ base = '', enlaces, cta = { texto: 'Agendar demo', href: wa(), origen: 'nav' } }) => `
<nav class="nav" aria-label="Principal">
  <div class="wrap">
    <a class="brand" href="${base || '#'}"><span class="dot"></span>Alan Méndez</a>
    <ul>${enlaces.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    <div class="nav-acc">
      <button class="tema" type="button" id="tema" aria-label="Cambiar tema claro/oscuro" title="Tema claro / oscuro">${ico.sol}${ico.luna}</button>
      <a class="btn btn-wa btn-sm" href="${cta.href}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="${cta.origen}">${ico.wa} ${cta.texto}</a>
    </div>
  </div>
</nav>`;

/* ---------- Pie + botón flotante de WhatsApp + scripts ---------- */
export const pie = ({ base = '', js }) => `
<footer>
  <div class="wrap">
    <span>© ${new Date().getFullYear()} ${esc(sitio.nombreCompleto)} · Celaya, Guanajuato</span>
    <span>${base ? `<a href="${base}">Inicio</a> · ` : ''}<a href="${sitio.github}" target="_blank" rel="noopener">GitHub</a> · <a href="mailto:${sitio.email}">Correo</a> · <a href="${wa()}" target="_blank" rel="noopener">WhatsApp</a></span>
  </div>
</footer>
<a class="wa-float" href="${wa()}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp" data-track="whatsapp_click" data-origen="flotante">${ico.wa}<span>Agendar demo</span></a>
<script>${js}</script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;

/* ---------- Portada de un caso (WebP 1600×1000, se muestra a la mitad o menos: nítida en retina) ---------- */
export const portada = (c, { base = '', clase = '', lazy = true } = {}) =>
  `<img class="${clase}" src="${base}${v(`img/casos/${c.slug}.webp`)}" alt="${esc(c.nombre)} en laptop y teléfono" width="1600" height="1000"${lazy ? ' loading="lazy" decoding="async"' : ''}>`;
export const portadaOg = (c) => `${sitio.dominio}/${v(`img/casos/${c.slug}.jpg`)}`;
