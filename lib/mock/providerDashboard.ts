import type { LocalizedName } from "@/lib/i18n/localized";
import { listProviderBookings } from "@/lib/mock/providerBookings";
import type { ProviderCategory } from "@/lib/validation/auth";

export type ProviderArrivalStatus = "CONFIRMED" | "PENDING_CONFIRMATION";

export type ProviderArrival = {
  id: string;
  guestName: LocalizedName;
  startsAt: string;
  partySize: number;
  cashDueSyp: number;
  status: ProviderArrivalStatus;
};

export type ProviderRecentCheckIn = {
  id: string;
  guestName: LocalizedName;
  checkedInAt: string;
  cashCollectedSyp: number;
  staffName: LocalizedName;
};

export type ProviderDashboardData = {
  category: ProviderCategory;
  periodDays: number;
  kpis: {
    collectedRevenueSyp: number;
    upcomingGuests: number;
    occupancyRate: number;
    checkInsToday: number;
    cancellations: number;
    noShows: number;
  };
  bookingTrend: Array<{ date: string; count: number }>;
  arrivals: ProviderArrival[];
  recentCheckIns: ProviderRecentCheckIn[];
  finance: {
    accruedCommissionSyp: number;
    paidCommissionSyp: number;
    outstandingCommissionSyp: number;
    creditCeilingSyp: number;
  };
};

const PROVIDER_DASHBOARD: ProviderDashboardData = {
  category: "hotels",
  periodDays: 30,
  kpis: {
    collectedRevenueSyp: 18_750_000,
    upcomingGuests: 24,
    occupancyRate: 0.72,
    checkInsToday: 7,
    cancellations: 3,
    noShows: 1,
  },
  bookingTrend: [
    { date: "2026-09-15", count: 6 },
    { date: "2026-09-16", count: 9 },
    { date: "2026-09-17", count: 7 },
    { date: "2026-09-18", count: 11 },
    { date: "2026-09-19", count: 13 },
    { date: "2026-09-20", count: 10 },
    { date: "2026-09-21", count: 8 },
  ],
  arrivals: [
    {
      id: "TRH-HJF799",
      guestName: { en: "Rami Haddad", ar: "رامي حداد" },
      startsAt: "2026-09-21T14:00:00+03:00",
      partySize: 1,
      cashDueSyp: 240_000,
      status: "CONFIRMED",
    },
    {
      id: "TRH-MQK284",
      guestName: { en: "Maya Darwish", ar: "مايا درويش" },
      startsAt: "2026-09-21T16:30:00+03:00",
      partySize: 2,
      cashDueSyp: 480_000,
      status: "CONFIRMED",
    },
    {
      id: "TRH-PLN641",
      guestName: { en: "Omar Al Masri", ar: "عمر المصري" },
      startsAt: "2026-09-21T18:00:00+03:00",
      partySize: 3,
      cashDueSyp: 720_000,
      status: "PENDING_CONFIRMATION",
    },
  ],
  recentCheckIns: [
    {
      id: "TRH-RMD318",
      guestName: { en: "Lina Shami", ar: "لينا شامي" },
      checkedInAt: "2026-09-21T11:42:00+03:00",
      cashCollectedSyp: 240_000,
      staffName: { en: "Hala Karam", ar: "هالة كرم" },
    },
    {
      id: "TRH-WQS502",
      guestName: { en: "Nour Hamdan", ar: "نور حمدان" },
      checkedInAt: "2026-09-21T10:18:00+03:00",
      cashCollectedSyp: 420_000,
      staffName: { en: "Hala Karam", ar: "هالة كرم" },
    },
  ],
  finance: {
    accruedCommissionSyp: 6_200_000,
    paidCommissionSyp: 2_100_000,
    outstandingCommissionSyp: 4_100_000,
    creditCeilingSyp: 5_000_000,
  },
};

const CATEGORY_DASHBOARD: Record<ProviderCategory, { revenue: number; upcoming: number; capacity: number; checkIns: number }> = {
  hotels: { revenue: 18_750_000, upcoming: 24, capacity: 0.72, checkIns: 7 },
  dining: { revenue: 12_480_000, upcoming: 46, capacity: 0.81, checkIns: 18 },
  trips: { revenue: 9_630_000, upcoming: 31, capacity: 0.64, checkIns: 9 },
  events: { revenue: 21_200_000, upcoming: 112, capacity: 0.86, checkIns: 34 },
  guides: { revenue: 5_760_000, upcoming: 12, capacity: 0.58, checkIns: 3 },
};

export function getProviderDashboardByDays(
  days: number,
  category: ProviderCategory = "hotels",
): ProviderDashboardData {
  const multiplier = days / PROVIDER_DASHBOARD.periodDays;
  const categoryData = CATEGORY_DASHBOARD[category];
  const bookings = listProviderBookings(category);
  const arrivals: ProviderArrival[] = bookings
    .filter((booking) => booking.status === "CONFIRMED" || booking.status === "PENDING")
    .map((booking) => ({
      id: booking.reference,
      guestName: { ...booking.guestName },
      startsAt: booking.scheduledAt,
      partySize: booking.partySize,
      cashDueSyp: booking.cashDueSyp,
      status: booking.status === "PENDING" ? "NEEDS_ACCEPTANCE" : "CONFIRMED",
    }));
  const recentCheckIns: ProviderRecentCheckIn[] = bookings
    .filter((booking) => booking.status === "CHECKED_IN" && booking.checkedInAt)
    .map((booking) => ({
      id: booking.reference,
      guestName: { ...booking.guestName },
      checkedInAt: booking.checkedInAt ?? booking.scheduledAt,
      cashCollectedSyp: booking.cashDueSyp,
      staffName: {
        en: booking.checkedInBy ?? "Provider team",
        ar: booking.checkedInBy ?? "فريق المنشأة",
      },
    }));
  return {
    ...PROVIDER_DASHBOARD,
    category,
    periodDays: days,
    kpis: {
      ...PROVIDER_DASHBOARD.kpis,
      collectedRevenueSyp: Math.round(categoryData.revenue * multiplier),
      upcomingGuests: categoryData.upcoming,
      occupancyRate: categoryData.capacity,
      checkInsToday: categoryData.checkIns,
      cancellations: Math.max(
        0,
        Math.round(PROVIDER_DASHBOARD.kpis.cancellations * multiplier),
      ),
      noShows: Math.max(
        0,
        Math.round(PROVIDER_DASHBOARD.kpis.noShows * multiplier),
      ),
    },
    arrivals,
    recentCheckIns,
  };
}
