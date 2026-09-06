import type { LocalizedName } from "@/lib/i18n/localized";

/** Architecture §3.2 trust tiers (docs win over the old 0–1 / 3-band mock). */
export type ReliabilityTier = "vip" | "standard" | "restricted" | "suspended";

export const RELIABILITY_START = 100;
export const RELIABILITY_NO_SHOW_DELTA = 30;

export const DEFAULT_VIP_AT_OR_ABOVE = 80;
export const DEFAULT_STANDARD_AT_OR_ABOVE = 50;
export const DEFAULT_RESTRICTED_AT_OR_ABOVE = 30;

export type ReliabilityCutoffs = {
  vipAtOrAbove: number;
  standardAtOrAbove: number;
  restrictedAtOrAbove: number;
};

export const DEFAULT_RELIABILITY_CUTOFFS: ReliabilityCutoffs = {
  vipAtOrAbove: DEFAULT_VIP_AT_OR_ABOVE,
  standardAtOrAbove: DEFAULT_STANDARD_AT_OR_ABOVE,
  restrictedAtOrAbove: DEFAULT_RESTRICTED_AT_OR_ABOVE,
};

export type AdminUserAccountEvent = {
  at: string;
  kind: "locked" | "unlocked";
};

export type AdminUser = {
  id: string;
  name: LocalizedName;
  phone: string;
  email: string;
  /** Integer reliability score on 0–100 (Architecture / SRS). */
  reliability: number;
  completedBookings: number;
  joinedAt: string;
  locked: boolean;
  accountEvents: AdminUserAccountEvent[];
};

const SEEDED_LOCK_AT: Record<string, string> = {
  usr_05: "2026-08-21",
  usr_11: "2026-08-01",
};

const USER_SEED: Omit<AdminUser, "accountEvents">[] = [
  {
    id: "usr_01",
    name: { en: "Rami Haddad", ar: "رامي حداد" },
    phone: "+963 933 441 208",
    email: "rami.haddad@example.com",
    reliability: 100,
    completedBookings: 18,
    joinedAt: "2025-11-04",
    locked: false,
  },
  {
    id: "usr_02",
    name: { en: "Maya Al-Khatib", ar: "مايا الخطيب" },
    phone: "+963 944 112 330",
    email: "maya.khatib@example.com",
    reliability: 100,
    completedBookings: 11,
    joinedAt: "2026-01-18",
    locked: false,
  },
  {
    id: "usr_03",
    name: { en: "Omar Nseir", ar: "عمر نصير" },
    phone: "+963 955 870 014",
    email: "omar.nseir@example.com",
    reliability: 40,
    completedBookings: 7,
    joinedAt: "2026-03-02",
    locked: false,
  },
  {
    id: "usr_04",
    name: { en: "Lina Barakat", ar: "لينا بركات" },
    phone: "+963 991 220 441",
    email: "lina.barakat@example.com",
    reliability: 100,
    completedBookings: 22,
    joinedAt: "2025-08-21",
    locked: false,
  },
  {
    id: "usr_05",
    name: { en: "Tarek Qudsi", ar: "طارق قدسي" },
    phone: "+963 988 334 119",
    email: "tarek.qudsi@example.com",
    reliability: 40,
    completedBookings: 4,
    joinedAt: "2026-05-09",
    locked: true,
  },
  {
    id: "usr_06",
    name: { en: "Hala Karam", ar: "هلا كرم" },
    phone: "+961 3 445 901",
    email: "hala.karam@example.com",
    reliability: 100,
    completedBookings: 9,
    joinedAt: "2026-02-14",
    locked: false,
  },
  {
    id: "usr_07",
    name: { en: "Sami Deeb", ar: "سامي ديب" },
    phone: "+963 922 667 880",
    email: "sami.deeb@example.com",
    reliability: 70,
    completedBookings: 13,
    joinedAt: "2025-12-11",
    locked: false,
  },
  {
    id: "usr_08",
    name: { en: "Nour Al-Hassan", ar: "نور الحسن" },
    phone: "+963 966 501 273",
    email: "nour.hassan@example.com",
    reliability: 100,
    completedBookings: 6,
    joinedAt: "2026-04-27",
    locked: false,
  },
  {
    id: "usr_09",
    name: { en: "Fadi Sharif", ar: "فادي شريف" },
    phone: "+971 50 882 1044",
    email: "fadi.sharif@example.com",
    reliability: 70,
    completedBookings: 5,
    joinedAt: "2026-06-03",
    locked: false,
  },
  {
    id: "usr_10",
    name: { en: "Yara Mansour", ar: "يارا منصور" },
    phone: "+963 911 778 652",
    email: "yara.mansour@example.com",
    reliability: 100,
    completedBookings: 31,
    joinedAt: "2025-06-30",
    locked: false,
  },
  {
    id: "usr_11",
    name: { en: "Bassel Atassi", ar: "باسل الأتاسي" },
    phone: "+963 947 219 008",
    email: "bassel.atassi@example.com",
    reliability: 10,
    completedBookings: 2,
    joinedAt: "2026-07-19",
    locked: true,
  },
  {
    id: "usr_12",
    name: { en: "Reem Jabri", ar: "ريم الجابري" },
    phone: "+962 79 554 2210",
    email: "reem.jabri@example.com",
    reliability: 100,
    completedBookings: 8,
    joinedAt: "2026-03-28",
    locked: false,
  },
  {
    id: "usr_13",
    name: { en: "Dina Shahin", ar: "دينا شاهين" },
    phone: "+963 934 661 902",
    email: "dina.shahin@example.com",
    reliability: 100,
    completedBookings: 10,
    joinedAt: "2026-04-11",
    locked: false,
  },
  {
    id: "usr_14",
    name: { en: "Majd Harmoush", ar: "مجد حرموش" },
    phone: "+963 958 440 173",
    email: "majd.harmoush@example.com",
    reliability: 70,
    completedBookings: 6,
    joinedAt: "2026-05-22",
    locked: false,
  },
  {
    id: "usr_15",
    name: { en: "Salma Qassar", ar: "سلمى قصّار" },
    phone: "+963 912 808 441",
    email: "salma.qassar@example.com",
    reliability: 100,
    completedBookings: 15,
    joinedAt: "2025-10-08",
    locked: false,
  },
  {
    id: "usr_16",
    name: { en: "Nabil Khouri", ar: "نبيل خوري" },
    phone: "+961 70 221 884",
    email: "nabil.khouri@example.com",
    reliability: 70,
    completedBookings: 3,
    joinedAt: "2026-07-02",
    locked: false,
  },
  {
    id: "usr_17",
    name: { en: "Hiba Zayat", ar: "هبة الزيات" },
    phone: "+963 993 115 770",
    email: "hiba.zayat@example.com",
    reliability: 100,
    completedBookings: 12,
    joinedAt: "2026-01-29",
    locked: false,
  },
  {
    id: "usr_18",
    name: { en: "Karim Tello", ar: "كريم تلّو" },
    phone: "+963 967 330 215",
    email: "karim.tello@example.com",
    reliability: 40,
    completedBookings: 4,
    joinedAt: "2026-08-05",
    locked: false,
  },
  {
    id: "usr_19",
    name: { en: "Farah Nahas", ar: "فرح نحاس" },
    phone: "+963 945 672 001",
    email: "farah.nahas@example.com",
    reliability: 100,
    completedBookings: 19,
    joinedAt: "2025-09-14",
    locked: false,
  },
  {
    id: "usr_20",
    name: { en: "Waleed Homsi", ar: "وليد حمصي" },
    phone: "+963 921 449 338",
    email: "waleed.homsi@example.com",
    reliability: 70,
    completedBookings: 9,
    joinedAt: "2026-02-21",
    locked: false,
  },
];

