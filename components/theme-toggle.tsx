"use client";

import { useEffect, useState } from "react";

/**
 * Interruptor de tema.
 *
 * Sin este componente el sitio se ve bien en un solo modo, que es el fallo
 * clasico: alguien abre la pagina de noche y le duele. El estado por defecto
 * es oscuro, y el script de <head> ya lo aplico antes de pintar para que no
 * haya salto.
 *
 * Monta el valor inicial como null a proposito: el servidor no puede saber
 * cual eligio el visitante, y poner un valor aqui crearia una discrepancia de
 * hidratacion en cuanto no coincidiera con lo que guardo el script.
 */
/**
 * @param tabIndex -1 mientras vive dentro del drawer movil cerrado, por lo mismo
 * que en LocaleSwitch: un control focusable dentro de un `aria-hidden` es una
 * violacion seria de WCAG, y el teclado de un lector de pantalla lo encuentra igual.
 */
export function ThemeToggle({ label, tabIndex }: { label: string; tabIndex?: number }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains("light") ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Modo privado o almacenamiento lleno: el tema cambia igual en esta
      // pestana, solo no se recuerda. No es motivo para romper el clic.
    }
    setTheme(next);
  }

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--text-muted)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:text-[var(--text)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      {/* El icono se elige por clase, no por estado de React: antes de
          hidratar hay que pintar algo, y el script de <head> ya decidio. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden h-4 w-4 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
      </svg>
    </button>
  );
}
