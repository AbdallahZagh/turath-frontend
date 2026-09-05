import { addDays } from "date-fns";

import { parseIsoDate, toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { CommissionTierId } from "@/lib/mock/adminCommissions";
import {
  cloneInventory,
  inventoryFor,
  type ProviderInventory,
} from "@/lib/mock/adminProviderInventory";
import type { GovernorateSlug, LandingPillarId } from "@/lib/mock/landing";

export const PROVIDER_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

export const PROVIDER_DOCUMENT_KINDS = [
  "commercialRegistration",
  "ministryLicense",
  "ownerId",
] as const;

export type ProviderDocumentKind = (typeof PROVIDER_DOCUMENT_KINDS)[number];

export type AdminProviderDocument = {
  id: string;
  kind: ProviderDocumentKind;
  filename: string;
  uploadedAt: string;
};

export const PROVIDER_ACCOUNT_EVENT_KINDS = [
  "submitted",
  "approved",
  "rejected",
  "suspended",
  "reinstated",
  "financeUpdated",
] as const;

export type ProviderAccountEventKind = (typeof PROVIDER_ACCOUNT_EVENT_KINDS)[number];

export type AdminProviderAccountEvent = {
  at: string;
  kind: ProviderAccountEventKind;
};

export type AdminProvider = {
  id: string;
  name: LocalizedName;
  owner: LocalizedName;
  category: LandingPillarId;
  governorate: GovernorateSlug;
  status: ProviderStatus;
  submittedAt: string;
  phone: string;
  email: string;
  address: LocalizedName;
  description: LocalizedName;
  documents: AdminProviderDocument[];
  tier: CommissionTierId;
  commissionOverride: number | null;
  creditOverrideSyp: number | null;
  inventory: ProviderInventory;
  accountEvents: AdminProviderAccountEvent[];
};

export type AdminProviderFinanceInput = {
  commissionOverride: number | null;
  creditOverrideSyp: number | null;
};

type ProviderSeed = {
  id: string;
  name: LocalizedName;
  owner: LocalizedName;
  category: LandingPillarId;
  governorate: GovernorateSlug;
  status: ProviderStatus;
  submittedAt: string;
};

const PROVIDER_SEED: ProviderSeed[] = [
  {
    id: "prv_01",
    name: { en: "Dar Al-Qamar", ar: "دار القمر" },
    owner: { en: "Samer Qabbani", ar: "سامر قبّاني" },
    category: "hotels",
    governorate: "damascus",
    status: "pending",
    submittedAt: "2026-08-22",
  },
  {
    id: "prv_02",
    name: { en: "Souq Spice Table", ar: "مائدة سوق التوابل" },
    owner: { en: "Rima Halabi", ar: "ريما الحلبي" },
    category: "dining",
    governorate: "aleppo",
    status: "pending",
    submittedAt: "2026-08-24",
  },
  {
    id: "prv_03",
    name: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    owner: { en: "Wael Asaad", ar: "وائل أسعد" },
    category: "trips",
    governorate: "palmyra",
    status: "pending",
    submittedAt: "2026-08-25",
  },
  {
    id: "prv_04",
    name: { en: "Krak Night Concert", ar: "حفل ليل الحصن" },
    owner: { en: "Maya Nahas", ar: "مايا نحاس" },
    category: "events",
    governorate: "homs",
    status: "pending",
    submittedAt: "2026-08-26",
  },
  {
    id: "prv_05",
    name: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    owner: { en: "Nadine Khouri", ar: "نادين خوري" },
    category: "guides",
    governorate: "latakia",
    status: "pending",
    submittedAt: "2026-08-27",
  },
  {
    id: "prv_06",
    name: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    owner: { en: "Firas Hammoud", ar: "فراس حمّود" },
    category: "hotels",
    governorate: "hama",
    status: "pending",
    submittedAt: "2026-08-28",
  },
  {
    id: "prv_07",
    name: { en: "Tartus Harbor Kitchen", ar: "مطبخ ميناء طرطوس" },
    owner: { en: "Joud Saleh", ar: "جود صالح" },
    category: "dining",
    governorate: "tartus",
    status: "pending",
    submittedAt: "2026-08-29",
  },
  {
    id: "prv_08",
    name: { en: "Bosra Stage Walk", ar: "جولة مسرح بصرى" },
    owner: { en: "Hanan Atrash", ar: "حنان الأطرش" },
    category: "guides",
    governorate: "bosra",
    status: "pending",
    submittedAt: "2026-08-30",
  },
  {
    id: "prv_09",
    name: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    owner: { en: "Lina Nasser", ar: "لينا ناصر" },
    category: "hotels",
    governorate: "damascus",
    status: "approved",
    submittedAt: "2026-06-12",
  },
  {
    id: "prv_10",
    name: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    owner: { en: "Karim Tello", ar: "كريم تلّو" },
    category: "dining",
    governorate: "damascus",
    status: "approved",
    submittedAt: "2026-06-18",
  },
  {
    id: "prv_11",
    name: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    owner: { en: "Youssef Homsi", ar: "يوسف حمصي" },
    category: "guides",
    governorate: "aleppo",
    status: "approved",
    submittedAt: "2026-07-02",
  },
  {
    id: "prv_12",
    name: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    owner: { en: "Sanaa Moussa", ar: "سناء موسى" },
    category: "dining",
    governorate: "tartus",
    status: "approved",
    submittedAt: "2026-07-11",
  },
  {
    id: "prv_13",
    name: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    owner: { en: "Adnan Hariri", ar: "عدنان الحريري" },
    category: "events",
    governorate: "bosra",
    status: "approved",
    submittedAt: "2026-07-20",
  },
  {
    id: "prv_14",
    name: { en: "Unlicensed Desert Camp", ar: "مخيم صحراوي بلا ترخيص" },
    owner: { en: "Unknown applicant", ar: "مقدّم غير معروف" },
    category: "trips",
    governorate: "palmyra",
    status: "rejected",
    submittedAt: "2026-05-08",
  },
  {
    id: "prv_15",
    name: { en: "Midnight Rooftop", ar: "سطح منتصف الليل" },
    owner: { en: "Ziad Kanaan", ar: "زياد كنعان" },
    category: "dining",
    governorate: "damascus",
    status: "rejected",
    submittedAt: "2026-06-01",
  },
  {
    id: "prv_16",
    name: { en: "Homs Garden Hotel", ar: "فندق حديقة حمص" },
    owner: { en: "Maha Qudsi", ar: "مها قدسي" },
    category: "hotels",
    governorate: "homs",
    status: "suspended",
    submittedAt: "2026-04-16",
  },
  {
    id: "prv_17",
    name: { en: "Lattakia Dive Club", ar: "نادي غوص اللاذقية" },
    owner: { en: "Bassel Hanna", ar: "باسل حنّا" },
    category: "trips",
    governorate: "latakia",
    status: "suspended",
    submittedAt: "2026-05-22",
  },
];

const ADDRESSES: Record<GovernorateSlug, LocalizedName> = {
  damascus: { en: "Old Damascus, behind Straight Street", ar: "دمشق القديمة، خلف الشارع المستقيم" },
  aleppo: { en: "Al-Jdaydeh, near the citadel slope", ar: "الجديدة، قرب سفح القلعة" },
  latakia: { en: "Corniche, facing the harbor", ar: "الكورنيش، مقابل الميناء" },
  tartus: { en: "Old harbor lane", ar: "زقاق الميناء القديم" },
  homs: { en: "Garden district, Khalid ibn al-Walid", ar: "حي الحديقة، خالد بن الوليد" },
  hama: { en: "Norias quarter, Orontes bank", ar: "حي النواعير، ضفة العاصي" },
  palmyra: { en: "Town edge, museum road", ar: "طرف البلدة، طريق المتحف" },
  bosra: { en: "Theatre square", ar: "ساحة المسرح" },
};

function emailFromOwner(owner: LocalizedName): string {
  const slug = owner.en
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
  return `${slug || "owner"}@example.com`;
}

function phoneFromId(id: string): string {
  const n = Number(id.replace("prv_", ""));
  const seq = Number.isFinite(n) ? n : 1;
  return `+963 9${String(30 + seq).padStart(2, "0")} ${String(120 + seq * 13).padStart(3, "0")} ${String(200 + seq * 7).padStart(3, "0")}`;
}

function documentsFor(seed: ProviderSeed): AdminProviderDocument[] {
  if (seed.id === "prv_14") {
    return [
      {
        id: `${seed.id}_id`,
        kind: "ownerId",
        filename: "id-scan.jpg",
        uploadedAt: seed.submittedAt,
      },
    ];
  }
  return [
    {
      id: `${seed.id}_cr`,
      kind: "commercialRegistration",
      filename: `cr-${seed.id}.pdf`,
      uploadedAt: seed.submittedAt,
    },
    {
      id: `${seed.id}_lic`,
      kind: "ministryLicense",
      filename: `license-${seed.id}.pdf`,
      uploadedAt: seed.submittedAt,
    },
    {
      id: `${seed.id}_id`,
      kind: "ownerId",
      filename: `id-${seed.id}.jpg`,
      uploadedAt: seed.submittedAt,
    },
  ];
}

function tierFor(seed: ProviderSeed): CommissionTierId {
  if (seed.status === "rejected" || seed.status === "suspended") {
    return "highRisk";
  }
  if (seed.id === "prv_09" || seed.id === "prv_10") {
    return "preferred";
  }
  return "standard";
}

function descriptionFor(seed: ProviderSeed): LocalizedName {
  return {
    en: `${seed.name.en} — ${seed.owner.en}.`,
    ar: `${seed.name.ar} — ${seed.owner.ar}.`,
  };
}

function shiftIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return iso;
  }
  return toIsoDate(addDays(date, days));
}

