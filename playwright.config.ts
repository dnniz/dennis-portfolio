import { defineConfig, devices } from "@playwright/test";

/**
 * Solo se comprueba accesibilidad, y por una razon concreta: en un portfolio lo
 * unico que se comprueba de verdad es si un reclutador puede leerlo. Un fallo de
 * contraste o un enlace sin nombre no se ven en el codigo, y el test de
 * contraste en vitest solo mira los tokens, no lo que se pinta.
 *
 * axe corre sobre la pagina ya renderizada, que es donde aparecen los problemas
 * que los tokens no cubren: el nombre accesible de un boton que solo tiene un
 * SVG, el idioma del documento, la jerarquia de encabezados.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://127.0.0.1:3000",
    // El tema oscuro lo aplica un script de <head>. Sin esperar a que termine,
    // axe puede medir el color de fondo del tema claro sobre un texto que ya
    // es del oscuro, y reportar un contraste que no existe.
    colorScheme: "dark",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // `pnpm build && pnpm start` en vez de `next dev`: en dev hay HMR activo y
  // React monta dos veces, lo que produce falsos positivos de accesibilidad.
  // webServer corre en local tambien, para que el comando sea el mismo.
  webServer: {
    command: "pnpm build && pnpm start",
    url: "http://127.0.0.1:3000/en",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
  },
});
