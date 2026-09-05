"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { disputeStatusBadgeProps } from "@/components/admin/disputeStatus";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Textarea } from "@/components/ui/Textarea";
import type { Locale } from "@/i18n/config";
import { localizedName } from "@/lib/i18n/localized";
import type { AdminDispute, DisputeResolution } from "@/lib/mock/adminDisputes";

type AdminDisputeResolveProps = {
  dispute: AdminDispute;
  pending: boolean;
  onResolve: (status: DisputeResolution, notes: { en: string; ar: string }) => void;
};

export function AdminDisputeResolve({
  dispute,
  pending,
  onResolve,
}: AdminDisputeResolveProps): ReactNode {
  const t = useTranslations("admin.disputes");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";
  const other: Locale = loc === "ar" ? "en" : "ar";
  const [source, setSource] = useState(dispute);
  const [notesEn, setNotesEn] = useState(dispute.notes.en);
  const [notesAr, setNotesAr] = useState(dispute.notes.ar);

  if (dispute !== source) {
    setSource(dispute);
    setNotesEn(dispute.notes.en);
    setNotesAr(dispute.notes.ar);
  }

  if (dispute.status !== "open") {
    const notes = localizedName(dispute.notes, loc);
    const notesOther = localizedName(dispute.notes, other);

    return (
      <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-prose text-lg font-semibold">{t("detail.resolutionTitle")}</h2>
          <Badge {...disputeStatusBadgeProps(dispute.status)}>
            {t(`status.${dispute.status}`)}
          </Badge>
        </div>
        {notes ? (
          <div className="flex flex-col gap-1">
            <p className="text-prose text-sm leading-relaxed">{notes}</p>
            {notesOther && notesOther !== notes ? (
              <p className="text-prose-muted text-sm leading-relaxed">{notesOther}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-prose-muted text-sm">{t("noNotes")}</p>
        )}
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-prose text-lg font-semibold">{t("detail.resolveTitle")}</h2>
        <p className="text-prose-muted text-sm leading-relaxed">{t("detail.resolveHint")}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("detail.notesEn")}</span>
          <Textarea
            variant="glass"
            size="sm"
            value={notesEn}
            onChange={(event) => setNotesEn(event.target.value)}
            label={t("detail.notesEn")}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("detail.notesAr")}</span>
          <Textarea
            variant="glass"
            size="sm"
            dir="rtl"
            value={notesAr}
            onChange={(event) => setNotesAr(event.target.value)}
            label={t("detail.notesAr")}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={pending}
          onClick={() => onResolve("resolvedGuest", { en: notesEn, ar: notesAr })}
        >
          {t("detail.forGuest")}
        </Button>
        <Button
          size="sm"
          variant="glass"
          disabled={pending}
          onClick={() => onResolve("resolvedProvider", { en: notesEn, ar: notesAr })}
        >
          {t("detail.forProvider")}
        </Button>
      </div>
    </GlassPanel>
  );
}
