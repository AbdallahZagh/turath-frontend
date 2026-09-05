import { z } from "zod";

import type { LandingPillarId } from "@/lib/mock/landing";

const emailSchema = z
  .string()
  .trim()
  .min(1, "emailRequired")
  .email("emailInvalid");

const passwordSchema = z
  .string()
  .min(1, "passwordRequired")
  .min(8, "passwordMin");

const phoneNationalSchema = z
  .string()
  .trim()
  .min(1, "phoneRequired")
  .regex(/^[0-9+\s()-]{7,20}$/, "phoneInvalid");

export const PROVIDER_CATEGORIES = [
  "hotels",
  "dining",
  "trips",
  "events",
  "guides",
] as const satisfies readonly LandingPillarId[];

export type ProviderCategory = (typeof PROVIDER_CATEGORIES)[number];

export const loginPhoneSchema = z.object({
  phone: phoneNationalSchema,
});

export const loginEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "passwordRequired"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "nameRequired"),
  dateOfBirth: z.string().min(1, "dateOfBirthRequired"),
  nationality: z.string().min(2, "nationalityRequired"),
  phone: phoneNationalSchema,
  phoneCountry: z.string().min(2),
  email: emailSchema,
  password: passwordSchema,
  terms: z.boolean().refine((value) => value === true, {
    message: "termsRequired",
  }),
});

export const verifyOtpSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "otpInvalid"),
});

export const forgotPhoneSchema = z.object({
  phone: phoneNationalSchema,
});

export const forgotEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "confirmRequired"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const GALLERY_MAX = 6;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function isUploadedFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function fileMatches(
  file: File,
  allowedTypes: ReadonlySet<string>,
  extensions: readonly string[],
): boolean {
  if (allowedTypes.has(file.type)) {
    return true;
  }
  if (file.type) {
    return false;
  }
  const name = file.name.toLowerCase();
  return extensions.some((ext) => name.endsWith(ext));
}

function uploadSchema(
  emptyKey: string,
  allowed: ReadonlySet<string>,
  extensions: readonly string[],
  typeKey: string,
) {
  return z
    .custom<File>(isUploadedFile, { error: emptyKey })
    .refine((file) => file.size > 0 && file.size <= MAX_UPLOAD_BYTES, {
      message: "uploadTooLarge",
    })
    .refine((file) => fileMatches(file, allowed, extensions), { message: typeKey });
}

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;
const DOCUMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"] as const;

const documentFileSchema = uploadSchema(
  "documentRequired",
  DOCUMENT_TYPES,
  DOCUMENT_EXTENSIONS,
  "documentTypeInvalid",
);

const imageFileSchema = uploadSchema(
  "imageRequired",
  IMAGE_TYPES,
  IMAGE_EXTENSIONS,
  "imageTypeInvalid",
);

const hhmmSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "hoursRequired");

function coordinateSchema(requiredKey: string, invalidKey: string, min: number, max: number) {
  return z
    .string()
    .trim()
    .min(1, requiredKey)
    .refine((value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed >= min && parsed <= max;
    }, invalidKey);
}

export const PROVIDER_REGISTER_STEP_IDS = [
  "account",
  "business",
  "documents",
  "photos",
] as const;

export type ProviderRegisterStepId = (typeof PROVIDER_REGISTER_STEP_IDS)[number];

export const providerRegisterSchema = z
  .object({
    ownerName: z.string().trim().min(2, "ownerNameRequired"),
    dateOfBirth: z.string().min(1, "dateOfBirthRequired"),
    nationality: z.string().min(2, "nationalityRequired"),
    phone: phoneNationalSchema,
    email: emailSchema,
    password: passwordSchema,
    businessNameEn: z.string().trim().min(2, "businessNameEnRequired"),
    businessNameAr: z.string().trim().min(2, "businessNameArRequired"),
    category: z.enum(PROVIDER_CATEGORIES, {
      error: "categoryRequired",
    }),
    governorate: z.string().min(1, "governorateRequired"),
    addressEn: z.string().trim().min(4, "addressEnRequired"),
    addressAr: z.string().trim().min(4, "addressArRequired"),
    descriptionEn: z.string().trim().min(8, "descriptionEnRequired"),
    descriptionAr: z.string().trim().min(8, "descriptionArRequired"),
    opensAt: hhmmSchema,
    closesAt: hhmmSchema,
    latitude: coordinateSchema("latitudeRequired", "latitudeInvalid", -90, 90),
    longitude: coordinateSchema("longitudeRequired", "longitudeInvalid", -180, 180),
    guideLicenseNumber: z.string().trim(),
    commercialRegistration: documentFileSchema,
    ministryLicense: documentFileSchema,
    ownerId: documentFileSchema,
    logo: imageFileSchema,
    gallery: z
      .array(imageFileSchema)
      .min(1, "galleryRequired")
      .max(GALLERY_MAX, "galleryMax"),
    terms: z.boolean().refine((value) => value === true, {
      message: "termsRequired",
    }),
  })
  .superRefine((value, ctx) => {
    if (value.category === "guides" && value.guideLicenseNumber.length < 3) {
      ctx.addIssue({
        code: "custom",
        path: ["guideLicenseNumber"],
        message: "guideLicenseRequired",
      });
    }
  });

export type LoginPhoneValues = z.infer<typeof loginPhoneSchema>;
export type LoginEmailValues = z.infer<typeof loginEmailSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
export type ForgotPhoneValues = z.infer<typeof forgotPhoneSchema>;
export type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ProviderRegisterValues = z.infer<typeof providerRegisterSchema>;

export const PROVIDER_REGISTER_STEP_FIELDS: Record<
  ProviderRegisterStepId,
  readonly (keyof ProviderRegisterValues)[]
> = {
  account: ["ownerName", "dateOfBirth", "nationality", "phone", "email", "password"],
  business: [
    "businessNameEn",
    "businessNameAr",
    "category",
    "governorate",
    "addressEn",
    "addressAr",
    "descriptionEn",
    "descriptionAr",
    "opensAt",
    "closesAt",
    "latitude",
    "longitude",
    "guideLicenseNumber",
  ],
  documents: ["commercialRegistration", "ministryLicense", "ownerId"],
  photos: ["logo", "gallery", "terms"],
};

export const PROVIDER_GALLERY_MAX = GALLERY_MAX;
