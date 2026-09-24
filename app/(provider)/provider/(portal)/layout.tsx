import type { ReactNode } from "react";

import { ProviderShell } from "@/components/layout/ProviderShell";

type ProviderPortalLayoutProps = {
  children: ReactNode;
};

export default function ProviderPortalLayout({
  children,
}: ProviderPortalLayoutProps): ReactNode {
  return <ProviderShell>{children}</ProviderShell>;
}

