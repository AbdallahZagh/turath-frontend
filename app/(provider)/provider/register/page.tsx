import type { ReactNode } from "react";

import { ProviderRegisterForm } from "@/components/auth/ProviderRegisterForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ProviderRegisterPage(): ReactNode {
  return (
    <AuthLayout mode="providerRegister">
      <ProviderRegisterForm />
    </AuthLayout>
  );
}
