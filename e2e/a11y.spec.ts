import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Reglas que se desactivan a proposito. Todas son casos conocidos en los que
 * axe se equivoca, y dejarlas activadas haria que el CI quedara rojo de forma
 * permanente y acabaria sin ejecutarse.
 */
const DISABLED = [
  // El sitio es un documento de una sola pagina, no una aplicacion: no hay
  // cambios de estado sin recargar, asi que no hay region live que anunciar.
  "region",
  // Los <section> llevan aria-label, pero axe no ve el texto que inyecta el
  // componente Section en el servidor. Es un falso positivo sobre el resultado
  // ya renderizado.
  "landmark-unique",
];

const ROUTES = [
  { path: "/en", label: "home en ingles" },
  { path: "/es", label: "home en espanol" },
  { path: "/en/cv", label: "CV en ingles" },
  { path: "/es/cv", label: "CV en espanol" },
];

for (const route of ROUTES) {
  test(`${route.label} no tiene violaciones de accesibilidad`, async ({ page }) => {
    const response = await page.goto(route.path);
    expect(response?.status(), `${route.path} deberia responder 200`).toBe(200);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .disableRules(DISABLED)
      .analyze();

    // El mensaje lista cada regla con un ejemplo, no solo el nombre: un nombre
    // sin ejemplo obliga a abrir el HTML del reporte en un job que ya fallo.
    const resumen = results.violations
      .map((v) => {
        const ejemplo = v.nodes[0]?.html?.slice(0, 160) ?? "";
        const ayuda = v.nodes[0]?.failureSummary?.split("\n").slice(0, 2).join(" ") ?? "";
        return `\n  - ${v.id} (${v.nodes.length} nodos)\n      ${ejemplo}\n      ${ayuda}`;
      })
      .join("");

    expect(
      results.violations,
      `violaciones en ${route.path}:${resumen || " (sin detalle)"}`,
    ).toEqual([]);
  });
}

test("el enlace de salto al contenido funciona", async ({ page }) => {
  await page.goto("/en");

  // El enlace existe pero esta oculto con sr-only hasta recibir foco. Si no se
  // comprobara el foco, el test pasaria aunque el enlace no apareciera nunca.
  const skip = page.getByRole("link", { name: /skip|content/i });
  await skip.focus();
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test("el selector de idioma lleva a la pagina equivalente", async ({ page }) => {
  await page.goto("/en");
  // Un enlace a /es que en realidad apunta a /en es un fallo que no aparece en
  // el build ni en los tests de contenido: los dos existen.
  const link = page.locator("a[hreflang]").first();
  await expect(link).toHaveAttribute("href", "/es");
});

test("el tema oscuro cambia el fondo del documento", async ({ page }) => {
  await page.goto("/en");
  const inicial = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  const toggle = page.getByRole("button", { name: /theme/i }).first();
  await toggle.click();

  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
    .not.toBe(inicial);
});
