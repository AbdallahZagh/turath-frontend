import type { ReactNode } from "react";

import { AuthLayout } from "@/components/layout/AuthLayout";

type AuthGroupLayoutProps = {
  children: ReactNode;
};

export default function AuthGroupLayout({ children }: AuthGroupLayoutProps): ReactNode {
  return <AuthLayout>{children}</AuthLayout>;
}
