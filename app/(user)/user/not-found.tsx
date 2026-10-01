import type { ReactNode } from "react";

import { NotFoundPanel } from "@/components/ui/NotFoundPanel";
import { USER_PATHS } from "@/config/userRoutes";
import { notFoundMetadata } from "@/lib/i18n/notFoundMetadata";

export const generateMetadata = notFoundMetadata;

/** Unknown links under /user stay inside the portal shell. */
export default function UserNotFound(): ReactNode {
  return (
    <div className="flex min-h-[60svh] items-center py-10">
      <NotFoundPanel homeHref={USER_PATHS.home} />
    </div>
  );
}
