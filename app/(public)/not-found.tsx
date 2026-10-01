import type { ReactNode } from "react";

import { PublicNotFoundSection } from "@/components/ui/NotFoundPanel";
import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/** `notFound()` in a public page (unknown listing or legal slug); the group layout adds the shell. */
export default function PublicNotFound(): ReactNode {
  return <PublicNotFoundSection />;
}
