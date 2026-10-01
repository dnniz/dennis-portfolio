import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { About } from "@/components/about";
import { AiTooling } from "@/components/ai-tooling";
import { Contact } from "@/components/contact";
import { Credentials } from "@/components/credentials";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { Stack } from "@/components/stack";
import { Work } from "@/components/work";
import { isLocale, copy, person, roles, site, stackGroups, type Locale } from "@/lib/content";
import { LOCALE_PATH } from "@/lib/content";

/**
 * Solo se generan las dos rutas que existen. Sin esto, Next intentaria
 * renderizar /cualquier-cosa y devolveria 200 en vez de 404.
 */
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
    title: site.title[l],
    description: site.description[l],
    keywords: [...site.keywords[l]],
    alternates: {
      canonical: LOCALE_PATH[l],
      languages: {
        es: LOCALE_PATH.es,
        en: LOCALE_PATH.en,
        "x-default": LOCALE_PATH.en,
      },
    },
    openGraph: {
      title: site.title[l],
      description: site.description[l],
      url: `${site.url}${LOCALE_PATH[l]}`,
      locale: l === "es" ? "es_PE" : "en_US",
      type: "profile",
    },
  };
}

export default async function LangPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const l = lang as Locale;
  const t = copy[l];
  const other = l === "es" ? "en" : "es";

  return (
    <>
      {/* Enlace de salto: sin esto, quien navega con teclado tiene que
          atravesar los seis enlaces de la cabecera en cada pagina. */}
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius)] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--accent-fg)]"
      >
        {t.a11y.skipToContent}
      </a>

      <SiteHeader
        nav={t.nav}
        name={person.name}
        initials={person.initials}
        contactLabel={t.cv.title}
        openMenuLabel={t.a11y.openMenu}
        current={l}
        otherLang={other}
        otherHref={LOCALE_PATH[other]}
        langLabel={t.a11y.toggleLang}
        themeLabel={t.a11y.toggleTheme}
      />

      <main id="main">
        <Hero t={t.hero} metrics={t.metrics} name={person.name} location={person.location[l]} />
        <About
          t={t.about}
          highlight={t.metrics.slice(0, 3).map((m) => ({ value: m.value, label: m.label }))}
        />
        <Work t={t.work} roles={roles} locale={l} />
        <Stack t={t.stack} groups={stackGroups} locale={l} />
        <AiTooling t={t.ai} />
        <Credentials t={t.credentials} locale={l} />
        <Contact
          t={t.contact}
          email={person.email}
          linkedin={person.linkedin}
          github={person.github}
          phone={person.phone}
        />
      </main>

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-[var(--max-w)] flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-[var(--text-faint)]">
            {person.name}
            <span className="px-2 text-[var(--border-strong)]" aria-hidden="true">
              /
            </span>
            {person.location[l]}
          </p>
        </div>
      </footer>
    </>
  );
}
