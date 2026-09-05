"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useSaveAdminTaxonomyTerm } from "@/hooks/useAdminTaxonomy";
import {
  DuplicateTaxonomySlugError,
  type AdminTaxonomyTerm,
  type TaxonomyKind,
} from "@/lib/mock/adminTaxonomy";
import { toast } from "@/store/toastStore";

type AdminTaxonomyTermModalProps = {
  open: boolean;
  kind: TaxonomyKind;
  term: AdminTaxonomyTerm | null;
  onClose: () => void;
};

export function AdminTaxonomyTermModal({
  open,
  kind,
  term,
  onClose,
}: AdminTaxonomyTermModalProps): ReactNode {
  const t = useTranslations("admin.taxonomy");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={term ? t("form.titleEdit") : t("form.titleAdd")}
      className="flex max-w-lg flex-col"
    >
      {open ? (
        <TaxonomyTermForm
          key={term?.id ?? `new-${kind}`}
          kind={kind}
          term={term}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}

type TaxonomyTermFormProps = {
  kind: TaxonomyKind;
  term: AdminTaxonomyTerm | null;
  onClose: () => void;
};

function TaxonomyTermForm({ kind, term, onClose }: TaxonomyTermFormProps): ReactNode {
  const t = useTranslations("admin.taxonomy");
  const saveTerm = useSaveAdminTaxonomyTerm();
  const [nameEn, setNameEn] = useState(term?.name.en ?? "");
  const [nameAr, setNameAr] = useState(term?.name.ar ?? "");
  const [slug, setSlug] = useState(term?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(term));

  function dismiss(): void {
    saveTerm.reset();
    onClose();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    saveTerm.mutate(
      {
        id: term?.id,
        input: {
          kind,
          slug,
          name: { en: nameEn, ar: nameAr },
        },
      },
      {
        onSuccess: () => {
          toast.success(term ? t("updated") : t("created"), term ? t("updatedBody") : t("createdBody"));
          onClose();
        },
        onError: (error) => {
          if (error instanceof DuplicateTaxonomySlugError) {
            toast.error(t("saveFailed"), t("duplicateSlug"));
            return;
          }
          toast.error(t("saveFailed"), t("saveFailedBody"));
        },
      },
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.nameEn")}</span>
          <Input
            variant="glass"
            size="sm"
            required
            value={nameEn}
            onChange={(event) => {
              const value = event.target.value;
              setNameEn(value);
              if (!slugTouched) {
                setSlug(
                  value
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                );
              }
            }}
            label={t("form.nameEn")}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-prose-muted text-xs font-medium">{t("form.nameAr")}</span>
          <Input
            variant="glass"
            size="sm"
            required
            dir="rtl"
            value={nameAr}
            onChange={(event) => setNameAr(event.target.value)}
            label={t("form.nameAr")}
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-prose-muted text-xs font-medium">{t("form.slug")}</span>
        <Input
          variant="glass"
          size="sm"
          required
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value);
          }}
          label={t("form.slug")}
        />
      </label>
      <div className="flex shrink-0 justify-end gap-2 pt-1">
        <Button type="button" variant="glass" size="sm" onClick={dismiss}>
          {t("form.cancel")}
        </Button>
        <Button type="submit" size="sm" disabled={saveTerm.isPending}>
          {t("form.save")}
        </Button>
      </div>
    </form>
  );
}
