"use client";

import { parseAsBoolean, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";

import type { GovernorateSlug } from "@/lib/mock/landing";
import { DISCOVERY_CATEGORIES, type DiscoveryCategory, type DiscoveryFilters } from "@/services/discovery";

const GOVERNORATES = ["damascus", "aleppo", "latakia", "tartus", "homs", "hama", "palmyra", "bosra"] as const;

export type DiscoveryUrlState = {
  q: string;
  category: DiscoveryCategory | null;
  governorate: GovernorateSlug | null;
  radius: number | null;
  maxPrice: number | null;
  generator: boolean;
  wifi: boolean;
  ac: boolean;
  smoking: boolean;
  accessible: boolean;
};

export type DiscoveryUrlPatch = { [Key in keyof DiscoveryUrlState]?: DiscoveryUrlState[Key] | null };

export type UseDiscoveryFiltersResult = {
  state: DiscoveryUrlState;
  filters: DiscoveryFilters;
  update: (patch: DiscoveryUrlPatch) => void;
  reset: () => void;
  queryString: string;
};

export function useDiscoveryFilters(): UseDiscoveryFiltersResult {
  const [state, setState] = useQueryStates({
    q: parseAsString.withDefault(""),
    category: parseAsStringLiteral(DISCOVERY_CATEGORIES),
    governorate: parseAsStringLiteral(GOVERNORATES),
    radius: parseAsInteger,
    maxPrice: parseAsInteger,
    generator: parseAsBoolean.withDefault(false),
    wifi: parseAsBoolean.withDefault(false),
    ac: parseAsBoolean.withDefault(false),
    smoking: parseAsBoolean.withDefault(false),
    accessible: parseAsBoolean.withDefault(false),
  }, { history: "replace" });
  const amenities = (["generator", "wifi", "ac"] as const).filter((amenity) => state[amenity]);
  const filters: DiscoveryFilters = { query: state.q || undefined, category: state.category ?? undefined, governorate: state.governorate ?? undefined, radiusKm: state.radius ?? undefined, maxPriceSyp: state.maxPrice ?? undefined, amenities: amenities.length ? amenities : undefined, smoking: state.smoking || undefined, accessible: state.accessible || undefined };
  function update(patch: DiscoveryUrlPatch): void { void setState(patch); }
  function reset(): void { void setState({ q: null, category: null, governorate: null, radius: null, maxPrice: null, generator: null, wifi: null, ac: null, smoking: null, accessible: null }); }
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q); if (state.category) params.set("category", state.category); if (state.governorate) params.set("governorate", state.governorate); if (state.radius) params.set("radius", String(state.radius)); if (state.maxPrice) params.set("maxPrice", String(state.maxPrice));
  for (const key of ["generator", "wifi", "ac", "smoking", "accessible"] as const) if (state[key]) params.set(key, "true");
  return { state, filters, update, reset, queryString: params.toString() };
}
