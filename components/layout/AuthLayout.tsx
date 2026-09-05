import Link from "next/link";
import type { ReactNode } from "react";

import { AuthShowcasePane, type AuthMode } from "@/components/auth/AuthShowcasePane";
import { Logo } from "@/components/logo/Logo";

import { LocaleSwitcher } from "./LocaleSwitcher";

type AuthLayoutProps = {
  mode: AuthMode;
  children: ReactNode;
};

export function AuthLayout({ mode, children }: AuthLayoutProps): ReactNode {
  return (
    <div className="app-canvas flex h-svh overflow-hidden">
      <AuthShowcasePane mode={mode} />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6 lg:justify-end lg:px-10">
          <Link href="/" className="flex items-center lg:hidden">
            <Logo variant="simple" className="h-8 w-auto" />
          </Link>
          <LocaleSwitcher compact />
        </div>
        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto px-4 py-3 sm:px-6">
          <div className="flex w-full items-center justify-center py-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
