#!/usr/bin/env bash
# Prepara `.next/standalone/` para que se pueda ejecutar tal cual.
#
# Por que hace falta. Con `output: "standalone"`, Next genera un server.js que
# solo empaqueta lo que esta en el grafo de imports del servidor. Fuera de ese
# grafo se quedan dos cosas que el navegador si necesita, y el sintoma es
# silencioso: el build sale en verde, `next start` funciona en local, y en
# produccion la pagina aparece sin una sola clase de estilo.
#
#   1. `public/`. Los 22 logos del stack se pintan como mascara CSS
#      (`mask-image: url(/logos/x.svg)`), no como <img>: no hay ninguna
#      referencia desde el codigo, asi que el tracer no los ve. Sin ellos, el
#      logo wall aparece vacio.
#
#   2. `.next/static/`. Los chunks de CSS y JS que se sirven en
#      `/_next/static/...`. No estan en el grafo de imports: son salidas del
#      build, no entradas. Es el fallo mas caro de los dos, porque una pagina
#      sin CSS parece una pagina rota y no un fallo de despliegue.
#
# Se probo `outputFileTracingIncludes` en next.config.mjs y en Next 16.3.7 no
# copia ni `public/` ni `.next/static/`. La copia manual es lo que funciona, y
# es la misma que hace el stage runner del Dockerfile.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d ".next/standalone" ]; then
  echo "error: no existe .next/standalone. ¿Ha corrido 'next build'?" >&2
  exit 1
fi

copiar() {
  local src="$1" dst="$2" etiqueta="$3"

  if [ ! -d "$src" ]; then
    echo "aviso: no existe $src, nada que copiar ($etiqueta)" >&2
    return 0
  fi

  rm -rf "$dst"
  mkdir -p "$dst"
  cp -r "$src"/. "$dst"/
  echo "  $etiqueta: $(find "$dst" -type f | wc -l | tr -d ' ') ficheros -> $dst"
}

echo "preparando .next/standalone/"
copiar "public" ".next/standalone/public" "public"
copiar ".next/static" ".next/standalone/.next/static" ".next/static"

# Comprobacion: sin esto, un fallo aqui se descubre en el navegador y no en el
# build. Un fichero de menos produce un 404 que no rompe nada visiblemente.
for obligatorio in \
  ".next/standalone/.next/static" \
  ".next/standalone/public"
do
  if [ ! -d "$obligatorio" ]; then
    echo "error: falta $obligatorio en el standalone" >&2
    exit 1
  fi
done

css=$(find .next/standalone/.next/static -name '*.css' 2>/dev/null | wc -l | tr -d ' ')
if [ "$css" -eq 0 ]; then
  echo "error: no hay ningun .css en el standalone. Se serviria la pagina sin estilos." >&2
  exit 1
fi
echo "  css: $css fichero(s) presentes"
