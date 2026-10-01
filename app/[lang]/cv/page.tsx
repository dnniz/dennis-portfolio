import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitch } from "@/components/locale-switch";
import { PrintButton } from "@/components/print-button";
import {
  LOCALE_PATH,
  certifications,
  copy,
  courses,
  education,
  isLocale,
  languages,
  person,
  roles,
  site,
  stackGroups,
  type Locale,
} from "@/lib/content";

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const l = lang as Locale;
  return {
    title: `${copy[l].cv.title}`,
    description: site.description[l],
    alternates: { canonical: `${LOCALE_PATH[l]}/cv` },
    // El CV es la version para el recruiting: se indexa, pero la version
    // imprimible se llega por el parametro de query, no por una URL aparte.
  };
}

/**
 * Version imprimible del CV.
 *
 * Existe por una razon muy concreta: quien esta Leyendo tu CV esta a punto de
 * llamarte, y llamar desde el movil no funciona. Este documento se imprime o se
 * guarda en PDF desde ahi, sin perder nada del contenido.
 *
 * El CSS de impresion esta en app/globals.css (@media print). Ahi se quitan
 * navegacion, tema, botones y el fondo, y se fuerza texto negro sobre blanco:
 * un PDF con fondo oscuro gasta toner y no se lee bien en un atm de bananas
 * con Impresora en blanco y negro.
 */
export default async function CvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];
  const other = l === "es" ? "en" : "es";

  return (
    <div className="mx-auto max-w-[52rem] px-5 py-12 print:max-w-none print:px-0 print:py-0">
      {/*
        Barra de herramientas: solo en pantalla. En el PDF desaparecen
        enteras, junto con la navegacion.
      */}
      <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={LOCALE_PATH[l]}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--accent)]"
        >
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
            <path d="M9.5 3.5 5 8l4.5 4.5" />
          </svg>
          {t.cv.back}
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitch
            current={l}
            other={other}
            href={`${LOCALE_PATH[other]}/cv`}
            label={t.a11y.toggleLang}
          />
          <ThemeToggle label={t.a11y.toggleTheme} />
          <PrintButton label={t.cv.print} />
        </div>
      </div>

      <article className="print-reset">
        <header className="border-b-2 border-[var(--text)] pb-5 print:border-b">
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">{person.name}</h1>
          <p className="mt-1 text-lg text-[var(--text-muted)]">{site.title[l]}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[var(--text-muted)]">
            <li>{person.location[l]}</li>
            <li>{person.email}</li>
            <li>{person.phone}</li>
            <li>
              <a href={person.linkedin} className="hover:text-[var(--accent)]">
                linkedin.com/in/dnniz
              </a>
            </li>
            <li>
              <a href={person.github} className="hover:text-[var(--accent)]">
                github.com/dnniz
              </a>
            </li>
          </ul>
        </header>

        <CvSection title={t.cv.summary}>
          {t.hero.sub}
        </CvSection>

        <CvSection title={t.credentials.education}>
          {education.map((e) => (
            <CvItem
              key={e.nameEn}
              heading={locale_(e.name, e.nameEn, l)}
              meta={`${e.issuer} · ${e.period[l]}`}
            />
          ))}
        </CvSection>

        <CvSection title={t.credentials.certifications}>
          {certifications.map((c) => (
            <CvItem key={c.name} heading={c.name} meta={`${c.issuer} · ${c.date[l]}`} />
          ))}
        </CvSection>

        <CvSection title={t.work.heading}>
          {roles.map((r) => (
            <div key={r.id} className="mb-5 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="text-sm font-semibold">
                  {r.title[l]}
                  {r.client && <span className="font-normal text-[var(--text-muted)]"> {r.client}</span>}
                </h3>
                <p className="font-mono text-xs text-[var(--text-muted)]">{r.period[l]}</p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {r.company} · {r.sector[l]} · {r.duration[l]}
              </p>
              <ul className="mt-1.5 flex flex-col gap-1 text-xs leading-relaxed">
                {r.bullets[l].map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true">–</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-1.5 font-mono text-[11px] text-[var(--text-faint)]">
                {r.stack.join(" · ")}
              </p>
            </div>
          ))}
        </CvSection>

        <CvSection title={t.stack.heading}>
          <div className="grid gap-3 sm:grid-cols-2">
            {stackGroups.map((g) => (
              <div key={g.id}>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-faint)]">
                  {g.label[l]}
                </p>
                <p className="mt-0.5 text-xs">{g.items.map((i) => i.name).join(", ")}</p>
              </div>
            ))}
          </div>
        </CvSection>

        <CvSection title={t.credentials.languages}>
          <p className="text-xs">
            {languages.map((l2) => `${locale_(l2.name, l2.nameEn, l)}: ${l2.level[l]}`).join(" · ")}
          </p>
        </CvSection>

        <CvSection title={t.credentials.courses}>
          <p className="text-xs leading-relaxed">{courses.map((c) => c.name).join(" · ")}</p>
        </CvSection>
      </article>
    </div>
  );
}

/** Elige el campo segun idioma sin repetir el ternario en cada sitio. */
function locale_(es: string, en: string, locale: Locale) {
  return locale === "es" ? es : en;
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-7">
      <h2 className="mb-2 border-b border-[var(--border-strong)] pb-1 font-mono text-xs uppercase tracking-[0.12em]">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-[var(--text-muted)]">{children}</div>
    </section>
  );
}

function CvItem({ heading, meta }: { heading: string; meta: string }) {
  return (
    <div className="mb-3 last:mb-0">
      <h3 className="text-sm font-semibold">{heading}</h3>
      <p className="text-xs text-[var(--text-muted)]">{meta}</p>
    </div>
  );
}
