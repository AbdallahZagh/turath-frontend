"use client";

import { Building2, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ProviderSidebar } from "@/components/layout/ProviderSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useIsClient } from "@/hooks/useIsClient";
import { initialsFromName } from "@/lib/format/initials";
import { useAuthStore } from "@/store/authStore";

type ProviderShellProps = {
  children: ReactNode;
};

export function ProviderShell({ children }: ProviderShellProps): ReactNode {
  const t = useTranslations("provider");
  const mounted = useIsClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeSession = useAuthStore((state) => state.completeSession);
  const setRole = useAuthStore((state) => state.setRole);

  if (!mounted) {
    return (
      <div className="p-6">
        <Skeleton className="h-[calc(100svh-3rem)]" />
      </div>
    );
  }

  const providerRole =
    user.role === "PROVIDER_OWNER" || user.role === "PROVIDER_STAFF";

  if (!isAuthenticated || !providerRole) {
    return (
      <div className="grid min-h-svh place-items-center p-4">
        <GlassPanel className="max-w-xl items-center px-6 py-14 text-center sm:px-10">
          <span className="bg-primary/12 text-primary grid size-14 place-items-center rounded-2xl">
            <Building2 className="size-7" aria-hidden />
          </span>
          <h1 className="font-heading text-prose mt-5 text-3xl font-semibold">
            {t("access.title")}
          </h1>
          <p className="text-prose-muted mt-2 max-w-md text-sm leading-relaxed">
            {t("access.description")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/login">{t("access.signIn")}</Button>
            {process.env.NODE_ENV === "development" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => completeSession("PROVIDER_OWNER")}
                >
                  {t("access.previewOwner")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => completeSession("PROVIDER_STAFF")}
                >
                  {t("access.previewStaff")}
                </Button>
              </>
            ) : null}
          </div>
        </GlassPanel>
      </div>
    );
  }

  const roleOptions: SelectOption[] = [
    { value: "PROVIDER_OWNER", label: t("roles.owner") },
    { value: "PROVIDER_STAFF", label: t("roles.staff") },
  ];

  return (
    <div className="app-canvas flex h-svh overflow-hidden p-1.5 max-lg:p-0">
      <ProviderSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="glass-surface absolute start-2 end-2 top-2 z-30 flex items-center justify-between gap-3 rounded-xl px-3 py-2 backdrop-blur-sm sm:start-4 sm:end-4 sm:top-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="text-prose-muted hover:bg-option-hover grid size-10 place-items-center rounded-full lg:hidden"
              aria-label={t("shell.openMenu")}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <div className="hidden min-w-0 sm:block">
              <p className="text-prose truncate text-sm font-semibold">
                {t("business.name")}
              </p>
              <p className="text-prose-muted truncate text-xs">
                {t("business.category")}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-2">
            {process.env.NODE_ENV === "development" ? (
              <Select
                compact
                size="sm"
                variant="plain"
                className="hidden sm:block"
                options={roleOptions}
                value={user.role}
                onChange={(value) => {
                  if (value === "PROVIDER_OWNER" || value === "PROVIDER_STAFF") {
                    setRole(value);
                  }
                }}
                label={t("roles.label")}
              />
            ) : null}
            <div className="hidden xl:block">
              <ThemeToggle />
            </div>
            <LocaleSwitcher compact />
            <span
              className="bg-primary text-primary-foreground grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold"
              aria-label={user.name}
              title={user.name}
            >
              {initialsFromName(user.name)}
            </span>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-20 sm:px-6 sm:pt-22 lg:ps-0 lg:pe-8">
          <div className="mx-auto w-full max-w-[98rem]">
            <PageHeader />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

