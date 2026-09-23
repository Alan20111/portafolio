// Genera index.html, casos/*.html, sitemap.xml y robots.txt a partir de src/datos.mjs.
// Uso: node src/build.mjs   (después: ./src/generar-pdf.sh para los PDFs de 1 página)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { sitio, casos, faq } from './datos.mjs';
import { cssIndex, cssCaso, cssDetalle, fuentesHead, cssSistema } from './estilos.mjs';
import { raiz, esc, wa, waCaso, v, ESTADOS, nombrePdf, ico, cabecera, navegacion, pie, portada, portadaOg } from './componentes.mjs';

const hoy = new Date().toISOString().slice(0, 10);

/* ---------- Tarjeta de caso (anzuelo: imagen, título, una línea, botón) ---------- */
const tarjetaCaso = (c) => {
  const e = ESTADOS[c.estado];
  return `
<article class="caso" data-estado="${c.estado}" data-sector="${esc(c.sector)}" id="caso-${c.slug}">
  <a class="caso-link" href="casos/${c.slug}" data-track="caso_abrir" data-caso="${c.slug}" aria-label="Ver caso ${esc(c.nombre)}">
    ${portada(c, { clase: 'caso-img' })}
  </a>
  <div class="caso-body">
    <div class="caso-top">
      <div><span class="eyebrow">${esc(c.sector)}</span><h3><a href="casos/${c.slug}" data-track="caso_abrir" data-caso="${c.slug}">${esc(c.nombre)}</a></h3></div>
      <span class="estado ${e.cls}">${esc(e.txt)}</span>
    </div>
    <p class="resumen">${esc(c.resumen)}</p>
    <div class="caso-acc">
      <a class="btn btn-sm" href="casos/${c.slug}" data-track="caso_abrir" data-caso="${c.slug}">Ver el caso →</a>
      ${c.demo ? `<a class="btn btn-sm" href="${esc(c.demo.url)}" target="_blank" rel="noopener" data-track="demo_click" data-demo="${c.slug}">${ico.ext} Probar demo</a>` : ''}
      <a class="btn btn-sm btn-ghost" href="casos/pdf/${nombrePdf(c)}" target="_blank" rel="noopener" data-track="caso_pdf" data-caso="${c.slug}" aria-label="PDF de 1 página de ${esc(c.nombre)}">${ico.pdf}</a>
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
    image: `${sitio.dominio}/${v('img/og.png')}`,
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
  // Llegada desde el QR de las tarjetas (/qr -> /?src=qr): registra el escaneo y limpia la URL
  try{if(new URLSearchParams(location.search).get('src')==='qr'){track('qr_scan',{origen:'tarjeta'});history.replaceState({},'',location.pathname+location.hash);}}catch(e){}
  document.addEventListener('click',function(ev){
    var el=ev.target.closest('[data-track]');if(!el)return;
    var p={};['caso','demo','origen'].forEach(function(k){if(el.dataset[k])p[k]=el.dataset[k]});
    track(el.dataset.track,p);
  });
  // Tema: sigue al sistema; el botón fuerza claro/oscuro y lo recuerda
  var mq=window.matchMedia('(prefers-color-scheme: light)');
  function temaActual(){return document.documentElement.dataset.theme||(mq.matches?'light':'dark')}
  var bt=document.getElementById('tema');
  if(bt)bt.addEventListener('click',function(){
    var nuevo=temaActual()==='light'?'dark':'light';
    document.documentElement.dataset.theme=nuevo;
    try{localStorage.setItem('tema',nuevo)}catch(e){}
    track('tema',{tema:nuevo});
  });
  // Copiar credenciales
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('[data-copy]');if(!b)return;
    navigator.clipboard&&navigator.clipboard.writeText(b.dataset.copy).then(function(){var t=b.textContent;b.textContent='Copiado ✓';setTimeout(function(){b.textContent=t},1500)});
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
const index = `${cabecera({
  titulo: 'Alan Méndez · Software a medida para negocios locales en Celaya, Guanajuato',
  descripcion: 'Desarrollo software a medida y automatización para negocios locales y PyMEs: tiendas en línea, sistemas de citas, paneles de ventas y apps. Casos reales, demos en vivo y trato directo. Celaya, Gto. y todo México.',
  canonical: `${sitio.dominio}/`,
  og: `${sitio.dominio}/${v('img/og.png')}`,
  extra: `<meta name="keywords" content="software a medida Celaya, desarrollo web Celaya, tienda en línea Celaya, sistema de citas, sistema para negocio, desarrollador freelance Guanajuato, automatización PyME">
<meta name="author" content="${esc(sitio.nombreCompleto)}">
<meta name="robots" content="index,follow">
<meta name="geo.region" content="MX-GUA"><meta name="geo.placename" content="Celaya, Guanajuato">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<link rel="preload" as="image" href="${v('img/alan.jpg')}" fetchpriority="high">
<script type="application/ld+json">${jsonld}</script>
<style>${cssIndex}</style>`,
})}
</head>
<body>
${navegacion({ enlaces: [['Casos', '#casos'], ['Sobre mí', '#sobre-mi'], ['FAQ', '#faq'], ['Contacto', '#contacto']] })}

<header class="hero">
  <div class="wrap">
    <div>
      <span class="kicker">Software a medida · Celaya, Gto.</span>
      <h1>Software que <em>trabaja por ti</em>.</h1>
      <p class="lead">Tiendas en línea, agendas de citas y paneles de ventas hechos para ti.</p>
      <div class="ctas">
        <a class="btn btn-wa" href="${wa()}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="hero">${ico.wa} Agendar demo</a>
        <a class="btn" href="#casos">Ver casos</a>
      </div>
      <div class="proof">
        <span><b>${casos.filter((c) => c.estado === 'produccion' || c.estado === 'entregado').length}</b> sistemas en producción</span>
        <span><b>${casos.filter((c) => c.demo).length}</b> demos que puedes probar</span>
        <span><b>2</b> semanas al primer entregable</span>
      </div>
    </div>
    <div class="foto">
      <img src="${v('img/alan.jpg')}" width="900" height="900" alt="Alan Méndez, desarrollador de software" onerror="this.onerror=null;this.src='https://github.com/Alan20111.png?size=400'">
      <div class="tag"><b>${esc(sitio.nombreCompleto)}</b>Desarrollador full-stack</div>
    </div>
  </div>
</header>

<section class="alt" id="como">
  <div class="wrap">
    <div class="sec-head"><h2>Así trabajo.</h2><p>Primero lo que hace dinero, luego lo que ahorra tiempo, al final lo que da información.</p></div>
    <div class="pasos">
      <div class="paso"><div class="n">1</div><h3>Diagnóstico por WhatsApp</h3><p>Me cuentas cómo vendes hoy. En una llamada de 20 minutos identificamos qué te quita tiempo y cómo resolverlo.</p></div>
      <div class="paso"><div class="n">2</div><h3>Maqueta navegable</h3><p>Antes de cobrar un peso ves una maqueta con tu logo y tus productos: sabes exactamente qué vas a recibir.</p></div>
      <div class="paso"><div class="n">3</div><h3>MVP en 2 semanas</h3><p>Sale a producción lo que cobra o agenda. Después, entregas semanales hasta cerrar el alcance, y soporte directo conmigo.</p></div>
    </div>
  </div>
</section>

<span id="demos"></span>
<section id="casos">
  <div class="wrap">
    <div class="sec-head"><h2>Casos de estudio.</h2><p>Negocios reales, problemas reales. Lee el caso o entra directo a la demo y juega con ella desde tu celular.</p></div>
    <div class="filtros" role="group" aria-label="Filtrar casos">
      <button class="chip" data-f="todos" aria-pressed="true">Todos</button>
      <button class="chip" data-f="produccion" aria-pressed="false">En producción</button>
      <button class="chip" data-f="demo" aria-pressed="false">Demos en vivo</button>
      <button class="chip" data-f="propuesta" aria-pressed="false">Propuestas y auditorías</button>
      <button class="chip" data-f="academico" aria-pressed="false">Académicos</button>
    </div>
    <div class="casos">${casos.map(tarjetaCaso).join('')}</div>
  </div>
</section>



<section id="sobre-mi">
  <div class="wrap sobre">
    <img src="${v('img/alan.jpg')}" width="900" height="900" alt="${esc(sitio.nombreCompleto)}" loading="lazy" onerror="this.onerror=null;this.src='https://github.com/Alan20111.png?size=400'">
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

${pie({ js })}`;

/* ---------- Página del caso (toda la información, con el tema del sitio) ---------- */
const paginaCaso = (c, i) => {
  const e = ESTADOS[c.estado];
  const sig = casos[(i + 1) % casos.length];
  const li = (arr) => arr.map((t) => `<li>${esc(t)}</li>`).join('');
  const d = c.demo;
  return `${cabecera({ titulo: `${c.nombre} · Caso de estudio · Alan Méndez`, descripcion: c.resumen, canonical: `${sitio.dominio}/casos/${c.slug}`, og: portadaOg(c), base: '../', tipo: 'article', extra: `<style>${cssIndex}${cssDetalle}</style>` })}
</head>
<body>
${navegacion({ base: '../', enlaces: [['Casos', '../#casos'], ['Sobre mí', '../#sobre-mi'], ['Contacto', '../#contacto']], cta: { texto: 'Quiero algo así', href: waCaso(c), origen: `caso-${c.slug}` } })}

<main class="detalle">
  <header class="wrap det-head">
    <a class="volver" href="../#casos">← Todos los casos</a>
    <span class="eyebrow">${esc(c.sector)} · ${esc(c.fecha)}</span>
    <h1>${esc(c.nombre)}</h1>
    <p class="det-cli">${esc(c.cliente)} <span class="estado ${e.cls}">${esc(c.estadoTexto)}</span></p>
    <p class="det-lead">${esc(c.resumen)}</p>
    <div class="det-acc">
      ${d ? `<a class="btn btn-wa" href="${d.url.startsWith('http') ? esc(d.url) : '../' + esc(d.url)}" target="_blank" rel="noopener" data-track="demo_click" data-demo="${c.slug}">${ico.ext} Abrir demo</a>` : ''}
      ${d && d.urlPanel ? `<a class="btn" href="${esc(d.urlPanel)}" target="_blank" rel="noopener" data-track="demo_click" data-demo="${c.slug}-panel">${ico.ext} Abrir panel</a>` : ''}
      ${c.url ? `<a class="btn" href="${esc(c.url)}" target="_blank" rel="noopener" data-track="caso_sitio" data-caso="${c.slug}">${ico.ext} Sitio</a>` : ''}
      <a class="btn" href="pdf/${nombrePdf(c)}" target="_blank" rel="noopener" data-track="caso_pdf" data-caso="${c.slug}">${ico.pdf} PDF de 1 página</a>
    </div>
  </header>

  <figure class="det-img">${portada(c, { base: '../', lazy: false })}</figure>

  <section class="wrap det-psr">
    <div class="det-bloque"><span class="eyebrow">El problema</span><ul>${li(c.problema)}</ul></div>
    <div class="det-bloque"><span class="eyebrow">La solución</span><ul>${li(c.solucion)}</ul></div>
    <div class="det-bloque"><span class="eyebrow">El resultado</span><ul>${li(c.resultado)}</ul></div>
  </section>

  <section class="wrap det-extra">
    <div>
      <span class="eyebrow">Tecnología</span>
      <div class="stack">${c.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
    ${d ? `<div>
      <span class="eyebrow">Demo</span>
      <p class="det-demo">${esc(d.descripcion)}</p>
      ${d.credenciales ? `<div class="cred">${d.credenciales.usuario ? `<div class="row"><span>Usuario</span><span><code>${esc(d.credenciales.usuario)}</code> <button type="button" data-copy="${esc(d.credenciales.usuario)}">Copiar</button></span></div>` : ''}<div class="row"><span>${esc(d.credenciales.etiqueta || 'Contraseña')}</span><span><code>${esc(d.credenciales.clave)}</code> <button type="button" data-copy="${esc(d.credenciales.clave)}">Copiar</button></span></div>${d.credenciales.nota ? `<small>${esc(d.credenciales.nota)}</small>` : ''}</div>` : d.solicitar ? `<div class="cred"><div class="row"><span>Cuenta de prueba</span><a href="${wa(`Hola Alan, quiero una cuenta de prueba de ${d.titulo}`)}" target="_blank" rel="noopener" data-track="demo_solicitar" data-demo="${c.slug}">Pedir por WhatsApp →</a></div></div>` : ''}
    </div>` : ''}
  </section>

  <section class="wrap det-cta">
    <h2>¿Tu negocio necesita algo así?</h2>
    <p>Cuéntamelo por WhatsApp y te propongo cómo resolverlo. Sin compromiso.</p>
    <a class="btn btn-wa" href="${waCaso(c)}" target="_blank" rel="noopener" data-track="whatsapp_click" data-origen="caso-cta-${c.slug}">${ico.wa} Agendar una demo</a>
    <a class="siguiente" href="${sig.slug}">Siguiente caso: ${esc(sig.nombre)} →</a>
  </section>
</main>

${pie({ base: '../', js })}`;
};

/* ---------- Hoja imprimible (fuente del PDF de 1 página; se guarda en src/pdf/) ---------- */
const hojaImprimible = (c) => {
  const e = ESTADOS[c.estado];
  const colores = { 'e-prod': 'color:#4f8a58;border-color:#8fb996', 'e-prop': 'color:#b0703f;border-color:#cc9166', 'e-acad': 'color:#5e616e;border-color:#9194a1', 'e-demo': 'color:#1c1d22;border-color:#1c1d22' };
  const li = (arr) => arr.map((t) => `<li>${esc(t)}</li>`).join('');
  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="UTF-8">
<title>Caso de estudio · ${esc(c.nombre)} · Alan Méndez</title>
${fuentesHead}
<style>${cssCaso}</style>
</head>
<body>
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
  <img class="img-pdf" src="../../img/casos/${c.slug}.webp" alt="Pantalla de ${esc(c.nombre)}">
  <div class="tres">
    <section class="bloque p"><h2>El problema</h2><ul>${li(c.problema)}</ul></section>
    <section class="bloque s"><h2>La solución</h2><ul>${li(c.solucion)}</ul></section>
    <section class="bloque r"><h2>El resultado</h2><ul>${li(c.resultado)}</ul></section>
  </div>
  <div class="stack-pdf">${c.stack.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
  <footer class="pie">
    <span>${c.url ? `Demo: <a href="${esc(c.url)}">${esc(c.url.replace(/^https?:\/\//, ''))}</a> · ` : ''}Caso completo: <a href="${sitio.dominio}/casos/${c.slug}">${sitio.dominio.replace(/^https?:\/\//, '')}/casos/${c.slug}</a></span>
    <a class="cta" href="${waCaso(c)}">Quiero algo así · WhatsApp</a>
  </footer>
</main>
</body>
</html>`;
};

/* ---------- Escribir archivos ---------- */
mkdirSync(join(raiz, 'casos', 'pdf'), { recursive: true });
writeFileSync(join(raiz, 'index.html'), index);
mkdirSync(join(raiz, 'assets'), { recursive: true });
writeFileSync(join(raiz, 'assets', 'sistema.css'), cssSistema);
mkdirSync(join(raiz, 'src', 'pdf'), { recursive: true });
casos.forEach((c, i) => {
  writeFileSync(join(raiz, 'casos', `${c.slug}.html`), paginaCaso(c, i));
  writeFileSync(join(raiz, 'src', 'pdf', `${c.slug}.html`), hojaImprimible(c));
});

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
