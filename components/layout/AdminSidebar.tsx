"use client";

import { ChevronDown, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { AdminSettingsMenu } from "@/components/layout/AdminSettingsMenu";
import { Logo } from "@/components/logo/Logo";
import { Tooltip } from "@/components/ui/Tooltip";
import { ADMIN_PATHS } from "@/config/adminRoutes";
import {
  ADMIN_NAV,
  type NavEntry,
  type NavGroup,
  type NavGroupKey,
  type NavItem,
} from "@/config/nav";
import { cn } from "@/lib/cn";
import type { AppRole } from "@/lib/auth/roles";
import { initialsFromName } from "@/lib/format/initials";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

function navIsActive(pathname: string, href: string): boolean {
  if (href === ADMIN_PATHS.home) {
    return pathname === ADMIN_PATHS.home;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupTitle(
  t: ReturnType<typeof useTranslations<"admin.nav">>,
  key: NavGroupKey,
): string {
  if (key === "people") {
    return t("people");
  }
  if (key === "settlement") {
    return t("settlement");
  }
  return t("rules");
}

function groupHasActive(pathname: string, group: NavGroup): boolean {
  return group.items.some((item) => navIsActive(pathname, item.href));
}

function entryVisible(entry: NavEntry, role: AppRole): boolean {
  if (entry.kind === "item") {
    return entry.item.roles.includes(role);
  }
  return (
    entry.group.roles.includes(role) &&
    entry.group.items.some((item) => item.roles.includes(role))
  );
}

type NavLinkProps = {
  item: NavItem;
  collapsed: boolean;
  onNavigate: () => void;
};

function NavLink({ item, collapsed, onNavigate }: NavLinkProps): ReactNode {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const Icon = item.icon;
  const label = t(item.labelKey);
  const active = navIsActive(pathname, item.href);
  const linkClass = cn(
    "flex w-full items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-sm font-medium transition-colors",
    collapsed && "lg:justify-center lg:px-0",
    active
      ? "bg-primary text-primary-foreground"
      : "text-prose-muted hover:bg-option-hover hover:text-prose",
  );
  const body = (
    <>
      <Icon className="size-4 shrink-0" aria-hidden />
      <span className={cn(collapsed && "lg:sr-only")}>{label}</span>
    </>
  );

  if (collapsed) {
    return (
      <div className="flex w-full">
        <Link
          href={item.href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={cn(linkClass, "lg:hidden")}
        >
          {body}
        </Link>
        <Tooltip content={label} placement="end" className="hidden w-full lg:inline-flex">
          <Link href={item.href} aria-current={active ? "page" : undefined} className={linkClass}>
            {body}
          </Link>
        </Tooltip>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={linkClass}
    >
      {body}
    </Link>
  );
}

type NavAccordionProps = {
  group: NavGroup;
  open: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onNavigate: () => void;
};

function NavAccordion({
  group,
  open,
  collapsed,
  onToggle,
  onNavigate,
}: NavAccordionProps): ReactNode {
  const t = useTranslations("admin.nav");
  const pathname = usePathname();
  const Icon = group.icon;
  const label = groupTitle(t, group.labelKey);
  const active = groupHasActive(pathname, group);
  const children = group.items.map((item) => (
    <NavLink
      key={item.href}
      item={item}
      collapsed={collapsed}
      onNavigate={onNavigate}
    />
  ));

  if (collapsed) {
    return <div className="flex flex-col gap-1">{children}</div>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-[0.85rem] px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "text-prose"
            : "text-prose-muted hover:bg-option-hover hover:text-prose",
        )}
      >
        <Icon className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 text-start">{label}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="ms-4 mt-1 flex flex-col gap-1 border-s border-glass-border ps-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type AdminSidebarProps = {
  /** Stick to the viewport on desktop when the document scrolls. */
  sticky?: boolean;
};

export function AdminSidebar({ sticky = false }: AdminSidebarProps): ReactNode {
  const tChrome = useTranslations("admin.shell");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const role = user.role;
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const [opened, setOpened] = useState<Partial<Record<NavGroupKey, boolean>>>({});
  const entries = ADMIN_NAV.filter((entry) => entryVisible(entry, role));

  function closeMobile(): void {
    setMobileNavOpen(false);
  }

  return (
    <>
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label={tChrome("closeNav")}
          className="bg-overlay fixed inset-0 z-40 lg:hidden"
          onClick={closeMobile}
        />
      ) : null}

      <aside
        className={cn(
          "glass-surface backdrop-blur-sm relative z-10 flex min-h-0 w-64 shrink-0 flex-col rounded-xl",
          "max-lg:fixed max-lg:inset-s-3 max-lg:inset-y-3 max-lg:z-50 max-lg:h-auto",
          sticky
            ? "lg:sticky lg:top-1.5 lg:h-[calc(100svh-0.75rem)] lg:self-start"
            : "h-full",
          collapsed ? "lg:w-19" : "lg:w-64",
          !mobileNavOpen && "max-lg:hidden",
        )}
      >
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? tChrome("expand") : tChrome("collapse")}
          className="glass-surface backdrop-blur-sm text-prose-muted hover:text-prose absolute end-0 bottom-11 z-20 hidden size-8 translate-x-1/2 items-center justify-center rounded-full lg:flex rtl:-translate-x-1/2"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-3.5 rtl:scale-x-[-1]" aria-hidden />
          ) : (
            <PanelLeftClose className="size-3.5 rtl:scale-x-[-1]" aria-hidden />
          )}
        </button>
        <div
          className={cn(
            "my-5 flex h-16 shrink-0 items-center px-4",
            collapsed ? "lg:justify-center lg:px-2" : "justify-center",
          )}
        >
          <Link href={ADMIN_PATHS.home} onClick={closeMobile} className="flex items-center justify-center">
            <Logo variant="main" className={cn("h-12", collapsed && "lg:hidden")} />
            {collapsed ? <Logo variant="simple" className="hidden h-8 lg:inline-flex" /> : null}
          </Link>
        </div>

        <nav aria-label={tChrome("navLabel")} className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
          {entries.map((entry) => {
            if (entry.kind === "item") {
              return (
                <NavLink
                  key={entry.item.href}
                  item={entry.item}
                  collapsed={collapsed}
                  onNavigate={closeMobile}
                />
              );
            }

            const hasActive = groupHasActive(pathname, entry.group);
            const open = opened[entry.group.key] ?? hasActive;

            return (
              <NavAccordion
                key={entry.group.key}
                group={entry.group}
                open={open}
                collapsed={collapsed}
                onToggle={() =>
                  setOpened((current) => ({
                    ...current,
                    [entry.group.key]: !(current[entry.group.key] ?? hasActive),
                  }))
                }
                onNavigate={closeMobile}
              />
            );
          })}
        </nav>

        <div
          className={cn(
            "flex shrink-0 items-center gap-1 border-t border-glass-border p-3",
            collapsed && "lg:flex-col lg:px-2",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2.5",
              collapsed && "lg:flex-col lg:justify-center",
            )}
          >
            <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {initialsFromName(user.name)}
            </span>
            <span className={cn("flex min-w-0 flex-col leading-tight", collapsed && "lg:hidden")}>
              <span className="text-prose truncate text-sm font-medium">{user.name}</span>
              <span className="text-prose-muted truncate text-xs">{tChrome("adminBadge")}</span>
            </span>
          </div>
          <AdminSettingsMenu />
        </div>
      </aside>
    </>
  );
}
