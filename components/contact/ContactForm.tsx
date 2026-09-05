"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import type { FieldError } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { fadeUp } from "@/lib/motion/variants";
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

export function ContactForm(): ReactNode {
  const t = useTranslations("contact");
  const tForm = useTranslations("contact.form");
  const tErrors = useTranslations("contact.errors");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "general",
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
      await new Promise((resolve) => {
        window.setTimeout(resolve, 600);
      });
      void values;
      setSubmitted(true);
      form.reset({
        name: "",
        email: "",
        phone: "",
        topic: "general",
        message: "",
      });
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} className="w-full">
      <GlassPanel className="p-6 sm:p-8 lg:p-9">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center sm:py-12">
            <div className="bg-primary/15 text-primary flex size-14 items-center justify-center rounded-2xl">
              <CheckCircle2 className="size-7" aria-hidden />
            </div>

            <h2 className="font-heading text-prose mt-5 text-2xl font-semibold sm:text-3xl">
              {t("successTitle")}
            </h2>
            <p className="text-prose-muted mt-2 max-w-md text-sm leading-relaxed sm:text-base">
              {t("successBody")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button type="button" variant="solid" onClick={() => setSubmitted(false)}>
                {t("successAgain")}
              </Button>
              <Button href="/" variant="outline">
                {t("successHome")}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div>
              <h2 className="font-heading text-prose text-2xl font-semibold sm:text-3xl">
                {tForm("title")}
              </h2>
              <p className="text-prose-muted mt-1.5 text-sm leading-relaxed">
                {tForm("lead")}
              </p>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Input
                variant="main"
                label={tForm("name")}
                placeholder={tForm("namePlaceholder")}
                autoComplete="name"
                required
                {...form.register("name")}
              />
              <AuthFieldError
                message={contactFieldMessage(tErrors, form.formState.errors.name)}
              />
            </div>

            {/* Email & Phone Grid */}
            <div className="flex flex-col gap-1.5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Input
                    variant="main"
                    type="email"
                    label={tForm("email")}
                    placeholder={tForm("emailPlaceholder")}
                    autoComplete="email"
                    {...form.register("email")}
                  />
                  <AuthFieldError
                    message={contactFieldMessage(tErrors, form.formState.errors.email)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <PhoneField
                        allowInternational
                        name={field.name}
                        label={tForm("phone")}
                        placeholder={tForm("phonePlaceholder")}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <AuthFieldError
                    message={contactFieldMessage(tErrors, form.formState.errors.phone)}
                  />
                </div>
              </div>
              <p className="text-prose-muted text-xs leading-normal">
                {tForm("emailOrPhoneHint")}
              </p>
            </div>

            {/* Topic Select */}
            <div className="flex flex-col gap-1.5">
              <Controller
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <Select
                    variant="main"
                    required
                    label={tForm("topic")}
                    placeholder={tForm("topicPlaceholder")}
                    options={topicOptions}
                    value={field.value ?? "general"}
                    onChange={(value) => {
                      if (isContactTopic(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                )}
              />
              <AuthFieldError
                message={contactFieldMessage(tErrors, form.formState.errors.topic)}
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <Textarea
                variant="main"
                required
                label={tForm("message")}
                placeholder={tForm("messagePlaceholder")}
                rows={5}
                {...form.register("message")}
              />
              <AuthFieldError
                message={contactFieldMessage(tErrors, form.formState.errors.message)}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="solid"
                disabled={busy}
                className="w-full justify-center sm:w-auto"
              >
                {busy ? tForm("submitting") : tForm("submit")}
                <Send className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
            </div>
          </form>
        )}
      </GlassPanel>
    </motion.div>
  );
}
