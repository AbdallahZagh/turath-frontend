import type { ReactNode } from "react";

import { NotFoundPanel } from "@/components/ui/NotFoundPanel";
import { ADMIN_PATHS } from "@/config/adminRoutes";
import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/** Unknown links under /admin stay inside the portal shell. */
export default function AdminNotFound(): ReactNode {
  return (
    <div className="flex min-h-[60svh] items-center py-10">
      <NotFoundPanel homeHref={ADMIN_PATHS.home} />
    </div>
  );
}
