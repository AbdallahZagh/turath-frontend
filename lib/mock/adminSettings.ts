import {
  FEATURED_SLOT_IDS,
  defaultFeaturedSlotEnables,
  type FeaturedSlotId,
} from "@/lib/mock/featuredSlots";

export {
  FEATURED_SLOT_IDS,
  FEATURED_SLOT_CAPACITY,
  type FeaturedSlotId,
} from "@/lib/mock/featuredSlots";

/** Architecture credit-ceiling axis — not Fees commission tiers. */
export const CREDIT_CEILING_TIERS = ["new", "established", "enterprise"] as const;

export type CreditCeilingTierId = (typeof CREDIT_CEILING_TIERS)[number];

export const OTP_CHANNELS = ["sms", "whatsapp"] as const;

export type OtpChannel = (typeof OTP_CHANNELS)[number];

export type AdminSettings = {
  creditCeilingsSyp: Record<CreditCeilingTierId, number>;
  reliability: {
    vipAtOrAbove: number;
    standardAtOrAbove: number;
    restrictedAtOrAbove: number;
    lockSuspended: boolean;
  };
  flags: {
    otpChannel: OtpChannel;
    /** Master switch for home Featured merchandising. */
    featuringEnabled: boolean;
    /** Per-slot enable for the eight named Home slots. */
    featuredSlots: Record<FeaturedSlotId, boolean>;
    webCheckIn: boolean;
  };
};

function cloneSettings(value: AdminSettings): AdminSettings {
  return {
    creditCeilingsSyp: { ...value.creditCeilingsSyp },
    reliability: { ...value.reliability },
    flags: {
      ...value.flags,
      featuredSlots: { ...value.flags.featuredSlots },
    },
  };
}

let settings: AdminSettings = {
  creditCeilingsSyp: {
    new: 1_500_000,
    established: 5_000_000,
    enterprise: 15_000_000,
  },
  reliability: {
    vipAtOrAbove: 80,
    standardAtOrAbove: 50,
    restrictedAtOrAbove: 30,
    lockSuspended: true,
  },
  flags: {
    otpChannel: "sms",
    featuringEnabled: true,
    featuredSlots: defaultFeaturedSlotEnables(),
    webCheckIn: true,
  },
};

export function getAdminSettings(): AdminSettings {
  return cloneSettings(settings);
}

export function saveAdminSettings(input: AdminSettings): AdminSettings {
  const featuredSlots = { ...defaultFeaturedSlotEnables() };
  for (const slot of FEATURED_SLOT_IDS) {
    featuredSlots[slot] = Boolean(input.flags.featuredSlots[slot]);
  }

  settings = cloneSettings({
    ...input,
    flags: {
      ...input.flags,
      featuringEnabled: Boolean(input.flags.featuringEnabled),
      featuredSlots,
      webCheckIn: Boolean(input.flags.webCheckIn),
    },
  });
  return getAdminSettings();
}

/** Slot is usable on Home / assignable in Featured when master + slot are on. */
export function isFeaturedSlotActive(
  slot: FeaturedSlotId,
  data: AdminSettings = getAdminSettings(),
): boolean {
  return data.flags.featuringEnabled && data.flags.featuredSlots[slot];
}
