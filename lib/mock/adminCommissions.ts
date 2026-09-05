import type { LandingPillarId } from "@/lib/mock/landing";

export const COMMISSION_TIERS = ["preferred", "standard", "highRisk"] as const;

export type CommissionTierId = (typeof COMMISSION_TIERS)[number];

export const COMMISSION_TIER_RATES: Record<CommissionTierId, number> = {
  preferred: 0.085,
  standard: 0.12,
  highRisk: 0.18,
};

export const COMMISSION_PILLARS: LandingPillarId[] = [
  "hotels",
  "dining",
  "trips",
  "events",
  "guides",
];

/** 150,000 SYP ≈ $10.50 → SYP per one US dollar. */
const DEFAULT_SYP_PER_USD = 14_286;

export type AdminCommissionRow = {
  category: LandingPillarId;
  rate: number;
};

export type AdminCommissions = {
  sypPerUsd: number;
  rows: AdminCommissionRow[];
};

export type SaveAdminCommissionsInput = {
  sypPerUsd: number;
  rates: Record<LandingPillarId, number>;
};

let commissions: AdminCommissions = {
  sypPerUsd: DEFAULT_SYP_PER_USD,
  rows: [
    { category: "hotels", rate: 0.12 },
    { category: "dining", rate: 0.12 },
    { category: "trips", rate: 0.1 },
    { category: "events", rate: 0.12 },
    { category: "guides", rate: 0.085 },
  ],
};

export function getAdminCommissions(): AdminCommissions {
  return {
    sypPerUsd: commissions.sypPerUsd,
    rows: commissions.rows.map((row) => ({ ...row })),
  };
}

export function saveAdminCommissions(
  input: SaveAdminCommissionsInput,
): AdminCommissions {
  commissions = {
    sypPerUsd: input.sypPerUsd,
    rows: COMMISSION_PILLARS.map((category) => ({
      category,
      rate: input.rates[category],
    })),
  };
  return getAdminCommissions();
}
