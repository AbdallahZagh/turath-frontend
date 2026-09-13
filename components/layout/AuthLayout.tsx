import Link from "next/link";
import type { ReactNode } from "react";

import { AuthMobileTrustStrip } from "@/components/auth/AuthMobileTrustStrip";
import { AuthShowcasePane, type AuthMode } from "@/components/auth/AuthShowcasePane";
import { Logo } from "@/components/logo/Logo";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

type AuthLayoutProps = {
  mode: AuthMode;
  children: ReactNode;
};

export function AuthLayout({ mode, children }: AuthLayoutProps): ReactNode {
  return (
    <div className="app-canvas flex h-svh overflow-x-clip overflow-y-hidden">
      <AuthShowcasePane mode={mode} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip">
        <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:justify-end lg:px-10">
          <Link href="/" className="flex min-w-0 items-center lg:hidden">
            <Logo variant="simple" className="h-8 w-auto" />
          </Link>
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher compact />
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-x-clip overflow-y-auto px-4 py-3 sm:px-6">
          <div className="flex w-full min-w-0 max-w-xl flex-col items-center justify-center py-2">
            {children}
            <AuthMobileTrustStrip />
          </div>
        </div>
      </div>
    </div>
  );
}
