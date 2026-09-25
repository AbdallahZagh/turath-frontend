import type { ReactNode } from "react";

import { AuthCredentialsForm } from "@/components/auth/AuthCredentialsForm";

export default function RegisterPage(): ReactNode {
  return <AuthCredentialsForm mode="register" />;
}
