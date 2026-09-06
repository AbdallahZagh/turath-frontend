"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Megaphone } from "lucide-react";

import { AdminEditDeleteMenu } from "@/components/admin/AdminEditDeleteMenu";
import { AdminFilterBar } from "@/components/admin/AdminFilterBar";
import { AdminPromotionModal } from "@/components/admin/AdminPromotionModal";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { stopMenuEvent } from "@/components/ui/Menu";
import { Table, type TableColumn } from "@/components/ui/Table";
import { useAdminPromotions, useDeleteAdminPromotion } from "@/hooks/useAdminPromotions";
import { usePageHeaderAction } from "@/hooks/usePageHeaderAction";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import { localizedName } from "@/lib/i18n/localized";
import {
  FEATURED_SLOT_IDS,
  PROMOTION_KINDS,
  PROMOTION_STATUSES,
  promotionStatus,
  type AdminPromotion,
  type PromotionStatus,
} from "@/lib/mock/adminPromotions";
import { toast } from "@/store/toastStore";

const ALL = "all";

function matchesPromotionQuery(row: AdminPromotion, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack =
    `${row.title.en} ${row.title.ar} ${row.target.en} ${row.target.ar} ${row.slot}`.toLowerCase();
  return haystack.includes(needle);
}

function statusBadgeProps(status: PromotionStatus): {
  variant: BadgeVariant;
  className?: string;
} {
  if (status === "live") {
    return { variant: "solid" };
  }
  if (status === "scheduled") {
    return { variant: "outline" };
  }
  return {
    variant: "glass",
    className: "opacity-60",
  };
}

export function AdminPromotions(): ReactNode {
  const t = useTranslations("admin.promotions");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminPromotions();
  const deletePromotion = useDeleteAdminPromotion();

  const [query, setQuery] = useState("");
  const [kind, setKind] = useState(ALL);
  const [slot, setSlot] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPromotion | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminPromotion | null>(null);

  usePageHeaderAction("add", () => {
    setEditing(null);
    setEditorOpen(true);
  });

  const filtered = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((row) => {
      if (kind !== ALL && row.kind !== kind) {
        return false;
      }
      if (slot !== ALL && row.slot !== slot) {
        return false;
      }
      if (status !== ALL && promotionStatus(row) !== status) {
        return false;
      }
      return matchesPromotionQuery(row, query);
    });
  }, [data, kind, slot, status, query]);

  const paging = usePagination(filtered, `${query}|${kind}|${slot}|${status}`);

  function openEdit(row: AdminPromotion): void {
    setEditing(row);
    setEditorOpen(true);
  }

  function handleConfirmDelete(): void {
    if (!deletingItem) return;
    deletePromotion.mutate(deletingItem.id, {
      onSuccess: () => {
        toast.success(t("deleted"), t("deletedBody"));
        setDeletingItem(null);
      },
      onError: () => {
        toast.error(t("saveFailed"), t("saveFailedBody"));
      },
    });
  }

  const columns: TableColumn<AdminPromotion>[] = [
    {
      id: "title",
      header: t("columns.title"),
      cell: (row) => (
        <span className="truncate font-medium">{localizedName(row.title, loc)}</span>
      ),
    },
    {
      id: "slot",
      header: t("columns.slot"),
      cell: (row) => t(`slots.${row.slot}`),
    },
    {
      id: "kind",
      header: t("columns.kind"),
      cell: (row) => t(`kind.${row.kind}`),
    },
    {
      id: "target",
      header: t("columns.target"),
      cell: (row) => (
        <span className="truncate">{localizedName(row.target, loc)}</span>
      ),
    },
    {
      id: "start",
      header: t("columns.start"),
      cell: (row) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(row.startAt, loc)}
        </span>
      ),
    },
    {
      id: "end",
      header: t("columns.end"),
      cell: (row) => (
        <span className="text-prose-muted whitespace-nowrap">
          {formatMediumDate(row.endAt, loc)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("columns.status"),
      cell: (row) => {
        const value = promotionStatus(row);
        return <Badge {...statusBadgeProps(value)}>{t(`status.${value}`)}</Badge>;
      },
    },
    {
      id: "actions",
      header: t("columns.actions"),
      align: "end",
      cell: (row) => (
        <div
          className="inline-flex"
          onClick={stopMenuEvent}
          onPointerDown={stopMenuEvent}
          onKeyDown={stopMenuEvent}
        >
          <AdminEditDeleteMenu
            label={t("actionMenu", { name: localizedName(row.title, loc) })}
            editLabel={t("actionEdit")}
            deleteLabel={t("actionDelete")}
            onEdit={() => openEdit(row)}
            onDelete={() => setDeletingItem(row)}
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
      <>
        <EmptyState
          className="flex-1 justify-center"
          icon={Megaphone}
          title={tUi("emptyTitle")}
          description={t("empty")}
        />
        <AdminPromotionModal
          open={editorOpen}
          promotion={editing}
          onClose={() => setEditorOpen(false)}
        />
      </>
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
            id: "slot",
            label: t("columns.slot"),
            value: slot,
            onChange: setSlot,
            options: [
              { value: ALL, label: t("allSlots") },
              ...FEATURED_SLOT_IDS.map((value) => ({
                value,
                label: t(`slots.${value}`),
              })),
            ],
          },
          {
            id: "kind",
            label: t("columns.kind"),
            value: kind,
            onChange: setKind,
            options: [
              { value: ALL, label: t("allKinds") },
              ...PROMOTION_KINDS.map((value) => ({
                value,
                label: t(`kind.${value}`),
              })),
            ],
          },
          {
            id: "status",
            label: t("columns.status"),
            value: status,
            onChange: setStatus,
            options: [
              { value: ALL, label: t("allStatuses") },
              ...PROMOTION_STATUSES.map((value) => ({
                value,
                label: t(`status.${value}`),
              })),
            ],
          },
        ]}
      />
      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(row) => row.id}
        onRowClick={openEdit}
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
      <AdminPromotionModal
        open={editorOpen}
        promotion={editing}
        onClose={() => setEditorOpen(false)}
      />
      <ConfirmDialog
        open={deletingItem !== null}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleConfirmDelete}
        tone="destructive"
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription")}
        confirmLabel={t("form.delete")}
        cancelLabel={t("form.cancel")}
        pending={deletePromotion.isPending}
      />
    </div>
  );
}
