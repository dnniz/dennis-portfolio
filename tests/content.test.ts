import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALE_PATH, copy, isLocale, person, roles, stackGroups } from "@/lib/content";

/**
 * Guard de paridad de copy.
 *
 * El fallo que atrapa: anadir una clave al copy en ingles y olvidarla en
 * espanol. El tipo `T` obliga a que existan ambas, pero NO a que tengan la
 * misma longitud las listas ni el mismo contenido en las estructuras anidadas.
 * Un `body: ["un parrafo"]` en ingles y tres en espanol compila sin queja y
 * produce una pagina descompensada que solo se ve leyendo las dos.
 */
describe("paridad de copy ES/EN", () => {
  const es = copy.es;
  const en = copy.en;

  it("el copy tiene las mismas secciones en ambos idiomas", () => {
    expect(Object.keys(es).sort()).toEqual(Object.keys(en).sort());
  });

  it("las listasmetricas coinciden en numero y orden", () => {
    expect(es.metrics.length).toBe(en.metrics.length);
    es.metrics.forEach((m, i) => {
      expect(en.metrics[i].value).toBe(m.value);
    });
  });

  it("el titular del hero no setranslate solo (mismo idioma, distinta frase)", () => {
    expect(es.hero.headline).not.toBe(en.hero.headline);
    expect(es.hero.eyebrow).not.toBe("");
    expect(en.hero.eyebrow).not.toBe("");
  });

  it("cada parrafo de 'about' tiene su equivalente en el otro idioma", () => {
    expect(es.about.body.length).toBe(en.about.body.length);
    es.about.body.forEach((p, i) => {
      expect(p.length).toBeGreaterThan(40);
      expect(en.about.body[i].length).toBeGreaterThan(40);
    });
  });

  it("los tres bloques de herramientas de IA estan traducidos", () => {
    expect(es.ai.items.length).toBe(3);
    expect(es.ai.items.length).toBe(en.ai.items.length);
    es.ai.items.forEach((item, i) => {
      expect(en.ai.items[i].title).not.toBe(item.title);
    });
  });

  it("las etiquetas de navegacion son distintas por idioma (no se copiaron)", () => {
    (Object.keys(es.nav) as (keyof typeof es.nav)[]).forEach((k) => {
      expect(es.nav[k].length).toBeGreaterThan(0);
      expect(en.nav[k].length).toBeGreaterThan(0);
    });
  });
});

/**
 * Guard de las metricas.
 *
 * Los numeros del hero son afirmaciones comprobables: salen del CV, no del
 * diseno. Si alguien edita el copy y escribe "15 anos" para sonar mas senior,
 * este test lo para. Es la unica defensa que tiene el sitio contra su propio
 * autor.
 */
