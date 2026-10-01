"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Contenedor de seccion con encabezado en vertical.
 *
 * El encabezado se apila (titulo encima, entradilla debajo) en vez de partir
 * en dos columnas con un parrafo suelto a la derecha. Ese patron de columna
 * partida es el que produce la sensacion de "maquetado" en cuanto el parrafo
 * no tiene nada visual que aportarle al lado.
 */
export function Section({
  id,
  heading,
  lead,
  children,
  className = "",
}: {
  id: string;
  heading: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-b border-[var(--border)] ${className}`}>
      <div className="mx-auto max-w-[var(--max-w)] px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{heading}</h2>
          {lead && (
            <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-[var(--text-muted)]">
              {lead}
            </p>
          )}
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}

/**
 * Entrada al hacer scroll. Con prefers-reduced-motion se renderiza tal cual:
 * nada de opacidad 0 inicial, porque si la animacion no corre, el contenido
 * se queda invisible para siempre.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
