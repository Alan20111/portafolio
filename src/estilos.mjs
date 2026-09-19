// Sistema de estilo: síntesis de tres referencias.
//  · Mercury  → canvas oscuro #171721, tarjetas grafito #1e1e2a planas (sin sombras), radios 12 px, pill cobalto #5266eb
//               como ÚNICA acción primaria, ghost de contorno marfil para lo secundario, ritmo espacioso.
//  · Slash    → titulares en serif didone (Playfair Display sustituye a Ivy Presto) solo ≥ 28 px con tracking +0.01em;
//               Inter para UI/cuerpo (16 px, #e2e3e9); cobre #cc9166 únicamente en eyebrows y enlaces editoriales.
//  · Apple    → titular alineado a la izquierda con una palabra teñida, encabezados con punto final, dos arquetipos de
//               botón y nada más, aire generoso, sin degradados ni sombras.
// Reglas: radios solo 12 px (tarjetas) / 4 px (estructura) / 9999 px (controles). Peso máximo de titulares 500.
// Cromáticos permitidos: cobalto (acción), cobre (editorial), salvia desaturada (estado positivo). Nada más.

export const tokens = `
:root{
  --canvas:#171721; --card:#1e1e2a; --panel:#272735; --hair:#2e3038; --hair2:#464853;
  --steel:#777a88; --fog:#9194a1; --mist:#acafb9; --silver:#c7c9d1; --bone:#e2e3e9; --ivory:#ededf3; --white:#ffffff;
  --cobalt:#5266eb; --cobalt-hover:#6377f0; --copper:#cc9166; --sage:#8fb996;
  --font-display:'Playfair Display',"Ivy Presto",Georgia,"Times New Roman",serif;
  --font-text:'Inter',ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --r-card:12px; --r-pill:9999px; --r-sm:4px;
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;color-scheme:dark}
body{font-family:var(--font-text);font-size:16px;line-height:1.5;background:var(--canvas);color:var(--bone);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
[hidden]{display:none!important}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
h1,h2{font-family:var(--font-display);font-weight:400;letter-spacing:.01em;color:var(--white)}
h3{font-family:var(--font-text);font-weight:500;color:var(--white)}
::selection{background:var(--cobalt);color:#fff}
.wrap{width:min(1216px,100% - 48px);margin-inline:auto}
@media(max-width:480px){.wrap{width:calc(100% - 32px)}}
.eyebrow{display:inline-block;font-size:13px;font-weight:600;letter-spacing:-.02em;line-height:1;color:var(--copper);text-transform:uppercase}
`;

