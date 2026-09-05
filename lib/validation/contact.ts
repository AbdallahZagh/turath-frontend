import { z } from "zod";

export const CONTACT_TOPICS = [
  "general",
  "booking",
  "partner",
  "press",
  "report",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\s()-]{7,20}$/;

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "nameRequired"),
    email: z.string().trim(),
    phone: z.string().trim(),
    topic: z
      .string()
      .min(1, "topicRequired")
      .refine(
        (value) => (CONTACT_TOPICS as readonly string[]).includes(value),
        { message: "topicRequired" },
      ),
    message: z
      .string()
      .trim()
      .min(1, "messageRequired")
      .min(10, "messageMin"),
  })
  .superRefine((value, ctx) => {
    if (!value.email && !value.phone) {
      ctx.addIssue({
        code: "custom",
        message: "contactRequired",
        path: ["email"],
      });
    }

    if (value.email && !EMAIL_RE.test(value.email)) {
      ctx.addIssue({
        code: "custom",
        message: "emailInvalid",
        path: ["email"],
      });
    }

    if (value.phone && !PHONE_RE.test(value.phone)) {
      ctx.addIssue({
        code: "custom",
        message: "phoneInvalid",
        path: ["phone"],
      });
    }
  });

export type ContactValues = z.infer<typeof contactSchema>;

export const CONTACT_ERROR_KEYS = [
  "nameRequired",
  "emailInvalid",
  "phoneInvalid",
  "contactRequired",
  "topicRequired",
  "messageRequired",
  "messageMin",
] as const;

export type ContactErrorKey = (typeof CONTACT_ERROR_KEYS)[number];

export function isContactErrorKey(value: string): value is ContactErrorKey {
  return (CONTACT_ERROR_KEYS as readonly string[]).includes(value);
}
