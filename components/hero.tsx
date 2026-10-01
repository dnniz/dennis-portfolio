"use client";

import { motion, useReducedMotion } from "motion/react";
import type { T } from "@/lib/content";

/**
 * Hero.
 *
 * Tres reglas deliberadas, porque son las que el generador suele fallar:
 *
 * 1. SIN FOTO. Un developer posando con fondo desenfocado es la senal mas
 *    rapida de portfolio plantilla. Aqui la "imagen" es una rejilla terminal
 *    con su historia real: el stack, los anos, el lugar. En un perfil de
 *    backend, mostrar codigo vale mas que mostrar un rostro.
 *
 * 2. CUATRO ELEMENTOS DE TEXTO, ni uno mas. Etiqueta, titular, subtexto y
 *    llamadas a la accion. La tira de logos de technologies que repiten lo
 *    que ya dice la seccion de stack no cabe aqui: por eso esta debajo.
 *
 * 3. UNA SOLA LLAMADA A LA ACCION PRIMARIA. Escribir y leer el CV son
 *    intenciones distintas y caben las dos; un tercer boton seria relleno.
 */
export function Hero({
  t,
  metrics,
  name,
  location,
}: {
  t: T["hero"];
  metrics: T["metrics"];
  name: string;
  location: string;
}) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      {/*
        Fondo: rejilla tenue + un halo del color de acento. Es lo unico
        decorativo de la pagina, y esta en `fixed` con pointer-events-none:
        una textura con filtro aplicada a un contenedor con scroll obliga al
        navegador a repintar en cada fotograma y hunde los fps en movil.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative mx-auto max-w-[var(--max-w)] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <div>
            <motion.p
              {...rise(0)}
              className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]"
            >
              {t.eyebrow}
            </motion.p>

            <motion.h1
              {...rise(0.06)}
              className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
            >
              {t.headline}
            </motion.h1>

            <motion.p
              {...rise(0.12)}
              className="mt-6 max-w-[46ch] text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
            >
              {t.sub}
            </motion.p>

            <motion.div {...rise(0.18)} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition-all duration-200 hover:bg-[var(--accent-hover)] active:translate-y-[1px] active:scale-[0.98]"
              >
                {t.ctaPrimary}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
                </svg>
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] active:translate-y-[1px]"
              >
                {t.ctaSecondary}
              </a>
            </motion.div>

            <motion.p
              {...rise(0.24)}
              className="mt-8 font-mono text-xs text-[var(--text-faint)]"
            >
              {name}
              <span className="px-2 text-[var(--border-strong)]" aria-hidden="true">
                /
              </span>
              {location}
            </motion.p>
          </div>

          <motion.div {...rise(0.3)} className="lg:sticky lg:top-24">
            <TerminalCard metrics={metrics} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * Terminal. No es una foto de stock ni un screenshot fabricated: es el perfil
 * del titular renderizado como sesion de consola, que es la metafora que el
 * propio trabajo sostiene. Los numeros vienen del CV, no son decorativos.
 */
function TerminalCard({ metrics }: { metrics: T["metrics"] }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_hsl(var(--shadow-color)/0.06),0_12px_32px_-12px_hsl(var(--shadow-color)/0.18)]">
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--border-strong)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--accent)] opacity-60" />
        </span>
        <span className="ml-1 font-mono text-[11px] text-[var(--text-faint)]">whoami</span>
      </div>

      <dl className="divide-y divide-[var(--border)]">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-baseline justify-between gap-4 px-4 py-3.5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
              {m.label}
            </dt>
            <dd className="font-mono text-lg font-medium tabular-nums text-[var(--text)]">
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
