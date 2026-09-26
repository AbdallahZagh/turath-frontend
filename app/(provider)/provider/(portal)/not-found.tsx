import type { ReactNode } from "react";

import { NotFoundPanel } from "@/components/ui/NotFoundPanel";
import { PROVIDER_PATHS } from "@/config/providerRoutes";

/** Unknown links under /provider stay inside the portal shell. */
export default function ProviderNotFound(): ReactNode {
  return (
    <div className="flex min-h-[60svh] items-center py-10">
      <NotFoundPanel homeHref={PROVIDER_PATHS.home} />
    </div>
  );
}
