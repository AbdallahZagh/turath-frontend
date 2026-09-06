"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { OtpInput } from "@/components/auth/OtpInput";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { useSendLoginCode, useVerifyOtp } from "@/hooks/useAuth";
import { homePathForRole } from "@/lib/auth/home";
import { fadeUp } from "@/lib/motion/variants";
import { verifyOtpSchema, type VerifyOtpValues } from "@/lib/validation/auth";
import { fieldMessage } from "@/lib/validation/fieldMessage";
import { maskDestination } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

const RESEND_SECONDS = 60;

export function VerifyOtpForm(): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const router = useRouter();
  const pending = useAuthStore((state) => state.pendingVerify);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const completeSession = useAuthStore((state) => state.completeSession);
  const userRole = useAuthStore((state) => state.user.role);
  const verify = useVerifyOtp();
  const resend = useSendLoginCode();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    // After a successful verify, completeSession clears pendingVerify.
    // Do not bounce to /login when the session is already authenticated.
    if (!pending && !isAuthenticated) {
      router.replace("/login");
    }
  }, [pending, isAuthenticated, router]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  if (!pending) {
    return null;
  }

  const masked = maskDestination(pending.channel, pending.destination);
  const busy = verify.isPending || resend.isPending;

  async function onSubmit(values: VerifyOtpValues): Promise<void> {
    if (!pending) {
      return;
    }
    try {
      await verify.mutateAsync({
        channel: pending.channel,
        destination: pending.destination,
        code: values.code,
      });
      const role = pending.flow === "register" ? "TOURIST" : userRole;
      completeSession(role);
      toast.success(t("toastVerifiedTitle"), t("toastVerifiedBody"));
      router.replace(homePathForRole(role));
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  async function onResend(): Promise<void> {
    if (!pending || secondsLeft > 0) {
      return;
    }
    try {
      await resend.mutateAsync({
        channel: pending.channel,
        destination: pending.destination,
      });
      setSecondsLeft(RESEND_SECONDS);
      toast.success(t("toastCodeSentTitle"), t("toastCodeSentBody"));
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
        {t("verifyTitle")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">
        {t("verifyLead", { destination: masked })}
      </p>

      <form
        className="mt-7 flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
            name="code"
            render={({ field }) => (
              <OtpInput
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                label={t("otp")}
                disabled={busy}
                aria-invalid={Boolean(form.formState.errors.code)}
              />
            )}
          />
          <AuthFieldError
            message={fieldMessage(tErrors, form.formState.errors.code)}
          />
        </div>

        <Button type="submit" className="w-full justify-center" disabled={busy}>
          {busy ? t("submitting") : t("submitOtp")}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          className="text-prose hover:text-prose-muted font-medium transition-colors disabled:opacity-40"
          disabled={secondsLeft > 0 || busy}
          onClick={() => {
            void onResend();
          }}
        >
          {secondsLeft > 0
            ? t("resendIn", { seconds: secondsLeft })
            : t("resendCode")}
        </button>
        <Link
          href="/login"
          className="text-prose-muted hover:text-prose font-medium transition-colors"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </motion.div>
  );
}
