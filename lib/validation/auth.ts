import { z } from "zod";

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

export type LoginPhoneValues = z.infer<typeof loginPhoneSchema>;
export type LoginEmailValues = z.infer<typeof loginEmailSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;
export type ForgotPhoneValues = z.infer<typeof forgotPhoneSchema>;
export type ForgotEmailValues = z.infer<typeof forgotEmailSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
