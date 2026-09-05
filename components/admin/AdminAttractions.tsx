"use client";

import { Landmark, LayoutGrid, Map, Table2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { ADMIN_PATHS } from "@/config/adminRoutes";
import { AdminAttractionCard } from "@/components/admin/AdminAttractionCard";
import { AdminAttractionDeleteDialog } from "@/components/admin/AdminAttractionDeleteDialog";
import { AdminEditDeleteMenu } from "@/components/admin/AdminEditDeleteMenu";
import { AdminAttractionModal } from "@/components/admin/AdminAttractionModal";
import { AdminFilterBar, ADMIN_TOOLBAR_HEIGHT } from "@/components/admin/AdminFilterBar";
import { AdminHeritageSitesMap } from "@/components/admin/AdminHeritageSitesMap";
import { AttractionCover } from "@/components/admin/AttractionCover";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { stopMenuEvent } from "@/components/ui/Menu";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Skeleton } from "@/components/ui/Skeleton";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminAttractions } from "@/hooks/useAdminAttractions";
import { useInfiniteReveal } from "@/hooks/useInfiniteReveal";
import { usePageHeaderAction } from "@/hooks/usePageHeaderAction";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { formatPickerTime } from "@/lib/format/datetime";
import { formatSyp } from "@/lib/format/money";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import { GOVERNORATES } from "@/lib/mock/landing";
import { useUiStore } from "@/store/uiStore";

const ALL = "all";

type ViewMode = "table" | "cards" | "map";
type PublishFilter = typeof ALL | "published" | "draft";

