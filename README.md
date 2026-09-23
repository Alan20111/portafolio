# Portafolio comercial — Alan Méndez

Sitio estático (HTML/CSS/JS sin framework ni build en el servidor; sistema de estilo definido en `src/estilos.mjs`: síntesis de Mercury (canvas oscuro, cobalto), Slash (serif Playfair + cobre) y Apple (titular teñido, dos botones)) para vender software a medida a
negocios locales y PyMEs. Se publica en Vercel desde el repo `Alan20111/portafolio` (rama `main`).

**En vivo:** https://alanmendez.vercel.app (el viejo portafolio-ten-olive-50.vercel.app redirige aquí)

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
src/datos.mjs         ← contenido (casos, demos, FAQ, contacto)
src/estilos.mjs       ← sistema de diseño: tokens de color/tipografía, CSS del sitio, del caso, del PDF y de las demos
src/componentes.mjs   ← piezas HTML reutilizables: cabecera(), navegacion(), pie(), portada(), iconos, huella ?v=
src/build.mjs         ← arma las páginas con los componentes (no repite HTML a mano)
assets/sistema.css    ← (generado) estilos compartidos de las demos: azulejos, teléfono, tablet, laptop, visor 100dvh
assets/visor.js       ← comportamiento común de los visores: escalar el dispositivo y azulejos sin mover la página
index.html, casos/    ← (generado) principal y una página por caso; src/pdf/ es la fuente de cada PDF de 1 página
demos/<x>/            ← demos alojadas; los visores usan /assets/sistema.css + /assets/visor.js
img/casos/<slug>.webp ← portada 1600×1000 (se muestra ≤ 880 px: nítida en retina); .jpg 1200×750 para WhatsApp
herramientas/         ← scripts para regenerar portadas y capturas de GymMachine
```

### Reglas de tamaño
- Imágenes de contenido: máximo `--media-lg` (880 px) de ancho en pantalla; la fuente siempre es ~2× para que se vea nítida.
- Visores de demo: todo cabe en 100dvh; el dispositivo se dibuja a tamaño real y `Visor.escalar` lo ajusta.

### Nuevo visor de demo
Copia `demos/koncafe/index.html` (dispositivos con HTML vivo) o `demos/gymmachine/index.html` (capturas),
cambia los datos del arreglo y los íconos del `<svg>` de símbolos. El CSS y el JS ya vienen de `/assets/`.

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
