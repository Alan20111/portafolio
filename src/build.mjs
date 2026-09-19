// Genera index.html, casos/*.html, sitemap.xml y robots.txt a partir de src/datos.mjs.
// Uso: node src/build.mjs   (después: ./src/generar-pdf.sh para los PDFs de 1 página)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitio, casos, faq } from './datos.mjs';
import { cssIndex, cssCaso, fuentesHead } from './estilos.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const wa = (texto = sitio.mensajeWhatsApp) => `https://wa.me/${sitio.telefonoE164}?text=${encodeURIComponent(texto)}`;
const hoy = new Date().toISOString().slice(0, 10);

const ESTADOS = {
  produccion: { txt: 'En producción', cls: 'e-prod' },
  entregado: { txt: 'Entregado', cls: 'e-prod' },
  propuesta: { txt: 'Propuesta', cls: 'e-prop' },
  academico: { txt: 'Académico', cls: 'e-acad' },
};
const nombrePdf = (c) => `Caso-${c.nombre.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}.pdf`;

/* ---------- Iconos ---------- */
const ico = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.54 0 8.23 3.7 8.23 8.24 0 4.54-3.7 8.23-8.23 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.24-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>',
  ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  gh: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
};

/* ---------- Tarjeta de caso ---------- */
const tarjetaCaso = (c) => {
  const e = ESTADOS[c.estado];
  const li = (arr) => arr.map((t) => `<li>${esc(t)}</li>`).join('');
  return `
<article class="caso" data-estado="${c.estado}" data-sector="${esc(c.sector)}" id="caso-${c.slug}">
  <img class="caso-img" src="img/casos/${c.slug}.jpg" alt="Pantalla de ${esc(c.nombre)}" loading="lazy" width="1000" height="625">
  <div class="caso-body">
  <div class="caso-top">
    <div><h3>${esc(c.nombre)}</h3><div class="cli">${esc(c.cliente)} · ${esc(c.fecha)}</div></div>
    <span class="estado ${e.cls}">${esc(c.estadoTexto)}</span>
  </div>
  <p class="resumen">${esc(c.resumen)}</p>
  <div class="psr">
    <div class="p"><b>El problema</b><p>${esc(c.problema[0])}</p><ul>${li(c.problema)}</ul></div>
    <div class="s"><b>La solución</b><p>${esc(c.solucion[0])}</p><ul>${li(c.solucion)}</ul></div>
    <div class="r"><b>El resultado</b><p>${esc(c.resultado[0])}</p><ul>${li(c.resultado)}</ul></div>
  </div>
  <button class="link-mas" type="button" data-toggle="caso-${c.slug}" aria-expanded="false">Ver caso completo ↓</button>
  <div class="stack">${c.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
  <div class="caso-acc">
    <a class="btn btn-accent btn-sm" href="casos/pdf/${nombrePdf(c)}" target="_blank" rel="noopener" data-track="caso_pdf" data-caso="${c.slug}">${ico.pdf} PDF de 1 página</a>
    ${c.demo ? `<a class="btn btn-sm" href="#demo-${c.slug}" data-track="caso_demo" data-caso="${c.slug}">${ico.ext} Ver demo</a>` : ''}
    ${c.url ? `<a class="btn btn-sm" href="${esc(c.url)}" target="_blank" rel="noopener" data-track="caso_sitio" data-caso="${c.slug}">${ico.ext} Sitio</a>` : ''}
  </div>
  </div>
</article>`;
};

