"use client";

import { ArrowLeft, ArrowRight, Landmark, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { AdminAttractionDeleteDialog } from "@/components/admin/AdminAttractionDeleteDialog";
import { AdminAttractionHero } from "@/components/admin/AdminAttractionHero";
import { AdminAttractionGalleryView } from "@/components/admin/AdminAttractionGalleryView";
import { AdminAttractionLogisticsView } from "@/components/admin/AdminAttractionLogisticsView";
import { AdminAttractionLocationView } from "@/components/admin/AdminAttractionLocationView";
import { AdminAttractionModal } from "@/components/admin/AdminAttractionModal";
import { AdminAttractionNarrativeView } from "@/components/admin/AdminAttractionNarrativeView";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAdminAttraction } from "@/hooks/useAdminAttractions";
import { ADMIN_PATHS } from "@/config/adminRoutes";

type AdminAttractionDetailProps = {
  attractionId: string;
};

export function AdminAttractionDetail({
  attractionId,
}: AdminAttractionDetailProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const tUi = useTranslations("ui");
  const locale = useLocale();
  const router = useRouter();

  const isRtl = locale === "ar";
  const { data: attraction, isPending, isError, refetch } = useAdminAttraction(attractionId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isError) {
    return (
      <ErrorState
        title={tUi("errorTitle")}
        description={tUi("errorDescription")}
        retryLabel={tUi("retry")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (isPending) {
    return (
      <div className="flex flex-col gap-6 pb-8">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
        <Skeleton className="h-36 rounded-3xl" />
      </div>
    );
  }

  if (!attraction) {
    return (
      <EmptyState
        icon={Landmark}
        title={t("detail.notFound")}
        description={t("detail.notFoundDescription")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={ADMIN_PATHS.heritageSites}
          className="border-glass-border bg-glass-control text-prose-muted hover:text-prose hover:border-primary/50 inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition"
        >
          {isRtl ? (
            <ArrowRight className="size-4" aria-hidden />
          ) : (
            <ArrowLeft className="size-4" aria-hidden />
          )}
          <span>{t("detail.back")}</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Pencil className="size-3.5" aria-hidden />
            <span>{t("detail.edit")}</span>
          </Button>

          <Button
            type="button"
            variant="glass"
            size="sm"
            onClick={() => setDeleteOpen(true)}
            className="text-destructive hover:bg-destructive/10 border-destructive/30 flex items-center gap-1.5"
          >
            <Trash2 className="size-3.5" aria-hidden />
            <span>{t("detail.delete")}</span>
          </Button>
        </div>
      </div>

      <AdminAttractionHero attraction={attraction} />
      <AdminAttractionGalleryView attraction={attraction} />
      <AdminAttractionNarrativeView attraction={attraction} />
      <AdminAttractionLogisticsView attraction={attraction} />
      <AdminAttractionLocationView attraction={attraction} />

      <AdminAttractionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        attraction={attraction}
      />

      <AdminAttractionDeleteDialog
        attraction={deleteOpen ? attraction : null}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          router.push(ADMIN_PATHS.heritageSites);
        }}
      />
    </div>
  );
}
