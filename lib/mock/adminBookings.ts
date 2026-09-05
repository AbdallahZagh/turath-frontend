import type { LocalizedName } from "@/lib/i18n/localized";
import type { LandingPillarId } from "@/lib/mock/landing";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "checkedIn",
  "completed",
  "cancelled",
  "noShow",
  "disputed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingWhen = {
  start: string;
  end?: string;
  time?: string;
};

export type AdminBooking = {
  id: string;
  code: string;
  guest: LocalizedName;
  phone: string;
  provider: LocalizedName;
  category: LandingPillarId;
  when: BookingWhen;
  amountSyp: number;
  status: BookingStatus;
  couponCode?: string;
  discountSyp?: number;
  originalAmountSyp?: number;
};

export const ADMIN_BOOKINGS: AdminBooking[] = [
  {
    id: "bkg_01",
    code: "K7M2QX",
    guest: { en: "Rami Haddad", ar: "رامي حداد" },
    phone: "+963 933 441 208",
    provider: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    category: "hotels",
    when: { start: "2026-08-28", end: "2026-08-31" },
    amountSyp: 1_350_000,
    originalAmountSyp: 1_500_000,
    discountSyp: 150_000,
    couponCode: "OLDDAMASCUS10",
    status: "checkedIn",
  },
  {
    id: "bkg_02",
    code: "N4P8LW",
    guest: { en: "Maya Al-Khatib", ar: "مايا الخطيب" },
    phone: "+963 944 112 330",
    provider: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    category: "dining",
    when: { start: "2026-08-31", time: "20:30" },
    amountSyp: 180_000,
    status: "confirmed",
  },
  {
    id: "bkg_03",
    code: "H2R9CT",
    guest: { en: "Omar Nseir", ar: "عمر نصير" },
    phone: "+963 955 870 014",
    provider: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    category: "guides",
    when: { start: "2026-09-02", time: "09:00" },
    amountSyp: 420_000,
    status: "pending",
  },
  {
    id: "bkg_04",
    code: "B6Y1KF",
    guest: { en: "Lina Barakat", ar: "لينا بركات" },
    phone: "+963 991 220 441",
    provider: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    category: "events",
    when: { start: "2026-09-05", time: "19:00" },
    amountSyp: 95_000,
    status: "confirmed",
  },
  {
    id: "bkg_05",
    code: "Q8D3ZA",
    guest: { en: "Tarek Qudsi", ar: "طارق قدسي" },
    phone: "+963 988 334 119",
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    when: { start: "2026-08-20" },
    amountSyp: 640_000,
    status: "noShow",
  },
  {
    id: "bkg_06",
    code: "M5T7VN",
    guest: { en: "Hala Karam", ar: "هلا كرم" },
    phone: "+961 3 445 901",
    provider: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    category: "dining",
    when: { start: "2026-08-29", time: "13:00" },
    amountSyp: 210_000,
    status: "completed",
  },
  {
    id: "bkg_07",
    code: "J1C4HS",
    guest: { en: "Sami Deeb", ar: "سامي ديب" },
    phone: "+963 922 667 880",
    provider: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    category: "hotels",
    when: { start: "2026-09-10", end: "2026-09-14" },
    amountSyp: 1_800_000,
    status: "confirmed",
  },
  {
    id: "bkg_08",
    code: "W9G6PE",
    guest: { en: "Nour Al-Hassan", ar: "نور الحسن" },
    phone: "+963 966 501 273",
    provider: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    category: "guides",
    when: { start: "2026-08-22" },
    amountSyp: 380_000,
    status: "cancelled",
  },
  {
    id: "bkg_09",
    code: "F3K8UY",
    guest: { en: "Fadi Sharif", ar: "فادي شريف" },
    phone: "+971 50 882 1044",
    provider: { en: "Krak Night Concert", ar: "حفل ليل الحصن" },
    category: "events",
    when: { start: "2026-08-27", time: "21:00" },
    amountSyp: 150_000,
    status: "disputed",
  },
  {
    id: "bkg_10",
    code: "A2L5RD",
    guest: { en: "Yara Mansour", ar: "يارا منصور" },
    phone: "+963 911 778 652",
    provider: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    category: "hotels",
    when: { start: "2026-08-18", end: "2026-08-20" },
    amountSyp: 720_000,
    status: "completed",
  },
  {
    id: "bkg_11",
    code: "P7X0QM",
    guest: { en: "Bassel Atassi", ar: "باسل الأتاسي" },
    phone: "+963 947 219 008",
    provider: { en: "Umayyad Courtyard Kitchen", ar: "مطبخ صحن الأموي" },
    category: "dining",
    when: { start: "2026-09-01", time: "21:00" },
    amountSyp: 165_000,
    status: "pending",
  },
  {
    id: "bkg_12",
    code: "S4B9IT",
    guest: { en: "Reem Jabri", ar: "ريم الجابري" },
    phone: "+962 79 554 2210",
    provider: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    category: "guides",
    when: { start: "2026-08-25", time: "16:00" },
    amountSyp: 450_000,
    status: "checkedIn",
  },
  {
    id: "bkg_13",
    code: "E8N2OC",
    guest: { en: "Dina Shahin", ar: "دينا شاهين" },
    phone: "+963 934 661 902",
    provider: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    category: "events",
    when: { start: "2026-08-15", time: "19:30" },
    amountSyp: 110_000,
    status: "completed",
  },
  {
    id: "bkg_14",
    code: "U6V1GJ",
    guest: { en: "Majd Harmoush", ar: "مجد حرموش" },
    phone: "+963 958 440 173",
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    when: { start: "2026-09-06" },
    amountSyp: 590_000,
    status: "confirmed",
  },
  {
    id: "bkg_15",
    code: "C3H7XK",
    guest: { en: "Salma Qassar", ar: "سلمى قصّار" },
    phone: "+963 912 808 441",
    provider: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    category: "dining",
    when: { start: "2026-08-12", time: "14:00" },
    amountSyp: 195_000,
    status: "noShow",
  },
  {
    id: "bkg_16",
    code: "Y5W4LM",
    guest: { en: "Nabil Khouri", ar: "نبيل خوري" },
    phone: "+961 70 221 884",
    provider: { en: "Beit Al-Wali", ar: "بيت الوالي" },
    category: "hotels",
    when: { start: "2026-09-18", end: "2026-09-22" },
    amountSyp: 2_100_000,
    status: "pending",
  },
  {
    id: "bkg_17",
    code: "D0R8PF",
    guest: { en: "Hiba Zayat", ar: "هبة الزيات" },
    phone: "+963 993 115 770",
    provider: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    category: "guides",
    when: { start: "2026-08-30", time: "08:00" },
    amountSyp: 410_000,
    status: "confirmed",
  },
  {
    id: "bkg_18",
    code: "T9A2BN",
    guest: { en: "Karim Tello", ar: "كريم تلّو" },
    phone: "+963 967 330 215",
    provider: { en: "Krak Night Concert", ar: "حفل ليل الحصن" },
    category: "events",
    when: { start: "2026-09-12", time: "20:00" },
    amountSyp: 175_000,
    status: "cancelled",
  },
  {
    id: "bkg_19",
    code: "G1Z6SE",
    guest: { en: "Farah Nahas", ar: "فرح نحاس" },
    phone: "+963 945 672 001",
    provider: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    category: "hotels",
    when: { start: "2026-08-08", end: "2026-08-10" },
    amountSyp: 680_000,
    status: "completed",
  },
  {
    id: "bkg_20",
    code: "L4Q7IW",
    guest: { en: "Waleed Homsi", ar: "وليد حمصي" },
    phone: "+963 921 449 338",
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    when: { start: "2026-08-26" },
    amountSyp: 610_000,
    status: "disputed",
  },
];

