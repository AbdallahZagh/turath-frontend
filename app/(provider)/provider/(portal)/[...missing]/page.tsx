import { notFound } from "next/navigation";

import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/** Any unmatched /provider/... path renders this segment's not-found inside the portal shell. */
export default function ProviderMissingPage(): never {
  notFound();
}
