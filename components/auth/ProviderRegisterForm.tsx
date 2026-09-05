"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { subYears } from "date-fns";
import { motion } from "framer-motion";
import { ImagePlus, Plus, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import { AuthFieldError } from "@/components/auth/AuthFieldError";
import { ProviderRegisterProgress } from "@/components/auth/ProviderRegisterProgress";
import { Logo } from "@/components/logo/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { countrySelectOptions } from "@/components/ui/countryOptions";
import { DatePicker } from "@/components/ui/DatePicker";
import { FileField } from "@/components/ui/FileField";
import { ImageField } from "@/components/ui/ImageField";
import { Input } from "@/components/ui/Input";
import { PhoneField } from "@/components/ui/PhoneField";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { TimePicker } from "@/components/ui/TimePicker";
import { useRegisterProvider } from "@/hooks/useAuth";
import { isLocale } from "@/i18n/config";
import { toIsoDate } from "@/lib/format/datetime";
import { SYRIA_ISO2 } from "@/lib/geo/countries";
import { GOVERNORATES } from "@/lib/mock/landing";
import { fadeUp } from "@/lib/motion/variants";
import {
  PROVIDER_CATEGORIES,
  PROVIDER_GALLERY_MAX,
  PROVIDER_REGISTER_STEP_FIELDS,
  PROVIDER_REGISTER_STEP_IDS,
  providerRegisterSchema,
  type ProviderRegisterStepId,
  type ProviderRegisterValues,
} from "@/lib/validation/auth";
import { fieldMessage, fieldMessageFromUnknown } from "@/lib/validation/fieldMessage";
import type { ProviderUploadedFile } from "@/services/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/store/toastStore";

const LAST_STEP = PROVIDER_REGISTER_STEP_IDS.length - 1;

function toUploaded(file: File): ProviderUploadedFile {
  return { filename: file.name, mimeType: file.type, size: file.size };
}

export function ProviderRegisterForm(): ReactNode {
  const t = useTranslations("auth");
  const tErrors = useTranslations("auth.errors");
  const tGov = useTranslations("landing.governorates");
  const tProvider = useTranslations("providerRegister");
  const tCountries = useTranslations("countries");
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  const router = useRouter();
  const completeSession = useAuthStore((state) => state.completeSession);
  const registerProvider = useRegisterProvider();
  const busy = registerProvider.isPending;
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const logoPreviewRef = useRef<string | undefined>(undefined);
  const galleryPreviewRef = useRef<string[]>([]);

  const [step, setStep] = useState(0);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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

  const nationalityOptions = useMemo(
    () => countrySelectOptions(locale, "nationality"),
    [locale],
  );

  const progressSteps = useMemo(
    () =>
      PROVIDER_REGISTER_STEP_IDS.map((id) => ({
        id,
        label: tProvider(`steps.${id}`),
      })),
    [tProvider],
  );

  const todayIso = toIsoDate(new Date());
  const adultIso = toIsoDate(subYears(new Date(), 18));
  const stepId: ProviderRegisterStepId = PROVIDER_REGISTER_STEP_IDS[step] ?? "account";

  const form = useForm<ProviderRegisterValues>({
    resolver: zodResolver(providerRegisterSchema),
    defaultValues: {
      ownerName: "",
      dateOfBirth: "",
      nationality: SYRIA_ISO2,
      phone: "",
      email: "",
      password: "",
      businessNameEn: "",
      businessNameAr: "",
      category: "hotels",
      governorate: "damascus",
      addressEn: "",
      addressAr: "",
      descriptionEn: "",
      descriptionAr: "",
      opensAt: "09:00",
      closesAt: "22:00",
      latitude: "",
      longitude: "",
      guideLicenseNumber: "",
      gallery: [],
      terms: false,
    },
  });

  const category = useWatch({ control: form.control, name: "category" });
  const gallery = useWatch({ control: form.control, name: "gallery" }) ?? [];

  useEffect(() => {
    return () => {
      if (logoPreviewRef.current) {
        URL.revokeObjectURL(logoPreviewRef.current);
      }
      galleryPreviewRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function setLogo(file: File | undefined, previewUrl: string | undefined): void {
    if (logoPreviewRef.current) {
      URL.revokeObjectURL(logoPreviewRef.current);
    }
    logoPreviewRef.current = previewUrl;
    setLogoPreview(previewUrl);
    if (file) {
      form.setValue("logo", file, { shouldValidate: true });
      return;
    }
    form.resetField("logo");
  }

  function addGalleryPhoto(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || gallery.length >= PROVIDER_GALLERY_MAX) {
      return;
    }
    const preview = URL.createObjectURL(file);
    galleryPreviewRef.current = [...galleryPreviewRef.current, preview];
    setGalleryPreviews(galleryPreviewRef.current);
    form.setValue("gallery", [...gallery, file], { shouldValidate: true });
  }

  function removeGalleryPhoto(index: number): void {
    const url = galleryPreviewRef.current[index];
    if (url) {
      URL.revokeObjectURL(url);
    }
    galleryPreviewRef.current = galleryPreviewRef.current.filter((_, i) => i !== index);
    setGalleryPreviews(galleryPreviewRef.current);
    form.setValue(
      "gallery",
      gallery.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  }

  async function goNext(): Promise<void> {
    const valid = await form.trigger(PROVIDER_REGISTER_STEP_FIELDS[stepId]);
    if (valid) {
      setStep((current) => Math.min(current + 1, LAST_STEP));
    }
  }

  async function onSubmit(values: ProviderRegisterValues): Promise<void> {
    try {
      await registerProvider.mutateAsync({
        ownerName: values.ownerName,
        dateOfBirth: values.dateOfBirth,
        nationality: values.nationality,
        phone: values.phone,
        email: values.email,
        password: values.password,
        businessNameEn: values.businessNameEn,
        businessNameAr: values.businessNameAr,
        category: values.category,
        governorate: values.governorate,
        addressEn: values.addressEn,
        addressAr: values.addressAr,
        descriptionEn: values.descriptionEn,
        descriptionAr: values.descriptionAr,
        opensAt: values.opensAt,
        closesAt: values.closesAt,
        latitude: values.latitude,
        longitude: values.longitude,
        guideLicenseNumber: values.guideLicenseNumber,
        commercialRegistration: toUploaded(values.commercialRegistration),
        ministryLicense: toUploaded(values.ministryLicense),
        ownerId: toUploaded(values.ownerId),
        logo: toUploaded(values.logo),
        gallery: values.gallery.map(toUploaded),
      });
      completeSession("PROVIDER_OWNER");
      toast.success(tProvider("toastSubmittedTitle"), tProvider("toastSubmittedBody"));
      router.replace("/provider/pending");
    } catch {
      toast.error(t("toastErrorTitle"), t("toastErrorBody"));
    }
  }

  async function onFormSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (step < LAST_STEP) {
      await goNext();
      return;
    }
    await form.handleSubmit(onSubmit)(event);
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      className="w-full max-w-2xl rounded-glass p-4 sm:p-5"
      lang={locale}
    >
      <Logo variant="main" className="h-9 w-fit [&_img]:h-full [&_img]:w-auto lg:hidden" />

      <h1 className="font-heading text-prose mt-3 text-3xl font-semibold tracking-tight">
        {tProvider("title")}
      </h1>
      <p className="text-prose-muted mt-2 text-sm leading-relaxed">
        {tProvider("lead")}
      </p>

      <ProviderRegisterProgress
        steps={progressSteps}
        current={step}
        label={tProvider("stepsLabel")}
        onSelect={setStep}
      />

      <p className="text-prose-muted mt-4 text-sm font-medium">
        {tProvider("stepOf", { current: step + 1, total: LAST_STEP + 1 })}
        {" — "}
        {tProvider(`stepLeads.${stepId}`)}
      </p>

      <form className="mt-4 flex flex-col gap-3" onSubmit={onFormSubmit} noValidate>
        {stepId === "account" ? (
          <>
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

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
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
                  message={fieldMessage(tErrors, form.formState.errors.dateOfBirth)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
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
                  message={fieldMessage(tErrors, form.formState.errors.nationality)}
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
          </>
        ) : null}

        {stepId === "business" ? (
          <>
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

            {category === "guides" ? (
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="guideLicenseNumber"
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="main"
                      required
                      label={tProvider("guideLicenseNumber")}
                      placeholder={tProvider("guideLicenseNumber")}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(
                    tErrors,
                    form.formState.errors.guideLicenseNumber,
                  )}
                />
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="addressEn"
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="main"
                      required
                      label={tProvider("addressEn")}
                      placeholder={tProvider("addressEn")}
                      dir="ltr"
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.addressEn)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="addressAr"
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="main"
                      required
                      label={tProvider("addressAr")}
                      placeholder={tProvider("addressAr")}
                      dir="rtl"
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.addressAr)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      variant="main"
                      required
                      rows={3}
                      label={tProvider("descriptionEn")}
                      placeholder={tProvider("descriptionEn")}
                      dir="ltr"
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.descriptionEn)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      variant="main"
                      required
                      rows={3}
                      label={tProvider("descriptionAr")}
                      placeholder={tProvider("descriptionAr")}
                      dir="rtl"
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.descriptionAr)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="opensAt"
                  render={({ field }) => (
                    <TimePicker
                      variant="main"
                      required
                      name={field.name}
                      label={tProvider("opensAt")}
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={15}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.opensAt)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="closesAt"
                  render={({ field }) => (
                    <TimePicker
                      variant="main"
                      required
                      name={field.name}
                      label={tProvider("closesAt")}
                      value={field.value}
                      onChange={field.onChange}
                      minuteStep={15}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.closesAt)}
                />
              </div>
            </div>

            <p className="text-prose-muted text-xs">{tProvider("mapHint")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="main"
                      required
                      inputMode="decimal"
                      dir="ltr"
                      label={tProvider("latitude")}
                      placeholder={tProvider("latitudePlaceholder")}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.latitude)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Controller
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <Input
                      {...field}
                      variant="main"
                      required
                      inputMode="decimal"
                      dir="ltr"
                      label={tProvider("longitude")}
                      placeholder={tProvider("longitudePlaceholder")}
                    />
                  )}
                />
                <AuthFieldError
                  message={fieldMessage(tErrors, form.formState.errors.longitude)}
                />
              </div>
            </div>
          </>
        ) : null}

        {stepId === "documents" ? (
          <>
            <p className="text-prose-muted text-sm leading-relaxed">
              {tProvider("documentsHint")}
            </p>
            <div className="flex flex-col gap-1.5">
              <Controller
                control={form.control}
                name="commercialRegistration"
                render={({ field }) => (
                  <FileField
                    required
                    label={tProvider("commercialRegistration")}
                    hint={tProvider("documentHint")}
                    removeLabel={tProvider("removeFile")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(
                  tErrors,
                  form.formState.errors.commercialRegistration,
                )}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Controller
                control={form.control}
                name="ministryLicense"
                render={({ field }) => (
                  <FileField
                    required
                    label={tProvider("ministryLicense")}
                    hint={tProvider("documentHint")}
                    removeLabel={tProvider("removeFile")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(tErrors, form.formState.errors.ministryLicense)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Controller
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FileField
                    required
                    label={tProvider("ownerId")}
                    hint={tProvider("documentHint")}
                    removeLabel={tProvider("removeFile")}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <AuthFieldError
                message={fieldMessage(tErrors, form.formState.errors.ownerId)}
              />
            </div>
          </>
        ) : null}

        {stepId === "photos" ? (
          <>
            <div className="flex flex-col gap-1.5">
              <ImageField
                required
                label={tProvider("logo")}
                hint={tProvider("logoHint")}
                removeLabel={tProvider("removeFile")}
                value={logoPreview}
                onChange={setLogo}
              />
              <AuthFieldError
                message={fieldMessage(tErrors, form.formState.errors.logo)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-prose-muted text-xs font-medium">
                  {tProvider("gallery")}
                </span>
                <span className="text-prose-muted text-xs">
                  {tProvider("galleryHint", { max: PROVIDER_GALLERY_MAX })}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {galleryPreviews.map((src, index) => (
                  <div
                    key={src}
                    className="border-glass-border relative aspect-video overflow-hidden rounded-xl border"
                  >
                    {/* Blob previews for local uploads. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryPhoto(index)}
                      className="bg-ink/80 text-foam absolute inset-e-1 top-1 flex size-6 items-center justify-center rounded-full"
                      aria-label={tProvider("removeFile")}
                    >
                      <X className="size-3.5" aria-hidden />
                    </button>
                  </div>
                ))}
                {gallery.length < PROVIDER_GALLERY_MAX ? (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="border-glass-border bg-glass-control text-prose-muted hover:border-primary/60 hover:text-prose flex aspect-video flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-2 text-center text-xs"
                  >
                    {gallery.length === 0 ? (
                      <ImagePlus className="size-4" aria-hidden />
                    ) : (
                      <Plus className="size-4" aria-hidden />
                    )}
                    <span>{tProvider("addPhoto")}</span>
                  </button>
                ) : null}
              </div>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={addGalleryPhoto}
              />
              <AuthFieldError
                message={fieldMessageFromUnknown(
                  tErrors,
                  form.formState.errors.gallery,
                )}
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
          </>
        ) : null}

        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="w-full justify-center sm:w-auto"
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              {tProvider("back")}
            </Button>
          ) : null}
          <Button
            type="submit"
            className="w-full flex-1 justify-center"
            disabled={busy}
          >
            {busy
              ? t("submitting")
              : step < LAST_STEP
                ? tProvider("next")
                : tProvider("submit")}
          </Button>
        </div>
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
