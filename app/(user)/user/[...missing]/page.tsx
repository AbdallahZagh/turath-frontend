import { notFound } from "next/navigation";

import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/** Any unmatched /user/... path renders this segment's not-found inside the portal shell. */
export default function UserMissingPage(): never {
  notFound();
}
