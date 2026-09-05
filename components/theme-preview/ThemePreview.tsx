import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/logo/Logo";
import { ToastLab } from "@/components/theme-preview/ToastLab";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { DatePicker } from "@/components/ui/DatePicker";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { SegmentSwitch } from "@/components/ui/SegmentSwitch";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Stepper } from "@/components/ui/Stepper";
import { TimePicker } from "@/components/ui/TimePicker";
import { Tooltip } from "@/components/ui/Tooltip";
import { formatSyp } from "@/lib/format/money";

const SAMPLE_AMOUNT_SYP = 150_000;

const TOKEN_SWATCHES = [
  { token: "app", className: "bg-app" },
  { token: "app-muted", className: "bg-app-muted" },
  { token: "surface", className: "bg-surface" },
  { token: "primary", className: "bg-primary" },
  { token: "accent", className: "bg-accent" },
  { token: "success", className: "bg-success" },
  { token: "info", className: "bg-info" },
  { token: "warning", className: "bg-warning" },
  { token: "neutral", className: "bg-neutral" },
  { token: "destructive", className: "bg-destructive" },
  { token: "border", className: "bg-border" },
  { token: "prose", className: "bg-prose" },
  { token: "prose-muted", className: "bg-prose-muted" },
] as const;

export async function ThemePreview(): Promise<ReactNode> {
  const t = await getTranslations("themePreview");
  const locale = await getLocale();
  const price = formatSyp(SAMPLE_AMOUNT_SYP, locale);
  const cityOptions = [
    { value: "damascus", label: t("cityDamascus") },
    { value: "aleppo", label: t("cityAleppo") },
    { value: "homs", label: t("cityHoms") },
    { value: "latakia", label: t("cityLatakia") },
    { value: "palmyra", label: t("cityPalmyra") },
  ];
  const stayOptions = [
    { value: "hotel", label: t("segmentHotel") },
    { value: "restaurant", label: t("segmentRestaurant") },
    { value: "trip", label: t("segmentTrip") },
    { value: "event", label: t("segmentEvent") },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Logo variant="main" priority />
          <div className="flex flex-wrap items-center gap-6">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-prose-muted">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl text-prose sm:text-5xl">{t("title")}</h1>
        <p className="max-w-2xl text-prose-muted">{t("subtitle")}</p>
      </GlassPanel>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("buttons")}</h2>
        <p className="text-sm text-prose-muted">{t("buttonsHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <Button>{t("variantSolid")}</Button>
            <Button variant="glass">{t("variantGlass")}</Button>
            <Button variant="outline">{t("variantOutline")}</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">{t("sizeSm")}</Button>
            <Button size="md">{t("sizeMd")}</Button>
            <Button size="lg">{t("sizeLg")}</Button>
          </div>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("toasts")}</h2>
        <p className="text-sm text-prose-muted">{t("toastsHint")}</p>
        <GlassPanel className="p-6 sm:p-8">
          <ToastLab />
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("inputs")}</h2>
        <p className="text-sm text-prose-muted">{t("inputsHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <Input
            variant="main"
            label={t("inputNameLabel")}
            placeholder={t("inputMainPlaceholder")}
            autoComplete="off"
          />
          <Input
            variant="glass"
            placeholder={t("inputGlassPlaceholder")}
            autoComplete="off"
          />
          <Input
            variant="plain"
            placeholder={t("inputPlainPlaceholder")}
            autoComplete="off"
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Input
              variant="plain"
              size="sm"
              placeholder={t("sizeSm")}
              autoComplete="off"
            />
            <Input
              variant="plain"
              size="md"
              placeholder={t("sizeMd")}
              autoComplete="off"
            />
            <Input
              variant="plain"
              size="lg"
              placeholder={t("sizeLg")}
              autoComplete="off"
            />
          </div>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("selects")}</h2>
        <p className="text-sm text-prose-muted">{t("selectsHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <Select
            variant="main"
            label={t("selectCityLabel")}
            placeholder={t("selectPlaceholder")}
            options={cityOptions}
          />
          <Select
            variant="glass"
            placeholder={t("selectPlaceholder")}
            options={cityOptions}
          />
          <Select
            variant="plain"
            placeholder={t("selectPlaceholder")}
            options={cityOptions}
          />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select
              variant="plain"
              size="sm"
              placeholder={t("sizeSm")}
              options={cityOptions}
            />
            <Select
              variant="plain"
              size="md"
              placeholder={t("sizeMd")}
              options={cityOptions}
            />
            <Select
              variant="plain"
              size="lg"
              placeholder={t("sizeLg")}
              options={cityOptions}
            />
          </div>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("controls")}</h2>
        <p className="text-sm text-prose-muted">{t("controlsHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 text-prose">
              <Radio name="preview-stay" value="hotel" defaultChecked />
              {t("radioHotel")}
            </label>
            <label className="inline-flex items-center gap-2 text-prose">
              <Radio name="preview-stay" value="restaurant" />
              {t("radioRestaurant")}
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="inline-flex items-center gap-2 text-prose">
              <Checkbox name="preview-wifi" defaultChecked />
              {t("checkWifi")}
            </label>
            <label className="inline-flex items-center gap-2 text-prose">
              <Checkbox name="preview-breakfast" />
              {t("checkBreakfast")}
            </label>
          </div>
          <div className="inline-flex items-center gap-3">
            <Switch id="preview-switch" defaultChecked />
            <label htmlFor="preview-switch" className="cursor-pointer text-prose">
              {t("switchLabel")}
            </label>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Radio name="preview-radio-size" size="sm" defaultChecked />
            <Radio name="preview-radio-size" size="md" />
            <Radio name="preview-radio-size" size="lg" />
            <Checkbox size="sm" defaultChecked />
            <Checkbox size="md" />
            <Checkbox size="lg" />
            <Switch size="sm" aria-label={t("sizeSm")} />
            <Switch size="md" defaultChecked aria-label={t("sizeMd")} />
            <Switch size="lg" aria-label={t("sizeLg")} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip content={t("tooltipBody")}>
              <Button variant="outline">{t("tooltipAuto")}</Button>
            </Tooltip>
            <Tooltip content={t("tooltipBody")} placement="top">
              <Button variant="outline">{t("tooltipTop")}</Button>
            </Tooltip>
            <Tooltip content={t("tooltipBody")} placement="right">
              <Button variant="outline">{t("tooltipRight")}</Button>
            </Tooltip>
            <Tooltip content={t("tooltipBody")} placement="bottom">
              <Button variant="outline">{t("tooltipBottom")}</Button>
            </Tooltip>
            <Tooltip content={t("tooltipBody")} placement="left">
              <Button variant="outline">{t("tooltipLeft")}</Button>
            </Tooltip>
          </div>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("segments")}</h2>
        <p className="text-sm text-prose-muted">{t("segmentsHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <SegmentSwitch
            variant="main"
            options={stayOptions}
            defaultValue="hotel"
            aria-label={t("segments")}
          />
          <SegmentSwitch
            variant="glass"
            options={stayOptions}
            defaultValue="restaurant"
            aria-label={t("segments")}
          />
          <SegmentSwitch
            variant="plain"
            options={stayOptions}
            defaultValue="trip"
            aria-label={t("segments")}
          />
          <div className="flex flex-col gap-4">
            <SegmentSwitch
              variant="plain"
              size="sm"
              options={stayOptions}
              defaultValue="hotel"
              aria-label={t("sizeSm")}
            />
            <SegmentSwitch
              variant="plain"
              size="md"
              options={stayOptions}
              defaultValue="hotel"
              aria-label={t("sizeMd")}
            />
            <SegmentSwitch
              variant="plain"
              size="lg"
              options={stayOptions}
              defaultValue="hotel"
              aria-label={t("sizeLg")}
            />
          </div>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("dates")}</h2>
        <p className="text-sm text-prose-muted">{t("datesHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <DatePicker
            variant="main"
            label={t("dateLabel")}
            defaultValue="2026-08-27"
          />
          <DatePicker variant="glass" defaultValue="2026-08-27" />
          <DatePicker variant="plain" defaultValue="2026-08-27" />
          <TimePicker
            variant="main"
            label={t("timeLabel")}
            defaultValue="18:30"
          />
          <TimePicker variant="glass" defaultValue="18:30" />
          <TimePicker variant="plain" defaultValue="18:30" />
          <div className="flex flex-col gap-4 sm:flex-row">
            <DatePicker
              variant="plain"
              size="sm"
              defaultValue="2026-08-27"
            />
            <DatePicker
              variant="plain"
              size="md"
              defaultValue="2026-08-27"
            />
            <DatePicker
              variant="plain"
              size="lg"
              defaultValue="2026-08-27"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <TimePicker variant="plain" size="sm" defaultValue="18:30" />
            <TimePicker variant="plain" size="md" defaultValue="18:30" />
            <TimePicker variant="plain" size="lg" defaultValue="18:30" />
          </div>
          <DatePicker
            variant="plain"
            rounded="1.5rem"
            defaultValue="2026-08-27"
          />
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("steppers")}</h2>
        <p className="text-sm text-prose-muted">{t("steppersHint")}</p>
        <GlassPanel className="flex flex-col gap-6 p-6 sm:p-8">
          <Stepper
            variant="main"
            label={t("stepperGuests")}
            defaultValue={2}
            min={1}
            max={12}
          />
          <Stepper variant="glass" defaultValue={2} min={1} max={12} />
          <Stepper variant="plain" defaultValue={2} min={1} max={12} />
          <div className="flex flex-col gap-4 sm:flex-row">
            <Stepper variant="plain" size="sm" defaultValue={2} min={1} />
            <Stepper variant="plain" size="md" defaultValue={2} min={1} />
            <Stepper variant="plain" size="lg" defaultValue={2} min={1} />
          </div>
          <Stepper
            variant="plain"
            rounded="1.5rem"
            defaultValue={2}
            min={1}
          />
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("palette")}</h2>
        <p className="text-sm text-prose-muted">{t("paletteHint")}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOKEN_SWATCHES.map((swatch) => (
            <GlassPanel key={swatch.token} className="p-3">
              <div
                className={`mb-3 h-16 rounded-glass border border-glass-border ${swatch.className}`}
              />
              <p className="font-mono text-xs text-prose">{swatch.token}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <GlassPanel className="flex flex-col gap-4 p-6">
          <h2 className="text-2xl text-prose">{t("type")}</h2>
          <p className="text-3xl text-prose">{t("headingSample")}</p>
          <p className="text-prose-muted">{t("bodySample")}</p>
          <p className="text-sm font-medium text-prose">{price}</p>
        </GlassPanel>

        <GlassPanel className="flex flex-col gap-4 p-6">
          <h2 className="text-2xl text-prose">{t("glass")}</h2>
          <p className="text-prose-muted">{t("glassBody")}</p>
        </GlassPanel>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl text-prose">{t("logos")}</h2>
        <p className="text-sm text-prose-muted">{t("logosHint")}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassPanel className="flex items-center justify-center p-6">
            <Logo variant="main" />
          </GlassPanel>
          <GlassPanel className="flex items-center justify-center p-6">
            <Logo variant="simple" />
          </GlassPanel>
          <GlassPanel className="flex flex-col items-center justify-center gap-3 p-6">
            <Image
              src="/reciept-logo.png"
              alt={t("voucher")}
              width={965}
              height={408}
              className="h-16 w-auto"
            />
            <p className="text-xs text-prose-muted">{t("voucher")}</p>
          </GlassPanel>
        </div>
      </section>

      <GlassPanel className="flex flex-col gap-4 p-6">
        <h3 className="text-xl text-prose">{t("sampleTitle")}</h3>
        <p className="text-sm text-prose-muted">{t("sampleMeta")}</p>
        <p className="text-sm font-medium text-prose">{price}</p>
        <p className="text-xs text-prose-muted">{t("voucherHint")}</p>
      </GlassPanel>
    </div>
  );
}
