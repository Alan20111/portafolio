# Portafolio comercial — Alan Méndez

Sitio estático (HTML/CSS/JS sin framework ni build en el servidor; estilo "galería blanca" tipo Apple definido en `src/estilos.mjs`) para vender software a medida a
negocios locales y PyMEs. Se publica en Vercel desde el repo `Alan20111/portafolio` (rama `main`).

**En vivo:** https://portafolio-ten-olive-50.vercel.app

## Cómo editar

Todo el contenido vive en **`src/datos.mjs`** (datos de contacto, casos de estudio, demos, FAQ).
Después de editarlo:

```bash
node src/build.mjs          # genera index.html, casos/*.html, sitemap.xml, robots.txt
./src/generar-pdf.sh        # regenera los PDFs de 1 página en casos/pdf/ (usa Google Chrome)
```

Y haces commit + push a `main`; Vercel publica solo en ~10 segundos.

Para verlo en local: `npx serve .` y abre http://localhost:3000.

## Estructura

```
index.html            página principal (generada)
casos/<slug>.html     caso de estudio imprimible (generado)
casos/pdf/*.pdf       PDF de 1 página por caso (generado)
demos/                prototipos autocontenidos hospedados aquí (KonCafe, MediConsulta, GymMachine)
img/alan.jpg          ← PON AQUÍ tu foto (cuadrada, ≥600 px). Mientras no exista, usa el avatar de GitHub.
img/og.png            imagen para WhatsApp/redes (1200×630)
src/datos.mjs         ← contenido
src/build.mjs         generador
vercel.json           URLs limpias, cabeceras de seguridad y caché
```

## Agregar un caso nuevo

1. Copia un objeto de `casos` en `src/datos.mjs` y llena `problema`, `solucion`, `resultado` (3–4 puntos cada uno para que quepa en 1 página).
2. Si tiene demo, llena `demo` (`credenciales` acepta `{ etiqueta, usuario, clave, nota }`).
3. `node src/build.mjs && ./src/generar-pdf.sh`.

## Analítica

- **Vercel Web Analytics:** en el dashboard del proyecto `portafolio` → pestaña *Analytics* → *Enable*. El script ya está en la página; a partir de ahí verás visitas y los eventos personalizados:
  `whatsapp_click` (origen: nav/hero/contacto/flotante), `demo_click` (demo), `caso_pdf` (caso), `caso_expandir`, `caso_demo`, `caso_sitio`, `demo_solicitar`, `filtro_casos`, `form_submit`.
- **GA4 (opcional):** pon tu ID en `sitio.ga4` y se cargan los mismos eventos ahí.

## Dominio, correo y SEO local

Ver [`DOMINIO.md`](DOMINIO.md).
