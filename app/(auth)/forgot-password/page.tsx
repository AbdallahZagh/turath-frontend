import type { ReactNode } from "react";

import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ForgotPasswordPage(): ReactNode {
  return (
    <AuthLayout mode="forgot">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
