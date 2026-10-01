"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { T } from "@/lib/content";
import { LocaleSwitch } from "./locale-switch";
import { ThemeToggle } from "./theme-toggle";

const LINKS: { key: keyof T["nav"]; href: string }[] = [
  { key: "about", href: "#about" },
  { key: "work", href: "#work" },
  { key: "stack", href: "#stack" },
  { key: "ai", href: "#ai" },
  { key: "credentials", href: "#credentials" },
];

/**
 * Cabecera sticky.
 *
 * El limite de 72px no es decorativo: una cabecera alta se come la pantalla en
 * movil, que es donde se lee la mitad de las visitas. En escritorio los seis
 * enlaces caben en una sola linea; por debajo de 1024px colapsan a menu, porque
 * partir la navegacion en dos lineas se lee como un error de maquetado.
 *
 * Se marca el enlace de la seccion visible con IntersectionObserver, en vez de
 * con un listener de scroll: el primero solo despierta en los cruces y el
 * segundo obliga a recalcular en cada fotograma.
 */
export function SiteHeader({
  nav,
  name,
  initials,
  contactLabel,
  openMenuLabel,
  current,
  otherLang,
  otherHref,
  langLabel,
  themeLabel,
}: {
  nav: T["nav"];
  name: string;
  initials: string;
  contactLabel: string;
  openMenuLabel: string;
  current: string;
  /** Idioma contrario al que se esta viendo, p.ej. "es" dentro de /en. */
  otherLang: string;
  /** URL del otro idioma, ya resuelta por el servidor. */
  otherHref: string;
  langLabel: string;
  themeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  // Observer en lugar de window.addEventListener("scroll"): se registra una vez
  // y el navegador avisa solo en los cruces de umbral.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      // rootMargin deja la cabecera fuera de la zona de deteccion: si no, la
      // seccion activa cambia en cuanto asoma por debajo de los 72px.
      { rootMargin: "-72px 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // El menu movil es un drawer: bloquea el scroll del fondo mientras esta
  // abierto, y Escape lo cierra. Sin eso se desplaza la pagina detras.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 h-[72px] border-b transition-colors duration-300 ${
        scrolled
          ? "border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[var(--max-w)] items-center gap-6 px-5 sm:px-8">
        <Link
          href={`/${current}`}
          className="flex shrink-0 items-center gap-2.5 font-medium tracking-tight"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-[var(--radius)] bg-[var(--accent)] font-mono text-[11px] font-semibold text-[var(--accent-fg)]"
          >
            {initials}
          </span>
          <span className="hidden text-sm sm:inline">{name}</span>
        </Link>

        {/* Navegacion principal: una sola linea en escritorio. */}
        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  aria-current={active === l.href.slice(1) ? "location" : undefined}
                  className={`rounded-[var(--radius)] px-2.5 py-1.5 text-sm transition-colors duration-200 ${
                    active === l.href.slice(1)
                      ? "text-[var(--accent)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  }`}
                >
                  {nav[l.key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <div className="hidden items-center gap-2 lg:flex">
            <LocaleSwitch
              current={current}
              other={otherLang}
              href={otherHref}
              label={langLabel}
            />
            <ThemeToggle label={themeLabel} />
          </div>
          <CvLink current={current} label={contactLabel} />
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-movil"
              aria-label={openMenuLabel}
              className="grid h-8 w-8 place-items-center rounded-[var(--radius)] border border-[var(--border)] text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Drawer movil. aria-hidden cuando esta cerrado para que sus enlaces no
          entren en el orden de tabulacion de una pestana cerrada. */}
      <div
        id="menu-movil"
        aria-hidden={!open}
        className={`no-print border-b border-[var(--border)] bg-[var(--bg)] transition-[opacity,transform] duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Movil" className="mx-auto max-w-[var(--max-w)] px-5 py-3 sm:px-8">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="block border-b border-[var(--border)] py-3 text-sm text-[var(--text-muted)] last:border-0"
                >
                  {nav[l.key]}
                </a>
              </li>
            ))}
            <li>
              <Link
                href={`/${current}/cv`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block py-3 text-sm text-[var(--text-muted)]"
              >
                {contactLabel}
              </Link>
            </li>
            {/* En movil el selector y el tema no caben en la barra: van dentro
                del drawer, con tabIndex -1 mientras esta cerrado para que no
                entren en el recorrido del teclado. */}
            <li className="flex items-center gap-3 py-3">
              <LocaleSwitch
                current={current}
                other={otherLang}
                href={otherHref}
                label={langLabel}
                tabIndex={open ? 0 : -1}
              />
              <ThemeToggle label={themeLabel} tabIndex={open ? 0 : -1} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** Enlace al CV. Vive en la cabecera y en el drawer movil, con la misma etiqueta. */
function CvLink({ current, label }: { current: string; label: string }) {
  return (
    <Link
      href={`/${current}/cv`}
      className="rounded-[var(--radius)] border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] active:scale-[0.98]"
    >
      {label}
    </Link>
  );
}
