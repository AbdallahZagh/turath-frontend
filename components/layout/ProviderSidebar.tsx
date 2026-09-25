"use client";

import { BadgeCheck, Building2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Skeleton } from "@/components/ui/Skeleton";
import { PROVIDER_NAV } from "@/config/nav";
import { PROVIDER_PATHS } from "@/config/providerRoutes";
import { useProviderProfile } from "@/hooks/useProviderProfile";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/authStore";

type ProviderSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function isActive(pathname: string, href: string): boolean {
  return href === PROVIDER_PATHS.home
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function ProviderSidebar({
  mobileOpen,
  onClose,
}: ProviderSidebarProps): ReactNode {
  const t = useTranslations("provider");
  const locale = useLocale();
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user.role);
  const profileQuery = useProviderProfile();
  const items = PROVIDER_NAV.filter((item) => item.roles.includes(role));
  const profile = profileQuery.data;
  const businessName = profile
    ? locale === "ar"
      ? profile.nameAr
      : profile.nameEn
    : t("business.name");
  const businessCategory = profile
    ? t(`profile.registration.categories.${profile.category}`)
    : t("business.category");

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="bg-overlay fixed inset-0 z-40 lg:hidden"
          aria-label={t("shell.closeMenu")}
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "glass-surface relative z-10 flex h-full w-64 shrink-0 flex-col rounded-xl backdrop-blur-sm",
          "max-lg:fixed max-lg:inset-s-3 max-lg:inset-y-3 max-lg:z-50",
          !mobileOpen && "max-lg:hidden",
        )}
      >
        <button
          type="button"
          className="text-prose-muted hover:bg-option-hover absolute end-3 top-3 grid size-9 place-items-center rounded-full lg:hidden"
          aria-label={t("shell.closeMenu")}
          onClick={onClose}
        >
          <X className="size-4" aria-hidden />
        </button>

        <Link
          href={PROVIDER_PATHS.home}
          onClick={onClose}
          className="mx-auto my-6 flex h-14 items-center justify-center px-5"
        >
          <Logo variant="main" className="h-12" priority />
        </Link>

        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
          aria-label={t("nav.label")}
        >
          {items.map(({ href, labelKey, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-prose-muted hover:bg-option-hover hover:text-prose",
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {t(`nav.${labelKey}`)}
              </Link>
            );
          })}
        </nav>

        <div className="border-glass-border border-t p-3">
          {profileQuery.isPending ? (
            <Skeleton className="h-[5.5rem] rounded-2xl" />
          ) : (
            <section className="border-glass-border bg-glass-control rounded-2xl border p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-primary/12 text-primary grid size-10 shrink-0 place-items-center rounded-xl">
                  <Building2 className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-prose-muted text-[0.65rem] font-bold uppercase tracking-[0.12em]">
                    {t("sidebarBusiness.current")}
                  </p>
                  <p className="text-prose mt-0.5 truncate text-sm font-semibold" title={businessName}>
                    {businessName}
                  </p>
                </div>
              </div>
              <div className="text-prose-muted mt-3 flex items-center justify-between gap-2 text-xs">
                <span className="truncate">{businessCategory}</span>
                {profile?.verified ? (
                  <span
                    className="text-primary inline-flex shrink-0 items-center gap-1"
                    title={t("profile.preview.verified")}
                  >
                    <BadgeCheck className="size-3.5" aria-hidden />
                    <span className="sr-only">{t("profile.preview.verified")}</span>
                  </span>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
