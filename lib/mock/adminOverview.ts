import type { GovernorateSlug, LandingPillarId } from "@/lib/mock/landing";

export type AdminOriginIso = "SY" | "LB" | "JO" | "AE" | "DE" | "FR" | "other";

export type AdminAttractionKey =
  | "umayyadMosque"
  | "aleppoCitadel"
  | "palmyra"
  | "krak"
  | "bosraTheatre";

export type AdminOverviewKpis = {
  grossBookingsSyp: number;
  completedCount: number;
  noShowRate: number;
  commissionRevenueSyp: number;
  pendingProviders: number;
  openDisputes: number;
};

export type AdminCityNoShow = {
  governorate: GovernorateSlug;
  rate: number;
};

export type AdminDailyVolume = {
  date: string;
  count: number;
};

export type AdminOriginShare = {
  id: AdminOriginIso;
  share: number;
};

export type AdminTopAttraction = {
  key: AdminAttractionKey;
  governorate: GovernorateSlug;
  visits: number;
};

export type AdminCommissionSlice = {
  pillar: LandingPillarId;
  amountSyp: number;
};

export type AdminOverview = {
  periodDays: number;
  kpis: AdminOverviewKpis;
  volume: AdminDailyVolume[];
  noShowByCity: AdminCityNoShow[];
  origins: AdminOriginShare[];
  topAttractions: AdminTopAttraction[];
  commissionByPillar: AdminCommissionSlice[];
};

export const ADMIN_OVERVIEW: AdminOverview = {
  periodDays: 30,
  kpis: {
    grossBookingsSyp: 428_500_000,
    completedCount: 1_842,
    noShowRate: 0.062,
    commissionRevenueSyp: 51_420_000,
    pendingProviders: 12,
    openDisputes: 3,
  },
  volume: [
    { date: "2026-08-24", count: 54 },
    { date: "2026-08-25", count: 61 },
    { date: "2026-08-26", count: 48 },
    { date: "2026-08-27", count: 72 },
    { date: "2026-08-28", count: 88 },
    { date: "2026-08-29", count: 95 },
    { date: "2026-08-30", count: 67 },
  ],
  noShowByCity: [
    { governorate: "homs", rate: 0.084 },
    { governorate: "aleppo", rate: 0.071 },
    { governorate: "hama", rate: 0.068 },
    { governorate: "tartus", rate: 0.062 },
    { governorate: "latakia", rate: 0.055 },
    { governorate: "bosra", rate: 0.05 },
    { governorate: "damascus", rate: 0.048 },
    { governorate: "palmyra", rate: 0.032 },
  ],
  origins: [
    { id: "SY", share: 0.42 },
    { id: "LB", share: 0.14 },
    { id: "JO", share: 0.11 },
    { id: "AE", share: 0.09 },
    { id: "DE", share: 0.08 },
    { id: "FR", share: 0.06 },
    { id: "other", share: 0.1 },
  ],
  topAttractions: [
    { key: "umayyadMosque", governorate: "damascus", visits: 4_820 },
    { key: "aleppoCitadel", governorate: "aleppo", visits: 3_140 },
    { key: "palmyra", governorate: "palmyra", visits: 2_260 },
    { key: "krak", governorate: "homs", visits: 1_890 },
    { key: "bosraTheatre", governorate: "bosra", visits: 1_420 },
  ],
  commissionByPillar: [
    { pillar: "hotels", amountSyp: 22_400_000 },
    { pillar: "dining", amountSyp: 9_180_000 },
    { pillar: "trips", amountSyp: 8_650_000 },
    { pillar: "events", amountSyp: 6_240_000 },
    { pillar: "guides", amountSyp: 4_950_000 },
  ],
};

export function getAdminOverviewByDays(days: number): AdminOverview {
  const multiplier = days / 30;
  return {
    ...ADMIN_OVERVIEW,
    periodDays: days,
    kpis: {
      ...ADMIN_OVERVIEW.kpis,
      grossBookingsSyp: Math.round(ADMIN_OVERVIEW.kpis.grossBookingsSyp * multiplier),
      completedCount: Math.round(ADMIN_OVERVIEW.kpis.completedCount * multiplier),
      commissionRevenueSyp: Math.round(ADMIN_OVERVIEW.kpis.commissionRevenueSyp * multiplier),
    },
    volume:
      days === 7
        ? ADMIN_OVERVIEW.volume
        : ADMIN_OVERVIEW.volume.map((v) => ({
            ...v,
            count: Math.round(v.count * (days / 7)),
          })),
  };
}
