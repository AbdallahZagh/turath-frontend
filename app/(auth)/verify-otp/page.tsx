import type { ReactNode } from "react";

import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function VerifyOtpPage(): ReactNode {
  return (
    <AuthLayout mode="verify">
      <VerifyOtpForm />
    </AuthLayout>
  );
}
