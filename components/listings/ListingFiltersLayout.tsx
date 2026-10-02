"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { FilterChips, type FilterChip } from "@/components/ui/FilterChips";
import { useTranslations } from "@/i18n/translations";

type ListingFiltersLayoutProps = {
  /** Renders the listing's filter fields; `embedded` is true inside the mobile Drawer. */
  renderFilters: (embedded: boolean) => ReactNode;
  drawerTitle: string;
  resetLabel: string;
  showResultsLabel: string;
  onReset: () => void;
  chips: FilterChip[];
  /** Result count line at the start of the toolbar. */
  summary: ReactNode;
  /** Extra toolbar badges (e.g. the searched dates on hotels). */
  badges?: ReactNode;
  children: ReactNode;
};

/**
 * The listing filter pattern (hotels, trips, events, guides): a sticky side panel from `lg`,
 * one “Filters” button opening a Drawer below it, and removable chips for the filters in use.
 */
export function ListingFiltersLayout({
  renderFilters,
  drawerTitle,
  resetLabel,
  showResultsLabel,
  onReset,
  chips,
  summary,
  badges,
  children,
}: ListingFiltersLayoutProps): ReactNode {
  const t = useTranslations("ui.filter");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const openLabel = chips.length > 0 ? t("openWithCount", { count: chips.length }) : t("open");

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden lg:block">{renderFilters(false)}</aside>

      <section aria-live="polite" className="min-w-0">
        <div className="mb-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {summary}
            <div className="flex flex-wrap items-center gap-2">
              {badges}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
                aria-expanded={filtersOpen}
              >
                <SlidersHorizontal className="size-3.5" aria-hidden />
                {openLabel}
              </Button>
            </div>
          </div>
          <FilterChips chips={chips} />
        </div>
        {children}
      </section>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={drawerTitle}
        side="end"
        footer={
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="glass" size="sm" className="shrink-0 whitespace-nowrap" onClick={onReset}>
              {resetLabel}
            </Button>
            <Button size="sm" onClick={() => setFiltersOpen(false)}>
              {showResultsLabel}
            </Button>
          </div>
        }
      >
        {renderFilters(true)}
      </Drawer>
    </div>
  );
}
