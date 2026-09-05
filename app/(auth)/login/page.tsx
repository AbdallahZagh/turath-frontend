import type { ReactNode } from "react";

import { AuthCredentialsForm } from "@/components/auth/AuthCredentialsForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function LoginPage(): ReactNode {
  return (
    <AuthLayout mode="login">
      <AuthCredentialsForm mode="login" />
    </AuthLayout>
  );
}
