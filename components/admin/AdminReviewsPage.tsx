"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, MessageSquareQuote } from "lucide-react";

import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminReviewActions } from "@/components/admin/AdminReviewActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { stopMenuEvent } from "@/components/ui/Menu";
import { StarRating } from "@/components/ui/StarRating";
import { Table, type TableColumn } from "@/components/ui/Table";
import {
  useAdminReviews,
  useModerateAdminReview,
} from "@/hooks/useAdminReviews";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { exportToCsv } from "@/lib/export/csv";
import { formatMediumDate } from "@/lib/format/datetime";
import { formatCount } from "@/lib/format/number";
import { localizedName } from "@/lib/i18n/localized";
import {
  REVIEW_ABOUT,
  REVIEW_MODERATION_STATUSES,
  type AdminReview,
  type ReviewAbout,
  type ReviewModerationStatus,
} from "@/lib/mock/adminReviews";
import { toast } from "@/store/toastStore";

const ALL = "all";

export function AdminReviewsPage(): ReactNode {
  const t = useTranslations("admin.reviewsPage");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";

  const { data, isPending, isError, refetch } = useAdminReviews();
  const moderate = useModerateAdminReview();

  const [query, setQuery] = useState("");
  const [about, setAbout] = useState(ALL);
  const [stars, setStars] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const filtered = useMemo(() => {
    if (!data) return [];

    const needle = query.trim().toLowerCase();

    return data.filter((rev) => {
      if (about !== ALL && rev.about !== about) return false;
      if (stars !== ALL && String(rev.stars) !== stars) return false;

      const currentStatus = rev.status ?? "published";
      if (status !== ALL && currentStatus !== status) return false;

      if (!needle) return true;

      const haystack = [
        rev.subjectEn,
        rev.author.en,
        rev.author.ar,
        rev.body.en,
        rev.body.ar,
        rev.bookingCode,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [data, about, stars, status, query]);

  const paging = usePagination(filtered, `${query}|${about}|${stars}|${status}`);

  function handleModerate(review: AdminReview, nextStatus: ReviewModerationStatus): void {
    moderate.mutate(
      { id: review.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            t("statusUpdated"),
            t("statusUpdatedBody", { status: t(`status.${nextStatus}`) }),
          );
        },
      },
    );
  }

  function handleExportCsv(): void {
    const headers = [
      t("columns.author"),
      t("columns.subject"),
      t("columns.stars"),
      t("columns.review"),
      t("columns.date"),
      t("columns.booking"),
      t("columns.status"),
    ];
    const rows = filtered.map((r) => [
      localizedName(r.author, loc),
      r.subjectEn,
      r.stars,
      localizedName(r.body, loc),
      formatMediumDate(r.at, loc),
      r.bookingCode,
      t(`status.${r.status ?? "published"}`),
    ]);
    exportToCsv(`turath-reviews-${new Date().toISOString().slice(0, 10)}`, headers, rows);
  }

  const columns: TableColumn<AdminReview>[] = [
    {
      id: "author",
      header: t("columns.author"),
      cell: (r) => (
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="truncate font-medium">{localizedName(r.author, loc)}</span>
          <span className="text-prose-muted text-xs truncate">
            {r.about === "guest" ? t("aboutGuest") : t("aboutProvider")}
          </span>
        </div>
      ),
    },
    {
      id: "subject",
      header: t("columns.subject"),
      cell: (r) => <span className="truncate font-medium">{r.subjectEn}</span>,
    },
    {
      id: "stars",
      header: t("columns.stars"),
      cell: (r) => (
        <StarRating
          value={r.stars}
          size="sm"
          label={tUi("ratingOutOf", { value: formatCount(r.stars, loc) })}
        />
      ),
    },
    {
      id: "review",
      header: t("columns.review"),
      cell: (r) => {
        const primary = localizedName(r.body, loc);
        const secondary = localizedName(r.body, other);
        return (
          <div className="flex flex-col gap-0.5 max-w-sm sm:max-w-md">
            <p className="text-prose text-xs line-clamp-2 leading-relaxed">{primary}</p>
            {secondary !== primary ? (
              <p className="text-prose-muted text-[11px] line-clamp-1">{secondary}</p>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "booking",
      header: t("columns.booking"),
      cell: (r) => (
        <span className="font-mono text-xs tabular-nums text-prose-muted tracking-wider">
          {r.bookingCode}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (r) => {
        const cur = r.status ?? "published";
        return (
          <Badge
            variant={
              cur === "published"
                ? "solid"
                : cur === "flagged"
                  ? "outline"
                  : "glass"
            }
            className={cur === "hidden" ? "opacity-60" : ""}
          >
            {t(`status.${cur}`)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      align: "end",
      cell: (review) => (
        <div
          className="inline-flex"
          onClick={stopMenuEvent}
          onPointerDown={stopMenuEvent}
          onKeyDown={stopMenuEvent}
        >
          <AdminReviewActions
            review={review}
            disabled={moderate.isPending}
            onModerate={handleModerate}
          />
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <ErrorState
        className="flex-1 justify-center"
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!isPending && data && data.length === 0) {
    return (
      <EmptyState
        className="flex-1 justify-center"
        icon={MessageSquareQuote}
        title={tUi("emptyTitle")}
        description={t("empty")}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <AdminFilterBar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder={t("searchPlaceholder")}
        filters={[
          {
            id: "about",
            label: t("columns.author"),
            value: about,
            onChange: setAbout,
            options: [
              { value: ALL, label: t("allAbout") },
              ...REVIEW_ABOUT.map((item: ReviewAbout) => ({
                value: item,
                label: item === "guest" ? t("aboutGuest") : t("aboutProvider"),
              })),
            ],
          },
          {
            id: "stars",
            label: t("columns.stars"),
            value: stars,
            onChange: setStars,
            options: [
              { value: ALL, label: t("allRatings") },
              { value: "5", label: t("starsCount", { count: 5 }) },
              { value: "4", label: t("starsCount", { count: 4 }) },
              { value: "3", label: t("starsCount", { count: 3 }) },
              { value: "2", label: t("starsCount", { count: 2 }) },
              { value: "1", label: t("starsCount", { count: 1 }) },
            ],
          },
          {
            id: "status",
            label: t("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: t("allStatuses") },
              ...REVIEW_MODERATION_STATUSES.map((st) => ({
                value: st,
                label: t(`status.${st}`),
              })),
            ],
          },
        ]}
        trailing={
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 shrink-0"
          >
            <Download className="size-3.5" aria-hidden />
            <span>{tUi("exportCsv")}</span>
          </Button>
        }
      />

      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(r) => r.id}
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
    </div>
  );
}
