# Portadas de los casos (laptop + teléfono)

Genera `img/casos/<slug>.webp` (1600×1000, tarjetas y página del caso) y `img/casos/<slug>.jpg` (1200×750, vista previa en WhatsApp).
Usa el Chrome instalado; no descarga navegadores.

```bash
cd herramientas/portadas && npm install          # solo la primera vez
npx serve -l 4173 ../..                           # en otra terminal: sirve el sitio para las demos locales
node capturar.mjs                                 # capturas 390×844 (2×) y 1440×900 (1.5×) → cap/
EF_PANEL="$HOME/Documents/Padre/Gestion de escuela/public/ayuda-comenzar/01-dashboard-nueva-asignatura.png" \
GYM_PANTALLAS=../../demos/gymmachine/pantallas node componer.mjs   # → out/
cp out/* ../../img/casos/ && cd ../.. && node src/build.mjs && ./src/generar-pdf.sh
```

- Proyecto web → laptop + teléfono. Programa de escritorio (MediConsulta) → solo laptop. App Android (GymMachine) → tres teléfonos.
- Evalúa Fácil pide sesión: la laptop usa la captura del panel docente de su ayuda.
- Las URLs de imagen llevan `?v=<huella>` (lo pone `src/componentes.mjs`), así que un cambio se ve al instante pese a la caché de un año.
