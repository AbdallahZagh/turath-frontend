import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import "./global";

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const cookieLocale = store.get(localeCookieName)?.value;
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
