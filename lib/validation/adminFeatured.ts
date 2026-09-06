import { z } from "zod";

import { PROMOTION_KINDS } from "@/lib/mock/adminPromotions";
import {
  FEATURED_SLOT_IDS,
  slotRequiresCampaign,
  type FeaturedSlotId,
} from "@/lib/mock/featuredSlots";

export const featuredFormSchema = z
  .object({
    titleEn: z.string().trim().min(1, "titleEnRequired"),
    titleAr: z.string().trim().min(1, "titleArRequired"),
    slot: z
      .string()
      .min(1, "slotRequired")
      .refine((value) => (FEATURED_SLOT_IDS as readonly string[]).includes(value), {
        message: "slotRequired",
      }),
    kind: z
      .string()
      .min(1, "kindRequired")
      .refine((value) => (PROMOTION_KINDS as readonly string[]).includes(value), {
        message: "kindRequired",
      }),
    targetPreset: z.string().min(1),
    targetEn: z.string().trim().min(1, "targetEnRequired"),
    targetAr: z.string().trim().min(1, "targetArRequired"),
    startAt: z.string().trim().min(1, "startRequired"),
    endAt: z.string().trim().min(1, "endRequired"),
  })
  .superRefine((value, ctx) => {
    if (value.endAt < value.startAt) {
      ctx.addIssue({
        code: "custom",
        message: "invalidDates",
        path: ["endAt"],
      });
    }

    const slot = value.slot as FeaturedSlotId;
    const wantsCampaign = slotRequiresCampaign(slot);
    if (wantsCampaign && value.kind !== "campaign") {
      ctx.addIssue({
        code: "custom",
        message: "kindSlotMismatch",
        path: ["kind"],
      });
    }
    if (!wantsCampaign && value.kind !== "featured") {
      ctx.addIssue({
        code: "custom",
        message: "kindSlotMismatch",
        path: ["kind"],
      });
    }
  });

export type FeaturedFormValues = z.infer<typeof featuredFormSchema>;

export const FEATURED_FORM_ERROR_KEYS = [
  "titleEnRequired",
  "titleArRequired",
  "slotRequired",
  "kindRequired",
  "targetEnRequired",
  "targetArRequired",
  "startRequired",
  "endRequired",
  "invalidDates",
  "kindSlotMismatch",
] as const;

export type FeaturedFormErrorKey = (typeof FEATURED_FORM_ERROR_KEYS)[number];

export function isFeaturedFormErrorKey(value: string): value is FeaturedFormErrorKey {
  return (FEATURED_FORM_ERROR_KEYS as readonly string[]).includes(value);
}
