import type { ReactNode } from "react";

import { AuthCredentialsForm } from "@/components/auth/AuthCredentialsForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function RegisterPage(): ReactNode {
  return (
    <AuthLayout mode="register">
      <AuthCredentialsForm mode="register" />
    </AuthLayout>
  );
}
