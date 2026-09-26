import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import type { LocalizedName } from "@/lib/i18n/localized";

type DetailMetadataSource = {
  name: LocalizedName;
  description: LocalizedName;
};

/** Tab title and description for a listing detail page in the active locale. The root layout adds the brand. */
export async function detailMetadata(
  item: DetailMetadataSource | null | undefined,
): Promise<Metadata> {
  if (!item) {
    const t = await getTranslations("notFound");
    return { title: t("title") };
  }
  const locale = await getLocale();
  const lang = isLocale(locale) ? locale : defaultLocale;
  return { title: item.name[lang], description: item.description[lang] };
}