function seedAccountEvents(seed: ProviderSeed): AdminProviderAccountEvent[] {
  const events: AdminProviderAccountEvent[] = [
    { at: seed.submittedAt, kind: "submitted" },
  ];

  if (seed.status === "approved") {
    events.push({ at: shiftIso(seed.submittedAt, 8), kind: "approved" });
  }

  if (seed.status === "rejected") {
    events.push({ at: shiftIso(seed.submittedAt, 6), kind: "rejected" });
  }

  if (seed.status === "suspended") {
    events.push({ at: shiftIso(seed.submittedAt, 10), kind: "approved" });
    events.push({ at: shiftIso(seed.submittedAt, 55), kind: "suspended" });
  }

  if (seed.id === "prv_09") {
    events.push({ at: shiftIso(seed.submittedAt, 20), kind: "financeUpdated" });
  }

  return events;
}

function cloneProvider(provider: AdminProvider): AdminProvider {
  return {
    ...provider,
    name: { ...provider.name },
    owner: { ...provider.owner },
    address: { ...provider.address },
    description: { ...provider.description },
    documents: provider.documents.map((doc) => ({ ...doc })),
    inventory: cloneInventory(provider.inventory),
    accountEvents: provider.accountEvents.map((event) => ({ ...event })),
  };
}

