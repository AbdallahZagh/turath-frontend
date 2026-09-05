import { isAfter, isBefore, startOfDay } from "date-fns";

import { parseIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import { COMMISSION_PILLARS } from "@/lib/mock/adminCommissions";
import { listAdminProviders } from "@/lib/mock/adminProviders";
import type { LandingPillarId } from "@/lib/mock/landing";

export const COUPON_SCOPES = ["provider", "listing", "pillar", "platform"] as const;

export type CouponScope = (typeof COUPON_SCOPES)[number];

export const COUPON_DISCOUNT_KINDS = ["percent", "fixed"] as const;

export type CouponDiscountKind = (typeof COUPON_DISCOUNT_KINDS)[number];

export const COUPON_STATUSES = ["scheduled", "live", "ended", "disabled"] as const;

export type CouponStatus = (typeof COUPON_STATUSES)[number];

export type CouponListing = {
  id: string;
  name: LocalizedName;
};

export const COUPON_LISTINGS: CouponListing[] = [
  {
    id: "lst_01",
    name: { en: "Dar Al-Qamar courtyard suite", ar: "جناح صحن دار القمر" },
  },
  {
    id: "lst_02",
    name: { en: "Souq Spice Table terrace", ar: "تراس مائدة سوق التوابل" },
  },
  {
    id: "lst_03",
    name: { en: "Citadel dusk walk", ar: "مشوار غروب القلعة" },
  },
  {
    id: "lst_04",
    name: { en: "Krak night concert", ar: "حفل ليل الحصن" },
  },
  {
    id: "lst_05",
    name: { en: "Palmyra dawn walk", ar: "مشوار فجر تدمر" },
  },
];

export type AdminCoupon = {
  id: string;
  title: LocalizedName;
  code: string;
  discountKind: CouponDiscountKind;
  discountValue: number;
  scope: CouponScope;
  scopeId: string | null;
  startAt: string;
  endAt: string;
  maxRedemptions: number | null;
  perGuestCap: number | null;
  enabled: boolean;
};

export type SaveAdminCouponInput = {
  title: LocalizedName;
  code: string;
  discountKind: CouponDiscountKind;
  discountValue: number;
  scope: CouponScope;
  scopeId: string | null;
  startAt: string;
  endAt: string;
  maxRedemptions: number | null;
  perGuestCap: number | null;
  enabled: boolean;
};

export class DuplicateCouponCodeError extends Error {
  constructor() {
    super("duplicate-code");
    this.name = "DuplicateCouponCodeError";
  }
}

function cloneCoupon(row: AdminCoupon): AdminCoupon {
  return {
    ...row,
    title: { ...row.title },
  };
}

let coupons: AdminCoupon[] = [
  {
    id: "cpn_01",
    title: { en: "Ramadan dining tables", ar: "موائد رمضان" },
    code: "RAMADAN15",
    discountKind: "percent",
    discountValue: 15,
    scope: "pillar",
    scopeId: "dining",
    startAt: "2026-08-20",
    endAt: "2026-09-20",
    maxRedemptions: 400,
    perGuestCap: 1,
    enabled: true,
  },
  {
    id: "cpn_02",
    title: { en: "Courtyard stay welcome", ar: "ترحيب إقامة الدار" },
    code: "QAMAR10",
    discountKind: "percent",
    discountValue: 10,
    scope: "provider",
    scopeId: "prv_01",
    startAt: "2026-09-20",
    endAt: "2026-10-12",
    maxRedemptions: 80,
    perGuestCap: 1,
    enabled: true,
  },
  {
    id: "cpn_03",
    title: { en: "Citadel dusk seats", ar: "مقاعد غروب القلعة" },
    code: "CITADEL20",
    discountKind: "percent",
    discountValue: 20,
    scope: "listing",
    scopeId: "lst_03",
    startAt: "2026-09-01",
    endAt: "2026-09-30",
    maxRedemptions: 120,
    perGuestCap: 2,
    enabled: true,
  },
  {
    id: "cpn_04",
    title: { en: "Platform late-summer welcome", ar: "ترحيب أواخر الصيف على المنصة" },
    code: "WELCOME5",
    discountKind: "percent",
    discountValue: 5,
    scope: "platform",
    scopeId: null,
    startAt: "2026-09-01",
    endAt: "2026-12-31",
    maxRedemptions: null,
    perGuestCap: 1,
    enabled: false,
  },
  {
    id: "cpn_05",
    title: { en: "Bosra night cash cut", ar: "خصم نقدي لليالي بصرى" },
    code: "BOSRA50K",
    discountKind: "fixed",
    discountValue: 50_000,
    scope: "listing",
    scopeId: "lst_04",
    startAt: "2026-07-01",
    endAt: "2026-08-15",
    maxRedemptions: 60,
    perGuestCap: 1,
    enabled: true,
  },
  {
    id: "cpn_06",
    title: { en: "Guide hour off", ar: "ساعة مرشد مخفّضة" },
    code: "GUIDE10",
    discountKind: "percent",
    discountValue: 10,
    scope: "pillar",
    scopeId: "guides",
    startAt: "2026-09-01",
    endAt: "2026-09-30",
    maxRedemptions: 200,
    perGuestCap: 1,
    enabled: true,
  },
  {
    id: "cpn_07",
    title: { en: "Coast road seats", ar: "مقاعد طريق الساحل" },
    code: "COAST25",
    discountKind: "percent",
    discountValue: 25,
    scope: "pillar",
    scopeId: "trips",
    startAt: "2026-08-01",
    endAt: "2026-08-31",
    maxRedemptions: 150,
    perGuestCap: 2,
    enabled: true,
  },
  {
    id: "cpn_08",
    title: { en: "Palmyra dawn cash off", ar: "خصم نقدي لفجر تدمر" },
    code: "PALMYRA30K",
    discountKind: "fixed",
    discountValue: 30_000,
    scope: "provider",
    scopeId: "prv_03",
    startAt: "2026-09-04",
    endAt: "2026-09-18",
    maxRedemptions: 40,
    perGuestCap: 1,
    enabled: true,
  },
];

export function listCouponListings(): CouponListing[] {
  return COUPON_LISTINGS.map((row) => ({ id: row.id, name: { ...row.name } }));
}

export function couponProviderOptions(): { id: string; name: LocalizedName }[] {
  return listAdminProviders().map((row) => ({
    id: row.id,
    name: { ...row.name },
  }));
}

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function isCouponScope(value: string): value is CouponScope {
  return (COUPON_SCOPES as readonly string[]).includes(value);
}

export function isCouponDiscountKind(value: string): value is CouponDiscountKind {
  return (COUPON_DISCOUNT_KINDS as readonly string[]).includes(value);
}

export function isLandingPillarId(value: string): value is LandingPillarId {
  return (COMMISSION_PILLARS as readonly string[]).includes(value);
}

export function couponStatus(row: AdminCoupon, today = new Date()): CouponStatus {
  if (!row.enabled) {
    return "disabled";
  }
  const start = parseIsoDate(row.startAt);
  const end = parseIsoDate(row.endAt);
  const day = startOfDay(today);
  if (!start || !end) {
    return "ended";
  }
  if (isBefore(day, start)) {
    return "scheduled";
  }
  if (isAfter(day, end)) {
    return "ended";
  }
  return "live";
}

function assertUniqueCode(code: string, exceptId?: string): void {
  const taken = coupons.some(
    (row) => row.code === code && row.id !== exceptId,
  );
  if (taken) {
    throw new DuplicateCouponCodeError();
  }
}

function resolveScopeId(scope: CouponScope, scopeId: string | null): string | null {
  if (scope === "platform") {
    return null;
  }
  if (!scopeId) {
    throw new Error("missing-scope");
  }
  if (scope === "pillar" && !isLandingPillarId(scopeId)) {
    throw new Error("missing-scope");
  }
  if (scope === "provider" && !listAdminProviders().some((row) => row.id === scopeId)) {
    throw new Error("missing-scope");
  }
  if (scope === "listing" && !COUPON_LISTINGS.some((row) => row.id === scopeId)) {
    throw new Error("missing-scope");
  }
  return scopeId;
}

function toCoupon(id: string, input: SaveAdminCouponInput): AdminCoupon {
  const code = normalizeCouponCode(input.code);
  return {
    id,
    title: { en: input.title.en.trim(), ar: input.title.ar.trim() },
    code,
    discountKind: input.discountKind,
    discountValue: input.discountValue,
    scope: input.scope,
    scopeId: resolveScopeId(input.scope, input.scopeId),
    startAt: input.startAt,
    endAt: input.endAt,
    maxRedemptions: input.maxRedemptions,
    perGuestCap: input.perGuestCap,
    enabled: input.enabled,
  };
}

export function listAdminCoupons(): AdminCoupon[] {
  return coupons.map(cloneCoupon);
}

export function createAdminCoupon(input: SaveAdminCouponInput): AdminCoupon {
  const code = normalizeCouponCode(input.code);
  assertUniqueCode(code);
  const created = toCoupon(`cpn_${Date.now().toString(36)}`, input);
  coupons = [created, ...coupons];
  return cloneCoupon(created);
}

export function updateAdminCoupon(id: string, input: SaveAdminCouponInput): AdminCoupon {
  const current = coupons.find((row) => row.id === id);
  if (!current) {
    throw new Error("missing-coupon");
  }
  const code = normalizeCouponCode(input.code);
  assertUniqueCode(code, id);
  const updated = toCoupon(id, input);
  coupons = coupons.map((row) => (row.id === id ? updated : row));
  return cloneCoupon(updated);
}

export function deleteAdminCoupon(id: string): void {
  const exists = coupons.some((row) => row.id === id);
  if (!exists) {
    throw new Error("missing-coupon");
  }
  coupons = coupons.filter((row) => row.id !== id);
}