/* ---------- Tarjeta de demo ---------- */
const tarjetaDemo = (c) => {
  const d = c.demo;
  if (!d) return '';
  const cred = d.credenciales
    ? `<div class="cred" aria-label="Credenciales de prueba">
        ${d.credenciales.usuario ? `<div class="row"><span>Usuario</span><span><code>${esc(d.credenciales.usuario)}</code> <button type="button" data-copy="${esc(d.credenciales.usuario)}">Copiar</button></span></div>` : ''}
        <div class="row"><span>${esc(d.credenciales.etiqueta || 'Contraseña')}</span><span><code>${esc(d.credenciales.clave)}</code> <button type="button" data-copy="${esc(d.credenciales.clave)}">Copiar</button></span></div>
        ${d.credenciales.nota ? `<small>${esc(d.credenciales.nota)}</small>` : ''}
      </div>`
    : d.solicitar
      ? `<div class="cred"><div class="row"><span>Cuenta de prueba</span><a href="${wa(`Hola Alan, quiero una cuenta de prueba de ${d.titulo}`)}" target="_blank" rel="noopener" data-track="demo_solicitar" data-demo="${c.slug}" style="color:var(--accent);font-weight:700">Pedir por WhatsApp →</a></div></div>`
      : `<div class="cred"><small>Sin registro: entra y juega con la interfaz.</small></div>`;
  return `
<article class="demo" id="demo-${c.slug}">
  <img class="demo-img" src="img/casos/${c.slug}.jpg" alt="" loading="lazy" width="1000" height="625">
  <div class="demo-body">
  <span class="tipo">${esc(d.tipo)}</span>
  <h3>${esc(d.titulo)}</h3>
  <p>${esc(d.descripcion)}</p>
  ${cred}
  <div class="demo-acc">
    <a class="btn btn-accent btn-sm" href="${esc(d.url)}" target="_blank" rel="noopener" data-track="demo_click" data-demo="${c.slug}">${ico.ext} Abrir demo</a>
    ${d.urlPanel ? `<a class="btn btn-sm" href="${esc(d.urlPanel)}" target="_blank" rel="noopener" data-track="demo_click" data-demo="${c.slug}-panel">${ico.ext} Abrir panel</a>` : ''}
  </div>
  </div>
</article>`;
};

