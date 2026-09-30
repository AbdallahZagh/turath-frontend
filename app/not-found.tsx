import type { ReactNode } from "react";

import { PublicShell } from "@/components/layout/PublicShell";
import { PublicNotFoundSection } from "@/components/ui/NotFoundPanel";
import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/**
 * URLs that match no route render outside every route-group layout, so this is the one
 * place that adds the public shell. `notFound()` inside `(public)` uses
 * `(public)/not-found.tsx`, where the group layout already provides the shell.
 */
export default function NotFound(): ReactNode {
  return (
    <PublicShell>
      <PublicNotFoundSection />
    </PublicShell>
  );
}
