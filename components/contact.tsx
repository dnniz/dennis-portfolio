"use client";

import { useState } from "react";
import type { T } from "@/lib/content";
import { Reveal, Section } from "./section";

/**
 * Contacto.
 *
 * El correo es el canal principal y el unico que lleva a una accion real. El
 * boton de copiar responde a como se lee un portfolio en el movil: la gente
 * abre el mailto, ve la app de correo y no la tiene configurada, y se va.
 *
 * WhatsApp y LinkedIn van como enlaces de icono con su nombre accesible: son
 * secundarios y no deben competir con el correo.
 */
export function Contact({
  t,
  email,
  linkedin,
  github,
  phone,
}: {
  t: T["contact"];
  email: string;
  linkedin: string;
  github: string;
  phone: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles (contexto no seguro, permiso denegado).
      // No se muestra un error: el enlace mailto de al lado sigue funcionando.
    }
  }

  return (
    <Section id="contact" heading={t.heading}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
        <Reveal>
          <p className="max-w-[52ch] text-base leading-relaxed text-[var(--text-muted)]">{t.body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition-all duration-200 hover:bg-[var(--accent-hover)] active:translate-y-[1px] active:scale-[0.98]"
            >
              {t.primary}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4.5 8 9l6-4.5M2 3.5h12v9H2z" />
              </svg>
            </a>

            <button
              type="button"
              onClick={copy}
              aria-live="polite"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2.5 text-sm text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)] active:translate-y-[1px]"
            >
              {copied ? t.copied : t.copyEmail}
              <span className="font-mono text-xs text-[var(--text-faint)]">{email}</span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:border-l lg:border-[var(--border)] lg:pl-8">
          <dl className="flex flex-col gap-5">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${email}`}
                  className="text-sm text-[var(--text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
                >
                  {email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                {t.phone}
              </dt>
              <dd className="mt-1 text-sm text-[var(--text-muted)]">{phone}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-faint)]">
                {t.profiles}
              </dt>
              <dd className="mt-1 flex flex-wrap gap-4">
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
                >
                  LinkedIn
                  <ExternalArrow />
                </a>
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
                >
                  GitHub
                  <ExternalArrow />
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}

function ExternalArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-2.5 w-2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 2h5.5v5.5M10 2 4 8M8 10H2V4" />
    </svg>
  );
}
