#!/bin/sh
# Genera un PDF de 1 página (carta) por cada caso desde src/pdf/<slug>.html (hoja imprimible), con Chrome headless.
# Uso: ./src/generar-pdf.sh   (corre primero: node src/build.mjs)
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p casos/pdf
for html in src/pdf/*.html; do
  slug=$(basename "$html" .html)
  nombre=$(/opt/homebrew/bin/node -e "import('./src/datos.mjs').then(m=>{const c=m.casos.find(x=>x.slug==='$slug');console.log('Caso-'+c.nombre.replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-\$/g,'')+'.pdf')})")
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=4000 \
    --print-to-pdf="$PWD/casos/pdf/$nombre" "file://$PWD/$html" 2>/dev/null
  printf "%-32s %s página(s)\n" "$nombre" "$(pdfinfo "casos/pdf/$nombre" 2>/dev/null | awk '/^Pages/{print $2}')"
done
