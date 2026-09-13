"use client";

import { Bus, Cross, CupSoda, Sandwich, Signpost, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { TripGearId } from "@/lib/mock/trips";

const GEAR_ICONS: Record<TripGearId, LucideIcon> = {
  water: CupSoda,
  snacks: Sandwich,
  walkingPoles: Signpost,
  firstAid: Cross,
  transport: Bus,
};

export function TripGearList({ gear, compact = false }: { gear: TripGearId[]; compact?: boolean }): ReactNode {
  const t = useTranslations("trips.gear");
  const shown = compact ? gear.slice(0, 3) : gear;
  return (
    <ul className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>
      {shown.map((item) => {
        const Icon = GEAR_ICONS[item];
        return <li key={item} className="bg-glass-control text-prose flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Icon className="text-accent size-4 shrink-0" aria-hidden />{t(item)}</li>;
      })}
    </ul>
  );
}
