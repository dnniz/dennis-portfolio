import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Fuentes autoalojadas por next/font: se sirven desde el propio origen, sin
 * peticion a Google ni al proveedor de fuentes. Es un requisito de privacidad
 * (GDPR) y ademas quita un third-party del critical path, que es justo lo que
 * mide LCP.
 *
 * Geist, no Inter. Inter es el default de facto del generador y por eso mismo
 * ya no dice nada; aqui el sitio es de backend y la tipografia tecnica es parte
 * del argumento.
 */
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Se mantiene el zoom del usuario: bloquearlo a 1x rompe la lectura para
  // quien necesita agrandar el texto, y es un fallo de accesibilidad.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio.denux.tech"),
  title: {
    default: "Dennis Pineda Licona, Senior Full-Stack Developer",
    template: "%s | Dennis Pineda Licona",
  },
  description:
    "Senior backend developer working with .NET and Node.js. Nine years across banking, telecom and energy, including a loyalty module serving 1M+ active users.",
  authors: [{ name: "Dennis Pineda Licona" }],
  creator: "Dennis Pineda Licona",
  alternates: {
    canonical: "/",
    types: {
      "application/rdf+xml": [
        { url: "/en", title: "English" },
        { url: "/es", title: "Espanol" },
      ],
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    siteName: "Dennis Pineda Licona",
    title: "Dennis Pineda Licona, Senior Full-Stack Developer",
    description:
      "Senior backend developer working with .NET and Node.js. Nine years across banking, telecom and energy.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/*
          El tema se aplica ANTES de pintar, con un script sincrono en <head>.
          Sin esto la pagina aparece en claro un instante y luego salta a oscuro
          (flash of wrong theme), que en un portfolio con dos modos es lo
          primero que nota quien lo visita de noche.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');if(s==='dark'||s==='light'){document.documentElement.classList.add(s);document.documentElement.style.colorScheme=s;}else{document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
