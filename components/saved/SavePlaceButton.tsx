"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent, ReactNode } from "react";

import { useSavedPlaces, useToggleSavedPlace } from "@/hooks/useSavedPlaces";
import type { SavedPlace } from "@/lib/mock/savedPlaces";
import { cn } from "@/lib/cn";

export function SavePlaceButton({ place, className }: { place: SavedPlace; className?: string }): ReactNode {
  const t = useTranslations("savedPlaces");
  const query = useSavedPlaces();
  const toggle = useToggleSavedPlace();
  const saved = (query.data ?? []).some((item) => item.id === place.id && item.category === place.category);

  function onClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();
    toggle.mutate(place);
  }

  return (
    <button
      type="button"
      aria-label={saved ? t("remove") : t("save")}
      aria-pressed={saved}
      disabled={toggle.isPending}
      onClick={onClick}
      className={cn("glass-surface text-prose hover:text-primary grid size-10 place-items-center rounded-full backdrop-blur-md transition-colors disabled:opacity-60", className)}
    >
      <Heart className={cn("size-4", saved && "fill-current text-primary")} aria-hidden />
    </button>
  );
}
