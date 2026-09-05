"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useResetPassword } from "@/hooks/useAuth";
import { fadeUp } from "@/lib/motion/variants";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validation/auth";
import { fieldMessage } from "@/lib/validation/fieldMessage";
import { toast } from "@/store/toastStore";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const reset = useResetPassword();
  const busy = reset.isPending;

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues): Promise<void> {
    if (!token) {
      toast.error(t("toastErrorTitle"), t("toastResetTokenMissing"));
      return;
    }
    try {
      await reset.mutateAsync({ token, password: values.password });
      toast.success(t("toastResetDoneTitle"), t("toastResetDoneBody"));
      router.push("/login");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-xl rounded-glass p-8 sm:p-5"
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />
      <h1 className="font-heading text-prose mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("resetTitle")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("resetLead")}</p>

      <form
        className="mt-7 flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                variant="main"
                autoComplete="new-password"
                required
                label={t("newPassword")}
                placeholder={t("newPassword")}
              />
            )}
          />
          <AuthFieldError
            message={fieldMessage(tErrors, form.formState.errors.password)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                variant="main"
                autoComplete="new-password"
                required
                label={t("confirmPassword")}
                placeholder={t("confirmPassword")}
              />
            )}
          />
          <AuthFieldError
            message={fieldMessage(
              tErrors,
              form.formState.errors.confirmPassword,
            )}
          />
        </div>
        <Button type="submit" className="w-full justify-center" disabled={busy}>
          {busy ? t("submitting") : t("submitReset")}
        </Button>
      </form>

      <p className="mt-6 text-sm">
        <Link
          href="/login"
          className="text-prose hover:text-prose-muted font-medium transition-colors"
        >
          {t("backToLogin")}
        </Link>
      </p>
    </motion.div>
  );
}
