"use client";

import { X } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

import { useTranslations } from "@/i18n/translations";

export type FilterChip = {
  id: string;
  /** The filter's name, e.g. “Governorate”; the chip shows “Governorate: Damascus”. */
  label?: string;
  /** The chosen value, e.g. “Damascus”. */
  value: string;
  onRemove: () => void;
  /** Screen-reader name of the chip; defaults to “Remove filter {value}”. */
  removeLabel?: string;
};

type FilterChipsProps = {
  chips: FilterChip[];
  /** Name of the chip list; defaults to “Active filters”. */
  listLabel?: string;
};

/** Removable chips: the filters in use (admin tables, listing catalogs) or picked values. */
export function FilterChips({ chips, listLabel }: FilterChipsProps): ReactNode {
  const t = useTranslations("ui.filter");

  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label={listLabel ?? t("applied")}>
      {chips.map((chip) => (
        <li key={chip.id}>
          <FilterChipButton
            label={chip.label ? `${chip.label}: ${chip.value}` : chip.value}
            removeLabel={chip.removeLabel ?? t("remove", { filter: chip.value })}
            onRemove={chip.onRemove}
          />
        </li>
      ))}
    </ul>
  );
}

type FilterChipButtonProps = {
  label: string;
  removeLabel: string;
  onRemove: () => void;
};

function FilterChipButton({ label, removeLabel, onRemove }: FilterChipButtonProps): ReactNode {
  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
    if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      onRemove();
    }
  }

  return (
    <button
      type="button"
      className="glass-surface backdrop-blur-sm text-prose inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
      aria-label={removeLabel}
      onClick={onRemove}
      onKeyDown={onKeyDown}
    >
      <span>{label}</span>
      <X className="size-3.5 shrink-0" aria-hidden />
    </button>
  );
}