/* ---------- JSON-LD ---------- */
const jsonld = JSON.stringify([
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${sitio.nombre} · Software a medida`,
    description: 'Desarrollo de software a medida, tiendas en línea, sistemas de citas y automatización para negocios locales y PyMEs en Celaya, Guanajuato y todo México.',
    url: sitio.dominio,
    telephone: `+${sitio.telefonoE164}`,
    email: sitio.email,
    image: `${sitio.dominio}/img/og.png`,
    priceRange: '$$',
    areaServed: [{ '@type': 'City', name: 'Celaya' }, { '@type': 'State', name: 'Guanajuato' }, { '@type': 'Country', name: 'México' }],
    address: { '@type': 'PostalAddress', addressLocality: sitio.ciudad, addressRegion: sitio.region, addressCountry: 'MX' },
    founder: { '@type': 'Person', name: sitio.nombreCompleto, sameAs: [sitio.github] },
    sameAs: [sitio.github, sitio.googleBusiness].filter(Boolean),
    knowsAbout: ['Desarrollo web', 'Tiendas en línea', 'Sistemas de citas', 'Automatización', 'Seguridad de aplicaciones', 'Apps Android'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
  },
]);

/* ---------- JS del sitio ---------- */
const js = `
(function(){
  var GA='${sitio.ga4}';
  // Analítica: Vercel Web Analytics (si está activado en el proyecto) + GA4 opcional.
  window.va=window.va||function(){(window.vaq=window.vaq||[]).push([].slice.call(arguments))};
  if(GA){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+GA;document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',GA);}
  function track(nombre,props){try{window.va('event',{name:nombre,data:props||{}});if(window.gtag)gtag('event',nombre,props||{});}catch(e){}}
  window.track=track;
  document.addEventListener('click',function(ev){
    var el=ev.target.closest('[data-track]');if(!el)return;
    var p={};['caso','demo','origen'].forEach(function(k){if(el.dataset[k])p[k]=el.dataset[k]});
    track(el.dataset.track,p);
  });
  // Copiar credenciales
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-copy]');if(!b)return;
    navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy).then(function(){var t=b.textContent;b.textContent='Copiado ✓';setTimeout(function(){b.textContent=t},1500)});
  });
  // Expandir caso
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-toggle]');if(!b)return;
    var c=document.getElementById(b.dataset.toggle);var ab=c.classList.toggle('abierto');
    b.setAttribute('aria-expanded',ab);b.textContent=ab?'Ver menos ↑':'Ver caso completo ↓';
    if(ab)track('caso_expandir',{caso:b.dataset.toggle.replace('caso-','')});
  });
  // Filtros
  var chips=document.querySelectorAll('.filtros .chip');
  chips.forEach(function(ch){ch.addEventListener('click',function(){
    chips.forEach(function(x){x.setAttribute('aria-pressed','false')});ch.setAttribute('aria-pressed','true');
    var f=ch.dataset.f;document.querySelectorAll('.caso').forEach(function(c){
      var ok=f==='todos'||c.dataset.estado===f||(f==='produccion'&&c.dataset.estado==='entregado');
      c.classList.toggle('oculto',!ok);
    });track('filtro_casos',{filtro:f});
  })});
  // Formulario → WhatsApp (sin backend, sin fricción)
  var form=document.getElementById('form-contacto');
  if(form)form.addEventListener('submit',function(ev){
    ev.preventDefault();var d=new FormData(form);
    var msg='Hola Alan, soy '+d.get('nombre')+' de '+(d.get('negocio')||'mi negocio')+'.\\n'+
      'Necesito: '+d.get('mensaje')+'\\n'+(d.get('tel')?'Mi teléfono: '+d.get('tel'):'');
    track('form_submit',{origen:'contacto'});
    window.open('https://wa.me/${sitio.telefonoE164}?text='+encodeURIComponent(msg),'_blank','noopener');
    var alt=document.getElementById('form-alt');if(alt){alt.href='mailto:${sitio.email}?subject='+encodeURIComponent('Demo para '+(d.get('negocio')||'mi negocio'))+'&body='+encodeURIComponent(msg);alt.hidden=false;}
  });
})();
`;

/* ---------- index.html ---------- */
const index = `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Alan Méndez · Software a medida para negocios locales en Celaya, Guanajuato</title>
<meta name="description" content="Desarrollo software a medida y automatización para negocios locales y PyMEs: tiendas en línea, sistemas de citas, paneles de ventas y apps. Casos reales, demos en vivo y trato directo. Celaya, Gto. y todo México.">
<meta name="keywords" content="software a medida Celaya, desarrollo web Celaya, tienda en línea Celaya, sistema de citas, sistema para negocio, desarrollador freelance Guanajuato, automatización PyME">
<meta name="author" content="${esc(sitio.nombreCompleto)}">
<meta name="robots" content="index,follow">
<meta name="geo.region" content="MX-GUA"><meta name="geo.placename" content="Celaya, Guanajuato">
<link rel="canonical" href="${sitio.dominio}/">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_MX">
<meta property="og:site_name" content="Alan Méndez · Software a medida">
<meta property="og:title" content="Software a medida y automatización para tu negocio local">
<meta property="og:description" content="Tiendas en línea, sistemas de citas, paneles de ventas y apps. Casos reales con demos que puedes probar. Trato directo, sin agencias.">
<meta property="og:url" content="${sitio.dominio}/">
<meta property="og:image" content="${sitio.dominio}/img/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#171721">
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
${fuentesHead}
<link rel="apple-touch-icon" href="img/icon-180.png">
<link rel="preload" as="image" href="img/alan.jpg" fetchpriority="high">
<script type="application/ld+json">${jsonld}</script>
<style>${cssIndex}</style>
</head>
<body>

<nav class="nav" aria-label="Principal">
  <div class="wrap">
    <a class="brand" href="#"><span class="dot"></span>Alan Méndez</a>
    <ul>
      <li><a href="#casos">Casos</a></li>
      <li><a href="#demos">Demos</a></li>
      <li><a href="#sobre-mi">Sobre mí</a></li>
      <li><a href="#faq">FAQ</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
    <a class="btn btn-wa btn-sm" href="${wa()}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="nav">${ico.wa} Agendar demo</a>
  </div>
</nav>

