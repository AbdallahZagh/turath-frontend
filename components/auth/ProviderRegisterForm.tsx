"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { Select } from "@/components/ui/Select";
import { useRegisterProvider } from "@/hooks/useAuth";
import { isLocale } from "@/i18n/config";
import { fadeUp } from "@/lib/motion/variants";
import { GOVERNORATES } from "@/lib/mock/landing";
import {
  PROVIDER_CATEGORIES,
  providerRegisterSchema,
  type ProviderRegisterValues,
} from "@/lib/validation/auth";
import { fieldMessage } from "@/lib/validation/fieldMessage";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

export function ProviderRegisterForm(): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const tGov = useTranslations("landing.governorates");
  const tProvider = useTranslations("providerRegister");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const router = useRouter();
  const completeSession = useAuthStore((state) => state.completeSession);
  const registerProvider = useRegisterProvider();
  const busy = registerProvider.isPending;

  const categoryOptions = useMemo(
    () =>
      PROVIDER_CATEGORIES.map((value) => ({
        value,
        label: tProvider(`categories.${value}`),
      })),
    [tProvider],
  );

  const governorateOptions = useMemo(
    () =>
      GOVERNORATES.map((item) => ({
        value: item.slug,
        label: tGov(item.slug),
      })),
    [tGov],
  );

  const form = useForm<ProviderRegisterValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      businessNameEn: "",
      businessNameAr: "",
      category: "hotels",
      governorate: "damascus",
      phone: "",
      email: "",
      ownerName: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: ProviderRegisterValues): Promise<void> {
    try {
      await registerProvider.mutateAsync({
        businessNameEn: values.businessNameEn,
        businessNameAr: values.businessNameAr,
        category: values.category,
        governorate: values.governorate,
        phone: values.phone,
        email: values.email,
        ownerName: values.ownerName,
        password: values.password,
      });
      completeSession("PROVIDER_OWNER");
      toast.success(tProvider("toastSubmittedTitle"), tProvider("toastSubmittedBody"));
      router.replace("/provider/pending");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-xl rounded-glass p-4 sm:p-5"
      lang={locale}
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />

      <h1 className="font-heading text-prose mt-3 text-3xl font-semibold tracking-tight">
        {tProvider("title")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">
        {tProvider("lead")}
      </p>

      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Controller
              control={form.control}
              name="businessNameEn"
              render={({ field }) => (
                <Input
                  {...field}
                  variant="main"
                  required
                  label={tProvider("businessNameEn")}
                  placeholder={tProvider("businessNameEn")}
                  dir="ltr"
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, form.formState.errors.businessNameEn)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Controller
              control={form.control}
              name="businessNameAr"
              render={({ field }) => (
                <Input
                  {...field}
                  variant="main"
                  required
                  label={tProvider("businessNameAr")}
                  placeholder={tProvider("businessNameAr")}
                  dir="rtl"
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, form.formState.errors.businessNameAr)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select
                  variant="main"
                  required
                  name={field.name}
                  label={tProvider("category")}
                  placeholder={tProvider("categoryPlaceholder")}
                  options={categoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, form.formState.errors.category)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Controller
              control={form.control}
              name="governorate"
              render={({ field }) => (
                <Select
                  variant="main"
                  searchable
                  required
                  name={field.name}
                  label={tProvider("governorate")}
                  placeholder={tProvider("governoratePlaceholder")}
                  searchPlaceholder={tProvider("searchRegions")}
                  emptyMessage={tProvider("emptyRegions")}
                  options={governorateOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, form.formState.errors.governorate)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
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
            message={fieldMessage(tErrors, form.formState.errors.phone)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
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
            message={fieldMessage(tErrors, form.formState.errors.email)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            control={form.control}
            name="ownerName"
            render={({ field }) => (
              <Input
                {...field}
                variant="main"
                autoComplete="name"
                required
                label={tProvider("ownerName")}
                placeholder={tProvider("ownerName")}
              />
            )}
          />
          <AuthFieldError
            message={fieldMessage(tErrors, form.formState.errors.ownerName)}
          />
        </div>

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
                label={t("password")}
                placeholder={t("password")}
              />
            )}
          />
          <AuthFieldError
            message={fieldMessage(tErrors, form.formState.errors.password)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-prose-muted flex items-start gap-2.5 text-sm leading-snug">
            <Controller
              control={form.control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  name={field.name}
                  className="mt-0.5"
                  checked={field.value === true}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              )}
            />
            {tProvider("termsLabel")}
          </label>
          <AuthFieldError
            message={fieldMessage(tErrors, form.formState.errors.terms)}
          />
        </div>

        <Button type="submit" className="w-full justify-center" disabled={busy}>
          {busy ? t("submitting") : tProvider("submit")}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        <Link
          href="/login"
          className="text-prose hover:text-prose-muted font-medium transition-colors"
        >
          {tProvider("toLogin")}
        </Link>
      </p>
    </motion.div>
  );
}
