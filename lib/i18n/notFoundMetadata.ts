import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/** Tab title for every 404 view; the root layout template adds the brand. */
export async function notFoundMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return { title: t("title") };
}
