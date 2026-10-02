import { z } from "zod";

import { parseNumberInput } from "@/lib/format/digits";
import type { ProviderCategory } from "@/lib/validation/auth";

export const PROVIDER_PROFILE_AMENITIES = [
  "generator",
  "wifi",
  "ac",
  "breakfast",
  "airportTransfer",
  "accessible",
  "parking",
  "terrace",
] as const;

export type ProviderProfileAmenity = (typeof PROVIDER_PROFILE_AMENITIES)[number];

/** Stay facilities a restaurant does not offer, so its profile does not list them. */
const NOT_OFFERED_BY_DINING: readonly ProviderProfileAmenity[] = ["breakfast", "airportTransfer"];

/** The facilities a business of this category can tick on its profile. */
export function profileAmenitiesFor(category: ProviderCategory): readonly ProviderProfileAmenity[] {
  return category === "dining"
    ? PROVIDER_PROFILE_AMENITIES.filter((amenity) => !NOT_OFFERED_BY_DINING.includes(amenity))
    : PROVIDER_PROFILE_AMENITIES;
}

const coordinate = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .min(1, "required")
    .refine((value) => {
      const parsed = parseNumberInput(value, { decimal: true, negative: true });
      return parsed !== undefined && parsed >= minimum && parsed <= maximum;
    }, "coordinate");

export const providerProfileSchema = z.object({
  nameEn: z.string().trim().min(2, "required"),
  nameAr: z.string().trim().min(2, "required"),
  descriptionEn: z.string().trim().min(20, "description"),
  descriptionAr: z.string().trim().min(20, "description"),
  governorate: z.string().trim().min(1, "required"),
  addressEn: z.string().trim().min(4, "required"),
  addressAr: z.string().trim().min(4, "required"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{8,20}$/, "phone"),
  email: z.email("email"),
  opensAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "time"),
  closesAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "time"),
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
  amenities: z.array(z.enum(PROVIDER_PROFILE_AMENITIES)),
  logo: z.string().min(1, "required"),
  gallery: z.array(z.string().min(1)).min(1, "gallery").max(6, "gallery"),
});

export type ProviderProfileValues = z.infer<typeof providerProfileSchema>;