<header class="hero">
  <div class="wrap">
    <div>
      <span class="kicker">Celaya, Gto. · Remoto en todo México</span>
      <h1>Software a medida y automatización para <em>eliminar cuellos de botella</em> en tu negocio local.</h1>
      <p class="lead">Tiendas en línea que cobran solas, agendas que confirman citas sin que estés al teléfono y paneles que responden «¿cuánto me quedó?». Lo construyo yo, lo ves funcionando cada semana y el código es tuyo.</p>
      <div class="ctas">
        <a class="btn btn-wa" href="${wa()}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="hero">${ico.wa} Agendar una demo por WhatsApp</a>
        <a class="btn" href="#casos">Ver casos reales</a>
      </div>
      <div class="proof">
        <span><b>${casos.filter((c) => c.estado === 'produccion' || c.estado === 'entregado').length}</b> sistemas en producción</span>
        <span><b>${casos.length}</b> casos documentados</span>
        <span><b>MVP</b> en 2 semanas</span>
        <span><b>0</b> agencias de por medio</span>
      </div>
    </div>
    <div class="foto">
      <img src="img/alan.jpg" width="460" height="460" alt="Alan Méndez, desarrollador de software" onerror="this.onerror=null;this.src='https://github.com/Alan20111.png?size=400'">
      <div class="tag"><b>${esc(sitio.nombreCompleto)}</b>Desarrollador full-stack</div>
    </div>
  </div>
</header>

<section class="alt" id="como">
  <div class="wrap">
    <div class="sec-head"><h2>Así trabajo.</h2><p>Primero lo que hace dinero, luego lo que ahorra tiempo, al final lo que da información.</p></div>
    <div class="pasos">
      <div class="paso"><div class="n">1</div><h3>Diagnóstico por WhatsApp</h3><p>Me cuentas cómo vendes hoy. En una llamada de 20 minutos identificamos el cuello de botella y qué lo resuelve.</p></div>
      <div class="paso"><div class="n">2</div><h3>Maqueta navegable</h3><p>Antes de cobrar un peso ves una maqueta con tu logo y tus productos: sabes exactamente qué vas a recibir.</p></div>
      <div class="paso"><div class="n">3</div><h3>MVP en 2 semanas</h3><p>Sale a producción lo que cobra o agenda. Después, entregas semanales hasta cerrar el alcance, y soporte directo conmigo.</p></div>
    </div>
  </div>
</section>

<section id="casos">
  <div class="wrap">
    <div class="sec-head"><h2>Casos de estudio.</h2><p>Problema, solución y resultado de cada proyecto. Cada uno tiene un PDF de una página que puedes mandar por WhatsApp.</p></div>
    <div class="filtros" role="group" aria-label="Filtrar casos">
      <button class="chip" data-f="todos" aria-pressed="true">Todos</button>
      <button class="chip" data-f="produccion" aria-pressed="false">En producción</button>
      <button class="chip" data-f="propuesta" aria-pressed="false">Propuestas y auditorías</button>
      <button class="chip" data-f="academico" aria-pressed="false">Académicos</button>
    </div>
    <div class="casos">${casos.map(tarjetaCaso).join('')}</div>
  </div>
</section>

<section class="alt" id="demos">
  <div class="wrap">
    <div class="sec-head"><h2>Showroom de demos.</h2><p>Juega con la interfaz en vivo desde tu celular. Donde hace falta contraseña, la tienes aquí lista para copiar.</p></div>
    <div class="demos">${casos.map(tarjetaDemo).join('')}</div>
  </div>
</section>

