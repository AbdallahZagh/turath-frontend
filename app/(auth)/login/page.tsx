import type { ReactNode } from "react";

import { AuthCredentialsForm } from "@/components/auth/AuthCredentialsForm";
import { RETURN_TO_PARAM, safeReturnPath } from "@/lib/auth/returnTo";

export default async function LoginPage({ searchParams }: PageProps<"/login">): Promise<ReactNode> {
  const params = await searchParams;
  return <AuthCredentialsForm mode="login" returnTo={safeReturnPath(params[RETURN_TO_PARAM])} />;
}
