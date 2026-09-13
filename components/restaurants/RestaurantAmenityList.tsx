"use client";

import { Accessibility, Snowflake, Wifi, Zap, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { RestaurantAmenityId } from "@/lib/mock/restaurants";

const AMENITY_ICONS: Record<RestaurantAmenityId, LucideIcon> = { generator: Zap, wifi: Wifi, ac: Snowflake, accessible: Accessibility };

export function RestaurantAmenityList({ amenities, compact = false }: { amenities: RestaurantAmenityId[]; compact?: boolean }): ReactNode {
  const t = useTranslations("restaurants.amenities");
  const shown = compact ? amenities.slice(0, 3) : amenities;
  return (
    <ul className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>
      {shown.map((amenity) => {
        const Icon = AMENITY_ICONS[amenity];
        return <li key={amenity} className="bg-glass-control text-prose flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Icon className="text-accent size-4 shrink-0" aria-hidden />{t(amenity)}</li>;
      })}
    </ul>
  );
}