<section id="sobre-mi">
  <div class="wrap sobre">
    <img src="img/alan.jpg" width="460" height="460" alt="${esc(sitio.nombreCompleto)}" loading="lazy" onerror="this.onerror=null;this.src='https://github.com/Alan20111.png?size=400'">
    <div>
      <div class="sec-head"><h2>Hola, soy Alan Méndez.</h2></div>
      <p>Desarrollo software para negocios de Celaya y la región desde 2024. Estudio Ingeniería en Sistemas Computacionales en el TecNM Celaya y he entregado sistemas que hoy usan un consultorio médico, un bazar, y cientos de docentes.</p>
      <p>No soy una agencia: hablas conmigo, quien diseña, programa y da soporte. Sin intermediarios que encarecen y sin burocracia para cambiar un botón.</p>
      <ul class="ventajas">
        <li>${ico.check}<span><b>Trato directo.</b> Mi WhatsApp, no un formulario de tickets.</span></li>
        <li>${ico.check}<span><b>El código es tuyo.</b> Repositorio, accesos y documentación a tu nombre.</span></li>
        <li>${ico.check}<span><b>Alcance cerrado y precio fijo.</b> Mensualidades sin anticipo dimensionadas para que el sistema se pague solo.</span></li>
        <li>${ico.check}<span><b>Seguridad desde el diseño.</b> Auditorías, reglas de acceso y pruebas automáticas en cada proyecto.</span></li>
      </ul>
      <div class="pill-row">
        <span>JavaScript / React</span><span>Java / JavaFX</span><span>C# / .NET</span><span>Firebase</span><span>Supabase</span><span>Cloudflare</span><span>Vercel</span><span>Mercado Pago</span><span>Android</span><span>Pentesting</span>
      </div>
    </div>
  </div>
</section>