function seedAccountEvents(
  user: Omit<AdminUser, "accountEvents">,
): AdminUserAccountEvent[] {
  if (!user.locked) {
    return [];
  }
  const at = SEEDED_LOCK_AT[user.id] ?? user.joinedAt;
  return [{ at, kind: "locked" }];
}

function cloneUser(user: AdminUser): AdminUser {
  return {
    ...user,
    name: { ...user.name },
    accountEvents: user.accountEvents.map((event) => ({ ...event })),
  };
}

const users: AdminUser[] = USER_SEED.map((row) => ({
  ...row,
  name: { ...row.name },
  accountEvents: seedAccountEvents(row),
}));

export function listAdminUsers(): AdminUser[] {
  return users.map(cloneUser);
}

export function findAdminUserIdByName(en: string): string | undefined {
  return users.find((user) => user.name.en === en)?.id;
}

export function getAdminUser(id: string): AdminUser | undefined {
  const found = users.find((user) => user.id === id);
  return found ? cloneUser(found) : undefined;
}

export function setAdminUserLocked(id: string, locked: boolean, at: string): AdminUser {
  const index = users.findIndex((user) => user.id === id);
  const current = index === -1 ? undefined : users[index];
  if (current === undefined) {
    throw new Error(`Unknown admin user: ${id}`);
  }
  if (current.locked === locked) {
    return cloneUser(current);
  }

  const next: AdminUser = {
    ...cloneUser(current),
    locked,
    accountEvents: [
      ...current.accountEvents.map((event) => ({ ...event })),
      { at, kind: locked ? "locked" : "unlocked" },
    ],
  };
  users[index] = next;
  return cloneUser(next);
}

export function reliabilityTier(
  score: number,
  cutoffs: ReliabilityCutoffs = DEFAULT_RELIABILITY_CUTOFFS,
): ReliabilityTier {
  if (score >= cutoffs.vipAtOrAbove) {
    return "vip";
  }
  if (score >= cutoffs.standardAtOrAbove) {
    return "standard";
  }
  if (score >= cutoffs.restrictedAtOrAbove) {
    return "restricted";
  }
  return "suspended";
}

export function reliabilityTierClass(tier: ReliabilityTier): string {
  if (tier === "suspended" || tier === "restricted") {
    return "text-destructive";
  }
  if (tier === "standard") {
    return "text-prose-muted";
  }
  return "text-prose";
}

/** No-shows implied by Architecture: start 100, each unexcused no-show −30. */
export function reliabilityNoShowCount(user: AdminUser): number {
  return Math.max(
    0,
    Math.round((RELIABILITY_START - user.reliability) / RELIABILITY_NO_SHOW_DELTA),
  );
}
