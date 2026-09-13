import { z } from "zod";

export const bookingReviewSchema = z.object({
  rating: z.number().int().min(1, "ratingRequired").max(5, "ratingRequired"),
  comment: z.string().trim().min(10, "commentMin").max(500, "commentMax"),
});

export type BookingReviewValues = z.infer<typeof bookingReviewSchema>;

export const BOOKING_REVIEW_ERROR_KEYS = ["ratingRequired", "commentMin", "commentMax"] as const;
export type BookingReviewErrorKey = (typeof BOOKING_REVIEW_ERROR_KEYS)[number];

export function isBookingReviewErrorKey(value: string): value is BookingReviewErrorKey {
  return (BOOKING_REVIEW_ERROR_KEYS as readonly string[]).includes(value);
}
