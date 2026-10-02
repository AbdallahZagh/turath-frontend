import { addDays } from "date-fns";

import { toIsoDate } from "@/lib/format/datetime";
import type { LocalizedName } from "@/lib/i18n/localized";
import type { TouristBookingStatus } from "@/lib/mock/bookings";
import type { ProviderCategory } from "@/lib/validation/auth";

export type ProviderBooking = {
  id: string;
  reference: string;
  backupCode: string;
  qrPayload: string;
  category: ProviderCategory;
  guestName: LocalizedName;
  phone: string;
  partySize: number;
  notes: string;
  offeringName: LocalizedName;
  scheduledAt: string;
  endsAt: string;
  listPriceSyp: number;
  discountSyp: number;
  cashDueSyp: number;
  couponCode: string | null;
  status: TouristBookingStatus;
  checkedInAt: string | null;
  checkedInBy: string | null;
  createdAt: string;
};

type ProviderBookingSeed = Omit<ProviderBooking, "qrPayload">;

/** A local datetime `days` from today, so the demo always has arrivals dated today. */
function fromToday(days: number, time: string): string {
  return `${toIsoDate(addDays(new Date(), days))}T${time}:00`;
}

const SEED: ProviderBookingSeed[] = [
  {
    id: "provider-booking-1",
    category: "hotels",
    reference: "TRH-HJF799",
    backupCode: "Y4DYRZ",
    guestName: { en: "Rami Haddad", ar: "رامي حداد" },
    phone: "+963 944 123 456",
    partySize: 1,
    notes: "Late arrival expected. Please keep the courtyard-side room if available.",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    scheduledAt: fromToday(0, "14:00"),
    endsAt: fromToday(1, "11:00"),
    listPriceSyp: 240_000,
    discountSyp: 0,
    cashDueSyp: 240_000,
    couponCode: null,
    status: "CONFIRMED",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-12T10:20:00+03:00",
  },
  {
    id: "provider-booking-2",
    category: "hotels",
    reference: "TRH-MQK284",
    backupCode: "QAMAR1",
    guestName: { en: "Maya Darwish", ar: "مايا درويش" },
    phone: "+963 933 714 206",
    partySize: 2,
    notes: "Guest requested a quiet room away from the street.",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    scheduledAt: fromToday(0, "16:30"),
    endsAt: fromToday(2, "11:00"),
    listPriceSyp: 600_000,
    discountSyp: 60_000,
    cashDueSyp: 540_000,
    couponCode: "QAMAR10",
    status: "CONFIRMED",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-10T15:45:00+03:00",
  },
  {
    id: "provider-booking-3",
    category: "hotels",
    reference: "TRH-USED24",
    backupCode: "USED24",
    guestName: { en: "Lina Shami", ar: "لينا شامي" },
    phone: "+963 955 301 842",
    partySize: 2,
    notes: "No special requests.",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    scheduledAt: "2026-09-21T11:30:00+03:00",
    endsAt: "2026-09-22T11:00:00+03:00",
    listPriceSyp: 420_000,
    discountSyp: 0,
    cashDueSyp: 420_000,
    couponCode: null,
    status: "CHECKED_IN",
    checkedInAt: "2026-09-21T11:42:00+03:00",
    checkedInBy: "Hala Karam",
    createdAt: "2026-09-08T09:15:00+03:00",
  },
  {
    id: "provider-booking-4",
    category: "hotels",
    reference: "TRH-PND572",
    backupCode: "PND572",
    guestName: { en: "Fadi Khoury", ar: "فادي خوري" },
    phone: "+963 988 420 115",
    partySize: 3,
    notes: "Travelling with a child; requested an extra bed.",
    offeringName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    scheduledAt: fromToday(0, "14:00"),
    endsAt: fromToday(3, "11:00"),
    listPriceSyp: 1_050_000,
    discountSyp: 150_000,
    cashDueSyp: 900_000,
    couponCode: "DAMASCUS150",
    status: "PENDING_CONFIRMATION",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-20T18:05:00+03:00",
  },
  {
    id: "provider-booking-5",
    category: "hotels",
    reference: "TRH-NSH401",
    backupCode: "NSH401",
    guestName: { en: "Nour Hamdan", ar: "نور حمدان" },
    phone: "+963 934 650 812",
    partySize: 2,
    notes: "No arrival recorded before the desk closed the booking.",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    scheduledAt: "2026-09-18T14:00:00+03:00",
    endsAt: "2026-09-19T11:00:00+03:00",
    listPriceSyp: 300_000,
    discountSyp: 0,
    cashDueSyp: 300_000,
    couponCode: null,
    status: "NO_SHOW",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-05T12:30:00+03:00",
  },
  {
    id: "provider-booking-6",
    category: "hotels",
    reference: "TRH-CNL903",
    backupCode: "CNL903",
    guestName: { en: "Salma Atassi", ar: "سلمى الأتاسي" },
    phone: "+963 966 731 522",
    partySize: 1,
    notes: "Cancelled before arrival.",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    scheduledAt: "2026-09-17T14:00:00+03:00",
    endsAt: "2026-09-18T11:00:00+03:00",
    listPriceSyp: 240_000,
    discountSyp: 0,
    cashDueSyp: 240_000,
    couponCode: null,
    status: "CANCELLED",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-02T11:00:00+03:00",
  },
  {
    id: "provider-booking-7",
    category: "hotels",
    reference: "TRH-CMP512",
    backupCode: "CMP512",
    guestName: { en: "Karim Nasser", ar: "كريم ناصر" },
    phone: "+963 944 618 230",
    partySize: 2,
    notes: "Stayed two nights; asked for an early breakfast on departure.",
    offeringName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    scheduledAt: "2026-09-14T14:00:00+03:00",
    endsAt: "2026-09-16T11:00:00+03:00",
    listPriceSyp: 600_000,
    discountSyp: 0,
    cashDueSyp: 600_000,
    couponCode: null,
    status: "COMPLETED",
    checkedInAt: "2026-09-14T14:25:00+03:00",
    checkedInBy: "Hala Karam",
    createdAt: "2026-08-30T09:10:00+03:00",
  },
  {
    id: "provider-booking-8",
    category: "hotels",
    reference: "TRH-DSP377",
    backupCode: "DSP377",
    guestName: { en: "Daniel Weber", ar: "Daniel Weber" },
    phone: "+963 955 402 917",
    partySize: 1,
    notes: "Guest says the flight was cancelled and challenges the no-show.",
    offeringName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    scheduledAt: "2026-09-12T14:00:00+03:00",
    endsAt: "2026-09-13T11:00:00+03:00",
    listPriceSyp: 240_000,
    discountSyp: 0,
    cashDueSyp: 240_000,
    couponCode: null,
    status: "DISPUTED",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-08-28T18:05:00+03:00",
  },
  {
    id: "provider-booking-dining-1", category: "dining", reference: "TRH-DIN821", backupCode: "DINE21",
    guestName: { en: "Maya Darwish", ar: "مايا درويش" }, phone: "+963 933 714 206", partySize: 4,
    notes: "Terrace seating requested. One guest has a nut allergy.", offeringName: { en: "Terrace table · 20:30", ar: "طاولة التراس ٢٠:٣٠" },
    scheduledAt: fromToday(0, "20:30"), endsAt: fromToday(0, "22:30"), listPriceSyp: 320_000,
    discountSyp: 32_000, cashDueSyp: 288_000, couponCode: "TASTE10", status: "CONFIRMED", checkedInAt: null,
    checkedInBy: null, createdAt: "2026-09-18T12:30:00+03:00",
  },
  {
    id: "provider-booking-trip-1", category: "trips", reference: "TRH-TRP622", backupCode: "TRIP22",
    guestName: { en: "Omar Al Masri", ar: "عمر المصري" }, phone: "+963 988 420 115", partySize: 2,
    notes: "Pickup from Bab Touma Square.", offeringName: { en: "Damascus story walk", ar: "جولة حكايات دمشق" },
    scheduledAt: "2026-10-02T08:30:00+03:00", endsAt: "2026-10-02T16:30:00+03:00", listPriceSyp: 360_000,
    discountSyp: 0, cashDueSyp: 360_000, couponCode: null, status: "CONFIRMED", checkedInAt: null,
    checkedInBy: null, createdAt: "2026-09-19T09:15:00+03:00",
  },
  {
    id: "provider-booking-event-1", category: "events", reference: "TRH-EVT808", backupCode: "EVENT8",
    guestName: { en: "Lina Shami", ar: "لينا شامي" }, phone: "+963 955 301 842", partySize: 3,
    notes: "Three VIP tickets.", offeringName: { en: "Courtyard music night · VIP", ar: "ليلة موسيقية في الباحة كبار الزوار" },
    scheduledAt: "2026-10-08T20:00:00+03:00", endsAt: "2026-10-08T22:30:00+03:00", listPriceSyp: 840_000,
    discountSyp: 0, cashDueSyp: 840_000, couponCode: null, status: "CONFIRMED", checkedInAt: null,
    checkedInBy: null, createdAt: "2026-09-20T17:40:00+03:00",
  },
  {
    id: "provider-booking-guide-1", category: "guides", reference: "TRH-GDE404", backupCode: "GUIDE4",
    guestName: { en: "Nour Hamdan", ar: "نور حمدان" }, phone: "+963 934 650 812", partySize: 2,
    notes: "English-language private walk focused on architecture.", offeringName: { en: "Old Damascus private walk", ar: "جولة خاصة في دمشق القديمة" },
    scheduledAt: "2026-09-25T09:00:00+03:00", endsAt: "2026-09-25T13:00:00+03:00", listPriceSyp: 360_000,
    discountSyp: 40_000, cashDueSyp: 320_000, couponCode: "WALK40", status: "CONFIRMED", checkedInAt: null,
    checkedInBy: null, createdAt: "2026-09-20T08:20:00+03:00",
  },
];

