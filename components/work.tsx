"use client";

import { useState } from "react";
import type { Locale, Role, T } from "@/lib/content";
import { Reveal, Section } from "./section";

/**
 * Experiencia.
 *
 * La lista tiene 13 entradas. Un `<ul>` con 13 filas separadas por hairlines es
 * el peor defecto posible aqui: es exactamente el CV impreso dentro de una
 * web, y no aprovecha para nada que se pueda escanear. La solucion es un
 * desplegable: cuatro destacados visibles, el resto detras de un boton.
 *
 * Los destacados no son "los cuatro ultimos". Son los cuatro con la restriccion
 * tecnica mas interesante: propiedad de un microservicio de integracion, un
 * modulo a escala de 1M de usuarios, automatizacion de datos en banca, y una
 * migracion transaccional masiva. Es lo que un responsable tecnico lee.
 */
export function Work({ t, roles, locale }: { t: T["work"]; roles: Role[]; locale: Locale }) {
  const [showAll, setShowAll] = useState(false);

  const featured = roles.filter((r) => r.featured);
  const rest = roles.filter((r) => !r.featured);
  const visible = showAll ? [...featured, ...rest] : featured;

  return (
    <Section id="work" heading={t.heading} lead={t.lead}>
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-faint)]">
          {t.featured}
          <span className="px-2 text-[var(--border-strong)]" aria-hidden="true">
            /
          </span>
          {t.shownOf
          .replace("{n}", String(visible.length))
          .replace("{total}", String(roles.length))}
        </p>
        <p className="text-sm text-[var(--text-faint)]">
          {roles[0]?.period[locale]} <span aria-hidden="true">&rarr;</span> {roles[roles.length - 1]?.period[locale]}
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {visible.map((role, i) => (
          <li key={role.id}>
            <Reveal delay={Math.min(i, 3) * 0.05}>
              <RoleCard role={role} locale={locale} stackLabel={t.stackLabel} />
            </Reveal>
          </li>
        ))}
      </ol>

      {rest.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] active:translate-y-[1px]"
          >
            {showAll ? t.featured : `${t.rest} (${rest.length})`}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className={`h-3.5 w-3.5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3.5 6 8 10.5 12.5 6" />
            </svg>
          </button>
          <span className="text-sm text-[var(--text-faint)]">
            <a href="#contact" className="underline underline-offset-4 transition-colors hover:text-[var(--accent)]">
              {t.viewCv}
            </a>
          </span>
        </div>
      )}
    </Section>
  );
}

function RoleCard({
  role,
  locale,
  stackLabel,
}: {
  role: Role;
  locale: Locale;
  stackLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `role-${role.id}`;

  return (
    <article className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[var(--border-strong)]">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="text-base font-medium tracking-[-0.01em] sm:text-lg">
                {role.title[locale]}
              </h3>
              {role.client && (
                <span className="text-base text-[var(--text-faint)]" aria-hidden="true">
                  {role.client}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {role.company}
              <span className="px-1.5 text-[var(--border-strong)]" aria-hidden="true">
                &middot;
              </span>
              {role.sector[locale]}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
              {role.period[locale]}
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--text-faint)]">
              {role.duration[locale]}
            </p>
          </div>
        </div>

        {/*
          Los bullets van plegados por defecto en movil y visibles en
          escritorio. Cuatro lineas de logros por entrada x 13 entradas es una
          columna de texto interminable en un movil; en escritorio caben y son
          el argumento, asi que no se ocultan.
        */}
        <ul
          className={`mt-5 flex flex-col gap-2.5 text-sm leading-relaxed text-[var(--text-muted)] md:grid md:grid-cols-2 md:gap-x-8 ${
            open ? "" : "hidden md:grid"
          }`}
        >
          {role.bullets[locale].map((b, i) => (
            <li key={i} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label={stackLabel}>
            {role.stack.map((s) => (
              <li
                key={s}
                className="rounded-[var(--radius)] border border-[var(--border)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-faint)]"
              >
                {s}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-faint)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] active:scale-[0.98] md:hidden"
          >
            <span aria-hidden="true">{open ? "−" : `+${role.bullets[locale].length}`}</span>
            <span className="sr-only">
              {role.title[locale]}, {role.period[locale]}
            </span>
          </button>
        </div>
        <span id={panelId} className="sr-only">
          {role.bullets[locale].join(" ")}
        </span>
      </div>
    </article>
  );
}
