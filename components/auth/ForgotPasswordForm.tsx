"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { useRequestPasswordReset } from "@/hooks/useAuth";
import { fadeUp } from "@/lib/motion/variants";
import {
  forgotEmailSchema,
  forgotPhoneSchema,
  type ForgotEmailValues,
  type ForgotPhoneValues,
} from "@/lib/validation/auth";
import { fieldMessage } from "@/lib/validation/fieldMessage";
import { toast } from "@/store/toastStore";

type ResetMethod = "phone" | "email";

function isResetMethod(value: string): value is ResetMethod {
  return value === "phone" || value === "email";
}

export function ForgotPasswordForm(): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const requestReset = useRequestPasswordReset();
  const [method, setMethod] = useState<ResetMethod>("email");
  const busy = requestReset.isPending;

  const phoneForm = useForm<ForgotPhoneValues>({
    resolver: zodResolver(forgotPhoneSchema),
    defaultValues: { phone: "" },
  });

  const emailForm = useForm<ForgotEmailValues>({
    resolver: zodResolver(forgotEmailSchema),
    defaultValues: { email: "" },
  });

  async function onPhone(values: ForgotPhoneValues): Promise<void> {
    try {
      const result = await requestReset.mutateAsync({
        channel: "phone",
        destination: values.phone,
      });
      toast.success(t("toastResetSentTitle"), t("toastResetSentBody"));
      router.push(`/reset-password?token=${encodeURIComponent(result.token)}`);
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  async function onEmail(values: ForgotEmailValues): Promise<void> {
    try {
      const result = await requestReset.mutateAsync({
        channel: "email",
        destination: values.email,
      });
      toast.success(t("toastResetSentTitle"), t("toastResetSentBody"));
      router.push(`/reset-password?token=${encodeURIComponent(result.token)}`);
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="glass-surface glass-frost backdrop-blur-sm w-full max-w-xl rounded-glass p-4 sm:p-6"
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />
      <h1 className="font-heading text-prose mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
        {t("forgotTitle")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">{t("forgotLead")}</p>

      <div className="mt-7 flex flex-col gap-5">
        <SegmentSwitch
          variant="main"
          className="w-full"
          paddingY="0.7rem"
          aria-label={`${t("tabPhone")} / ${t("tabEmail")}`}
          options={[
            { value: "phone", label: t("tabPhone") },
            { value: "email", label: t("tabEmail") },
          ]}
          value={method}
          onChange={(value) => {
            if (isResetMethod(value)) {
              setMethod(value);
            }
          }}
        />

        {method === "phone" ? (
          <form
            className="flex flex-col gap-5"
            onSubmit={phoneForm.handleSubmit(onPhone)}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Controller
                control={phoneForm.control}
                name="phone"
                render={({ field }) => (
                  <PhoneField
                    name={field.name}
                    required
                    label={t("phone")}
                    placeholder={t("phonePlaceholder")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(tErrors, phoneForm.formState.errors.phone)}
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={busy}>
              {busy ? t("submitting") : t("submitForgot")}
            </Button>
          </form>
        ) : (
          <form
            className="flex flex-col gap-5"
            onSubmit={emailForm.handleSubmit(onEmail)}
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <Controller
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    variant="main"
                    autoComplete="email"
                    required
                    label={t("email")}
                    placeholder={t("email")}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(tErrors, emailForm.formState.errors.email)}
              />
            </div>
            <Button type="submit" className="w-full justify-center" disabled={busy}>
              {busy ? t("submitting") : t("submitForgot")}
            </Button>
          </form>
        )}
      </div>

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
