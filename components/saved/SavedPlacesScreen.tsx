"use client";

import { Bookmark, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSavedPlaces, useToggleSavedPlace } from "@/hooks/useSavedPlaces";
import type { Locale } from "@/i18n/config";
import type { SavedPlaceCategory } from "@/lib/mock/savedPlaces";
import { localizedName } from "@/lib/i18n/localized";
import { cn } from "@/lib/cn";

const CATEGORIES: ("all" | SavedPlaceCategory)[] = ["all", "hotels", "restaurants", "trips", "events", "guides", "attractions"];

export function SavedPlacesScreen(): ReactNode {
  const t = useTranslations("savedPlaces");
  const tUi = useTranslations("ui");
  const tGov = useTranslations("landing.governorates");
  const locale: Locale = useLocale() === "ar" ? "ar" : "en";
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const query = useSavedPlaces();
  const toggle = useToggleSavedPlace();

  if (query.isPending) return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"><Skeleton className="h-80" /><Skeleton className="h-80" /><Skeleton className="h-80" /></div>;
  if (query.isError) return <ErrorState title={tUi("errorTitle")} description={tUi("errorDescription")} retryLabel={tUi("retry")} onRetry={() => void query.refetch()} />;

  const items = (query.data ?? []).filter((item) => category === "all" || item.category === category);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("filterLabel")}>
        {CATEGORIES.map((value) => (
          <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors", category === value ? "bg-primary text-primary-foreground" : "bg-glass-control text-prose-muted hover:text-prose")}>
            {t(`categories.${value}`)}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Bookmark} title={t("emptyTitle")} description={t("emptyBody")} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <GlassPanel key={`${item.category}-${item.id}`} frost={false} className="group relative overflow-hidden">
              <Link href={item.href} className="block">
                <div className="relative aspect-4/3 overflow-hidden">
                  <Image src={item.imageSrc} alt={localizedName(item.name, locale)} fill sizes="(min-width:1280px) 29vw, (min-width:640px) 45vw, 92vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <Badge>{t(`categories.${item.category}`)}</Badge>
                  <h2 className="font-heading text-prose mt-3 text-xl font-semibold">{localizedName(item.name, locale)}</h2>
                  <p className="text-prose-muted mt-1 flex items-center gap-1.5 text-sm"><MapPin className="size-4" aria-hidden />{tGov(item.governorate)}</p>
                </div>
              </Link>
              <button type="button" aria-label={t("removeNamed", { name: localizedName(item.name, locale) })} disabled={toggle.isPending} onClick={() => toggle.mutate(item)} className="glass-surface text-prose hover:text-destructive absolute end-3 top-3 grid size-10 place-items-center rounded-full backdrop-blur-md">
                <Trash2 className="size-4" aria-hidden />
              </button>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
