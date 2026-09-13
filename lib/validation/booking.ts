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
