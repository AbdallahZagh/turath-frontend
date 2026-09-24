import type { LocalizedName } from "@/lib/i18n/localized";
import type { TouristBookingStatus } from "@/lib/mock/bookings";

export type ProviderBooking = {
  id: string;
  reference: string;
  backupCode: string;
  qrPayload: string;
  guestName: LocalizedName;
  phone: string;
  partySize: number;
  notes: string;
  roomName: LocalizedName;
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

const SEED: ProviderBookingSeed[] = [
  {
    id: "provider-booking-1",
    reference: "TRH-HJF799",
    backupCode: "Y4DYRZ",
    guestName: { en: "Rami Haddad", ar: "رامي حداد" },
    phone: "+963 944 123 456",
    partySize: 1,
    notes: "Late arrival expected. Please keep the courtyard-side room if available.",
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
    scheduledAt: "2026-09-21T14:00:00+03:00",
    endsAt: "2026-09-22T11:00:00+03:00",
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
    reference: "TRH-MQK284",
    backupCode: "QAMAR1",
    guestName: { en: "Maya Darwish", ar: "مايا درويش" },
    phone: "+963 933 714 206",
    partySize: 2,
    notes: "Guest requested a quiet room away from the street.",
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
    scheduledAt: "2026-09-21T16:30:00+03:00",
    endsAt: "2026-09-23T11:00:00+03:00",
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
    reference: "TRH-USED24",
    backupCode: "USED24",
    guestName: { en: "Lina Shami", ar: "لينا شامي" },
    phone: "+963 955 301 842",
    partySize: 2,
    notes: "No special requests.",
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
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
    reference: "TRH-PND572",
    backupCode: "PND572",
    guestName: { en: "Fadi Khoury", ar: "فادي خوري" },
    phone: "+963 988 420 115",
    partySize: 3,
    notes: "Travelling with a child; requested an extra bed.",
    roomName: { en: "Family courtyard suite", ar: "جناح الفناء العائلي" },
    scheduledAt: "2026-09-24T14:00:00+03:00",
    endsAt: "2026-09-27T11:00:00+03:00",
    listPriceSyp: 1_050_000,
    discountSyp: 150_000,
    cashDueSyp: 900_000,
    couponCode: "DAMASCUS150",
    status: "PENDING",
    checkedInAt: null,
    checkedInBy: null,
    createdAt: "2026-09-20T18:05:00+03:00",
  },
  {
    id: "provider-booking-5",
    reference: "TRH-NSH401",
    backupCode: "NSH401",
    guestName: { en: "Nour Hamdan", ar: "نور حمدان" },
    phone: "+963 934 650 812",
    partySize: 2,
    notes: "No arrival recorded before the desk closed the booking.",
    roomName: { en: "Courtyard king room", ar: "غرفة فناء بسرير كبير" },
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
    reference: "TRH-CNL903",
    backupCode: "CNL903",
    guestName: { en: "Salma Atassi", ar: "سلمى الأتاسي" },
    phone: "+963 966 731 522",
    partySize: 1,
    notes: "Cancelled before arrival.",
    roomName: { en: "Yasmin double room", ar: "غرفة الياسمين المزدوجة" },
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
];

const bookings: ProviderBooking[] = SEED.map((booking) => ({
  ...booking,
  guestName: { ...booking.guestName },
  roomName: { ...booking.roomName },
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
    roomName: { ...booking.roomName },
  };
}

export function listProviderBookings(): ProviderBooking[] {
  return bookings.map(cloneBooking);
}

export function getProviderBooking(id: string): ProviderBooking | undefined {
  const booking = bookings.find((item) => item.id === id);
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
