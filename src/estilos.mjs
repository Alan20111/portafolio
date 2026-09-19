// Sistema de estilo: "galería blanca" (referencia Apple España). Tema claro únicamente.
// Reglas: sin sombras ni degradados; radios solo 10 / 28 / 980 px; peso máximo 600;
// una sola acción primaria azul (#0071e3), todo lo demás pill neutra (#e2e2e5);
// colores de acento (verde/azul/violeta/naranja/teal) solo como tinte de palabra o contorno de etiqueta.

export const tokens = `
:root{
  --canvas:#f5f5f7; --paper:#ffffff; --ink:#1d1d1f; --charcoal:#333336; --slate:#474747; --iron:#707070;
  --mist:#e2e2e5; --fog:#d6d6d6;
  --blue:#0071e3; --link:#0066cc; --green:#03aa49; --green-deep:#03873a; --violet:#8668ff; --orange:#ed6300; --teal:#00a1b3;
  --font-display:'SF Pro Display',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;
  --font-text:'SF Pro Text',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",sans-serif;
  --r-link:10px; --r-card:28px; --r-pill:980px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:var(--font-text);font-size:17px;line-height:1.47;letter-spacing:-.272px;background:var(--canvas);color:var(--ink);-webkit-font-smoothing:antialiased;font-feature-settings:"numr" off}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
[hidden]{display:none!important}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
h1,h2,h3{font-family:var(--font-display);font-weight:600}
.wrap{width:min(980px,100% - 40px);margin-inline:auto}
@media(max-width:480px){.wrap{width:calc(100% - 32px)}}
`;

