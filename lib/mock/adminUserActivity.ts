import { addDays } from "date-fns";

import { parseIsoDate, toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { AdminBooking, BookingStatus } from "@/lib/mock/adminBookings";
import type { AdminUser } from "@/lib/mock/adminUsers";

export const USER_ACTIVITY_CHANNELS = ["bookings", "money", "account"] as const;

export type UserActivityChannel = (typeof USER_ACTIVITY_CHANNELS)[number];

export const USER_ACTIVITY_KINDS = [
  "placed",
  "confirmed",
  "checkedIn",
  "completed",
  "cancelled",
  "noShow",
  "disputed",
  "locked",
  "unlocked",
] as const;

export type UserActivityKind = (typeof USER_ACTIVITY_KINDS)[number];

export type AdminUserActivityEvent = {
  id: string;
  at: string;
  kind: UserActivityKind;
  channels: UserActivityChannel[];
  provider?: LocalizedName;
  amountSyp?: number;
  bookingCode?: string;
};

const KIND_RANK: Record<UserActivityKind, number> = {
  placed: 0,
  confirmed: 1,
  checkedIn: 2,
  cancelled: 3,
  noShow: 4,
  disputed: 5,
  completed: 6,
  locked: 7,
  unlocked: 8,
};

const MONEY_STATUSES: ReadonlySet<BookingStatus> = new Set([
  "completed",
  "noShow",
  "disputed",
]);

function shiftIso(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  if (!date) {
    return iso;
  }
  return toIsoDate(addDays(date, days));
}

function notBefore(iso: string, floor: string): string {
  return iso < floor ? floor : iso;
}

function bookingKind(status: BookingStatus): UserActivityKind | undefined {
  if (status === "pending") {
    return undefined;
  }
  if (status === "confirmed") {
    return undefined;
  }
  if (status === "checkedIn") {
    return "checkedIn";
  }
  return status;
}

function eventsForBooking(
  booking: AdminBooking,
  joinedAt: string,
): AdminUserActivityEvent[] {
  const start = booking.when.start;
  const events: AdminUserActivityEvent[] = [
    {
      id: `${booking.id}_placed`,
      at: notBefore(shiftIso(start, -14), joinedAt),
      kind: "placed",
      channels: ["bookings"],
      provider: booking.provider,
      bookingCode: booking.code,
    },
  ];

  if (booking.status !== "pending") {
    events.push({
      id: `${booking.id}_confirmed`,
      at: notBefore(shiftIso(start, -10), joinedAt),
      kind: "confirmed",
      channels: ["bookings"],
      provider: booking.provider,
      bookingCode: booking.code,
    });
  }

  if (booking.status === "checkedIn" || booking.status === "completed") {
    events.push({
      id: `${booking.id}_checkedIn`,
      at: start,
      kind: "checkedIn",
      channels: ["bookings"],
      provider: booking.provider,
      bookingCode: booking.code,
    });
  }

  const terminal = bookingKind(booking.status);
  if (terminal === "checkedIn" || terminal === undefined) {
    return events;
  }

  const money = MONEY_STATUSES.has(booking.status);
  const at =
    terminal === "cancelled" ? notBefore(shiftIso(start, -2), joinedAt) : start;

  events.push({
    id: `${booking.id}_${terminal}`,
    at,
    kind: terminal,
    channels: money ? ["bookings", "money"] : ["bookings"],
    provider: booking.provider,
    amountSyp: money ? booking.amountSyp : undefined,
    bookingCode: booking.code,
  });

  return events;
}

export function buildUserActivity(
  user: AdminUser,
  bookings: AdminBooking[],
): AdminUserActivityEvent[] {
  const events: AdminUserActivityEvent[] = bookings.flatMap((booking) =>
    eventsForBooking(booking, user.joinedAt),
  );

  user.accountEvents.forEach((event, index) => {
    events.push({
      id: `${user.id}_${event.kind}_${event.at}_${index}`,
      at: event.at,
      kind: event.kind,
      channels: ["account"],
    });
  });

  events.sort((a, b) => {
    if (a.at !== b.at) {
      return b.at.localeCompare(a.at);
    }
    return KIND_RANK[b.kind] - KIND_RANK[a.kind];
  });

  return events;
}
