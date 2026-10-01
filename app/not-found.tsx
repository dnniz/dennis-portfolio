import Link from "next/link";
import { LOCALE_LABEL, LOCALE_PATH, DEFAULT_LOCALE } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[var(--max-w)] flex-col justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        Esta pagina no existe
      </h1>
      <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[var(--text-muted)]">
        The page you were looking for is not here. It may have moved, or the link may be
        mistyped.
      </p>

      {/* Se ofrecen los dos idiomas en vez de adivinar: quien llega a un 404
          desde un enlace externo no tiene cookie de idioma que lo guie. */}
      <div className="mt-8 flex flex-wrap gap-3">
        {(["es", "en"] as const).map((l) => (
          <Link
            key={l}
            href={LOCALE_PATH[l]}
            className="rounded-[var(--radius)] border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--text)] transition-colors duration-200 hover:border-[var(--accent-border)] hover:text-[var(--accent)]"
          >
            {LOCALE_LABEL[l]}
          </Link>
        ))}
        <Link
          href={LOCALE_PATH[DEFAULT_LOCALE]}
          className="rounded-[var(--radius)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
        >
          Portfolio
        </Link>
      </div>
    </main>
  );
}
