import type { LocalizedName } from "@/lib/i18n/localized";
import { GOVERNORATES, type GovernorateSlug } from "@/lib/mock/landing";

export const TAXONOMY_KINDS = ["categories", "amenities", "governorates"] as const;

export type TaxonomyKind = (typeof TAXONOMY_KINDS)[number];

export type AdminTaxonomyTerm = {
  id: string;
  kind: TaxonomyKind;
  slug: string;
  name: LocalizedName;
  sortOrder: number;
};

export type SaveAdminTaxonomyTermInput = {
  kind: TaxonomyKind;
  slug: string;
  name: LocalizedName;
};

function slugFromName(name: string, fallbackId: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : fallbackId;
}

const CATEGORY_SEED: Omit<AdminTaxonomyTerm, "id" | "kind" | "sortOrder">[] = [
  { slug: "hotels", name: { en: "Stays", ar: "الإقامات" } },
  { slug: "dining", name: { en: "Dining", ar: "الطعام" } },
  { slug: "trips", name: { en: "Trips", ar: "الرحلات" } },
  { slug: "events", name: { en: "Events", ar: "الفعاليات" } },
  { slug: "guides", name: { en: "Guides", ar: "المرشدون" } },
];

const AMENITY_SEED: Omit<AdminTaxonomyTerm, "id" | "kind" | "sortOrder">[] = [
  { slug: "generator", name: { en: "24/7 Generator", ar: "مولّد على مدار الساعة" } },
  { slug: "wifi", name: { en: "Wi-Fi", ar: "واي فاي" } },
  { slug: "ac", name: { en: "AC", ar: "تكييف" } },
  { slug: "rooftop", name: { en: "Rooftop", ar: "سطح" } },
  { slug: "live-music", name: { en: "Live music", ar: "موسيقى حية" } },
  { slug: "smoking", name: { en: "Smoking area", ar: "منطقة تدخين" } },
  { slug: "accessibility", name: { en: "Accessible", ar: "مهيأ لذوي الإعاقة" } },
  { slug: "multilingual", name: { en: "Multilingual", ar: "متعدد اللغات" } },
  { slug: "guided", name: { en: "Guided", ar: "جولة بمرشد" } },
  { slug: "vip", name: { en: "VIP tier", ar: "فئة كبار الشخصيات" } },
];

const GOVERNORATE_NAMES: Record<GovernorateSlug, LocalizedName> = {
  damascus: { en: "Damascus", ar: "دمشق" },
  aleppo: { en: "Aleppo", ar: "حلب" },
  latakia: { en: "Latakia", ar: "اللاذقية" },
  tartus: { en: "Tartus", ar: "طرطوس" },
  homs: { en: "Homs", ar: "حمص" },
  hama: { en: "Hama", ar: "حماة" },
  palmyra: { en: "Palmyra", ar: "تدمر" },
  bosra: { en: "Bosra", ar: "بصرى" },
};

function seedKind(
  kind: TaxonomyKind,
  rows: Omit<AdminTaxonomyTerm, "id" | "kind" | "sortOrder">[],
): AdminTaxonomyTerm[] {
  return rows.map((row, index) => ({
    id: `tax_${kind}_${row.slug}`,
    kind,
    slug: row.slug,
    name: row.name,
    sortOrder: index + 1,
  }));
}

let terms: AdminTaxonomyTerm[] = [
  ...seedKind("categories", CATEGORY_SEED),
  ...seedKind("amenities", AMENITY_SEED),
  ...seedKind(
    "governorates",
    GOVERNORATES.map((item) => ({
      slug: item.slug,
      name: GOVERNORATE_NAMES[item.slug],
    })),
  ),
];

export class DuplicateTaxonomySlugError extends Error {
  constructor() {
    super("duplicate-slug");
    this.name = "DuplicateTaxonomySlugError";
  }
}

function cloneTerm(term: AdminTaxonomyTerm): AdminTaxonomyTerm {
  return { ...term, name: { ...term.name } };
}

export function listAdminTaxonomy(): AdminTaxonomyTerm[] {
  return terms.map(cloneTerm);
}

function assertUniqueSlug(kind: TaxonomyKind, slug: string, exceptId?: string): void {
  const taken = terms.some(
    (term) => term.kind === kind && term.slug === slug && term.id !== exceptId,
  );
  if (taken) {
    throw new DuplicateTaxonomySlugError();
  }
}

function nextSortOrder(kind: TaxonomyKind): number {
  let max = 0;
  for (const term of terms) {
    if (term.kind === kind && term.sortOrder > max) {
      max = term.sortOrder;
    }
  }
  return max + 1;
}

export function createAdminTaxonomyTerm(
  input: SaveAdminTaxonomyTermInput,
): AdminTaxonomyTerm {
  const id = `tax_${input.kind}_${Date.now().toString(36)}`;
  const slug = slugFromName(input.slug || input.name.en, id);
  assertUniqueSlug(input.kind, slug);
  const created: AdminTaxonomyTerm = {
    id,
    kind: input.kind,
    slug,
    name: { en: input.name.en.trim(), ar: input.name.ar.trim() },
    sortOrder: nextSortOrder(input.kind),
  };
  terms = [...terms, created];
  return cloneTerm(created);
}

export function updateAdminTaxonomyTerm(
  id: string,
  input: SaveAdminTaxonomyTermInput,
): AdminTaxonomyTerm {
  const current = terms.find((term) => term.id === id);
  if (!current) {
    throw new Error("missing-term");
  }
  const slug = slugFromName(input.slug || input.name.en, id);
  assertUniqueSlug(current.kind, slug, id);
  const updated: AdminTaxonomyTerm = {
    ...current,
    slug,
    name: { en: input.name.en.trim(), ar: input.name.ar.trim() },
  };
  terms = terms.map((term) => (term.id === id ? updated : term));
  return cloneTerm(updated);
}

export function moveAdminTaxonomyTerm(
  id: string,
  direction: -1 | 1,
): AdminTaxonomyTerm[] {
  const current = terms.find((term) => term.id === id);
  if (!current) {
    throw new Error("missing-term");
  }

  const ordered = terms
    .filter((term) => term.kind === current.kind)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const index = ordered.findIndex((term) => term.id === id);
  const swapWith = ordered[index + direction];
  if (index < 0 || !swapWith) {
    return listAdminTaxonomy();
  }

  const currentOrder = current.sortOrder;
  terms = terms.map((term) => {
    if (term.id === current.id) {
      return { ...term, sortOrder: swapWith.sortOrder };
    }
    if (term.id === swapWith.id) {
      return { ...term, sortOrder: currentOrder };
    }
    return term;
  });

  return listAdminTaxonomy();
}

export function deleteAdminTaxonomyTerm(id: string): AdminTaxonomyTerm[] {
  terms = terms.filter((term) => term.id !== id);
  return listAdminTaxonomy();
}
