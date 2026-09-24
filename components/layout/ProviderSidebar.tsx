"use client";

import { LogOut, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { PROVIDER_NAV } from "@/config/nav";
import { PROVIDER_PATHS } from "@/config/providerRoutes";
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
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user.role);
  const signOut = useAuthStore((state) => state.signOut);
  const items = PROVIDER_NAV.filter((item) => item.roles.includes(role));

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
          <Button
            href="/login"
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="size-4" aria-hidden />
            {t("nav.signOut")}
          </Button>
        </div>
      </aside>
    </>
  );
}
