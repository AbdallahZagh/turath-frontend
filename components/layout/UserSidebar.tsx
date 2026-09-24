"use client";

import {
  BedDouble,
  CalendarDays,
  CalendarHeart,
  LayoutDashboard,
  Languages,
  Landmark,
  MapPinned,
  ShieldCheck,
  Utensils,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { USER_PATHS } from "@/config/userRoutes";
import { cn } from "@/lib/cn";

type UserSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

const USER_NAV = [
  {
    key: "account",
    items: [
      { href: USER_PATHS.home, key: "dashboard", icon: LayoutDashboard },
      { href: USER_PATHS.bookings, key: "bookings", icon: CalendarDays },
      { href: USER_PATHS.reliability, key: "reliability", icon: ShieldCheck },
    ],
  },
  {
    key: "discover",
    items: [
      { href: USER_PATHS.hotels, key: "hotels", icon: BedDouble },
      { href: USER_PATHS.restaurants, key: "restaurants", icon: Utensils },
      { href: USER_PATHS.trips, key: "trips", icon: MapPinned },
      { href: USER_PATHS.events, key: "events", icon: CalendarHeart },
      { href: USER_PATHS.guides, key: "guides", icon: Languages },
      { href: USER_PATHS.attractions, key: "attractions", icon: Landmark },
    ],
  },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === USER_PATHS.home ? pathname === href : pathname.startsWith(href);
}

export function UserSidebar({ mobileOpen, onClose }: UserSidebarProps): ReactNode {
  const t = useTranslations("account");
  const tChrome = useTranslations("chrome");
  const pathname = usePathname();

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

        <Link href={USER_PATHS.home} onClick={onClose} className="mx-auto my-6 flex h-14 items-center justify-center px-5">
          <Logo variant="main" className="h-12" priority />
        </Link>

        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3" aria-label={t("nav.label")}>
          {USER_NAV.map((group) => (
            <div key={group.key}>
              <p className="text-prose-muted mb-1.5 px-3 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                {t(`nav.groups.${group.key}`)}
              </p>
              <div className="flex flex-col gap-1">
                {group.items.map(({ href, key, icon: Icon }) => {
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
                      {t(`nav.${key}`)}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-glass-border border-t p-3">
          <p className="text-prose-muted mb-2 px-1 text-[0.65rem] font-bold uppercase tracking-[0.14em]">
            {tChrome("theme")}
          </p>
          <ThemeToggle className="w-full" />
        </div>
      </aside>
    </>
  );
}