export function matchesAdminBookingQuery(booking: AdminBooking, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }

  const haystack = [
    booking.guest.en,
    booking.guest.ar,
    booking.provider.en,
    booking.provider.ar,
    booking.phone,
    booking.code,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

export function listAdminBookingsByPhone(phone: string): AdminBooking[] {
  return ADMIN_BOOKINGS.filter((booking) => booking.phone === phone);
}

export function getAdminBookingByCode(code: string): AdminBooking | undefined {
  const found = ADMIN_BOOKINGS.find((booking) => booking.code === code);
  if (!found) {
    return undefined;
  }
  return { ...found, guest: { ...found.guest }, provider: { ...found.provider } };
}

export function listAdminBookingsByProviderName(en: string): AdminBooking[] {
  return ADMIN_BOOKINGS.filter((booking) => booking.provider.en === en);
}

export function updateAdminBookingStatus(id: string, status: BookingStatus): AdminBooking {
  const index = ADMIN_BOOKINGS.findIndex((booking) => booking.id === id);
  const current = index === -1 ? undefined : ADMIN_BOOKINGS[index];
  if (!current) {
    throw new Error(`Booking ${id} not found`);
  }
  const updated: AdminBooking = { ...current, status };
  ADMIN_BOOKINGS[index] = updated;
  return {
    ...updated,
    guest: { ...updated.guest },
    provider: { ...updated.provider },
  };
}
