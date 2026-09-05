"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Pencil, Tags, Trash2 } from "lucide-react";

import { ADMIN_TOOLBAR_HEIGHT } from "@/components/admin/AdminFilterBar";
import { AdminTaxonomyTermModal } from "@/components/admin/AdminTaxonomyTermModal";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Table, type TableColumn } from "@/components/ui/Table";
import {
  useAdminTaxonomy,
  useDeleteAdminTaxonomyTerm,
  useMoveAdminTaxonomyTerm,
} from "@/hooks/useAdminTaxonomy";
import { usePageHeaderAction } from "@/hooks/usePageHeaderAction";
import { usePagination } from "@/hooks/usePagination";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import {
  TAXONOMY_KINDS,
  type AdminTaxonomyTerm,
  type TaxonomyKind,
} from "@/lib/mock/adminTaxonomy";
import { toast } from "@/store/toastStore";

function isKind(value: string): value is TaxonomyKind {
  return (TAXONOMY_KINDS as readonly string[]).includes(value);
}

export function AdminTaxonomy(): ReactNode {
  const t = useTranslations("admin.taxonomy");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const { data, isPending, isError, refetch } = useAdminTaxonomy();
  const moveTerm = useMoveAdminTaxonomyTerm();
  const deleteTerm = useDeleteAdminTaxonomyTerm();

  const [kind, setKind] = useState<TaxonomyKind>("categories");
  const [editorKind, setEditorKind] = useState<TaxonomyKind>("categories");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTaxonomyTerm | null>(null);
  const [deletingTerm, setDeletingTerm] = useState<AdminTaxonomyTerm | null>(null);

  usePageHeaderAction("add", () => {
    setEditorKind(kind);
    setEditing(null);
    setEditorOpen(true);
  });

  const rows = useMemo(() => {
    if (!data) {
      return [];
    }
    return data
      .filter((term) => term.kind === kind)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data, kind]);

  const paging = usePagination(rows, kind);
  const firstId = rows[0]?.id;
  const lastId = rows[rows.length - 1]?.id;

  function openEdit(term: AdminTaxonomyTerm): void {
    setEditorKind(term.kind);
    setEditing(term);
    setEditorOpen(true);
  }

  function move(term: AdminTaxonomyTerm, direction: -1 | 1): void {
    moveTerm.mutate(
      { id: term.id, direction },
      {
        onError: () => {
          toast.error(t("moveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  function handleConfirmDelete(): void {
    if (!deletingTerm) return;
    deleteTerm.mutate(deletingTerm.id, {
      onSuccess: () => {
        toast.success(t("deleted"), t("deletedBody"));
        setDeletingTerm(null);
      },
      onError: () => {
        toast.error(t("saveFailed"), t("saveFailedBody"));
      },
    });
  }

  const columns: TableColumn<AdminTaxonomyTerm>[] = [
    {
      id: "name",
      header: t("columns.name"),
      cell: (term) => (
        <span className="truncate font-medium">{localizedName(term.name, loc)}</span>
      ),
    },
    {
      id: "slug",
      header: t("columns.slug"),
      cell: (term) => (
        <span className="text-prose-muted font-mono text-xs" dir="ltr">
          {term.slug}
        </span>
      ),
    },
    {
      id: "order",
      header: t("columns.order"),
      align: "end",
      cell: (term) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Button
            type="button"
            variant="glass"
            size="sm"
            disabled={term.id === firstId || moveTerm.isPending}
            aria-label={t("moveUp")}
            onClick={() => move(term, -1)}
          >
            <ChevronUp className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="sm"
            disabled={term.id === lastId || moveTerm.isPending}
            aria-label={t("moveDown")}
            onClick={() => move(term, 1)}
          >
            <ChevronDown className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="sm"
            aria-label={t("edit")}
            onClick={() => openEdit(term)}
          >
            <Pencil className="size-3.5" aria-hidden />
          </Button>
          <Button
            type="button"
            variant="glass"
            size="sm"
            aria-label={t("delete")}
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeletingTerm(term)}
          >
            <Trash2 className="size-3.5" aria-hidden />
          </Button>
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
          icon={Tags}
          title={tUi("emptyTitle")}
          description={t("empty")}
        />
        <AdminTaxonomyTermModal
          open={editorOpen}
          kind={editorKind}
          term={editing}
          onClose={() => setEditorOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-stretch gap-2">
        <div className="max-w-full">
          <SegmentSwitch
            variant="glass"
            size="sm"
            minHeight={ADMIN_TOOLBAR_HEIGHT}
            aria-label={t("kindLabel")}
            value={kind}
            onChange={(value) => {
              if (isKind(value)) {
                setKind(value);
              }
            }}
            options={TAXONOMY_KINDS.map((value) => ({
              value,
              label: t(`kind.${value}`),
            }))}
          />
        </div>
      </div>
      <Table
        fill
        columns={columns}
        rows={paging.rows}
        getRowId={(term) => term.id}
        onRowClick={openEdit}
        caption={t("caption")}
        emptyMessage={t("empty")}
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
      <AdminTaxonomyTermModal
        open={editorOpen}
        kind={editorKind}
        term={editing}
        onClose={() => setEditorOpen(false)}
      />
      <ConfirmDialog
        open={deletingTerm !== null}
        onClose={() => setDeletingTerm(null)}
        onConfirm={handleConfirmDelete}
        tone="destructive"
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription")}
        confirmLabel={t("delete")}
        cancelLabel={t("form.cancel")}
        pending={deleteTerm.isPending}
      />
    </div>
  );
}
