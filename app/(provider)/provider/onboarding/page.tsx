import type { ReactNode } from "react";

import { ProviderOnboardingForm } from "@/components/auth/ProviderOnboardingForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function ProviderOnboardingPage(): ReactNode {
  return <AuthLayout mode="providerRegister" contentSize="wide"><ProviderOnboardingForm /></AuthLayout>;
}
