"use client";

import { subYears } from "date-fns";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { countrySelectOptions } from "@/components/ui/countryOptions";
import { DatePicker } from "@/components/ui/DatePicker";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { isLocale } from "@/i18n/config";
import { toIsoDate } from "@/lib/format/datetime";
import { SYRIA_ISO2 } from "@/lib/geo/countries";
import { fadeUp } from "@/lib/motion/variants";

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
  const tCountries = useTranslations("countries");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";

  const [loginMethod, setLoginMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [phoneCountry, setPhoneCountry] = useState(SYRIA_ISO2);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState(SYRIA_ISO2);

  const nationalityOptions = useMemo(
    () => countrySelectOptions(locale, "nationality"),
    [locale],
  );
  const todayIso = toIsoDate(new Date());
  const adultIso = toIsoDate(subYears(new Date(), 18));
  const isRegister = mode === "register";

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
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

      <form
        className={cn(
          isRegister ? "mt-4 flex flex-col gap-3" : "mt-7 flex flex-col gap-5",
        )}
        onSubmit={onSubmit}
      >
        {mode === "login" ? (
          <>
            <SegmentSwitch
              variant="main"
              className="mb-7 w-full"
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
              <>
                <PhoneField
                  name="phone"
                  required
                  label={t("phone")}
                  placeholder={t("phonePlaceholder")}
                  value={phone}
                  onChange={setPhone}
                />
                <Button type="submit" className="w-full justify-center">
                  {t("sendCode")}
                </Button>
              </>
            ) : (
              <>
                <Input
                  name="email"
                  type="email"
                  variant="main"
                  autoComplete="email"
                  required
                  label={t("email")}
                  placeholder={t("email")}
                />
                <div className="flex flex-col gap-2">
                  <Input
                    name="password"
                    type="password"
                    variant="main"
                    autoComplete="current-password"
                    required
                    label={t("password")}
                    placeholder={t("password")}
                  />
                  <Link
                    href="/forgot-password"
                    className="text-prose-muted hover:text-prose self-end text-xs font-medium"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Button type="submit" className="w-full justify-center">
                  {t("submitLogin")}
                </Button>
              </>
            )}
          </>
        ) : (
          <>
            <Input
              name="name"
              variant="main"
              autoComplete="name"
              required
              label={t("name")}
              placeholder={t("name")}
            />
            <div className="grid grid-cols-2 gap-x-4">
              <DatePicker
                variant="main"
                name="dateOfBirth"
                required
                label={t("dateOfBirth")}
                value={dateOfBirth}
                onChange={setDateOfBirth}
                min="1900-01-01"
                max={todayIso}
                showToday={false}
                centerOn={adultIso}
              />
              <Select
                variant="main"
                searchable
                required
                name="nationality"
                label={t("nationality")}
                placeholder={t("nationalityPlaceholder")}
                searchPlaceholder={tCountries("search")}
                emptyMessage={tCountries("empty")}
                options={nationalityOptions}
                value={nationality}
                onChange={setNationality}
                menuMinWidth={320}
              />
            </div>
            <PhoneField
              name="phone"
              required
              allowInternational
              label={t("phone")}
              placeholder={t("phonePlaceholder")}
              value={phone}
              onChange={setPhone}
              countryIso={phoneCountry}
              onCountryChange={setPhoneCountry}
            />
            <Input
              name="email"
              type="email"
              variant="main"
              autoComplete="email"
              required
              label={t("email")}
              placeholder={t("email")}
            />
            <Input
              name="password"
              type="password"
              variant="main"
              autoComplete="new-password"
              required
              label={t("password")}
              placeholder={t("password")}
            />

            <label className="text-prose-muted flex items-start gap-2.5 text-sm leading-snug">
              <Checkbox name="terms" required className="mt-0.5" />
              {t("termsLabel")}
            </label>

            <Button type="submit" className="w-full justify-center">
              {t("submitRegister")}
            </Button>
          </>
        )}
      </form>

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
