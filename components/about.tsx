import type { T } from "@/lib/content";
import { Reveal, Section } from "./section";

/**
 * Sobre mi.
 *
 * Layout de columna estrecha con un dato marginal a la derecha, no de dos
 * columnas iguales: el texto corrido es el argumento y necesita su medida de
 * 65ch. La columna de la derecha sostiene hechos cortos (los mismos metricos
 * del hero, en otro formato) que de otro modo quedarian redundantes.
 */
export function About({ t, highlight }: { t: T["about"]; highlight: { value: string; label: string }[] }) {
  return (
    <Section id="about" heading={t.heading}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          {t.body.map((p, i) => (
            <p key={i} className="max-w-[65ch] text-base leading-relaxed text-[var(--text-muted)]">
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="lg:border-l lg:border-[var(--border)] lg:pl-8">
          <dl className="flex flex-col gap-5">
            {highlight.map((h) => (
              <div key={h.label}>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                  {h.label}
                </dt>
                <dd className="mt-1 text-2xl font-medium tabular-nums tracking-tight">{h.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
