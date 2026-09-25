"use client";

import { Menu, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminCommandPalette } from "@/components/layout/AdminCommandPalette";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { getPageHeader } from "@/config/pageHeaders";
import { ADMIN_PATHS } from "@/config/adminRoutes";
import { useIsClient } from "@/hooks/useIsClient";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps): ReactNode {
  const t = useTranslations("admin.shell");
  const pathname = usePathname();
  const fillViewport = getPageHeader(pathname)?.fillViewport === true;
  const contentScrolls = useUiStore((state) => state.contentScrolls);
  const pinViewport = fillViewport && !contentScrolls;
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const mounted = useIsClient();
  const role = useAuthStore((state) => state.user.role);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeSession = useAuthStore((state) => state.completeSession);

  if (!mounted) {
    return (
      <div className="p-6">
        <Skeleton className="h-[calc(100svh-3rem)]" />
      </div>
    );
  }

  if (!isAuthenticated || role !== "SUPER_ADMIN") {
    return (
      <div className="grid min-h-svh place-items-center p-4">
        <GlassPanel className="max-w-xl items-center px-6 py-14 text-center sm:px-10">
          <span className="bg-primary/12 text-primary grid size-14 place-items-center rounded-2xl">
            <ShieldCheck className="size-7" aria-hidden />
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
              <Button variant="outline" onClick={() => completeSession("SUPER_ADMIN")}>
                {t("access.preview")}
              </Button>
            ) : null}
          </div>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div
      className={
        pinViewport
          ? "app-canvas flex h-svh gap-4 overflow-hidden p-1.5 max-lg:gap-0 max-lg:p-0"
          : "flex min-h-svh gap-4 p-1.5 max-lg:gap-0 max-lg:p-0"
      }
    >
      <AdminSidebar sticky={!pinViewport} />
      <div
        className={
          pinViewport
            ? "relative flex min-h-0 min-w-0 flex-1 flex-col"
            : "relative flex min-w-0 flex-1 flex-col"
        }
      >
        <button
          type="button"
          className="glass-surface backdrop-blur-sm text-prose hover:text-prose absolute inset-s-4 top-4 z-30 flex size-10 items-center justify-center rounded-full lg:hidden"
          aria-label={t("openNav")}
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="size-5" aria-hidden />
        </button>
        <div className="absolute inset-e-6 top-5 z-30 hidden w-[min(32rem,calc(100%-6rem))] items-center gap-2 sm:flex">
          <div className="min-w-0 flex-1"><AdminCommandPalette /></div>
          <NotificationBell audience="admin" href={ADMIN_PATHS.notifications} />
        </div>
        <main
          className={
            pinViewport
              ? "flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:pt-4"
              : "flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:pt-4"
          }
        >
          <div
            className={
              pinViewport
                ? "mx-auto flex h-full min-h-0 w-full flex-col gap-6 max-lg:pt-10"
                : "mx-auto flex w-full flex-col gap-6 max-lg:pt-10"
            }
          >
            <PageHeader />
            <div className={pinViewport ? "flex min-h-0 flex-1 flex-col" : undefined}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
