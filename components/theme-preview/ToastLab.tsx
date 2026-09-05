"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toastStore";

export function ToastLab(): ReactNode {
  const t = useTranslations("themePreview");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        size="sm"
        onClick={() => toast.success(t("toastSuccessTitle"), t("toastSuccessBody"))}
      >
        {t("toastSuccess")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="glass"
        onClick={() => toast.info(t("toastInfoTitle"), t("toastInfoBody"))}
      >
        {t("toastInfo")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => toast.warn(t("toastWarnTitle"), t("toastWarnBody"))}
      >
        {t("toastWarn")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => toast.error(t("toastErrorTitle"), t("toastErrorBody"))}
      >
        {t("toastError")}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="glass"
        onClick={() => toast.neutral(t("toastNeutralTitle"), t("toastNeutralBody"))}
      >
        {t("toastNeutral")}
      </Button>
    </div>
  );
}
