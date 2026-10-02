import type { Locale } from "@/i18n/config";
import { formatDateAndPickerTime, formatMediumDate } from "@/lib/format/datetime";
import type { BookingWhen } from "@/lib/mock/adminBookings";

export function formatBookingWhen(when: BookingWhen, loc: Locale): string {
  const start = formatMediumDate(when.start, loc);
  if (when.end) {
    return `${start} – ${formatMediumDate(when.end, loc)}`;
  }
  if (when.time) {
    return formatDateAndPickerTime(when.start, when.time, loc);
  }
  return start;
}
