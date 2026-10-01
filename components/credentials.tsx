import type { Locale, T } from "@/lib/content";
import { Reveal, Section } from "./section";
import { certifications, courses, education, languages } from "@/lib/content";

/**
 * Credenciales.
 *
 * Cuatro grupos en retícula 2x2 en escritorio. Cada grupo lleva su propia
 * etiqueta en mono y una lista sin hairlines por fila: son pocos elementos y
 * el separador entre cada uno solo anade ruido.
 *
 * Sin logos de las certificaciones: SFPC y GitHub Copilot se nombran con su
 * nombre completo, que es como las busca quien las verifica.
 */
export function Credentials({ t, locale }: { t: T["credentials"]; locale: Locale }) {
  return (
    <Section id="credentials" heading={t.heading}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
        <Reveal>
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-faint)]">
            {t.certifications}
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            {certifications.map((c) => (
              <li key={c.name}>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="mt-0.5 text-sm text-[var(--text-faint)]">
                  {c.issuer}
                  <span className="px-1.5 text-[var(--border-strong)]" aria-hidden="true">
                    &middot;
                  </span>
                  {c.date[locale]}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.06}>
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-faint)]">
            {t.education}
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            {education.map((e) => (
              <li key={e.nameEn}>
                <p className="text-sm font-medium">{locale === "es" ? e.name : e.nameEn}</p>
                <p className="mt-0.5 text-sm text-[var(--text-faint)]">
                  {e.issuer}
                  <span className="px-1.5 text-[var(--border-strong)]" aria-hidden="true">
                    &middot;
                  </span>
                  {e.period[locale]}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12}>
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-faint)]">
            {t.languages}
          </h3>
          <ul className="mt-4 flex flex-col gap-4">
            {languages.map((l) => (
              <li key={l.nameEn} className="flex items-baseline justify-between gap-4">
                <span className="text-sm">{locale === "es" ? l.name : l.nameEn}</span>
                <span className="text-sm text-[var(--text-faint)]">{l.level[locale]}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.18}>
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-faint)]">
            {t.courses}
          </h3>
          {/*
            Nueve cursos. Una lista de nueve filas con hairline debajo es el
            peor default para una lista larga, asi que van como pills: se
            recorren de un vistazo y no compiten con las certificaciones, que
            son las que importan.
          */}
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {courses.map((c) => (
              <li
                key={c.name}
                className="rounded-[var(--radius-pill)] border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
                title={c.issuer}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
