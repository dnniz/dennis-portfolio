/**
 * Sin anotacion de tipo: este archivo es .mjs, no TypeScript. `import type`
 * aqui hace que Next falle al cargarlo con "SyntaxError: Unexpected token '{'",
 * porque Node lo parsea como JavaScript puro antes de que nada lo transforme.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // El contenedor de Coolify arranca `node .next/standalone/server.js`, que es
  // el unico output que no arrastra node_modules entero a la imagen final.
  output: "standalone",
  reactStrictMode: true,
  // Next anade `X-Powered-By: Next.js` a cada respuesta. No dice nada util y
  // solo anuncia la technology a quien escanea cabeceras.
  poweredByHeader: false,
  // El portfolio no tiene imagenes optimas que servir (los logos son SVG
  // enmascarados por CSS), asi que el optimizer solo anade una capa.
  images: { unoptimized: true },
  // Cabeceras de seguridad basicas. Coolify/Traefik termina TLS delante, asi
  // que HSTS se deja fuera: si lo fija la app y luego el proxy no sirve
  // HTTPS, el navegador deja de poder volver a la version segura.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
