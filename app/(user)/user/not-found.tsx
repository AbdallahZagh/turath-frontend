import type { ReactNode } from "react";

import { NotFoundPanel } from "@/components/ui/NotFoundPanel";
import { USER_PATHS } from "@/config/userRoutes";

/** Unknown links under /user stay inside the portal shell. */
export default function UserNotFound(): ReactNode {
  return (
    <div className="flex min-h-[60svh] items-center py-10">
      <NotFoundPanel homeHref={USER_PATHS.home} />
    </div>
  );
}
