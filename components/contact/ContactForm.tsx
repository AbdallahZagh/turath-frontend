"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  CONTACT_TOPICS,
  contactSchema,
  isContactErrorKey,
  type ContactErrorKey,
  type ContactTopic,
  type ContactValues,
} from "@/lib/validation/contact";
import { toast } from "@/store/toastStore";

function contactFieldMessage(
  tErrors: (key: ContactErrorKey) => string,
  error: FieldError | undefined,
): string | undefined {
  if (!error?.message) {
    return undefined;
  }
  if (!isContactErrorKey(error.message)) {
    return error.message;
  }
  return tErrors(error.message);
}

function isContactTopic(value: string): value is ContactTopic {
  return (CONTACT_TOPICS as readonly string[]).includes(value);
}

const WHATSAPP_HREF = "https://wa.me/963000000000";
const COMPANY_EMAIL = "hello@turath.sy";

export function ContactForm(): ReactNode {
  const t = useTranslations("contact");
  const tErrors = useTranslations("contact.errors");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
    },
  });

  const topicOptions: SelectOption[] = CONTACT_TOPICS.map((topic) => ({
    value: topic,
    label: t(`topics.${topic}`),
  }));

  async function onSubmit(values: ContactValues): Promise<void> {
    setBusy(true);
    try {
      // Mock submit — no backend yet.
      await new Promise((resolve) => {
        window.setTimeout(resolve, 650);
      });
      void values;
      setSubmitted(true);
      form.reset({
        name: "",
        email: "",
        phone: "",
        topic: "",
        message: "",
      });
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <GlassPanel className="mx-auto w-full max-w-2xl items-center gap-4 p-8 text-center sm:p-10">
        <CheckCircle2 className="text-accent size-12" aria-hidden />
        <h2 className="font-heading text-prose text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("successTitle")}
        </h2>
        <p className="text-prose-muted max-w-md text-sm leading-relaxed sm:text-base">
          {t("successBody")}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="solid"
            onClick={() => {
              setSubmitted(false);
            }}
          >
            {t("successAgain")}
          </Button>
          <Button href="/" variant="outline">
            {t("successHome")}
          </Button>
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
      <GlassPanel className="p-6 sm:p-8">
        <form
          className="flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Input
              variant="main"
              label={t("name")}
              autoComplete="name"
              disabled={busy}
              {...form.register("name")}
            />
            <AuthFieldError message={contactFieldMessage(tErrors, form.formState.errors.name)} />
          </div>

          <p className="text-prose-muted text-xs leading-relaxed">{t("emailOrPhoneHint")}</p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Input
                variant="main"
                type="email"
                label={t("email")}
                autoComplete="email"
                disabled={busy}
                {...form.register("email")}
              />
              <AuthFieldError
                message={contactFieldMessage(tErrors, form.formState.errors.email)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Input
                variant="main"
                type="tel"
                label={t("phone")}
                autoComplete="tel"
                disabled={busy}
                {...form.register("phone")}
              />
              <AuthFieldError
                message={contactFieldMessage(tErrors, form.formState.errors.phone)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Controller
              control={form.control}
              name="topic"
              render={({ field }) => (
                <Select
                  variant="main"
                  label={t("topic")}
                  placeholder={t("topicPlaceholder")}
                  options={topicOptions}
                  value={field.value ?? ""}
                  onChange={(value) => {
                    if (isContactTopic(value)) {
                      field.onChange(value);
                    }
                  }}
                  disabled={busy}
                />
              )}
            />
            <AuthFieldError message={contactFieldMessage(tErrors, form.formState.errors.topic)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Textarea
              variant="main"
              label={t("message")}
              placeholder={t("messagePlaceholder")}
              rows={5}
              disabled={busy}
              {...form.register("message")}
            />
            <AuthFieldError
              message={contactFieldMessage(tErrors, form.formState.errors.message)}
            />
          </div>

          <Button type="submit" variant="solid" disabled={busy} className="w-full sm:w-fit">
            {busy ? t("submitting") : t("submit")}
          </Button>
        </form>
      </GlassPanel>

      <GlassPanel className="h-fit gap-4 p-6 sm:p-8">
        <h2 className="font-heading text-prose text-lg font-semibold">{t("asideHeading")}</h2>
        <p className="text-prose-muted text-sm leading-relaxed">{t("asideNote")}</p>
        <ul className="mt-2 flex flex-col gap-3">
          <li>
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="text-prose hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Mail className="size-4 shrink-0" aria-hidden />
              <span>
                <span className="text-prose-muted block text-xs font-normal">
                  {t("asideEmailLabel")}
                </span>
                {t("asideEmail")}
              </span>
            </a>
          </li>
          <li>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-prose hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <MessageCircle className="size-4 shrink-0" aria-hidden />
              <span>
                <span className="text-prose-muted block text-xs font-normal">
                  {t("asideWhatsappLabel")}
                </span>
                {t("asideWhatsapp")}
              </span>
            </a>
          </li>
        </ul>
        <Link
          href="/"
          className="text-prose-muted hover:text-prose mt-4 text-sm transition-colors"
        >
          {t("successHome")}
        </Link>
      </GlassPanel>
    </div>
  );
}
