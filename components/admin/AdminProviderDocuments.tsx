"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileText } from "lucide-react";

import { GlassPanel } from "@/components/ui/GlassPanel";
import type { Locale } from "@/i18n/config";
import { formatMediumDate } from "@/lib/format/datetime";
import type { AdminProviderDocument } from "@/lib/mock/adminProviders";

type AdminProviderDocumentsProps = {
  documents: AdminProviderDocument[];
};

export function AdminProviderDocuments({
  documents,
}: AdminProviderDocumentsProps): ReactNode {
  const t = useTranslations("admin.providers");
  const locale = useLocale();
  const loc: Locale = locale === "ar" ? "ar" : "en";

  return (
    <GlassPanel className="flex-none gap-4 p-5 sm:p-6">
      <h2 className="text-prose text-lg font-semibold">{t("detail.documentsTitle")}</h2>
      {documents.length === 0 ? (
        <p className="text-prose-muted text-sm">{t("detail.documentsEmpty")}</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="border-glass-border flex items-start gap-3 rounded-2xl border p-3"
            >
              <FileText className="text-accent mt-0.5 size-4 shrink-0" aria-hidden />
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="text-prose text-sm font-medium">
                  {t(`detail.documentKind.${doc.kind}`)}
                </span>
                <span className="text-prose-muted truncate text-xs">{doc.filename}</span>
                <span className="text-prose-muted text-xs">
                  {formatMediumDate(doc.uploadedAt, loc)} · {t("detail.placeholderFile")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassPanel>
  );
}
