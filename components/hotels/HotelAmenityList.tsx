import {
  Accessibility,
  AirVent,
  Car,
  Coffee,
  Plane,
  PlugZap,
  Trees,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { HotelAmenityId } from "@/lib/mock/hotels";

const AMENITY_ICON: Record<HotelAmenityId, LucideIcon> = {
  generator: PlugZap,
  wifi: Wifi,
  ac: AirVent,
  breakfast: Coffee,
  airportTransfer: Plane,
  accessible: Accessibility,
  parking: Car,
  terrace: Trees,
};

type HotelAmenityListProps = {
  amenities: HotelAmenityId[];
  compact?: boolean;
};

export function HotelAmenityList({
  amenities,
  compact = false,
}: HotelAmenityListProps): ReactNode {
  const t = useTranslations("hotels.amenities");
  const visibleAmenities = compact ? amenities.slice(0, 3) : amenities;

  return (
    <ul className={compact ? "flex flex-wrap gap-x-3 gap-y-1.5" : "grid gap-3 sm:grid-cols-2"}>
      {visibleAmenities.map((amenity) => {
        const Icon = AMENITY_ICON[amenity];
        return (
          <li
            key={amenity}
            className={
              compact
                ? "text-prose-muted inline-flex items-center gap-1.5 text-xs"
                : "bg-glass-control text-prose flex items-center gap-3 rounded-2xl px-4 py-3 text-sm"
            }
          >
            <Icon className="text-accent size-4 shrink-0" aria-hidden />
            {t(amenity)}
          </li>
        );
      })}
    </ul>
  );
}
