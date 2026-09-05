import { addDays } from "date-fns";

import { parseIsoDate, toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { AdminBooking, BookingStatus } from "@/lib/mock/adminBookings";
import type { AdminLedgerRow } from "@/lib/mock/adminLedger";
import type {
  AdminProvider,
  AdminProviderAccountEvent,
} from "@/lib/mock/adminProviders";

export const PROVIDER_ACTIVITY_CHANNELS = ["bookings", "money", "account"] as const;

export type ProviderActivityChannel = (typeof PROVIDER_ACTIVITY_CHANNELS)[number];

export const PROVIDER_ACTIVITY_KINDS = [
  "placed",
  "confirmed",
  "checkedIn",
  "completed",
  "cancelled",
  "noShow",
  "disputed",
  "settled",
  "submitted",
  "approved",
  "rejected",
  "suspended",
  "reinstated",
  "financeUpdated",
] as const;

export type ProviderActivityKind = (typeof PROVIDER_ACTIVITY_KINDS)[number];

export type AdminProviderActivityEvent = {
  id: string;
  at: string;
  kind: ProviderActivityKind;
  channels: ProviderActivityChannel[];
  guest?: LocalizedName;
  amountSyp?: number;
  bookingCode?: string;
};

const KIND_RANK: Record<ProviderActivityKind, number> = {
  placed: 0,
  confirmed: 1,
  checkedIn: 2,
  cancelled: 3,
  noShow: 4,
  disputed: 5,
  completed: 6,
  settled: 7,
  submitted: 8,
  approved: 9,
  rejected: 10,
  suspended: 11,
  reinstated: 12,
  financeUpdated: 13,
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

function bookingKind(status: BookingStatus): ProviderActivityKind | undefined {
  if (status === "pending" || status === "confirmed") {
    return undefined;
  }
  if (status === "checkedIn") {
    return "checkedIn";
  }
  return status;
}

function eventsForBooking(
  booking: AdminBooking,
  submittedAt: string,
): AdminProviderActivityEvent[] {
  const start = booking.when.start;
  const events: AdminProviderActivityEvent[] = [
    {
      id: `${booking.id}_placed`,
      at: notBefore(shiftIso(start, -14), submittedAt),
      kind: "placed",
      channels: ["bookings"],
      guest: booking.guest,
      bookingCode: booking.code,
    },
  ];

  if (booking.status !== "pending") {
    events.push({
      id: `${booking.id}_confirmed`,
      at: notBefore(shiftIso(start, -10), submittedAt),
      kind: "confirmed",
      channels: ["bookings"],
      guest: booking.guest,
      bookingCode: booking.code,
    });
  }

  if (booking.status === "checkedIn" || booking.status === "completed") {
    events.push({
      id: `${booking.id}_checkedIn`,
      at: start,
      kind: "checkedIn",
      channels: ["bookings"],
      guest: booking.guest,
      bookingCode: booking.code,
    });
  }

  const terminal = bookingKind(booking.status);
  if (terminal === "checkedIn" || terminal === undefined) {
    return events;
  }

  const money = MONEY_STATUSES.has(booking.status);
  const at =
    terminal === "cancelled" ? notBefore(shiftIso(start, -2), submittedAt) : start;

  events.push({
    id: `${booking.id}_${terminal}`,
    at,
    kind: terminal,
    channels: money ? ["bookings", "money"] : ["bookings"],
    guest: booking.guest,
    amountSyp: money ? booking.amountSyp : undefined,
    bookingCode: booking.code,
  });

  return events;
}

function accountChannels(
  kind: AdminProviderAccountEvent["kind"],
): ProviderActivityChannel[] {
  return kind === "financeUpdated" ? ["account", "money"] : ["account"];
}

export function buildProviderActivity(
  provider: AdminProvider,
  bookings: AdminBooking[],
  ledger: AdminLedgerRow | null,
): AdminProviderActivityEvent[] {
  const events: AdminProviderActivityEvent[] = bookings.flatMap((booking) =>
    eventsForBooking(booking, provider.submittedAt),
  );

  provider.accountEvents.forEach((event, index) => {
    events.push({
      id: `${provider.id}_${event.kind}_${event.at}_${index}`,
      at: event.at,
      kind: event.kind,
      channels: accountChannels(event.kind),
    });
  });

  if (ledger && ledger.paidSyp > 0) {
    events.push({
      id: `${provider.id}_settled_${ledger.lastSettledAt}`,
      at: ledger.lastSettledAt,
      kind: "settled",
      channels: ["money"],
      amountSyp: ledger.paidSyp,
    });
  }

  events.sort((a, b) => {
    if (a.at !== b.at) {
      return b.at.localeCompare(a.at);
    }
    return KIND_RANK[b.kind] - KIND_RANK[a.kind];
  });

  return events;
}