function enrich(seed: ProviderSeed): AdminProvider {
  return {
    ...seed,
    name: { ...seed.name },
    owner: { ...seed.owner },
    phone: phoneFromId(seed.id),
    email: emailFromOwner(seed.owner),
    address: { ...ADDRESSES[seed.governorate] },
    description: descriptionFor(seed),
    documents: documentsFor(seed),
    tier: tierFor(seed),
    commissionOverride: seed.id === "prv_09" ? 0.1 : null,
    creditOverrideSyp: null,
    inventory: inventoryFor(seed),
    accountEvents: seedAccountEvents(seed),
  };
}

const providers: AdminProvider[] = PROVIDER_SEED.map(enrich);

export function listAdminProviders(): AdminProvider[] {
  return providers.map(cloneProvider);
}

export function findAdminProviderIdByName(en: string): string | undefined {
  return providers.find((provider) => provider.name.en === en)?.id;
}

export function getAdminProvider(id: string): AdminProvider | undefined {
  const found = providers.find((provider) => provider.id === id);
  return found ? cloneProvider(found) : undefined;
}

function kycKindForStatus(
  from: ProviderStatus,
  to: ProviderStatus,
): ProviderAccountEventKind | null {
  if (from === to) {
    return null;
  }
  if (to === "approved" && from === "suspended") {
    return "reinstated";
  }
  if (to === "approved") {
    return "approved";
  }
  if (to === "rejected") {
    return "rejected";
  }
  if (to === "suspended") {
    return "suspended";
  }
  return null;
}

export function setAdminProviderStatus(
  id: string,
  status: ProviderStatus,
  at: string,
): AdminProvider {
  const index = providers.findIndex((provider) => provider.id === id);
  const current = index === -1 ? undefined : providers[index];
  if (current === undefined) {
    throw new Error(`Unknown admin provider: ${id}`);
  }

  const kind = kycKindForStatus(current.status, status);
  if (kind === null) {
    return cloneProvider(current);
  }

  const next = cloneProvider(current);
  next.status = status;
  next.accountEvents.push({ at, kind });
  providers[index] = next;
  return cloneProvider(next);
}

export function setAdminProviderFinance(
  id: string,
  input: AdminProviderFinanceInput,
  at: string,
): AdminProvider {
  const index = providers.findIndex((provider) => provider.id === id);
  const current = index === -1 ? undefined : providers[index];
  if (current === undefined) {
    throw new Error(`Unknown admin provider: ${id}`);
  }
  if (
    current.commissionOverride === input.commissionOverride &&
    current.creditOverrideSyp === input.creditOverrideSyp
  ) {
    return cloneProvider(current);
  }

  const next = cloneProvider(current);
  next.commissionOverride = input.commissionOverride;
  next.creditOverrideSyp = input.creditOverrideSyp;
  next.accountEvents.push({ at, kind: "financeUpdated" });
  providers[index] = next;
  return cloneProvider(next);
}
