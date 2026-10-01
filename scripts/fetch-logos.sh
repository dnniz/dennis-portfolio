#!/usr/bin/env bash
# Descarga los logos REALES a public/logos/.
#
# Por que como mascara y no como <img>: una mascara SVG con
# `mask-image: url(...)` + `background: currentColor` pinta el logo del color
# del texto. Un solo archivo sirve en tema claro y en oscuro, y no hace falta
# mantener dos variantes.
#
# Por que dos fuentes: Simple Icons (marca oficial en un color) cubre casi todo,
# pero RETIRO hace tiempo los iconos de C#, SQL Server, Oracle y Azure porque
# esas marcas no dan permiso de redistribucion. Devicon si los mantiene. Los
# slugs estan verificados contra el indice real de cada proyecto, no de memoria:
# una slug inventada devuelve 404 y el script falla en vez de dejar un hueco.
#
# Lo que no tiene logo en ninguna de las dos fuentes (Power BI) se queda como
# texto. Un logo dibujado a mano o parecido se nota, y peor: miente sobre lo
# que se uso para construirlo.
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p public/logos

# slug|fuente
ICONS=(
  # Simple Icons
  "dotnet|simple" "nodedotjs|simple" "nestjs|simple" "express|simple"
  "typescript|simple" "angular|simple" "react|simple" "expo|simple"
  "redux|simple" "postgresql|simple" "docker|simple" "git|simple"
  "githubactions|simple" "jenkins|simple" "apachekafka|simple"
  "gitlab|simple" "trello|simple" "sonarqubecloud|simple"
  # Devicon (Simple Icons no los tiene)
  "csharp|devicon" "microsoftsqlserver|devicon" "oracle|devicon"
  "azure|devicon" "dotnetcore|devicon"
)

simple_url() {
  echo "https://cdn.simpleicons.org/$1/000000"
}

devicon_url() {
  local slug="$1" variant="$2"
  echo "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg"
}

fail=0
ok=0
for entry in "${ICONS[@]}"; do
  slug="${entry%%|*}"
  src="${entry##*|}"
  out="public/logos/${slug}.svg"

  case "$src" in
    simple)  url="$(simple_url "$slug")" ;;
    devicon) url="$(devicon_url "$slug" original)" ;;
    *) echo "FUENTE DESCONOCIDA ${src}"; fail=1; continue ;;
  esac

  code=$(curl -sS -o "$out.tmp" -w '%{http_code}' "$url")
  if [ "$code" != "200" ] || [ ! -s "$out.tmp" ]; then
    echo "FALLO ${slug} (${src}, HTTP ${code})"
    rm -f "$out.tmp"
    fail=1
    continue
  fi

  python3 - "$out.tmp" "$src" <<'PY'
import re, sys
path, src = sys.argv[1], sys.argv[2]
s = open(path, encoding="utf-8").read()

# El <title> hace que un lector de pantalla lea el nombre de la marca dos
# veces: la del logo y la de la etiqueta de texto que lo acompaña.
s = re.sub(r"<title>.*?</title>", "", s, flags=re.S)

# Simple Icons: el CDN pinta de negro plano. Devicon "original" trae la marca a
# todo color, y al enmascararla se pierde el color, que es justo lo que se
# quiere (un solo archivo para los dos temas).
s = s.replace('fill="#000000"', 'fill="currentColor"')
if 'fill="currentColor"' not in s:
    # Devicon original: el path suele venir sin atributo fill, con el color en
    # el <svg> o en un grupo. Se normaliza al currentColor del texto.
    s = s.replace("<svg", '<svg fill="currentColor"', 1) if "<svg" in s else s

open(path, "w", encoding="utf-8").write(s)
PY

  mv "$out.tmp" "$out"
  ok=$((ok + 1))
  printf 'ok  %-22s %6s bytes  (%s)\n' "$slug" "$(wc -c < "$out" | tr -d ' ')" "$src"
done

echo
echo "descargados: ${ok}/${#ICONS[@]}"
[ "$fail" -eq 0 ] || { echo "HAY FALLOS: revisa la lista de arriba"; exit 1; }
