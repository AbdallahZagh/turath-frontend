import type { ReactNode } from "react";

import { ProviderPendingView } from "@/components/auth/ProviderPendingView";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ProviderPendingPage(): ReactNode {
  return (
    <AuthLayout mode="providerRegister">
      <ProviderPendingView />
    </AuthLayout>
  );
}
