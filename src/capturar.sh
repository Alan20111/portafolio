#!/bin/sh
# Captura una imagen representativa de cada proyecto (1280×800 → JPEG 1000 px) con Chrome headless.
# Uso: ./src/capturar.sh   — vuelve a correrlo cuando cambie una demo.
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP="${TMPDIR:-/tmp}/capturas"; mkdir -p "$TMP" img/casos
cap() { # slug url
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1280,800 --virtual-time-budget=8000 \
    --screenshot="$TMP/$1.png" "$2" 2>/dev/null
  sips -Z 1000 -s format jpeg -s formatOptions 82 "$TMP/$1.png" --out "img/casos/$1.jpg" >/dev/null
  printf "%-14s %s\n" "$1" "$(sips -g pixelWidth -g pixelHeight img/casos/$1.jpg | awk '/pixel/{printf "%s ", $2}')"
}
# evaluafacil: la SPA no renderiza en headless; su imagen viene de "Gestion de escuela/public/ayuda-comenzar/01-dashboard-nueva-asignatura.png"
# gymmachine: recorte de la página 4 de "GymMachine — Wireframes & Análisis de Vistas.pdf" (pdftoppm -r 110 + sips -c 560 935 --cropOffset 25 0)
cap bazargirl    "https://bazargirl.pages.dev/demo/"
cap aglaia       "https://aglaianails.pages.dev"
cap rawssport    "https://rawssport.pages.dev"
cap koncafe      "file://$PWD/demos/koncafe/app-cliente.html"
cap mediconsulta "file://$PWD/demos/mediconsulta/index.html"

