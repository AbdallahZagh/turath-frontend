import type { ReactNode } from "react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const token = firstParam(params.token);

  return (
    <AuthLayout mode="reset">
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