const bookings: ProviderBooking[] = SEED.map((booking) => ({
  ...booking,
  guestName: { ...booking.guestName },
  offeringName: { ...booking.offeringName },
  qrPayload: JSON.stringify({
    bookingId: booking.id,
    reference: booking.reference,
    backupCode: booking.backupCode,
  }),
}));

function cloneBooking(booking: ProviderBooking): ProviderBooking {
  return {
    ...booking,
    guestName: { ...booking.guestName },
    offeringName: { ...booking.offeringName },
  };
}

export function listProviderBookings(category: ProviderCategory = "hotels"): ProviderBooking[] {
  return bookings.filter((booking) => booking.category === category).map(cloneBooking);
}

export function getProviderBooking(
  id: string,
  category?: ProviderCategory,
): ProviderBooking | undefined {
  const booking = bookings.find((item) => item.id === id && (!category || item.category === category));
  return booking ? cloneBooking(booking) : undefined;
}

export function getProviderBookingByBackupCode(code: string): ProviderBooking | undefined {
  const normalized = code.trim().toUpperCase();
  const booking = bookings.find((item) => item.backupCode === normalized);
  return booking ? cloneBooking(booking) : undefined;
}

export function updateProviderBookingStatus(
  id: string,
  status: TouristBookingStatus,
  staffName?: string,
): ProviderBooking {
  const index = bookings.findIndex((item) => item.id === id);
  const current = bookings[index];
  if (index < 0 || !current) {
    throw new Error(`Unknown provider booking: ${id}`);
  }

  const next: ProviderBooking = {
    ...current,
    status,
    checkedInAt: status === "CHECKED_IN" ? new Date().toISOString() : current.checkedInAt,
    checkedInBy: status === "CHECKED_IN" ? (staffName ?? current.checkedInBy) : current.checkedInBy,
  };
  bookings[index] = next;
  return cloneBooking(next);
}
