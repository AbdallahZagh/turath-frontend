"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { subYears } from "date-fns";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { countrySelectOptions } from "@/components/ui/countryOptions";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Select } from "@/components/ui/Select";
import {
  useLoginWithEmail,
  useRegisterTourist,
  useSendLoginCode,
} from "@/hooks/useAuth";
import { isLocale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { toIsoDate } from "@/lib/format/datetime";
import { SYRIA_ISO2 } from "@/lib/geo/countries";
import { fadeUp } from "@/lib/motion/variants";
import {
  loginEmailSchema,
  loginPhoneSchema,
  registerSchema,
  type LoginEmailValues,
  type LoginPhoneValues,
  type RegisterValues,
} from "@/lib/validation/auth";
import { fieldMessage } from "@/lib/validation/fieldMessage";
import { toast } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";

type AuthCredentialsFormProps = {
  mode: "login" | "register";
};

type LoginMethod = "phone" | "email";

function isLoginMethod(value: string): value is LoginMethod {
  return value === "phone" || value === "email";
}

export function AuthCredentialsForm({
  mode,
}: AuthCredentialsFormProps): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const tCountries = useTranslations("countries");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const router = useRouter();
  const setPendingVerify = useAuthStore((state) => state.setPendingVerify);

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [phoneCountry, setPhoneCountry] = useState(SYRIA_ISO2);

  const sendCode = useSendLoginCode();
  const loginEmail = useLoginWithEmail();
  const registerTourist = useRegisterTourist();

  const nationalityOptions = useMemo(
    () => countrySelectOptions(locale, "nationality"),
    [locale],
  );
  const todayIso = toIsoDate(new Date());
  const adultIso = toIsoDate(subYears(new Date(), 18));
  const isRegister = mode === "register";
  const busy =
    sendCode.isPending || loginEmail.isPending || registerTourist.isPending;

  const phoneForm = useForm<LoginPhoneValues>({
    resolver: zodResolver(loginPhoneSchema),
    defaultValues: { phone: "" },
  });

  const emailForm = useForm<LoginEmailValues>({
    resolver: zodResolver(loginEmailSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      nationality: SYRIA_ISO2,
      phone: "",
      phoneCountry: SYRIA_ISO2,
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onLoginPhone(values: LoginPhoneValues): Promise<void> {
    try {
      await sendCode.mutateAsync({
        channel: "phone",
        destination: values.phone,
      });
      setPendingVerify({
        channel: "phone",
        destination: values.phone,
        flow: "login",
      });
      toast.success(t("toastCodeSentTitle"), t("toastCodeSentBody"));
      router.push("/verify-otp");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  async function onLoginEmail(values: LoginEmailValues): Promise<void> {
    try {
      await loginEmail.mutateAsync(values);
      setPendingVerify({
        channel: "email",
        destination: values.email,
        flow: "login",
      });
      toast.success(t("toastCodeSentTitle"), t("toastCodeSentBody"));
      router.push("/verify-otp");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  async function onRegister(values: RegisterValues): Promise<void> {
    try {
      await registerTourist.mutateAsync({
        name: values.name,
        dateOfBirth: values.dateOfBirth,
        nationality: values.nationality,
        phone: values.phone,
        phoneCountry: values.phoneCountry,
        email: values.email,
        password: values.password,
      });
      setPendingVerify({
        channel: "phone",
        destination: values.phone,
        flow: "register",
      });
      toast.success(t("toastCodeSentTitle"), t("toastCodeSentBody"));
      router.push("/verify-otp");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className={cn(
        "w-full max-w-xl rounded-glass",
        isRegister ? "p-4 sm:p-5" : "p-8 sm:p-5",
      )}
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />

      <h1
        className={cn(
          "font-heading text-prose font-semibold tracking-tight",
          isRegister ? "mt-3 text-3xl" : "mt-6 text-3xl sm:text-4xl",
        )}
      >
        {mode === "login" ? t("loginTitle") : t("registerTitle")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">
        {mode === "login" ? t("loginLead") : t("registerLead")}
      </p>

      {mode === "login" ? (
        <div className="mt-7 flex flex-col gap-5">
          <SegmentSwitch
            variant="main"
            className="mb-2 w-full"
            paddingY="0.7rem"
            aria-label={`${t("tabPhone")} / ${t("tabEmail")}`}
            options={[
              { value: "phone", label: t("tabPhone") },
              { value: "email", label: t("tabEmail") },
            ]}
            value={loginMethod}
            onChange={(value) => {
              if (isLoginMethod(value)) {
                setLoginMethod(value);
              }
            }}
          />

          {loginMethod === "phone" ? (
            <form
              className="flex flex-col gap-5"
              onSubmit={phoneForm.handleSubmit(onLoginPhone)}
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
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={busy}
              >
                {busy ? t("submitting") : t("sendCode")}
              </Button>
            </form>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={emailForm.handleSubmit(onLoginEmail)}
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
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={emailForm.control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      variant="main"
                      autoComplete="current-password"
                      required
                      label={t("password")}
                      placeholder={t("password")}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(
                    tErrors,
                    emailForm.formState.errors.password,
                  )}
                />
                <Link
                  href="/forgot-password"
                  className="text-prose-muted hover:text-prose self-end text-xs font-medium"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={busy}
              >
                {busy ? t("submitting") : t("submitLogin")}
              </Button>
            </form>
          )}
        </div>
      ) : (
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={registerForm.handleSubmit(onRegister)}
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Controller
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  variant="main"
                  autoComplete="name"
                  required
                  label={t("name")}
                  placeholder={t("name")}
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, registerForm.formState.errors.name)}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div className="flex flex-col gap-1.5">
              <Controller
                control={registerForm.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DatePicker
                    variant="main"
                    name={field.name}
                    required
                    label={t("dateOfBirth")}
                    value={field.value}
                    onChange={field.onChange}
                    min="1900-01-01"
                    max={todayIso}
                    showToday={false}
                    centerOn={adultIso}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(
                  tErrors,
                  registerForm.formState.errors.dateOfBirth,
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Controller
                control={registerForm.control}
                name="nationality"
                render={({ field }) => (
                  <Select
                    variant="main"
                    searchable
                    required
                    name={field.name}
                    label={t("nationality")}
                    placeholder={t("nationalityPlaceholder")}
                    searchPlaceholder={tCountries("search")}
                    emptyMessage={tCountries("empty")}
                    options={nationalityOptions}
                    value={field.value}
                    onChange={field.onChange}
                    menuMinWidth={320}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(
                  tErrors,
                  registerForm.formState.errors.nationality,
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Controller
              control={registerForm.control}
              name="phone"
              render={({ field }) => (
                <PhoneField
                  name={field.name}
                  required
                  allowInternational
                  label={t("phone")}
                  placeholder={t("phonePlaceholder")}
                  value={field.value}
                  onChange={field.onChange}
                  countryIso={phoneCountry}
                  onCountryChange={(iso) => {
                    setPhoneCountry(iso);
                    registerForm.setValue("phoneCountry", iso, {
                      shouldValidate: true,
                    });
                  }}
                />
              )}
            />
            <AuthFieldError
              message={fieldMessage(tErrors, registerForm.formState.errors.phone)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Controller
              control={registerForm.control}
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
              message={fieldMessage(tErrors, registerForm.formState.errors.email)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Controller
              control={registerForm.control}
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
              message={fieldMessage(
                tErrors,
                registerForm.formState.errors.password,
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-prose-muted flex items-start gap-2.5 text-sm leading-snug">
              <Controller
                control={registerForm.control}
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
              {t("termsLabel")}
            </label>
            <AuthFieldError
              message={fieldMessage(tErrors, registerForm.formState.errors.terms)}
            />
          </div>

          <Button
            type="submit"
            className="w-full justify-center"
            disabled={busy}
          >
            {busy ? t("submitting") : t("submitRegister")}
          </Button>
        </form>
      )}

      <div
        className={cn(
          "flex items-center justify-between",
          isRegister ? "mt-4" : "mt-6",
        )}
      >
        <p className="text-sm">
          {mode === "login" ? (
            <Link
              href="/register"
              className="text-prose hover:text-prose-muted font-medium transition-colors"
            >
              {t("toRegister")}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-prose hover:text-prose-muted font-medium transition-colors"
            >
              {t("toLogin")}
            </Link>
          )}
        </p>
        <p className="text-prose-muted flex items-center justify-center gap-2 text-xs">
          <Info className="h-4 w-4" />
          <span className="text-prose-muted text-xs">{t("providerNote")}</span>
        </p>
      </div>
    </motion.div>
  );
}
