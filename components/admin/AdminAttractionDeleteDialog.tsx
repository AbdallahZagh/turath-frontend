"use client";

import { Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDeleteAdminAttraction } from "@/hooks/useAdminAttractions";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminAttraction } from "@/lib/mock/adminAttractions";
import { toast } from "@/store/toastStore";

type AdminAttractionDeleteDialogProps = {
  attraction: AdminAttraction | null;
  onClose: () => void;
  onDeleted?: () => void;
};

export function AdminAttractionDeleteDialog({
  attraction,
  onClose,
  onDeleted,
}: AdminAttractionDeleteDialogProps): ReactNode {
  const t = useTranslations("admin.attractions");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const deleteAttraction = useDeleteAdminAttraction();

  const primaryName = attraction ? localizedName(attraction.name, loc) : "";
  const secondaryName = attraction ? localizedName(attraction.name, otherLocale) : "";

  function onConfirm(): void {
    if (!attraction) {
      return;
    }

    deleteAttraction.mutate(attraction.id, {
      onSuccess: () => {
        toast.success(t("detail.deleted"), t("detail.deletedBody"));
        onClose();
        onDeleted?.();
      },
      onError: () => {
        toast.error(t("detail.saveFailed"), t("detail.saveFailedBody"));
      },
    });
  }

  return (
    <ConfirmDialog
      open={Boolean(attraction)}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t("detail.deleteConfirmTitle")}
      description={t("detail.deleteConfirmBody")}
      confirmLabel={t("detail.deleteConfirmButton")}
      cancelLabel={t("detail.deleteCancelButton")}
      pending={deleteAttraction.isPending}
      icon={Trash2}
    >
      {attraction ? (
        <div className="border-glass-border bg-glass-control flex items-center gap-3 rounded-2xl border p-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={attraction.imageSrc}
            alt=""
            className="size-12 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-prose truncate text-sm font-semibold">{primaryName}</p>
            {secondaryName !== primaryName ? (
              <p className="text-prose-muted truncate text-xs">{secondaryName}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </ConfirmDialog>
  );
}
