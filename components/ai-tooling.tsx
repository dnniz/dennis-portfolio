import type { T } from "@/lib/content";
import { Reveal, Section } from "./section";

/**
 * Herramientas de IA.
 *
 * Esta seccion existe por una razon concreta y conviene no perderla de vista:
 * en un mercado saturado, "uso IA" no distingue a nadie. Lo que distingue es
 * haber montado la infraestructura. Por eso el titular dice "en el flujo, no
 * en la diapositiva" y las tres tarjetas nombran Skills internas, servidores MCP
 * y wrappers de harness, que es trabajo de ingenieria, no de prompt.
 *
 * Las tres celdas llevan fondo distinto: un bento de tres tarjetas de texto
 * sobre el mismo blanco se lee como plantilla sin内容量 que justifique el
 * espacio.
 */
export function AiTooling({ t }: { t: T["ai"] }) {
  return (
    <Section id="ai" heading={t.heading}>
      <Reveal>
        {t.body.map((p) => (
          <p key={p} className="max-w-[62ch] text-base leading-relaxed text-[var(--text-muted)]">
            {p}
          </p>
        ))}
      </Reveal>

      <div className="mt-10 grid gap-3 md:grid-cols-3">
        {t.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <article
              className={`h-full rounded-[var(--radius)] border p-5 ${
                i === 0
                  ? "border-[var(--accent-border)] bg-[var(--accent-soft)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`font-mono text-[11px] ${i === 0 ? "text-[var(--accent)]" : "text-[var(--text-faint)]"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-medium tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
