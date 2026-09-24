"use client";

import {
  BedDouble,
  CalendarDays,
  CalendarHeart,
  Languages,
  Landmark,
  LayoutDashboard,
  MapPinned,
  Search,
  ShieldCheck,
  Utensils,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";

import {
  GlobalSearchPalette,
  type GlobalSearchItem,
} from "@/components/layout/GlobalSearchPalette";
import { USER_PATHS } from "@/config/userRoutes";

export function UserGlobalSearch(): ReactNode {
  const t = useTranslations("account");
  const items = useMemo<GlobalSearchItem[]>(
    () => [
      { href: USER_PATHS.home, label: t("nav.dashboard"), icon: LayoutDashboard },
      { href: USER_PATHS.bookings, label: t("nav.bookings"), icon: CalendarDays },
      { href: USER_PATHS.reliability, label: t("nav.reliability"), icon: ShieldCheck },
      { href: USER_PATHS.hotels, label: t("nav.hotels"), icon: BedDouble },
      { href: USER_PATHS.restaurants, label: t("nav.restaurants"), icon: Utensils },
      { href: USER_PATHS.trips, label: t("nav.trips"), icon: MapPinned },
      { href: USER_PATHS.events, label: t("nav.events"), icon: CalendarHeart },
      { href: USER_PATHS.guides, label: t("nav.guides"), icon: Languages },
      { href: USER_PATHS.attractions, label: t("nav.attractions"), icon: Landmark },
    ],
    [t],
  );
  const searchAll = useMemo(
    () => ({
      icon: Search,
      getHref: (query: string) => `/search?q=${encodeURIComponent(query)}`,
      getLabel: (query: string) => t("shell.searchAll", { query }),
    }),
    [t],
  );

  return (
    <GlobalSearchPalette
      items={items}
      searchAll={searchAll}
      labels={{
        dialog: t("shell.searchLabel"),
        placeholder: t("shell.searchPlaceholder"),
        noResults: t("shell.searchEmpty"),
        navigate: t("shell.paletteNavigate"),
        select: t("shell.paletteSelect"),
        close: t("shell.paletteClose"),
        shortcut: t("shell.paletteShortcut"),
      }}
    />
  );
}
