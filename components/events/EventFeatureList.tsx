"use client";

import { Accessibility, Baby, Building2, Trees, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { EventFeatureId } from "@/lib/mock/events";

const FEATURE_ICONS: Record<EventFeatureId, LucideIcon> = { indoor: Building2, outdoor: Trees, accessible: Accessibility, familyFriendly: Baby };

export function EventFeatureList({ features, compact = false }: { features: EventFeatureId[]; compact?: boolean }): ReactNode {
  const t = useTranslations("events.features");
  const shown = compact ? features.slice(0, 3) : features;
  return <ul className={compact ? "flex flex-wrap gap-2" : "grid gap-3 sm:grid-cols-2"}>{shown.map((feature) => { const Icon = FEATURE_ICONS[feature]; return <li key={feature} className="bg-glass-control text-prose flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Icon className="text-accent size-4 shrink-0" aria-hidden />{t(feature)}</li>; })}</ul>;
}