<section class="alt" id="faq">
  <div class="wrap">
    <div class="sec-head"><h2>Preguntas frecuentes.</h2></div>
    <div class="faq">
      ${faq.map((f) => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join('')}
    </div>
  </div>
</section>

<section id="contacto">
  <div class="wrap contacto">
    <div>
      <div class="sec-head"><h2>Hablemos de tu negocio.</h2><p>Cuéntame qué te quita tiempo y te propongo cómo resolverlo. Sin compromiso.</p></div>
      <div class="dato">${ico.wa}<div><b>WhatsApp</b><span><a href="${wa()}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="contacto">${esc(sitio.telefonoBonito)}</a></span></div></div>
      <div class="dato">${ico.mail}<div><b>Correo</b><span><a href="mailto:${sitio.email}">${sitio.email}</a></span></div></div>
      <div class="dato">${ico.pin}<div><b>Ubicación</b><span>Celaya y Tarimoro, Guanajuato · trabajo remoto en todo México</span></div></div>
      <div class="dato">${ico.gh}<div><b>GitHub</b><span><a href="${sitio.github}" target="_blank" rel="noopener">github.com/Alan20111</a></span></div></div>
    </div>
    <form id="form-contacto" novalidate>
      <label>Tu nombre <input name="nombre" required autocomplete="name" placeholder="Ej. Valeria"></label>
      <label>Tu negocio <input name="negocio" autocomplete="organization" placeholder="Ej. Bazar Girl"></label>
      <label>Tu WhatsApp (opcional) <input name="tel" type="tel" autocomplete="tel" inputmode="tel" placeholder="466 123 4567"></label>
      <label>¿Qué te quita tiempo hoy? <textarea name="mensaje" required placeholder="Ej. Cotizo envíos a mano y pierdo ventas de noche"></textarea></label>
      <button class="btn btn-wa" type="submit">${ico.wa} Enviar por WhatsApp</button>
      <a id="form-alt" class="btn btn-sm" href="#" hidden>${ico.mail} O envíalo por correo</a>
      <span class="form-note">Se abre WhatsApp con tu mensaje ya escrito. No guardo tus datos en ningún servidor.</span>
    </form>
  </div>
</section>

<footer>
  <div class="wrap">
    <span>© ${new Date().getFullYear()} ${esc(sitio.nombreCompleto)} · Celaya, Guanajuato</span>
    <span><a href="${sitio.github}" target="_blank" rel="noopener">GitHub</a> · <a href="mailto:${sitio.email}">Correo</a> · <a href="${wa()}" target="_blank" rel="noopener">WhatsApp</a></span>
  </div>
</footer>

<a class="wa-float" href="${wa()}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp" data-track="whatsapp_click" data-origen="flotante">${ico.wa}<span>Agendar demo</span></a>

<script>${js}</script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>`;

/* ---------- Caso de estudio (1 página, imprimible) ---------- */
const paginaCaso = (c) => {
  const e = ESTADOS[c.estado];
  const colores = { 'e-prod': 'color:#4f8a58;border-color:#8fb996', 'e-prop': 'color:#b0703f;border-color:#cc9166', 'e-acad': 'color:#5e616e;border-color:#9194a1' };
  const li = (arr) => arr.map((t) => `<li>${esc(t)}</li>`).join('');
  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Caso de estudio · ${esc(c.nombre)} · Alan Méndez</title>
<meta name="description" content="${esc(c.resumen)}">
<link rel="canonical" href="${sitio.dominio}/casos/${c.slug}">
<meta property="og:title" content="Caso de estudio · ${esc(c.nombre)}">
<meta property="og:description" content="${esc(c.resumen)}">
<meta property="og:image" content="${sitio.dominio}/img/og.png">
<link rel="icon" href="../img/favicon.svg" type="image/svg+xml">
${fuentesHead}
<style>${cssCaso}</style>
</head>
<body>
<div class="barra"><a href="../#casos">← Volver</a><a href="pdf/${nombrePdf(c)}" target="_blank" rel="noopener">Descargar PDF</a><button type="button" onclick="print()">Imprimir</button></div>
<main class="hoja">
  <header class="cab">
    <div>
      <div class="k">Caso de estudio · ${esc(c.sector)}</div>
      <h1>${esc(c.nombre)}</h1>
      <div class="cli">${esc(c.cliente)} · ${esc(c.fecha)}</div>
      <span class="estado-pdf" style="${colores[e.cls]}">${esc(c.estadoTexto)}</span>
    </div>
    <div class="yo"><b>${esc(sitio.nombreCompleto)}</b>Software a medida · Celaya, Gto.<br>${esc(sitio.telefonoBonito)}<br>${sitio.email}</div>
  </header>
  <p class="resumen">${esc(c.resumen)}</p>
  <img class="img-pdf" src="../img/casos/${c.slug}.jpg" alt="Pantalla de ${esc(c.nombre)}">
  <div class="tres">
    <section class="bloque p"><h2>El problema</h2><ul>${li(c.problema)}</ul></section>
    <section class="bloque s"><h2>La solución</h2><ul>${li(c.solucion)}</ul></section>
    <section class="bloque r"><h2>El resultado</h2><ul>${li(c.resultado)}</ul></section>
  </div>
  <div class="stack-pdf">${c.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
  <footer class="pie">
    <span>${c.url ? `Demo: <a href="${esc(c.url)}">${esc(c.url.replace(/^https?:\/\//, ''))}</a> · ` : ''}Más casos: <a href="${sitio.dominio}">${sitio.dominio.replace(/^https?:\/\//, '')}</a></span>
    <a class="cta" href="${wa(`Hola Alan, vi el caso de ${c.nombre} y quiero algo parecido para mi negocio`)}">Quiero algo así · WhatsApp</a>
  </footer>
</main>
</body>
</html>`;
};

/* ---------- Escribir archivos ---------- */
mkdirSync(join(raiz, 'casos', 'pdf'), { recursive: true });
writeFileSync(join(raiz, 'index.html'), index);
for (const c of casos) writeFileSync(join(raiz, 'casos', `${c.slug}.html`), paginaCaso(c));

const urls = ['/', ...casos.map((c) => `/casos/${c.slug}`)];
writeFileSync(
  join(raiz, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${sitio.dominio}${u}</loc><lastmod>${hoy}</lastmod><priority>${u === '/' ? '1.0' : '0.7'}</priority></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(join(raiz, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /demos/\nSitemap: ${sitio.dominio}/sitemap.xml\n`);

console.log(`✓ index.html, ${casos.length} casos, sitemap.xml y robots.txt generados`);
console.log('  PDFs pendientes:', casos.map(nombrePdf).join(', '));
