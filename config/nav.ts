import {
  BookOpen,
  Building2,
  CalendarCheck,
  Contact,
  Landmark,
  LayoutDashboard,
  Megaphone,
  MessageSquareQuote,
  Percent,
  Scale,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  TicketPercent,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import type { AppRole } from "@/lib/auth/roles";

export type NavLabelKey =
  | "overview"
  | "providers"
  | "users"
  | "reviews"
  | "bookings"
  | "disputes"
  | "attractions"
  | "taxonomy"
  | "commissions"
  | "ledger"
  | "promotions"
  | "coupons"
  | "auditLogs"
  | "settings";

export type NavGroupKey = "people" | "settlement" | "rules";

export type NavItem = {
  href: string;
  labelKey: NavLabelKey;
  icon: LucideIcon;
  roles: AppRole[];
};

export type NavGroup = {
  key: NavGroupKey;
  labelKey: NavGroupKey;
  icon: LucideIcon;
  roles: AppRole[];
  items: NavItem[];
};

export type NavEntry = { kind: "item"; item: NavItem } | { kind: "group"; group: NavGroup };

const ADMIN: AppRole[] = ["SUPER_ADMIN"];

const overview: NavItem = {
  href: ADMIN_PATHS.home,
  labelKey: "overview",
  icon: LayoutDashboard,
  roles: ADMIN,
};

const bookings: NavItem = {
  href: ADMIN_PATHS.bookings,
  labelKey: "bookings",
  icon: CalendarCheck,
  roles: ADMIN,
};

const attractions: NavItem = {
  href: ADMIN_PATHS.heritageSites,
  labelKey: "attractions",
  icon: Landmark,
  roles: ADMIN,
};

const promotions: NavItem = {
  href: ADMIN_PATHS.featured,
  labelKey: "promotions",
  icon: Megaphone,
  roles: ADMIN,
};

const coupons: NavItem = {
  href: ADMIN_PATHS.discountCodes,
  labelKey: "coupons",
  icon: TicketPercent,
  roles: ADMIN,
};

const settings: NavItem = {
  href: ADMIN_PATHS.settings,
  labelKey: "settings",
  icon: Settings,
  roles: ADMIN,
};

export const ADMIN_NAV: NavEntry[] = [
  { kind: "item", item: overview },
  {
    kind: "group",
    group: {
      key: "people",
      labelKey: "people",
      icon: Contact,
      roles: ADMIN,
      items: [
        { href: ADMIN_PATHS.guests, labelKey: "users", icon: Users, roles: ADMIN },
        { href: ADMIN_PATHS.businesses, labelKey: "providers", icon: Building2, roles: ADMIN },
        { href: ADMIN_PATHS.reviews, labelKey: "reviews", icon: MessageSquareQuote, roles: ADMIN },
      ],
    },
  },
  { kind: "item", item: bookings },
  {
    kind: "group",
    group: {
      key: "settlement",
      labelKey: "settlement",
      icon: Wallet,
      roles: ADMIN,
      items: [
        { href: ADMIN_PATHS.noShows, labelKey: "disputes", icon: Scale, roles: ADMIN },
        { href: ADMIN_PATHS.accounts, labelKey: "ledger", icon: BookOpen, roles: ADMIN },
      ],
    },
  },
  { kind: "item", item: attractions },
  {
    kind: "group",
    group: {
      key: "rules",
      labelKey: "rules",
      icon: SlidersHorizontal,
      roles: ADMIN,
      items: [
        { href: ADMIN_PATHS.fees, labelKey: "commissions", icon: Percent, roles: ADMIN },
        { href: ADMIN_PATHS.lists, labelKey: "taxonomy", icon: Tags, roles: ADMIN },
        { href: ADMIN_PATHS.auditLogs, labelKey: "auditLogs", icon: ShieldCheck, roles: ADMIN },
      ],
    },
  },
  { kind: "item", item: promotions },
  { kind: "item", item: coupons },
  { kind: "item", item: settings },
];

export function flattenAdminNav(): NavItem[] {
  const items: NavItem[] = [];
  for (const entry of ADMIN_NAV) {
    if (entry.kind === "item") {
      items.push(entry.item);
    } else {
      items.push(...entry.group.items);
    }
  }
  return items;
}
