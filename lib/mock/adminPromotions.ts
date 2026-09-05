import { isAfter, isBefore, startOfDay } from "date-fns";

import type { LocalizedName } from "@/lib/i18n/localized";
import { parseIsoDate } from "@/lib/format/datetime";

export const PROMOTION_KINDS = ["featured", "campaign"] as const;

export type PromotionKind = (typeof PROMOTION_KINDS)[number];

export const PROMOTION_STATUSES = ["scheduled", "live", "ended"] as const;

export type PromotionStatus = (typeof PROMOTION_STATUSES)[number];

export const PROMOTION_TARGET_PRESETS: readonly {
  id: string;
  target: LocalizedName;
}[] = [
  { id: "hotels", target: { en: "Hotels", ar: "الفنادق" } },
  { id: "dining", target: { en: "Dining", ar: "المطاعم" } },
  { id: "trips", target: { en: "Trips", ar: "الرحلات" } },
  { id: "events", target: { en: "Events", ar: "الفعاليات" } },
  { id: "guides", target: { en: "Guides", ar: "المرشدون" } },
  { id: "umayyad", target: { en: "Umayyad Mosque", ar: "الجامع الأموي الكبير" } },
  { id: "palmyra", target: { en: "Palmyra Monumental Arch", ar: "قوس النصر في تدمر" } },
  { id: "bosra", target: { en: "Bosra Roman Theatre", ar: "مسرح بصرى الروماني" } },
  { id: "krak", target: { en: "Krak des Chevaliers", ar: "قلعة الحصن" } },
  { id: "beitAlWali", target: { en: "Beit Al-Wali", ar: "بيت الوالي" } },
  { id: "darAlQamar", target: { en: "Dar Al-Qamar", ar: "دار القمر" } },
  { id: "citadelWalks", target: { en: "Citadel Walks", ar: "مشاوير القلعة" } },
];

export const CUSTOM_PROMOTION_TARGET_ID = "custom";

export function promotionPresetIdForTarget(target: LocalizedName): string {
  return (
    PROMOTION_TARGET_PRESETS.find((preset) => preset.target.en === target.en)?.id ??
    CUSTOM_PROMOTION_TARGET_ID
  );
}

export type AdminPromotion = {
  id: string;
  title: LocalizedName;
  kind: PromotionKind;
  target: LocalizedName;
  startAt: string;
  endAt: string;
};

export type SaveAdminPromotionInput = {
  title: LocalizedName;
  kind: PromotionKind;
  target: LocalizedName;
  startAt: string;
  endAt: string;
};

function clonePromotion(row: AdminPromotion): AdminPromotion {
  return {
    ...row,
    title: { ...row.title },
    target: { ...row.target },
  };
}

let promotions: AdminPromotion[] = [
  {
    id: "prm_01",
    title: { en: "Courtyard stays, late summer", ar: "إقامات البيوت الدمشقية أواخر الصيف" },
    kind: "featured",
    target: { en: "Dar Al-Qamar", ar: "دار القمر" },
    startAt: "2026-08-20",
    endAt: "2026-09-12",
  },
  {
    id: "prm_02",
    title: { en: "Heritage week on the home grid", ar: "أسبوع التراث على شبكة الصفحة الرئيسية" },
    kind: "campaign",
    target: { en: "Attractions", ar: "المعالم" },
    startAt: "2026-08-28",
    endAt: "2026-09-08",
  },
  {
    id: "prm_03",
    title: { en: "Citadel dusk walks", ar: "مشاوير غروب القلعة" },
    kind: "featured",
    target: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    startAt: "2026-09-10",
    endAt: "2026-09-24",
  },
  {
    id: "prm_04",
    title: { en: "Ramadan tables teaser", ar: "تشويقة موائد رمضان" },
    kind: "campaign",
    target: { en: "Dining", ar: "الطعام" },
    startAt: "2026-09-18",
    endAt: "2026-10-02",
  },
  {
    id: "prm_05",
    title: { en: "Bosra night listing", ar: "عرض ليالي بصرى" },
    kind: "featured",
    target: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    startAt: "2026-07-01",
    endAt: "2026-08-15",
  },
  {
    id: "prm_06",
    title: { en: "Coast road trips", ar: "رحلات طريق الساحل" },
    kind: "campaign",
    target: { en: "Trips", ar: "الرحلات" },
    startAt: "2026-08-01",
    endAt: "2026-08-31",
  },
  {
    id: "prm_07",
    title: { en: "Umayyad Friday spotlight", ar: "تسليط جمعة الأموي" },
    kind: "featured",
    target: { en: "Umayyad Mosque", ar: "الجامع الأموي" },
    startAt: "2026-09-01",
    endAt: "2026-09-07",
  },
  {
    id: "prm_08",
    title: { en: "Guides of Old Damascus", ar: "مرشدو دمشق القديمة" },
    kind: "featured",
    target: { en: "Guides", ar: "المرشدون" },
    startAt: "2026-09-05",
    endAt: "2026-09-30",
  },
];

export function promotionStatus(
  row: AdminPromotion,
  today = new Date(),
): PromotionStatus {
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

export function listAdminPromotions(): AdminPromotion[] {
  return promotions.map(clonePromotion);
}

export function createAdminPromotion(input: SaveAdminPromotionInput): AdminPromotion {
  const created: AdminPromotion = {
    id: `prm_${Date.now().toString(36)}`,
    title: { en: input.title.en.trim(), ar: input.title.ar.trim() },
    kind: input.kind,
    target: { en: input.target.en.trim(), ar: input.target.ar.trim() },
    startAt: input.startAt,
    endAt: input.endAt,
  };
  promotions = [created, ...promotions];
  return clonePromotion(created);
}

export function updateAdminPromotion(
  id: string,
  input: SaveAdminPromotionInput,
): AdminPromotion {
  const current = promotions.find((row) => row.id === id);
  if (!current) {
    throw new Error("missing-promotion");
  }
  const updated: AdminPromotion = {
    ...current,
    title: { en: input.title.en.trim(), ar: input.title.ar.trim() },
    kind: input.kind,
    target: { en: input.target.en.trim(), ar: input.target.ar.trim() },
    startAt: input.startAt,
    endAt: input.endAt,
  };
  promotions = promotions.map((row) => (row.id === id ? updated : row));
  return clonePromotion(updated);
}

export function deleteAdminPromotion(id: string): void {
  promotions = promotions.filter((row) => row.id !== id);
}
