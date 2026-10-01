import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_PATH } from "@/lib/content";
import { LOCALE_COOKIE, negotiate } from "@/lib/i18n";

/**
 * Raiz: redirige segun el idioma.
 *
 * Redirige de rebote, no renderiza una pagina intermedia. Un visitante que
 * llega a portfolio.denux.tech ve el portfolio de inmediato; una pantalla de
 * "elige idioma" le obliga a un clic antes de saber que la web existe.
 *
 * El idioma se decide con la MISMA funcion que usa el servidor en /[lang], para
 * que no sea posible que la raiz mande a un idioma que despues contradiga el
 * render de esa ruta.
 */
export default async function Root() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const locale = negotiate(
    cookieStore.get(LOCALE_COOKIE)?.value,
    headerStore.get("accept-language"),
  );
  redirect(LOCALE_PATH[locale]);
}
