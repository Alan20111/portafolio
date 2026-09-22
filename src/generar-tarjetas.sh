#!/bin/sh
# Genera el PDF de tarjetas de presentación (10 por hoja carta) desde src/tarjetas.html.
# Uso: ./src/generar-tarjetas.sh
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p tarjetas
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$PWD/tarjetas/Tarjetas-Alan-Mendez.pdf" "file://$PWD/src/tarjetas.html" 2>/dev/null
echo "tarjetas/Tarjetas-Alan-Mendez.pdf · $(pdfinfo tarjetas/Tarjetas-Alan-Mendez.pdf 2>/dev/null | awk '/^Pages/{print $2}') página(s) · $(pdfinfo tarjetas/Tarjetas-Alan-Mendez.pdf 2>/dev/null | awk '/^Page size/{print $3, $4, $5}')"
