import {
  COMMISSION_TIERS,
  type CommissionTierId,
} from "@/lib/mock/adminCommissions";

export { COMMISSION_TIERS, type CommissionTierId };

export const OTP_CHANNELS = ["sms", "whatsapp"] as const;

export type OtpChannel = (typeof OTP_CHANNELS)[number];

export type AdminSettings = {
  creditCeilingsSyp: Record<CommissionTierId, number>;
  reliability: {
    atRiskBelow: number;
    watchBelow: number;
    lockAtRisk: boolean;
  };
  flags: {
    otpChannel: OtpChannel;
    featuredListings: boolean;
    webCheckIn: boolean;
  };
};

function cloneSettings(value: AdminSettings): AdminSettings {
  return {
    creditCeilingsSyp: { ...value.creditCeilingsSyp },
    reliability: { ...value.reliability },
    flags: { ...value.flags },
  };
}

let settings: AdminSettings = {
  creditCeilingsSyp: {
    preferred: 8_000_000,
    standard: 3_000_000,
    highRisk: 1_200_000,
  },
  reliability: {
    atRiskBelow: 0.6,
    watchBelow: 0.8,
    lockAtRisk: true,
  },
  flags: {
    otpChannel: "sms",
    featuredListings: true,
    webCheckIn: true,
  },
};

export function getAdminSettings(): AdminSettings {
  return cloneSettings(settings);
}

export function saveAdminSettings(input: AdminSettings): AdminSettings {
  settings = cloneSettings(input);
  return getAdminSettings();
}
