import type { LocalizedName } from "@/lib/i18n/localized";

export type ProviderArrivalStatus = "CONFIRMED" | "NEEDS_ACCEPTANCE";

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
      status: "NEEDS_ACCEPTANCE",
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

export function getProviderDashboardByDays(days: number): ProviderDashboardData {
  const multiplier = days / PROVIDER_DASHBOARD.periodDays;
  return {
    ...PROVIDER_DASHBOARD,
    periodDays: days,
    kpis: {
      ...PROVIDER_DASHBOARD.kpis,
      collectedRevenueSyp: Math.round(
        PROVIDER_DASHBOARD.kpis.collectedRevenueSyp * multiplier,
      ),
      cancellations: Math.max(
        0,
        Math.round(PROVIDER_DASHBOARD.kpis.cancellations * multiplier),
      ),
      noShows: Math.max(
        0,
        Math.round(PROVIDER_DASHBOARD.kpis.noShows * multiplier),
      ),
    },
  };
}
