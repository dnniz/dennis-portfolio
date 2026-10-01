"use client";

import { useEffect, useState } from "react";

/**
 * Selector de idioma.
 *
 * Recibe `href` ya resuelto y no una funcion `hrefFor` que la llame. Motivo
 * concreto: este archivo es un Client Component y la pagina que lo usa es un
 * Server Component, y las funciones no cruzan ese limite. Al pasar
 * `hrefFor={(t) => ...}` el build falla al prerenderizar con "Functions cannot
 * be passed directly to Client Components". Que la URL la calcule el servidor
 * es ademas lo correcto: ya tiene el idioma actual y la ruta en la mano.
 *
 * La eleccion se guarda en una cookie, no en localStorage, por lo mismo que
 * aqui: el idioma se resuelve en el SERVIDOR, asi que para que la eleccion
 * sobreviva tiene que viajar en la peticion. localStorage no llega al servidor
 * y habria que leerlo en un useEffect, lo que hace que la primera pintura salga
 * en el idioma por defecto y luego salte al otro. Ese es el parpadeo de idioma.
 */
export function LocaleSwitch({
  current,
  other,
  href,
  label,
  tabIndex,
}: {
  current: string;
  other: string;
  /** URL completa del otro idioma, ya construida por el servidor. */
  href: string;
  label: string;
  /**
   * El drawer movil lleva `aria-hidden` cuando esta cerrado, y axe rechaza un
   * elemento con aria-hidden que aun es focusable. Aqui se le pasa -1 para que
   * el enlace salga del recorrido de teclado mientras el drawer esta cerrado.
   */
  tabIndex?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <a
      href={href}
      tabIndex={tabIndex}
      hrefLang={other}
      lang={other}
      aria-label={`${label}: ${other === "es" ? "Español" : "English"}`}
      className="inline-flex h-8 items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--border)] px-2.5 font-mono text-xs font-medium text-[var(--text-muted)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
      </svg>
      <span aria-hidden="true">{current.toUpperCase()}</span>
      {/* Antes de hidratar se ve solo el idioma actual: pintar "EN / ES"
          cuando aun no se sabe cual esta activo produce un parpadeo. */}
      {mounted && (
        <span aria-hidden="true" className="text-[var(--text-faint)]">
          /
        </span>
      )}
      {mounted && <span aria-hidden="true">{other.toUpperCase()}</span>}
    </a>
  );
}