export const cssIndex = tokens + `
/* Nav: transparente sobre el hero, vidrio esmerilado al hacer scroll */
.nav{position:sticky;top:0;z-index:50;background:rgba(23,23,33,.72);backdrop-filter:blur(20px) saturate(1.4);border-bottom:1px solid var(--hair)}
.nav .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:12px}
.brand{font-family:var(--font-display);font-size:22px;letter-spacing:.01em;display:flex;align-items:center;gap:10px;color:var(--white)}
.brand .dot{width:8px;height:8px;border-radius:50%;background:var(--copper)}
.nav ul{display:none;list-style:none;gap:4px;font-size:14px;color:var(--fog)}
.nav ul a{padding:6px 10px;border-radius:var(--r-pill);transition:color .15s}
.nav ul a:hover{color:var(--white)}
@media(min-width:820px){.nav ul{display:flex}}

/* Botones: dos arquetipos */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:var(--r-pill);padding:10px 20px;font-size:14px;font-weight:500;line-height:1.4;background:transparent;color:var(--ivory);border:1px solid var(--ivory);white-space:nowrap;transition:background .15s,color .15s,border-color .15s}
.btn:hover{background:var(--panel)}
.btn-wa{background:var(--cobalt);color:#fff;border-color:var(--cobalt)}
.btn-wa:hover{background:var(--cobalt-hover);border-color:var(--cobalt-hover)}
.btn-accent{border-color:var(--steel);color:var(--ivory)}
.btn-sm{padding:8px 16px;font-size:13px}
.btn svg{width:16px;height:16px;flex:none}

/* Hero */
.hero{padding:88px 0 96px;border-bottom:1px solid var(--hair)}
.hero .wrap{display:grid;gap:48px;align-items:center}
@media(min-width:820px){.hero{padding:128px 0 144px}.hero .wrap{grid-template-columns:1.25fr .75fr;gap:72px}}
.kicker{display:inline-block;font-size:13px;font-weight:600;letter-spacing:-.02em;line-height:1;color:var(--copper);text-transform:uppercase;margin-bottom:24px}
.hero h1{font-size:clamp(42px,6vw,76px);line-height:1.02;letter-spacing:.01em;text-wrap:balance}
.hero h1 em{font-style:italic;color:var(--copper)}
.hero .lead{margin-top:28px;font-size:20px;line-height:1.38;letter-spacing:-.04em;font-weight:300;color:var(--mist);max-width:36ch;text-wrap:pretty}
@media(max-width:480px){.hero .lead{font-size:18px;letter-spacing:-.02em}}
.hero .ctas{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:36px}
.hero .proof{display:flex;flex-wrap:wrap;gap:12px 32px;margin-top:48px;font-size:14px;color:var(--fog)}
.hero .proof b{font-family:var(--font-display);font-weight:400;font-size:28px;line-height:1;color:var(--white);margin-right:6px;vertical-align:-3px}
.foto{position:relative;justify-self:center;width:min(380px,100%);background:var(--card);border-radius:var(--r-card);padding:12px}
.foto img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:8px;background:var(--panel);filter:saturate(.85)}
.foto .tag{padding:16px 8px 6px;font-size:14px;color:var(--fog)}
.foto .tag b{display:block;font-family:var(--font-display);font-weight:400;font-size:21px;color:var(--white);letter-spacing:.01em;margin-bottom:2px}

/* Bandas: un solo canvas continuo, ritmo por aire y hairlines */
section{padding:112px 0}
@media(min-width:820px){section{padding:160px 0}}
.alt{border-block:1px solid var(--hair)}
.sec-head{margin-bottom:48px;max-width:720px}
.sec-head h2{font-size:clamp(32px,5vw,52px);line-height:1.13;letter-spacing:.01em}
.sec-head p{margin-top:16px;color:var(--fog);font-size:18px;line-height:1.38;letter-spacing:-.02em}

/* Cómo trabajo */
.pasos{display:grid;gap:16px}
@media(min-width:720px){.pasos{grid-template-columns:repeat(3,1fr)}}
.paso{background:var(--card);border-radius:var(--r-card);padding:32px}
.paso .n{font-family:var(--font-display);font-size:44px;line-height:1;color:var(--copper);margin-bottom:20px}
.paso h3{font-size:18px;margin-bottom:8px}
.paso p{color:var(--fog);font-size:16px}

/* Filtros */
.filtros{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px}
.chip{border:1px solid var(--steel);background:transparent;color:var(--ivory);border-radius:var(--r-pill);padding:8px 14px;font-size:13px;font-weight:500}
.chip[aria-pressed="true"]{background:var(--white);color:#000;border-color:var(--white)}

/* Casos */
.casos{display:grid;gap:16px}
@media(min-width:820px){.casos{grid-template-columns:repeat(2,1fr)}}
.caso{background:var(--card);border-radius:var(--r-card);padding:32px;display:flex;flex-direction:column;gap:18px;min-width:0}
.caso.oculto{display:none}
.caso-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.caso h3{font-family:var(--font-display);font-weight:400;font-size:28px;line-height:1.15;letter-spacing:.01em}
.caso .cli{color:var(--fog);font-size:14px;margin-top:6px}
.estado{font-size:12px;font-weight:500;padding:4px 10px;border-radius:var(--r-pill);white-space:nowrap;flex:none;border:1px solid var(--steel);color:var(--mist);background:transparent}
.e-prod{color:var(--sage);border-color:var(--sage)}
.e-prop{color:var(--copper);border-color:var(--copper)}
.e-acad{color:var(--mist);border-color:var(--steel)}
.caso .resumen{color:var(--bone);font-size:16px}
.psr{display:grid;gap:12px}
.psr div{border-top:1px solid var(--hair);padding-top:12px}
.psr b{display:block;font-size:13px;font-weight:600;letter-spacing:-.02em;text-transform:uppercase;color:var(--copper);margin-bottom:6px}
.psr p{font-size:15px;line-height:1.5;color:var(--silver)}
.psr ul{display:none;padding-left:18px;font-size:15px;line-height:1.5;color:var(--silver)}
.psr li+li{margin-top:4px}
.caso.abierto .psr ul{display:block}
.caso.abierto .psr p{display:none}
.stack{display:flex;flex-wrap:wrap;gap:6px}
.stack span{font-size:12px;border:1px solid var(--hair2);color:var(--mist);border-radius:var(--r-pill);padding:4px 10px}
.caso-acc{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:4px}
.caso-acc .btn,.demo-acc .btn{flex:1 1 auto;min-width:0}
.link-mas{font-size:14px;font-weight:500;color:var(--copper);align-self:flex-start;border-bottom:1px solid transparent}
.link-mas:hover{border-bottom-color:var(--copper)}

/* Demos */
.demos{display:grid;gap:16px}
@media(min-width:720px){.demos{grid-template-columns:repeat(2,1fr)}}
@media(min-width:1024px){.demos{grid-template-columns:repeat(3,1fr)}}
.demo{background:var(--card);border-radius:var(--r-card);padding:32px;display:flex;flex-direction:column;gap:14px;min-width:0}
.demo .tipo{font-size:13px;font-weight:600;letter-spacing:-.02em;text-transform:uppercase;color:var(--copper)}
.demo h3{font-size:20px;line-height:1.3;letter-spacing:-.02em}
.demo p{color:var(--fog);font-size:15px;flex:1}
.cred{border:1px solid var(--hair2);border-radius:var(--r-card);padding:12px 14px;font-size:14px;display:grid;gap:6px;background:var(--canvas)}
.cred .row{display:flex;align-items:center;justify-content:space-between;gap:8px}
.cred code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;background:var(--panel);color:var(--ivory);padding:2px 8px;border-radius:var(--r-sm)}
.cred button,.cred a{font-size:13px;font-weight:600;color:var(--copper);padding:2px 0}
.cred small{color:var(--fog);font-size:12px}
.demo-acc{display:flex;flex-wrap:wrap;gap:8px}

/* Sobre mí */
.sobre{display:grid;gap:48px;align-items:start}
@media(min-width:820px){.sobre{grid-template-columns:.8fr 1.2fr;gap:72px}}
.sobre img{width:min(400px,100%);aspect-ratio:4/5;object-fit:cover;border-radius:var(--r-card);background:var(--card);filter:saturate(.85)}
.sobre p{color:var(--bone);margin-bottom:16px;font-size:16px}
.ventajas{display:grid;gap:12px;margin:28px 0;list-style:none}
.ventajas li{display:flex;gap:12px;align-items:flex-start;font-size:16px;color:var(--bone)}
.ventajas b{color:var(--white);font-weight:500}
.ventajas svg{width:18px;height:18px;flex:none;color:var(--copper);margin-top:4px}
.pill-row{display:flex;flex-wrap:wrap;gap:6px}
.pill-row span{font-size:12px;border:1px solid var(--hair2);border-radius:var(--r-pill);padding:5px 12px;color:var(--mist)}

/* FAQ: filas con hairline, sin tarjetas */
.faq{max-width:800px;border-top:1px solid var(--hair)}
details{border-bottom:1px solid var(--hair)}
summary{cursor:pointer;list-style:none;padding:22px 0;font-family:var(--font-display);font-weight:400;font-size:24px;line-height:1.2;letter-spacing:.01em;color:var(--white);display:flex;justify-content:space-between;align-items:center;gap:16px}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";font-family:var(--font-text);font-weight:300;font-size:28px;color:var(--steel);flex:none;line-height:1}
details[open] summary::after{content:"–"}
details p{padding:0 0 24px;color:var(--silver);max-width:64ch}

/* Contacto */
.contacto{display:grid;gap:48px}
@media(min-width:820px){.contacto{grid-template-columns:1fr 1fr;gap:72px}}
form{display:grid;gap:14px;background:var(--card);border-radius:var(--r-card);padding:32px}
label{font-size:13px;font-weight:500;color:var(--mist);display:grid;gap:8px}
input,textarea,select{font:inherit;font-size:16px;color:var(--ivory);background:transparent;border:1px solid var(--steel);border-radius:var(--r-pill);padding:12px 20px;width:100%}
input::placeholder,textarea::placeholder{color:var(--steel)}
textarea{border-radius:16px;min-height:120px;resize:vertical}
input:focus,textarea:focus,select:focus{outline:none;border-color:var(--ivory)}
.form-note{font-size:12px;color:var(--fog)}
.dato{display:flex;gap:14px;align-items:flex-start;margin-bottom:24px}
.dato svg{width:20px;height:20px;color:var(--steel);flex:none;margin-top:2px}
.dato b{display:block;color:var(--white);font-weight:500}
.dato span{color:var(--fog);font-size:15px}
.dato a{color:var(--copper)}

footer{border-top:1px solid var(--hair);padding:32px 0 108px;color:var(--fog);font-size:13px}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px}
footer a{color:var(--copper)}

/* WhatsApp flotante: misma acción primaria, mismo pill cobalto */
.wa-float{position:fixed;right:16px;bottom:16px;z-index:60;display:flex;align-items:center;gap:8px;background:var(--cobalt);color:#fff;border-radius:var(--r-pill);padding:12px 20px 12px 14px;font-size:14px;font-weight:500}
.wa-float:hover{background:var(--cobalt-hover)}
.wa-float svg{width:22px;height:22px}
@media(max-width:600px){.caso,.demo,.paso,form{padding:24px}.caso h3{font-size:24px}.caso-acc .btn,.demo-acc .btn{white-space:normal;text-align:center}}
@media(max-width:480px){.wa-float span{display:none}.wa-float{padding:14px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
`;

