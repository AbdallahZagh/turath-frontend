import { z } from "zod";

const requiredText = z.string().trim().min(1);
const positiveInteger = z.number().int().positive();
const positiveAmount = z.number().positive();

export const hotelRoomSchema = z.object({
  nameEn: requiredText,
  nameAr: requiredText,
  occupancy: positiveInteger,
  quantity: positiveInteger,
  priceSyp: positiveAmount,
  amenities: z.array(z.enum(["generator", "wifi", "ac"])).min(1),
});

export const restaurantTableSchema = z.object({
  label: requiredText,
  capacity: positiveInteger,
  zone: z.enum(["indoor", "terrace", "vip", "smoking"]),
});

export const restaurantScheduleSchema = z.object({
  slots: requiredText.refine(
    (value) => value.split(",").every((slot) => /^([01]\d|2[0-3]):[0-5]\d$/.test(slot.trim())),
  ),
});

export const tripOfferingSchema = z.object({
  titleEn: requiredText,
  titleAr: requiredText,
  date: requiredText,
  pickupEn: requiredText,
  pickupAr: requiredText,
  capacity: positiveInteger,
  seatsLeft: z.number().int().min(0),
  priceSyp: positiveAmount,
  itineraryEn: requiredText,
  itineraryAr: requiredText,
}).refine((value) => value.seatsLeft <= value.capacity, { path: ["seatsLeft"] });

export const eventSessionSchema = z.object({
  titleEn: requiredText,
  titleAr: requiredText,
  date: requiredText,
  time: requiredText,
  tier: z.enum(["standard", "vip"]),
  capacity: positiveInteger,
  available: z.number().int().min(0),
  maxPerUser: z.number().int().min(1).max(6),
  priceSyp: positiveAmount,
}).refine((value) => value.available <= value.capacity, { path: ["available"] });

export const guideOfferingSchema = z.object({
  licenseNumber: requiredText,
  languages: z.array(z.enum(["ar", "en", "fr"])).min(1),
  hourlySyp: positiveAmount,
  fullDaySyp: positiveAmount,
  specialtiesEn: requiredText,
  specialtiesAr: requiredText,
  blockedDates: z.string(),
});

export type HotelRoomValues = z.infer<typeof hotelRoomSchema>;
export type RestaurantTableValues = z.infer<typeof restaurantTableSchema>;
export type RestaurantScheduleValues = z.infer<typeof restaurantScheduleSchema>;
export type TripOfferingValues = z.infer<typeof tripOfferingSchema>;
export type EventSessionValues = z.infer<typeof eventSessionSchema>;
export type GuideOfferingValues = z.infer<typeof guideOfferingSchema>;
