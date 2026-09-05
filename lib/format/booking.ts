import type { Locale } from "@/i18n/config";
import { formatMediumDate, formatPickerTime } from "@/lib/format/datetime";
import type { BookingWhen } from "@/lib/mock/adminBookings";

export function formatBookingWhen(when: BookingWhen, loc: Locale): string {
  const start = formatMediumDate(when.start, loc);
  if (when.end) {
    return `${start} – ${formatMediumDate(when.end, loc)}`;
  }
  if (when.time) {
    return `${start} · ${formatPickerTime(when.time, loc, "12")}`;
  }
  return start;
}
