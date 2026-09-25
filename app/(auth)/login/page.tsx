import type { ReactNode } from "react";

import { AuthCredentialsForm } from "@/components/auth/AuthCredentialsForm";

export default function LoginPage(): ReactNode {
  return <AuthCredentialsForm mode="login" />;
}