function matchesAttractionQuery(attraction: AdminAttraction, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [attraction.name.en, attraction.name.ar, attraction.slug]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

function hoursLabel(attraction: AdminAttraction, locale: Locale): string {
  return `${formatPickerTime(attraction.opensAt, locale, "24")}–${formatPickerTime(attraction.closesAt, locale, "24")}`;
}

export function AdminAttractions(): ReactNode {
  const t = useTranslations("admin.attractions");
  const tGov = useTranslations("landing.governorates");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminAttractions();

  const [view, setView] = useState<ViewMode>("table");
  const [query, setQuery] = useState("");
  const [governorate, setGovernorate] = useState(ALL);
  const [publish, setPublish] = useState<PublishFilter>(ALL);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminAttraction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAttraction | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const setContentScrolls = useUiStore((state) => state.setContentScrolls);

  usePageHeaderAction("add", () => setCreateOpen(true));

  useEffect(() => {
    setContentScrolls(view === "cards");
    return () => setContentScrolls(false);
  }, [view, setContentScrolls]);

  const rows = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((attraction) => {
      if (governorate !== ALL && attraction.governorate !== governorate) {
        return false;
      }
      if (publish === "published" && !attraction.published) {
        return false;
      }
      if (publish === "draft" && attraction.published) {
        return false;
      }
      return matchesAttractionQuery(attraction, query);
    });
  }, [data, governorate, publish, query]);

  const filterKey = `${query}|${governorate}|${publish}`;
  const paging = usePagination(rows, filterKey);
  const cards = useInfiniteReveal(rows, filterKey);

  useEffect(() => {
    const hasMore = cards.hasMore;
    const loadMore = cards.loadMore;

    if (view !== "cards" || !hasMore) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const root = sentinel.closest("main");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { root, rootMargin: "240px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [view, cards.hasMore, cards.loadMore, cards.visible.length]);

  const columns: TableColumn<AdminAttraction>[] = [
    {
      id: "site",
      header: t("columns.site"),
      cell: (attraction) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
            <AttractionCover
              src={attraction.imageSrc}
              alt=""
              sizes="40px"
              className="absolute inset-0 size-full"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate font-medium">{localizedName(attraction.name, loc)}</span>
            <span className="text-prose-muted truncate text-xs">{attraction.slug}</span>
          </div>
        </div>
      ),
    },
    {
      id: "governorate",
      header: t("columns.governorate"),
      cell: (attraction) => tGov(attraction.governorate),
    },
    {
      id: "hours",
      header: t("columns.hours"),
      cell: (attraction) => (
        <span className="text-prose-muted whitespace-nowrap">{hoursLabel(attraction, loc)}</span>
      ),
    },
    {
      id: "fee",
      header: t("columns.fee"),
      cell: (attraction) =>
        attraction.entryFeeSyp === 0 ? t("free") : formatSyp(attraction.entryFeeSyp, loc),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (attraction) => (
        <Badge variant={attraction.published ? "solid" : "outline"}>
          {attraction.published ? t("status.published") : t("status.draft")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t("columns.actions"),
      align: "end",
      cell: (attraction) => (
        <div
          className="inline-flex"
          onClick={stopMenuEvent}
          onPointerDown={stopMenuEvent}
          onKeyDown={stopMenuEvent}
        >
          <AdminEditDeleteMenu
            label={t("actionMenu", { name: localizedName(attraction.name, loc) })}
            editLabel={t("actionEdit")}
            deleteLabel={t("actionDelete")}
            onEdit={() => setEditTarget(attraction)}
            onDelete={() => setDeleteTarget(attraction)}
          />
        </div>
      ),
    },
  ];

  const editors = (
    <>
      <AdminAttractionModal
        open={createOpen || Boolean(editTarget)}
        onClose={() => {
          setCreateOpen(false);
          setEditTarget(null);
        }}
        attraction={editTarget}
      />
      <AdminAttractionDeleteDialog
        attraction={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );

  if (isError) {
    return (
      <>
        <ErrorState
          className="flex-1 justify-center"
          title={tUi("errorTitle")}
          description={tUi("errorDescription")}
          retryLabel={tUi("retry")}
          onRetry={() => {
            void refetch();
          }}
        />
        {editors}
      </>
    );
  }

  if (!isPending && data && data.length === 0) {
    return (
      <>
        <EmptyState
          className="flex-1 justify-center"
          icon={Landmark}
          title={tUi("emptyTitle")}
          description={t("empty")}
        />
        {editors}
      </>
    );
  }

  return (
    <div className={view === "cards" ? "flex flex-col gap-4" : "flex min-h-0 flex-1 flex-col gap-4"}>
      <AdminFilterBar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder={t("searchPlaceholder")}
        filters={[
          {
            id: "governorate",
            label: t("columns.governorate"),
            value: governorate,
            onChange: setGovernorate,
            options: [
              { value: ALL, label: t("allGovernorates") },
              ...GOVERNORATES.map((item) => ({
                value: item.slug,
                label: tGov(item.slug),
              })),
            ],
          },
          {
            id: "status",
            label: t("columns.status"),
            value: publish,
            onChange: (value) => setPublish(value as PublishFilter),
            options: [
              { value: ALL, label: t("allStatuses") },
              { value: "published", label: t("status.published") },
              { value: "draft", label: t("status.draft") },
            ],
          },
        ]}
        trailing={
          <SegmentSwitch
            variant="glass"
            size="sm"
            minHeight={ADMIN_TOOLBAR_HEIGHT}
            aria-label={t("viewLabel")}
            value={view}
            onChange={(value) => setView(value as ViewMode)}
            options={[
              {
                value: "table",
                label: t("view.table"),
                icon: <Table2 className="size-3.5 shrink-0" aria-hidden />,
              },
              {
                value: "cards",
                label: t("view.cards"),
                icon: <LayoutGrid className="size-3.5 shrink-0" aria-hidden />,
              },
              {
                value: "map",
                label: t("view.map"),
                icon: <Map className="size-3.5 shrink-0" aria-hidden />,
              },
            ]}
          />
        }
      />

      {view === "table" ? (
        <Table
          fill
          columns={columns}
          rows={paging.rows}
          getRowId={(attraction) => attraction.id}
          getRowHref={(attraction) => ADMIN_PATHS.heritageSite(attraction.id)}
          caption={t("caption")}
          emptyMessage={t("emptyFiltered")}
          isLoading={isPending}
          loadingRowCount={paging.pageSize}
          pagination={
            isPending
              ? undefined
              : {
                  page: paging.page,
                  pageCount: paging.pageCount,
                  pageSize: paging.pageSize,
                  total: paging.total,
                  onPageChange: paging.setPage,
                  onPageSizeChange: paging.setPageSize,
                }
          }
        />
      ) : view === "map" ? (
        <AdminHeritageSitesMap attractions={rows} />
      ) : (
        <div className="pb-2">
          {isPending ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={`skel-${String(index)}`} className="aspect-4/3" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <EmptyState
              className="flex-1 justify-center"
              icon={Landmark}
              title={tUi("emptyTitle")}
              description={t("emptyFiltered")}
            />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.visible.map((attraction) => (
                  <AdminAttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
              <div ref={sentinelRef} className="h-4" />
              {cards.hasMore ? (
                <p className="text-prose-muted py-3 text-center text-sm">{t("loadingMore")}</p>
              ) : null}
            </>
          )}
        </div>
      )}

      {editors}
    </div>
  );
}
