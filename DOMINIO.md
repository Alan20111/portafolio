# Dominio, correo y SEO local

## 0. Hoy
El sitio vive en **https://alanmendez.vercel.app** (subdominio gratis de Vercel). El viejo `portafolio-ten-olive-50.vercel.app` redirige con 308.

## ⚠️ Antes de cambiar de dominio
Las tarjetas impresas llevan un QR a **alanmendez.vercel.app** (el dominio no va escrito, solo dentro del QR).
Si algún día usas `alanmendez.dev`, **no borres el proyecto ni ese subdominio en Vercel**: déjalo y redirígelo al nuevo
(en `vercel.json` ya hay una redirección de ese tipo para el dominio viejo). Así las tarjetas que ya repartiste siguen funcionando.

## 1. Comprar el dominio
Opciones baratas y sin sorpresas de renovación: **Cloudflare Registrar** (.com ≈ $220 MXN/año, ya lo usas
para AGLAIA/Raws/Bazar) o **Registro.mx / Akky** para `.mx` (≈ $400–500 MXN/año).
Sugerencia: **`alanmendez.dev`** (≈ US$12–15/año). Se puede comprar directo en Vercel (dashboard → Domains → Buy) o en Cloudflare Registrar; `.dev` obliga HTTPS, que Vercel ya da. Después, desde la carpeta del sitio:

```bash
vercel domains add alanmendez.dev
```

y cambias `sitio.dominio` en `src/datos.mjs`, corres `node src/build.mjs && ./src/generar-pdf.sh` y publicas.

## 2. Conectarlo a Vercel
1. Vercel → proyecto `portafolio` → *Settings → Domains* → agrega `tudominio.mx` y `www.tudominio.mx`.
2. En el DNS del dominio crea:
   | Tipo | Nombre | Valor |
   |---|---|---|
   | A | `@` | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |
3. Cambia `sitio.dominio` en `src/datos.mjs` por `https://tudominio.mx`, corre `node src/build.mjs` y publica
   (así el canonical, el sitemap y los PDFs apuntan al dominio nuevo).

## 3. Correo con tu dominio (hola@tudominio.mx)
La opción gratis que ya conoces: **Cloudflare Email Routing** (recibir) + **Resend** o Gmail "Enviar como" (enviar).

Registros en el DNS (Cloudflare los pone solos al activar Email Routing):
| Tipo | Nombre | Valor |
|---|---|---|
| MX | `@` | `route1.mx.cloudflare.net` (prio 69) |
| MX | `@` | `route2.mx.cloudflare.net` (prio 6) |
| MX | `@` | `route3.mx.cloudflare.net` (prio 30) |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` |

Para **enviar** desde Gmail con esa dirección: Gmail → Configuración → Cuentas → "Enviar como" → usa el SMTP
de Gmail con una contraseña de aplicación. Si prefieres buzón completo: Google Workspace (≈ $120 MXN/mes) o
Zoho Mail (gratis hasta 5 usuarios) y usas sus registros MX en lugar de los de Cloudflare.

Agrega también DMARC: `TXT _dmarc` → `v=DMARC1; p=none; rua=mailto:tu-correo`.

## 4. Ficha de Google Business
1. https://business.google.com → crea la ficha como **"Empresa de servicios"** (sin dirección pública),
   categoría *Empresa de desarrollo de software*, zona de servicio: Celaya, Tarimoro, Guanajuato.
2. Pon el sitio web, el WhatsApp y sube 3–5 capturas de las demos como fotos.
3. Copia el enlace "Compartir perfil" en `sitio.googleBusiness` (src/datos.mjs) — se agrega al JSON-LD.
4. Pide a tus clientes actuales (Bazar Girl, consultorio) una reseña con el enlace corto de la ficha.

## 5. Después de publicar
- Google Search Console → agrega el dominio → envía `https://tudominio.mx/sitemap.xml`.
- Prueba la velocidad en https://pagespeed.web.dev (el sitio no usa fuentes externas ni frameworks; debe cargar < 1 s).
- Comparte el enlace por WhatsApp y verifica que la vista previa (og.png) se vea bien.
