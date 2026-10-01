import type { Locale, StackGroup, T } from "@/lib/content";
import { Reveal, Section } from "./section";

/**
 * Stack.
 *
 * Logos reales de Simple Icons y Devicon, no texto plano. Un muro de nombres
 * de technologies en un muro, sin marca, es lo mas parecido a un muro que
 * existe. Los archivos estan en public/logos y se pintan como MASCARA con
 * currentColor, de modo que un unico archivo sirve en claro y en oscuro.
 *
 * La retícula es deliberadamente asimetrica (3/2/3 y no 3/3/3): una rejilla
 * de columnas iguales es el gridspec por defecto del generador y hace que
 * cualquier lista se lea como una tabla sin observar.
 *
 * Power BI va como texto porque no tiene logo en ninguna de las dos fuentes
 * (Microsoft no autoriza redistribuirlo). Un icono dibujado a mano o parecido
 * seria mentir sobre como se construyo esta pagina.
 */
export function Stack({ t, groups, locale }: { t: T["stack"]; groups: StackGroup[]; locale: Locale }) {
  return (
    <Section id="stack" heading={t.heading} lead={t.lead}>
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {groups.map((group, gi) => (
          <Reveal key={group.id} delay={Math.min(gi, 4) * 0.04} className="lg:w-[18rem] lg:shrink-0">
            <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-faint)]">
              {group.label[locale]}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center gap-2.5 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 transition-colors duration-300 hover:border-[var(--accent-border)]"
                >
                  {item.icon ? (
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 bg-[var(--text-muted)]"
                      style={{
                        maskImage: `url(/logos/${item.icon}.svg)`,
                        WebkitMaskImage: `url(/logos/${item.icon}.svg)`,
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskPosition: "center",
                      }}
                    />
                  ) : (
                    // Punto de reserva para lo que no tiene logo: se marca con
                    // un guion, no con un circulo de color, para que se lea
                    // como ausencia y no como insignia.
                    <span aria-hidden="true" className="w-4 shrink-0 text-center font-mono text-xs text-[var(--border-strong)]">
                      -
                    </span>
                  )}
                  <span className="truncate text-sm text-[var(--text-muted)]">{item.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