// PDF imprimible: papel blanco (la tinta oscura no se imprime bien) con la misma voz tipográfica y acentos.
export const cssCaso = tokens + `
@page{size:letter;margin:0}
html{color-scheme:light}
body{background:#fff;color:#1c1d22}
h1,h2{color:#08080a}
.hoja{width:8.5in;min-height:11in;margin:0 auto;padding:.6in .65in .5in;display:flex;flex-direction:column;gap:.2in;background:#fff}
.cab{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:1px solid #1c1d22;padding-bottom:14px}
.cab .k{font-size:9pt;letter-spacing:-.01em;text-transform:uppercase;color:var(--copper);font-weight:600}
.cab h1{font-size:26pt;letter-spacing:.01em;line-height:1.05;margin-top:6px;font-weight:400}
.cab .cli{color:#5e616e;font-size:10pt;margin-top:4px}
.cab .yo{text-align:right;font-size:9pt;color:#5e616e;line-height:1.45}
.cab .yo b{display:block;color:#08080a;font-size:10.5pt;font-weight:500}
.estado-pdf{display:inline-block;font-size:8pt;font-weight:500;padding:3px 10px;border-radius:9999px;border:1px solid;margin-top:8px;background:transparent!important}
.resumen{font-size:12pt;line-height:1.38;letter-spacing:-.01em;color:#1c1d22;text-wrap:pretty}
.tres{display:grid;grid-template-columns:1fr;gap:12px}
.bloque{border-top:1px solid #d6d6d6;padding-top:8px;break-inside:avoid}
.bloque h2{font-family:var(--font-text);font-size:8.5pt;letter-spacing:-.01em;text-transform:uppercase;margin-bottom:5px;font-weight:600;color:var(--copper)}
.bloque ul{padding-left:16px;font-size:10pt;line-height:1.42;color:#2e3038;display:grid;gap:3px}
.stack-pdf{display:flex;flex-wrap:wrap;gap:5px}
.stack-pdf span{font-size:8pt;border:1px solid #c7c9d1;border-radius:9999px;padding:3px 9px;color:#5e616e}
.pie{margin-top:auto;border-top:1px solid #d6d6d6;padding-top:12px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:9pt;color:#5e616e}
.pie .cta{background:var(--cobalt);color:#fff;font-weight:500;padding:8px 16px;border-radius:9999px;font-size:9.5pt;white-space:nowrap}
.pie a{color:var(--copper)}
.barra{display:flex;gap:8px;justify-content:center;padding:14px;background:var(--canvas);font-size:14px}
.barra a,.barra button{border:1px solid var(--ivory);color:var(--ivory);border-radius:9999px;padding:8px 16px;font-weight:500}
@media print{.barra{display:none}.hoja{margin:0;min-height:auto;height:11in}}
@media screen and (max-width:700px){.hoja{width:100%;padding:24px 16px}}
`;

// Enlaces de fuentes (Playfair Display para titulares, Inter para UI). display=swap para no bloquear el render.
export const fuentesHead = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap">`;
