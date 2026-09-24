"use client";

import { Coins, Menu, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { HeaderProfileMenu } from "@/components/layout/HeaderProfileMenu";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { UserGlobalSearch } from "@/components/layout/UserGlobalSearch";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { USER_PATHS } from "@/config/userRoutes";
import { useIsClient } from "@/hooks/useIsClient";
import { useAuthStore } from "@/store/authStore";
import { isCurrency, useCurrencyStore } from "@/store/currencyStore";

type UserShellProps = { children: ReactNode };

export function UserShell({ children }: UserShellProps): ReactNode {
  const t = useTranslations("account");
  const mounted = useIsClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeSession = useAuthStore((state) => state.completeSession);
  const signOut = useAuthStore((state) => state.signOut);
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  if (!mounted) {
    return <div className="p-6"><Skeleton className="h-[calc(100svh-3rem)]" /></div>;
  }

  if (!isAuthenticated || user.role !== "TOURIST") {
    return (
      <div className="grid min-h-svh place-items-center p-4">
        <GlassPanel className="max-w-xl items-center px-6 py-14 text-center sm:px-10">
          <span className="bg-primary/12 text-primary grid size-14 place-items-center rounded-2xl">
            <UserRound className="size-7" aria-hidden />
          </span>
          <h1 className="font-heading text-prose mt-5 text-3xl font-semibold">{t("access.title")}</h1>
          <p className="text-prose-muted mt-2 max-w-md text-sm leading-relaxed">{t("access.description")}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/login">{t("access.signIn")}</Button>
            {process.env.NODE_ENV === "development" ? (
              <Button variant="outline" onClick={() => completeSession("TOURIST")}>
                {t("access.preview")}
              </Button>
            ) : null}
          </div>
        </GlassPanel>
      </div>
    );
  }

  const currencyOptions: SelectOption[] = [
    { value: "SYP", label: t("preferences.syp") },
    { value: "USD", label: t("preferences.usd") },
  ];

  return (
    <div className="app-canvas flex h-svh overflow-hidden p-1.5 max-lg:p-0">
      <UserSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="glass-surface absolute start-2 end-2 top-2 z-30 flex items-center justify-between gap-3 rounded-xl px-3 py-2 backdrop-blur-sm sm:start-4 sm:end-4 sm:top-3 sm:px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              className="text-prose-muted hover:bg-option-hover grid size-10 place-items-center rounded-full lg:hidden"
              aria-label={t("shell.openMenu")}
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" aria-hidden />
            </button>
            <UserGlobalSearch />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <Select compact className="hidden lg:block" size="sm" variant="plain" icon={<Coins className="size-3.5" />} options={currencyOptions} value={currency} onChange={(value) => { if (isCurrency(value)) setCurrency(value); }} label={t("preferences.currency")} />
            <HeaderProfileMenu
              name={user.name}
              email={user.email}
              openLabel={t("shell.profileMenu.open")}
              signOutLabel={t("nav.signOut")}
              signOutHref="/login"
              items={[{ href: USER_PATHS.profile, label: t("shell.profileMenu.profile"), icon: UserRound }]}
              onSignOut={signOut}
            />
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
