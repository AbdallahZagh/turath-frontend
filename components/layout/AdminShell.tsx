"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminCommandPalette } from "@/components/layout/AdminCommandPalette";
import { PageHeader } from "@/components/ui/PageHeader";
import { getPageHeader } from "@/config/pageHeaders";
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
        <div className="absolute inset-e-6 top-5 z-30 hidden sm:block">
          <AdminCommandPalette />
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
