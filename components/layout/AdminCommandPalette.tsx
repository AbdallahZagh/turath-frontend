"use client";

import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";

import {
  GlobalSearchPalette,
  type GlobalSearchItem,
} from "@/components/layout/GlobalSearchPalette";
import { flattenAdminNav } from "@/config/nav";

const COMMAND_ITEMS = flattenAdminNav();

export function AdminCommandPalette(): ReactNode {
  const tNav = useTranslations("admin.nav");
  const tShell = useTranslations("admin.shell");
  const items = useMemo<GlobalSearchItem[]>(
    () =>
      COMMAND_ITEMS.map((item) => ({
        href: item.href,
        label: tNav(item.labelKey),
        icon: item.icon,
      })),
    [tNav],
  );

  return (
    <GlobalSearchPalette
      items={items}
      labels={{
        dialog: tShell("commandPalette"),
        placeholder: tShell("searchPlaceholder"),
        noResults: tShell("noResults"),
        navigate: tShell("paletteNavigate"),
        select: tShell("paletteSelect"),
        close: tShell("paletteClose"),
        shortcut: tShell("paletteShortcut"),
      }}
    />
  );
}
