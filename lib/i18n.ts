import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./content";

/**
 * Cookie que recuerda el idioma que el visitor eligio de forma explicita.
 * Sin ella, la eleccion se pierde en cada navegacion.
 */
export const LOCALE_COOKIE = "portfolio_lang";

/** Deteccion de idioma. Un solo lugar, para que las reglas no se contradigan. */
export function negotiate(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
): Locale {
  // 1. Eleccion explicita del visitante. Siempre gana.
  if (isLocale(cookieValue)) return cookieValue;

  // 2. Cabecera Accept-Language. El contenedor remoto es es, pero la oferta
  //    objetivo esta en ingles, asi que un navegador en ingles debe caer en EN.
  if (acceptLanguage) {
    const ranked = acceptLanguage
      .split(",")
      .map((part) => {
        const [tag, ...params] = part.trim().split(";");
        const q = params.find((p) => p.trim().startsWith("q="));
        return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split("=")[1]) || 0 : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { tag } of ranked) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Locale para el render de una pagina. En un Server Component se lee del
 * contexto de peticion: cookie primero, luego Accept-Language, luego EN.
 */
export async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  return negotiate(cookieStore.get(LOCALE_COOKIE)?.value, headerStore.get("accept-language"));
}

/** El otro idioma, para pintar el enlace del selector. */
export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}
