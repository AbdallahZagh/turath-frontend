"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toastStore";

export function ToastLab(): ReactNode {
  const t = useTranslations("themePreview");

  function showStack(): void {
    toast.success(t("toastSuccessTitle"), t("toastSuccessBody"));
    toast.info(t("toastInfoTitle"), t("toastInfoBody"));
    toast.warn(t("toastWarnTitle"), t("toastWarnBody"));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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

      <div className="border-glass-border flex flex-wrap gap-3 border-t pt-5">
        <Button type="button" size="sm" variant="outline" onClick={showStack}>
          {t("toastStack")}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => toast.info(t("toastLongTitle"), t("toastLongBody"))}
        >
          {t("toastLong")}
        </Button>
        <Button type="button" size="sm" variant="glass" onClick={() => toast.dismissAll()}>
          {t("toastDismissAll")}
        </Button>
      </div>
    </div>
  );
}
