"use client";

import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";

import {
  GlobalSearchPalette,
  type GlobalSearchItem,
} from "@/components/layout/GlobalSearchPalette";
import { PROVIDER_NAV } from "@/config/nav";
import { useAuthStore } from "@/store/authStore";

export function ProviderGlobalSearch(): ReactNode {
  const t = useTranslations("provider");
  const role = useAuthStore((state) => state.user.role);
  const items = useMemo<GlobalSearchItem[]>(
    () =>
      PROVIDER_NAV.filter((item) => item.roles.includes(role)).map((item) => ({
        href: item.href,
        label: t(`nav.${item.labelKey}`),
        icon: item.icon,
      })),
    [role, t],
  );

  return (
    <GlobalSearchPalette
      items={items}
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
