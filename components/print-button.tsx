"use client";

/**
 * Boton de imprimir.
 *
 * Va en un client component propio, y no como <button onClick> dentro de la
 * pagina del CV, porque esa pagina es un Server Component. Poner el manejador
 * ahi obligaria a marcar toda la pagina con "use client", y con ella la
 * generacion estatica de los datos: el CV se renderia en el cliente para
 * imprimir un boton.
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-[var(--radius)] bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-[var(--accent-fg)] transition-colors duration-200 hover:bg-[var(--accent-hover)] active:scale-[0.98]"
    >
      {label}
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
        <path d="M4.5 6V2.5h7V6M4.5 12H3a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1V11a1 1 0 0 1-1 1h-1.5M4.5 10h7v3.5h-7z" />
      </svg>
    </button>
  );
}
