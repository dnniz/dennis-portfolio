import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Estos tests no renderizan: leen el codigo fuente. Suena a trampa, pero es
 * justo el punto.
 *
 * El fallo que cubren es el que no se ve en el build. Si alguien renombra la
 * seccion `id="work"` a `id="projects"` y olvida actualizar el array LINKS del
 * header, Next compila sin quejarse, los 18 tests de contenido siguen verdes y
 * el fallo es que tres de los seis enlaces del menu no llevan a ningun sitio.
 * Un 404 en un portfolio se lee como "este candidato no revisa su propia web".
 *
 * Renderizar en jsdom no evitaria eso: habria que montar el arbol entero para
 * comprobar que un href tiene un destino, cuando comparar el id del <section>
 * con la constante del menu es la misma comprobacion en tres lineas.
 */
const SRC = process.cwd();
const files = ["components", "app", "lib"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const sources = files.flatMap((d) => walk(join(SRC, d)));
const all = sources.map((f) => ({ file: f, text: readFileSync(f, "utf8") }));

describe("el copy vive en lib/content.ts, no en los componentes", () => {
  /**
   * Este guard existe por un bug concreto. En la version EN de la pagina de
   * contacto habia dos etiquetas escritas a mano en el JSX: "Telefono" y
   * "Perfiles". El build pasaba verde, los tests de contenido pasaban, y en la
   * pagina inglesa se leia "Telefono" bajo un correo de gmail. Nadie se entera
   * hasta que un reclutador de otro pais lo ve.
   *
   * El fallo no se detecta comparando los dos idiomas: ambas paginas tienen
   * las mismas etiquetas, porque las dos vienen del mismo JSX. Solo se detecta
   * buscando texto visible fuera de lib/content.ts.
   */
  const PALABRAS = [
    "Telefono",
    "Perfiles",
    "Correo",
    "Anios",
    "Proyectos",
    "Experiencia",
    "Contactame",
    "Hablemos",
    "Curriculum",
    "Hola",
    "Gracias",
  ];

  // Se ignoran los comentarios: un comentario en espanol que explique por que
  // algo es asi no es copy que se vea en pantalla.
  const offenders: string[] = [];
  for (const { file, text } of all) {
    if (file.endsWith("lib/content.ts")) continue;
    const sinComentarios = text
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");

    for (const palabra of PALABRAS) {
      // Solo texto que se pinta: dentro de JSX, no en nombres de variable ni
      // en cadenas de import.
      const re = new RegExp(`>\\s*[^<>]*${palabra}[^<>]*<`, "i");
      if (re.test(sinComentarios)) {
        offenders.push(`${file.replace(SRC + "/", "")}: "${palabra}"`);
      }
    }
  }

  it("ningun componente pinta copy en espanol fuera del diccionario", () => {
    expect(offenders, `mover a lib/content.ts:\\n  ${offenders.join("\\n  ")}`).toEqual([]);
  });
});

describe("integridad de las anclas de navegacion", () => {
  // Se sacan de aqui en vez de escribirlos a mano: duplicarlos seria la
  // version codificada del mismo bug que el test intenta encontrar.
  const header = all.find((f) => f.file.endsWith("site-header.tsx"))!;
  const links = [...header.text.matchAll(/href:\s*"(#[\w-]+)"/g)].map((m) => m[1]);

  // Los id viven en dos formas distintas y hay que mirar las dos:
  //   <section id="contact">   -> escrito a mano (una sola seccion)
  //   <Section id="work" ...>   -> el componente, que es el caso normal
  // Buscar solo la primera daria cinco anclas huerfanas y el test "encontraria"
  // un bug que no existe, que es peor que no tener el test.
  const sectionIds = new Set(
    all.flatMap((f) => [
      ...[...f.text.matchAll(/<section id="([\w-]+)"/g)].map((m) => m[1]),
      ...[...f.text.matchAll(/<Section\s+id="([\w-]+)"/g)].map((m) => m[1]),
    ]),
  );

  it("el header declara enlaces a las seis secciones", () => {
    expect(links.length).toBeGreaterThanOrEqual(5);
  });

  it("cada ancla del header tiene un <section> con ese id", () => {
    const huerfanas = links.filter((href) => !sectionIds.has(href.slice(1)));
    expect(huerfanas, `anclas sin destino: ${huerfanas.join(", ")}`).toEqual([]);
  });

  it("no hay secciones huerfanas que la navegacion no enlaza", () => {
    const enlazadas = new Set(links.map((h) => h.slice(1)));
    // #contact se enlaza desde el CTA del hero, no desde el array del menu.
    const permitidas = new Set([...enlazadas, "contact"]);
    const huerfanas = [...sectionIds].filter((id) => !permitidas.has(id));
    expect(huerfanas, `secciones sin entrada en la navegacion: ${huerfanas.join(", ")}`).toEqual([]);
  });

  it("las secciones tienen scroll-margin para la cabecera sticky", () => {
    // Sin esto, al pulsar un enlace el titulo queda debajo de la cabecera de
    // 72px y parece que el enlace no funciono.
    const section = all.find((f) => f.file.endsWith("components/section.tsx"))!;
    expect(section.text).toMatch(/scroll-mt-/);
  });
});

/**
 * Contraste de los pares de color.
 *
 * AA pide 4.5:1 en texto normal y 3:1 en texto grande. Se aplica sobre el
 * token de color de cada tema. Los tres pares que se comprueban son los que
 * aparecen en el cuerpo del texto, no en bordes decorativos.
 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Extrae el valor hex de un token.
 *
 * Los tres lugares donde viven los tokens, segun como se aplique el tema:
 *
 *   :root                -> tema claro, el valor por defecto del documento
 *   .dark                -> tema oscuro aplicado por clase (lo pone el script
 *                           de <head> y el interruptor)
 *   :root:not(.light)    -> tema oscuro por preferencia del sistema, dentro de
 * un @media. Es el mismo juego de valores que .dark.
 * El parser busca en los tres y devuelve el primero que exista, en ese orden.
 * La version anterior solo miraba `:root` y `:root.dark`: la segunda forma
 * nunca aparece en el CSS, asi que el test del tema oscuro fallaba siempre y
 * habria acabado "arreglado" bajando el liston del contraste.
 */
function token(css: string, name: string, theme: "light" | "dark"): string {
  const selectors =
    theme === "light"
      ? [String.raw`:root\s*\{`, String.raw`@media\s*\(prefers-color-scheme:\s*light\)[^{]*\{[^}]*?`]
      : [String.raw`\.dark\s*\{`, String.raw`:root:not\(\.light\)\s*\{`];

  for (const sel of selectors) {
    const re = new RegExp(`${sel}([^{}]*)\}`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(css)) !== null) {
      const tok = new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`).exec(m[1]);
      if (tok) return tok[1];
    }
  }
  throw new Error(`no encuentro el token ${name} en ${theme}`);
}

describe("contraste WCAG AA", () => {
  const css = readFileSync(join(SRC, "app", "globals.css"), "utf8");

  (["light", "dark"] as const).forEach((theme) => {
    describe(`tema ${theme}`, () => {
      const bg = token(css, "--bg", theme);

      it("el texto principal sobre el fondo pasa 4.5:1", () => {
        expect(contrast(token(css, "--text", theme), bg)).toBeGreaterThanOrEqual(4.5);
      });

      it("el texto atenuado sobre el fondo pasa 4.5:1", () => {
        expect(contrast(token(css, "--text-muted", theme), bg)).toBeGreaterThanOrEqual(4.5);
      });

      it("el texto tenue sobre el fondo pasa 4.5:1", () => {
        // --text-faint es el token con mas riesgo: se usa para metadatos en
        // 11px, que es donde un ratio de 3.9:1 pasaria la prueba y aun asi
        // seria ilegible.
        expect(contrast(token(css, "--text-faint", theme), bg)).toBeGreaterThanOrEqual(4.5);
      });

      it("el acento sobre el fondo pasa 3:1", () => {
        // El acento se usa en texto de 12px en mayusculas y en bordes. 3:1 es
        // el minimo de WCAG para texto grande y componentes graficos.
        expect(contrast(token(css, "--accent", theme), bg)).toBeGreaterThanOrEqual(3);
      });

      it("el texto del boton de acento sobre el propio acento pasa 4.5:1", () => {
        // El boton primario invierte los dos: texto --accent-fg sobre fondo
        // --accent. Es el par con mas riesgo del tema oscuro, donde el acento
        // claro lleva texto casi negro.
        expect(contrast(token(css, "--accent-fg", theme), token(css, "--accent", theme))).toBeGreaterThanOrEqual(
          4.5,
        );
      });
    });
  });
});

describe("el build sobrevive a la imagen Alpine", () => {
  /**
   * Este test existe por un fallo que solo aparece en produccion.
   *
   * `node:22-alpine` no trae bash. El script `build` era
   * `next build && bash scripts/copy-public.sh`, y en Docker reventaba con
   * `sh: bash: not found` y exit 127. Local funcionaba porque la maquina de
   * desarrollo si tiene bash, el build de `next build` habia terminado bien
   * justo antes, y los 37 tests de contenido seguian verdes: ninguno mira el
   * shell con el que se invoca un script.
   *
   * La leccion es que "funciona en local" no es evidencia de nada cuando la
   * imagen base es distinta. Este test lee el shebang y los scripts de
   * package.json, que es donde se decide que shell se usa.
   */
  const scriptsDir = join(SRC, "scripts");

  it("los scripts que se ejecutan dentro de la imagen son POSIX", () => {
    // `fetch-logos.sh` si usa bash a proposito: arrays, `local` y `pipefail`, y
    // corre solo en la maquina de desarrollo para bajar los SVG. No entra en
    // Docker jamas, asi que no se toca. Lo que no se permite es que un script
    // QUE SE EJECUTA EN EL BUILD necesite bash, porque ahi el shell es el de
    // la imagen y no hay bash.
    const soloLocal = new Set(["fetch-logos.sh"]);

    const offenders = readdirSync(scriptsDir)
      .filter((f) => f.endsWith(".sh"))
      .filter((f) => !soloLocal.has(f))
      // Solo la primera linea: los comentarios explican por que el script ES
      // POSIX y mencionan bash, y leer el fichero entero daria un falso positivo.
      .filter((f) => /^#!.*\bbash\b/.test(readFileSync(join(scriptsDir, f), "utf8")));

    expect(offenders, `estos scripts del build piden bash, que Alpine no trae: ${offenders.join(", ")}`)
      .toEqual([]);
  });

  it("el script build no invoca bash, porque el shell del build es el de Alpine", () => {
    const pkg = JSON.parse(readFileSync(join(SRC, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.build).not.toMatch(/(^|[\s;&|])bash\s/);
    // Y no basta con quitar `bash`: el shebang del script invocado tiene que
    // ser ejecutable en Alpine, o el fallo reaparece un nivel mas abajo.
    expect(pkg.scripts.build).toMatch(/\bsh\s+scripts\/copy-public\.sh/);
  });

  it("el Dockerfile declara una imagen base de la que sabemos que existe", () => {
    const dockerfile = readFileSync(join(SRC, "Dockerfile"), "utf8");
    // El fallo espejo: fijar `node:latest` hace que una actualizacion de la
    // imagen cambie el runtime sin que cambie el codigo.
    expect(dockerfile).toMatch(/FROM node:\$\{NODE_VERSION\}-alpine/);
    expect(dockerfile).not.toMatch(/FROM node:latest/);
  });

  it("el stage builder tiene bash por si el build llegara a pedirlo", () => {
    // Red de seguridad, no la solucion. El build ya no lo necesita; si alguien
    // lo reintroduce, este test obliga a instalar bash en el mismo commit.
    const dockerfile = readFileSync(join(SRC, "Dockerfile"), "utf8");
    const builder = dockerfile.split("AS builder")[1]?.split("FROM")[0] ?? "";
    expect(builder).toMatch(/apk add[^\n]*bash/);
  });
});
