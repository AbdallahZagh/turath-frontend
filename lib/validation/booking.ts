import { z } from "zod";

export const HOTEL_BOOKING_ERROR_KEYS = [
  "checkInRequired",
  "checkOutRequired",
  "checkOutAfterCheckIn",
  "roomRequired",
  "guestsMin",
  "guestsMax",
  "specialRequestsMax",
] as const;

export type HotelBookingErrorKey = (typeof HOTEL_BOOKING_ERROR_KEYS)[number];

export const hotelBookingSchema = z
  .object({
    checkIn: z.string().min(1, "checkInRequired"),
    checkOut: z.string().min(1, "checkOutRequired"),
    roomId: z.string().min(1, "roomRequired"),
    guests: z.number().int().min(1, "guestsMin").max(8, "guestsMax"),
    specialRequests: z.string().trim().max(500, "specialRequestsMax"),
    couponCode: z.string().trim().max(32),
  })
  .superRefine((values, context) => {
    if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) {
      context.addIssue({
        code: "custom",
        message: "checkOutAfterCheckIn",
        path: ["checkOut"],
      });
    }
  });

export type HotelBookingValues = z.infer<typeof hotelBookingSchema>;

export function isHotelBookingErrorKey(value: string): value is HotelBookingErrorKey {
  return (HOTEL_BOOKING_ERROR_KEYS as readonly string[]).includes(value);
}

export const RESTAURANT_BOOKING_ERROR_KEYS = [
  "dateRequired",
  "timeRequired",
  "zoneRequired",
  "partyMin",
  "partyMax",
  "specialRequestsMax",
] as const;

export type RestaurantBookingErrorKey = (typeof RESTAURANT_BOOKING_ERROR_KEYS)[number];

export const restaurantBookingSchema = z.object({
  date: z.string().min(1, "dateRequired"),
  timeSlot: z.string().min(1, "timeRequired"),
  zoneId: z.enum(["indoor", "terrace", "vip", "smoking"], { error: "zoneRequired" }),
  partySize: z.number().int().min(1, "partyMin").max(12, "partyMax"),
  specialRequests: z.string().trim().max(500, "specialRequestsMax"),
  couponCode: z.string().trim().max(32),
});

export type RestaurantBookingValues = z.infer<typeof restaurantBookingSchema>;

export function isRestaurantBookingErrorKey(value: string): value is RestaurantBookingErrorKey {
  return (RESTAURANT_BOOKING_ERROR_KEYS as readonly string[]).includes(value);
}

export const TRIP_BOOKING_ERROR_KEYS = [
  "dateRequired",
  "pickupRequired",
  "seatsMin",
  "seatsMax",
  "emergencyContactRequired",
  "emergencyContactInvalid",
] as const;

export type TripBookingErrorKey = (typeof TRIP_BOOKING_ERROR_KEYS)[number];

export const tripBookingSchema = z.object({
  date: z.string().min(1, "dateRequired"),
  seats: z.number().int().min(1, "seatsMin").max(12, "seatsMax"),
  pickupPointId: z.string().min(1, "pickupRequired"),
  emergencyContact: z.string().trim().min(1, "emergencyContactRequired").regex(/^\+?[0-9 ()-]{7,20}$/, "emergencyContactInvalid"),
  couponCode: z.string().trim().max(32),
});

export type TripBookingValues = z.infer<typeof tripBookingSchema>;

export function isTripBookingErrorKey(value: string): value is TripBookingErrorKey {
  return (TRIP_BOOKING_ERROR_KEYS as readonly string[]).includes(value);
}

export const EVENT_BOOKING_ERROR_KEYS = ["sessionRequired", "tierRequired", "quantityMin", "quantityMax"] as const;

export type EventBookingErrorKey = (typeof EVENT_BOOKING_ERROR_KEYS)[number];

export const eventBookingSchema = z.object({
  sessionId: z.string().min(1, "sessionRequired"),
  ticketTier: z.enum(["standard", "vip"], { error: "tierRequired" }),
  quantity: z.number().int().min(1, "quantityMin").max(6, "quantityMax"),
  couponCode: z.string().trim().max(32),
});

export type EventBookingValues = z.infer<typeof eventBookingSchema>;

export function isEventBookingErrorKey(value: string): value is EventBookingErrorKey {
  return (EVENT_BOOKING_ERROR_KEYS as readonly string[]).includes(value);
}
