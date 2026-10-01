# syntax=docker/dockerfile:1

# Imagen de runtime para Next.js 16 con `output: "standalone"`.
#
# Replica el patron de Denux-site-web, que ya esta en produccion y aguanta.
# Las decisiones que no son obvias y que cuestan un 502 si se olvidan:
#
# 1. `HOSTNAME=0.0.0.0` y NO `HOST`. Coolify inyecta `HOST`, pero el
#    `server.js` que genera Next lee `HOSTNAME`. Si solo se define `HOST`,
#    el proceso escucha en el loopback y el proxy responde "no available
#    server" aunque el contenedor este sano.
#
# 2. `public/` y `.next/static/` se copian a mano. El modo standalone no
#    los incluye, y sin ellos todos los estaticos dan 404. Aqui importa de
#    verdad: los 23 logos del stack viven en public/logos y sin este COPY el
#    muro de tecnologias sale entero sin iconos.
#
# 3. El tag de Node esta fijado a la version mayor.menor (22-alpine) en vez
#    de `latest`. Con `latest` una rebase puede cambiar el runtime sin que
#    cambie el codigo.

ARG NODE_VERSION=22

###############################################################################
# base -- toolchain comun
###############################################################################
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# corepack lee el campo `packageManager` de package.json, de modo que la
# version de pnpm en el contenedor es la del proyecto y no la de la imagen.
RUN corepack enable

###############################################################################
# deps -- solo dependencias, capa cacheable
###############################################################################
FROM base AS deps
# Next.js usa musl en alpine; sin esto, swc falla al buscar su binario.
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Solo los manifiestos primero: mientras estos no cambien, Docker reutiliza
# la capa y no reinstala cientos de MB de dependencias en cada build.
# pnpm-workspace.yaml NO es opcional: pnpm 12 lee de ahi el `allowBuilds` que
# habilita los binarios de esbuild y sharp. Si este COPY se queda solo con los
# dos manifiestos, el install aborta con ERR_PNPM_IGNORED_BUILDS y el fallo
# solo aparece aqui, no en el CI, que ya tiene el checkout completo.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# --frozen-lockfile falla si el lockfile no cuadra con package.json. En CI un
# lockfile desincronizado debe romper el build, no resolverse en silencio a una
# version distinta.
RUN pnpm install --frozen-lockfile

###############################################################################
# builder -- construye la app
###############################################################################
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# git no versiona directorios vacios, asi que sin este mkdir el COPY de public/
# en el runner aborta el build entero. Se crea en el builder, que es la unica
# forma de que un COPY condicional tenga un origen real.
RUN mkdir -p /app/public

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

###############################################################################
# runner -- imagen final minima
###############################################################################
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Ver el punto 1 de la cabecera. Sin esto, el contenedor arranca y no
# responde.
ENV HOSTNAME=0.0.0.0

# curl hace falta para el healthcheck HTTP de Coolify, que se ejecuta DENTRO
# del contenedor. Si la imagen no lo trae, el healthcheck falla siempre y el
# proxy marca el contenedor como unhealthy.
RUN apk add --no-cache curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Los estaticos van como root pero se leen como nextjs: `standalone` deja
# algunos ficheros con permisos restrictivos que rompen el COPY --chown.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# No se ejecuta como root: un compromiso del proceso no da root al host.
USER nextjs

EXPOSE 3000

# El healthcheck pega a la raiz, que es la pagina de redireccion por idioma:
# responde 307 sin tocar disco ni base de datos. Un healthcheck que dependiera
# de mas podria marcar como unhealthy una app que funciona.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl --fail --silent --show-error --max-time 4 http://127.0.0.1:3000/en || exit 1

CMD ["node", "server.js"]
