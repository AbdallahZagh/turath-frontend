"use client";

import { List, Map, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import type { UseDiscoveryFiltersResult } from "@/hooks/useDiscoveryFilters";
import { GOVERNORATES } from "@/lib/mock/landing";
import {
  DISCOVERY_AMENITIES,
  DISCOVERY_CATEGORIES,
  type DiscoveryCategory,
} from "@/services/discovery";

export function DiscoveryFiltersPanel({
  discovery,
  mode,
  showQuery = false,
}: {
  discovery: UseDiscoveryFiltersResult;
  mode: "map" | "list";
  showQuery?: boolean;
}): ReactNode {
  const t = useTranslations("discovery");
  const tf = useTranslations("discovery.filters");
  const tGov = useTranslations("landing.governorates");
  const { state, update, reset, queryString } = discovery;
  const categories: SelectOption[] = [
    { value: "all", label: tf("allCategories") },
    ...DISCOVERY_CATEGORIES.map((category) => ({
      value: category,
      label: t(`categories.${category}`),
    })),
  ];
  const governorates: SelectOption[] = [
    { value: "all", label: tf("allGovernorates") },
    ...GOVERNORATES.map((item) => ({ value: item.slug, label: tGov(item.slug) })),
  ];
  const radius: SelectOption[] = [
    { value: "all", label: tf("anyRadius") },
    ...[25, 75, 150, 300].map((value) => ({
      value: String(value),
      label: tf("radiusKm", { value }),
    })),
  ];
  const prices: SelectOption[] = [
    { value: "all", label: tf("anyPrice") },
    ...[100000, 250000, 500000].map((value) => ({
      value: String(value),
      label: tf("priceUpTo", { value: new Intl.NumberFormat().format(value) }),
    })),
  ];
  const target = mode === "map" ? "/search" : "/explore";
  const targetHref = queryString ? `${target}?${queryString}` : target;
  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-prose flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="text-primary size-4" aria-hidden />
          {tf("title")}
        </h2>
        <Button variant="glass" size="sm" onClick={reset}>
          <RotateCcw className="size-3.5" aria-hidden />
          {tf("reset")}
        </Button>
      </div>
      <div className="mt-5 space-y-4">
        {showQuery ? (
          <Input
            variant="main"
            type="search"
            label={tf("query")}
            placeholder={tf("queryPlaceholder")}
            value={state.q}
            onChange={(event) => update({ q: event.target.value || null })}
          />
        ) : null}
        <Select
          variant="main"
          label={tf("category")}
          options={categories}
          value={state.category ?? "all"}
          onChange={(value) =>
            update({ category: value === "all" ? null : (value as DiscoveryCategory) })
          }
        />
        <Select
          variant="main"
          label={tf("governorate")}
          options={governorates}
          value={state.governorate ?? "all"}
          onChange={(value) =>
            update({
              governorate:
                value === "all"
                  ? null
                  : (value as UseDiscoveryFiltersResult["state"]["governorate"]),
            })
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Select
            variant="main"
            label={tf("radius")}
            options={radius}
            value={state.radius ? String(state.radius) : "all"}
            onChange={(value) => update({ radius: value === "all" ? null : Number(value) })}
          />
          <Select
            variant="main"
            label={tf("price")}
            options={prices}
            value={state.maxPrice ? String(state.maxPrice) : "all"}
            onChange={(value) => update({ maxPrice: value === "all" ? null : Number(value) })}
          />
        </div>
        <fieldset>
          <legend className="text-prose mb-3 text-sm font-semibold">{tf("amenities")}</legend>
          <div className="space-y-2">
            {DISCOVERY_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="text-prose-muted flex cursor-pointer items-center gap-3 text-sm"
              >
                <Checkbox
                  checked={state[amenity]}
                  onChange={(event) => update({ [amenity]: event.target.checked })}
                />
                <span>{tf(`amenityOptions.${amenity}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-prose mb-3 text-sm font-semibold">{tf("access")}</legend>
          <div className="space-y-2">
            <label className="text-prose-muted flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={state.smoking}
                onChange={(event) => update({ smoking: event.target.checked })}
              />
              <span>{tf("smoking")}</span>
            </label>
            <label className="text-prose-muted flex cursor-pointer items-center gap-3 text-sm">
              <Checkbox
                checked={state.accessible}
                onChange={(event) => update({ accessible: event.target.checked })}
              />
              <span>{tf("accessible")}</span>
            </label>
          </div>
        </fieldset>
        <Link href={targetHref} className="block">
          <Button variant="outline" className="w-full">
            {mode === "map" ? (
              <List className="size-4" aria-hidden />
            ) : (
              <Map className="size-4" aria-hidden />
            )}
            {mode === "map" ? tf("showList") : tf("showMap")}
          </Button>
        </Link>
      </div>
    </GlassPanel>
  );
}