describe("metricas,{cite las del CV}", () => {
  it("el copy declara 9 anos, 13 proyectos y 1M+ usuarios", () => {
    const values = copy.en.metrics.map((m) => m.value);
    expect(values).toContain("9");
    expect(values).toContain("13");
    expect(values).toContain("1M+");
  });

  it("el numero de roles coincide con la metrica de proyectos entregados", () => {
    expect(roles.length).toBe(13);
    const projects = copy.en.metrics.find((m) => m.value === "13");
    expect(projects).toBeDefined();
  });

  it("todos los roles tienen bullets en ambos idiomas", () => {
    roles.forEach((r) => {
      expect(r.bullets.en.length).toBeGreaterThan(0);
      expect(r.bullets.es.length).toBe(r.bullets.en.length);
    });
  });

  it("los roles estan ordenados del mas reciente al mas antiguo", () => {
    const years = roles.map((r) => Number(r.period.en.match(/\d{4}/)?.[0] ?? 0));
    for (let i = 1; i < years.length; i++) {
      expect(years[i - 1]).toBeGreaterThanOrEqual(years[i]);
    }
  });

  it("cada rol tiene un id unico (se usa como key de React)", () => {
    const ids = roles.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

/**
 * Guard de logos.
 *
 * Un slug de icono que no existe en public/logos no falla el build: el
 * `mask-image` simplemente no pinta nada y la celda sale vacia. El fallo se ve
 * en pantalla, tarde. Este test convierte un defecto visual en un fallo de CI.
 */
describe("logos del stack", () => {
  const dir = join(process.cwd(), "public", "logos");

  const iconEntries = stackGroups.flatMap((g) =>
    g.items.map((i) => ({ group: g.id, name: i.name, icon: i.icon })),
  );

  it("hay al menos una tecnologia con logo", () => {
    expect(iconEntries.filter((i) => i.icon).length).toBeGreaterThan(15);
  });

  it("cada slug referenciado existe como archivo SVG", () => {
    const missing = iconEntries
      .filter((i) => i.icon)
      .filter((i) => !existsSync(join(dir, `${i.icon}.svg`)));
    expect(missing, `logos ausentes: ${missing.map((m) => m.icon).join(", ")}`).toEqual([]);
  });

  it("no hay SVG huerfanos en public/logos", () => {
    // El caso inverso: un logo descargado que ya no usa nadie. No rompe nada,
    // pero infla la imagen de Docker y hace que el directorio parezca mas
    // completo de lo que la pagina realmente llega a mostrar.
    const usados = new Set(iconEntries.map((i) => i.icon).filter(Boolean));
    const enDisco = readdirSync(dir)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => f.replace(/\.svg$/, ""));
    expect(enDisco.filter((s) => !usados.has(s)), "SVG que nadie referencia").toEqual([]);
  });

  it("el standalone lleva public/ y .next/static (si no, 404 al desplegar)", () => {
    // Dos fallos silenciosos del mismo tipo. El segundo es el caro.
    //
    // 1. `public/`: los logos se pintan como mascara CSS, no como <img>, asi
    //    que el tracer de ficheros no ve referencia alguna y no los copia.
    // 2. `.next/static/`: los chunks de CSS y JS de `/_next/static/...`. Son
    //    salidas del build, no entradas del grafo de imports, asi que tampoco se
    //    copian. Sin ellos la pagina se sirve SIN UNA SOLA CLASE DE ESTILO. El
    //    build sale verde y `next start` en local va bien, porque ahi no hay
    //    standalone de por medio: solo se rompe al desplegar, y parece culpa de
    //    Coolify o del dominio.
    //
    // Las dos versiones anteriores de este test comprobaban que el script
    // existiera y que `outputFileTracingIncludes` estuviera en la config. Las
    // dos pasaron mientras el sitio se servia sin estilos: se estaba
    // comprobando la intencion en lugar del resultado.
    const standalone = join(process.cwd(), ".next", "standalone");
    if (!existsSync(standalone)) return; // sin build previo, nada que comprobar

    const logos = join(standalone, "public", "logos");
    expect(
      existsSync(logos) && readdirSync(logos).length > 0,
      "public/logos no llego al standalone",
    ).toBe(true);

    const staticDir = join(standalone, ".next", "static");
    expect(existsSync(staticDir), ".next/static no llego al standalone").toBe(true);

    const css = readdirSync(staticDir, { recursive: true })
      .map(String)
      .filter((f) => f.endsWith(".css"));
    expect(
      css.length,
      "no hay ningun .css en el standalone: la pagina se serviria sin estilos",
    ).toBeGreaterThan(0);
  });

  it("los SVG no llevan <title> (el nombre ya va en el texto de al lado)", () => {
    const offenders = iconEntries
      .filter((i) => i.icon)
      .filter((i) => readFileSync(join(dir, `${i.icon}.svg`), "utf8").includes("<title>"));
    expect(offenders.map((o) => o.icon)).toEqual([]);
  });

  it("Power BI va sin logo en vez de con un icono inventado", () => {
    // No hay logo oficial redistribuible de Power BI. Si alguien "arregla" esto
    // con un dibujo parecido, este test avisa.
    const powerBi = iconEntries.find((i) => i.name === "Power BI");
    expect(powerBi?.icon ?? null).toBeNull();
  });
});

/**
 * Guard de i18n y rutas.
 */
describe("rutas e idioma", () => {
  it("solo acepta es y en como locale", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale("")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("las dos rutas existen y no chocan con la raiz", () => {
    expect(LOCALE_PATH.es).toBe("/es");
    expect(LOCALE_PATH.en).toBe("/en");
  });

  it("el email de contacto es valido", () => {
    expect(person.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});

/**
 * Guard de plantillas.
 *
 * Las plantillas con huecos son el punto donde se cuela el idioma equivocado:
 * `"{n} de {total}"` en un componente produce "4 de 13" en la pagina inglesa, y
 * el texto se ve bien en las dos capturas de prueba, asi que nadie lo nota.
 */
describe("plantillas interpoladas", () => {
  const plantillas = (t: Record<string, unknown>, prefijo = ""): string[] =>
    Object.entries(t).flatMap(([k, v]) =>
      typeof v === "string" && v.includes("{")
        ? [`${prefijo}${k}`]
        : v && typeof v === "object"
          ? plantillas(v as Record<string, unknown>, `${prefijo}${k}.`)
          : [],
    );

  it("los dos idiomas tienen las mismas claves de plantilla", () => {
    const en = plantillas(copy.en as unknown as Record<string, unknown>).sort();
    const es = plantillas(copy.es as unknown as Record<string, unknown>).sort();
    expect(es, "plantillas que faltan en es").toEqual(en);
  });

  it("ninguna plantilla queda con huecos sin sustituir", () => {
    // Un hueco sin sustituir sale en pantalla como "{n}" literal. Solo se
    // consideran los huecos que la propia plantilla declara: `{n}` en
    // `shownOf` es correcto, `{n` sin cerrar en otro sitio es un typo.
    const sueltas: string[] = [];
    for (const locale of ["en", "es"] as const) {
      const visitar = (obj: Record<string, unknown>, ruta: string) => {
        for (const [k, v] of Object.entries(obj)) {
          if (typeof v === "string") {
            // `{a}` cerrado y con nombre = placeholder declarado.
            const declarados = v.match(/\{\w+\}/g) ?? [];
            const abiertos = (v.match(/\{/g) ?? []).length - declarados.length;
            if (abiertos > 0) sueltas.push(`${locale}.${ruta}${k}: "${v}"`);
          } else if (v && typeof v === "object") {
            visitar(v as Record<string, unknown>, `${ruta}${k}.`);
          }
        }
      };
      visitar(copy[locale] as unknown as Record<string, unknown>, "");
    }
    expect(sueltas.join(" | ") || "(ninguna)", "llaves sin cerrar en el copy").toBe("(ninguna)");
  });
});