export const cssIndex = tokens + `
/* Nav */
.nav{position:sticky;top:0;z-index:50;background:rgba(255,255,255,.92);backdrop-filter:saturate(1.8) blur(20px);border-bottom:1px solid var(--fog)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:48px;gap:12px}
.brand{font-family:var(--font-display);font-weight:600;font-size:17px;letter-spacing:-.272px;display:flex;align-items:center;gap:8px;color:#000}
.brand .dot{width:8px;height:8px;border-radius:50%;background:var(--ink)}
.nav ul{display:none;list-style:none;gap:28px;font-size:12px;letter-spacing:-.036px;color:var(--ink)}
.nav ul a{opacity:.8}.nav ul a:hover{opacity:1}
@media(min-width:820px){.nav ul{display:flex}}

/* Botones: dos arquetipos */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--r-pill);padding:11px 20px;font-size:17px;font-weight:600;letter-spacing:-.374px;line-height:1.18;background:var(--mist);color:var(--charcoal);white-space:nowrap;transition:opacity .15s,background .15s}
.btn:hover{background:#d9d9dd}
.btn-wa{background:var(--blue);color:#fff}
.btn-wa:hover{background:#0077ed}
.btn-accent{background:var(--mist);color:var(--charcoal)}
.btn-sm{padding:8px 16px;font-size:14px;letter-spacing:-.14px}
.btn svg{width:17px;height:17px;flex:none}

/* Hero */
.hero{background:var(--paper);padding:64px 0 72px}
.hero .wrap{display:grid;gap:40px;align-items:center}
@media(min-width:820px){.hero{padding:96px 0 112px}.hero .wrap{grid-template-columns:1.2fr .8fr;gap:64px}}
.kicker{display:block;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink);margin-bottom:20px}
.hero h1{font-size:clamp(39px,6.2vw,64px);line-height:1.06;letter-spacing:-.015em;text-wrap:balance}
.hero h1 em{font-style:normal;color:var(--green)}
.hero .lead{margin-top:24px;font-size:21px;line-height:1.33;letter-spacing:.231px;color:var(--ink);max-width:34ch;text-wrap:pretty}
@media(max-width:480px){.hero .lead{font-size:17px;letter-spacing:-.272px;line-height:1.47}}
.hero .ctas{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:32px}
.hero .proof{display:flex;flex-wrap:wrap;gap:8px 28px;margin-top:40px;font-size:14px;letter-spacing:-.14px;color:var(--iron)}
.hero .proof b{color:var(--ink);font-weight:600}
.foto{position:relative;justify-self:center;width:min(360px,100%)}
.foto img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:var(--r-card);background:var(--canvas)}
.foto .tag{margin-top:14px;font-size:14px;letter-spacing:-.14px;color:var(--iron)}
.foto .tag b{display:block;color:var(--ink);font-weight:600}

/* Bandas */
section{padding:80px 0}
@media(min-width:820px){section{padding:112px 0}}
.alt{background:var(--paper)}
.sec-head{margin-bottom:40px}
.sec-head h2{font-size:clamp(28px,4.5vw,39px);line-height:1.07;letter-spacing:-.351px}
.sec-head p{margin-top:12px;color:var(--slate);font-size:17px;max-width:60ch}

/* Cómo trabajo */
.pasos{display:grid;gap:12px}
@media(min-width:720px){.pasos{grid-template-columns:repeat(3,1fr)}}
.paso{background:var(--canvas);border-radius:var(--r-card);padding:28px}
.alt .paso{background:var(--canvas)}
.paso .n{font-family:var(--font-display);font-size:28px;line-height:1;letter-spacing:-.252px;color:var(--blue);margin-bottom:16px}
.paso h3{font-size:21px;letter-spacing:.231px;line-height:1.33;margin-bottom:6px}
.paso p{color:var(--slate);font-size:17px}

/* Filtros */
.filtros{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px}
.chip{border:1px solid var(--fog);background:transparent;color:var(--ink);border-radius:var(--r-pill);padding:9px 16px;font-size:14px;letter-spacing:-.14px}
.chip[aria-pressed="true"]{background:var(--ink);color:#fff;border-color:var(--ink)}

/* Casos */
.casos{display:grid;gap:12px}
@media(min-width:820px){.casos{grid-template-columns:repeat(2,1fr)}}
.caso{background:var(--paper);border-radius:var(--r-card);padding:28px;display:flex;flex-direction:column;gap:16px}
.caso.oculto{display:none}
.caso-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.caso h3{font-size:28px;letter-spacing:-.252px;line-height:1.14}
.caso .cli{color:var(--iron);font-size:14px;letter-spacing:-.14px;margin-top:4px}
.estado{font-size:12px;letter-spacing:-.036px;padding:5px 12px;border-radius:var(--r-pill);white-space:nowrap;flex:none;border:1px solid;background:transparent}
.e-prod{color:var(--green-deep);border-color:var(--green)}
.e-prop{color:var(--orange);border-color:var(--orange)}
.e-acad{color:var(--violet);border-color:var(--violet)}
.caso .resumen{color:var(--ink);font-size:17px}
.psr{display:grid;gap:12px}
.psr div{border-left:1px solid var(--fog);padding:2px 0 2px 14px}
.psr b{display:block;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--iron);margin-bottom:4px}
.psr .p b{color:var(--orange)}.psr .s b{color:var(--link)}.psr .r b{color:var(--green-deep)}
.psr p{font-size:14px;letter-spacing:-.14px;line-height:1.43;color:var(--slate)}
.psr ul{display:none;padding-left:18px;font-size:14px;letter-spacing:-.14px;line-height:1.43;color:var(--slate)}
.psr li+li{margin-top:4px}
.caso.abierto .psr ul{display:block}
.caso.abierto .psr p{display:none}
.stack{display:flex;flex-wrap:wrap;gap:6px}
.stack span{font-size:12px;letter-spacing:-.036px;background:var(--canvas);color:var(--slate);border-radius:var(--r-pill);padding:4px 10px}
.caso-acc{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:4px}
.caso-acc .btn,.demo-acc .btn{flex:1 1 auto;min-width:0}
.caso,.demo,.paso{min-width:0}
@media(max-width:600px){.caso,.demo,.paso,form{padding:20px;border-radius:var(--r-card)}.caso h3{font-size:24px}.caso-acc .btn,.demo-acc .btn{white-space:normal;text-align:center}}
.link-mas{font-size:14px;letter-spacing:-.14px;color:var(--link);align-self:flex-start;border-bottom:1px solid var(--link);line-height:1.2}

/* Demos */
.demos{display:grid;gap:12px}
@media(min-width:720px){.demos{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.demos{grid-template-columns:repeat(3,1fr)}}
.demo{background:var(--canvas);border-radius:var(--r-card);padding:28px;display:flex;flex-direction:column;gap:12px}
.demo .tipo{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--iron)}
.demo h3{font-size:21px;letter-spacing:.231px;line-height:1.33}
.demo p{color:var(--slate);font-size:14px;letter-spacing:-.14px;line-height:1.43;flex:1}
.cred{border:1px solid var(--fog);border-radius:var(--r-link);padding:10px 14px;font-size:14px;letter-spacing:-.14px;display:grid;gap:6px;background:var(--paper)}
.cred .row{display:flex;align-items:center;justify-content:space-between;gap:8px}
.cred code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;background:var(--canvas);padding:2px 8px;border-radius:6px}
.cred button,.cred a{font-size:14px;font-weight:600;color:var(--link);padding:2px 0}
.cred small{color:var(--iron);font-size:12px;letter-spacing:-.036px}
.demo-acc{display:flex;flex-wrap:wrap;gap:8px}

/* Sobre mí */
.sobre{display:grid;gap:40px;align-items:start}
@media(min-width:820px){.sobre{grid-template-columns:.8fr 1.2fr;gap:64px}}
.sobre img{width:min(360px,100%);aspect-ratio:4/5;object-fit:cover;border-radius:var(--r-card);background:var(--canvas)}
.sobre p{color:var(--ink);margin-bottom:14px;font-size:17px}
.ventajas{display:grid;gap:12px;margin:24px 0;list-style:none}
.ventajas li{display:flex;gap:12px;align-items:flex-start;font-size:17px}
.ventajas svg{width:20px;height:20px;flex:none;color:var(--green);margin-top:3px}
.pill-row{display:flex;flex-wrap:wrap;gap:6px}
.pill-row span{font-size:12px;letter-spacing:-.036px;border:1px solid var(--fog);border-radius:var(--r-pill);padding:5px 12px;color:var(--slate)}

/* FAQ: filas con línea, sin tarjetas */
.faq{max-width:760px;border-top:1px solid var(--fog)}
details{border-bottom:1px solid var(--fog)}
summary{cursor:pointer;list-style:none;padding:20px 0;font-size:21px;line-height:1.33;letter-spacing:.231px;font-family:var(--font-display);font-weight:600;display:flex;justify-content:space-between;align-items:center;gap:16px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-weight:400;font-size:28px;color:var(--iron);flex:none;line-height:1}
details[open] summary::after{content:"–"}
details p{padding:0 0 24px;color:var(--slate);max-width:62ch}

/* Contacto */
.contacto{display:grid;gap:40px}
@media(min-width:820px){.contacto{grid-template-columns:1fr 1fr;gap:64px}}
form{display:grid;gap:14px;background:var(--canvas);border-radius:var(--r-card);padding:28px}
.alt form{background:var(--canvas)}
label{font-size:14px;letter-spacing:-.14px;font-weight:600;display:grid;gap:6px}
input,textarea,select{font:inherit;font-size:17px;letter-spacing:-.272px;color:var(--ink);background:var(--paper);border:1px solid var(--fog);border-radius:var(--r-link);padding:12px 14px;width:100%}
input:focus,textarea:focus,select:focus{outline:2px solid var(--blue);outline-offset:-1px;border-color:var(--blue)}
textarea{min-height:120px;resize:vertical}
.form-note{font-size:12px;letter-spacing:-.036px;color:var(--iron)}
.dato{display:flex;gap:14px;align-items:flex-start;margin-bottom:20px}
.dato svg{width:22px;height:22px;color:var(--ink);flex:none;margin-top:2px}
.dato b{display:block;font-weight:600}
.dato span{color:var(--slate);font-size:14px;letter-spacing:-.14px}
.dato a{color:var(--link);border-bottom:1px solid var(--link)}

footer{border-top:1px solid var(--fog);background:var(--paper);padding:24px 0 100px;color:var(--iron);font-size:12px;letter-spacing:-.036px}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px}
footer a{color:var(--link)}

/* WhatsApp flotante: la misma acción primaria, mismo pill */
.wa-float{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:8px;background:var(--blue);color:#fff;border-radius:var(--r-pill);padding:12px 20px 12px 14px;font-size:17px;font-weight:600;letter-spacing:-.374px}
.wa-float:hover{background:#0077ed}
.wa-float svg{width:22px;height:22px}
@media(max-width:480px){.wa-float span{display:none}.wa-float{padding:14px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;

export const cssCaso = tokens + `
@page{size:letter;margin:0}
body{background:#fff}
.hoja{width:8.5in;min-height:11in;margin:0 auto;padding:.6in .65in .5in;display:flex;flex-direction:column;gap:.2in;background:#fff}
.cab{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:1px solid var(--fog);padding-bottom:14px}
.cab .k{font-size:9pt;letter-spacing:.08em;text-transform:uppercase;color:var(--iron);font-weight:600}
.cab h1{font-size:24pt;letter-spacing:-.02em;line-height:1.07;margin-top:4px}
.cab .cli{color:var(--slate);font-size:10pt;margin-top:4px}
.cab .yo{text-align:right;font-size:9pt;color:var(--slate);line-height:1.45}
.cab .yo b{display:block;color:var(--ink);font-size:10.5pt;font-weight:600}
.estado-pdf{display:inline-block;font-size:8pt;font-weight:400;padding:3px 10px;border-radius:980px;border:1px solid;margin-top:8px;background:transparent!important}
.resumen{font-size:12pt;line-height:1.35;color:var(--ink);text-wrap:pretty}
.tres{display:grid;grid-template-columns:1fr;gap:12px}
.bloque{border-left:1px solid var(--fog);padding:2px 0 2px 14px;break-inside:avoid}
.bloque h2{font-family:var(--font-text);font-size:8.5pt;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;font-weight:600}
.bloque.p h2{color:var(--orange)}.bloque.s h2{color:var(--link)}.bloque.r h2{color:var(--green-deep)}
.bloque ul{padding-left:16px;font-size:10pt;line-height:1.4;color:var(--slate);display:grid;gap:3px}
.stack-pdf{display:flex;flex-wrap:wrap;gap:5px}
.stack-pdf span{font-size:8pt;background:var(--canvas);border-radius:980px;padding:3px 9px;color:var(--slate)}
.pie{margin-top:auto;border-top:1px solid var(--fog);padding-top:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:9pt;color:var(--slate)}
.pie .cta{background:var(--blue);color:#fff;font-weight:600;padding:8px 14px;border-radius:980px;font-size:9.5pt;white-space:nowrap}
.pie a{color:var(--link)}
.barra{display:flex;gap:8px;justify-content:center;padding:14px;background:var(--canvas);border-bottom:1px solid var(--fog);font-size:14px}
.barra a,.barra button{background:var(--mist);border-radius:980px;padding:8px 16px;font-weight:600;color:var(--charcoal)}
@media print{.barra{display:none}.hoja{margin:0;min-height:auto;height:11in}}
@media screen and (max-width:700px){.hoja{width:100%;padding:24px 16px}}
`;
