import type { LocalizedName } from "@/lib/i18n/localized";

export type ReliabilityBand = "atRisk" | "watch" | "strong";

export const DEFAULT_AT_RISK_BELOW = 0.6;
export const DEFAULT_WATCH_BELOW = 0.8;

export type AdminUserAccountEvent = {
  at: string;
  kind: "locked" | "unlocked";
};

export type AdminUser = {
  id: string;
  name: LocalizedName;
  phone: string;
  email: string;
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
    reliability: 0.96,
    completedBookings: 18,
    joinedAt: "2025-11-04",
    locked: false,
  },
  {
    id: "usr_02",
    name: { en: "Maya Al-Khatib", ar: "مايا الخطيب" },
    phone: "+963 944 112 330",
    email: "maya.khatib@example.com",
    reliability: 0.91,
    completedBookings: 11,
    joinedAt: "2026-01-18",
    locked: false,
  },
  {
    id: "usr_03",
    name: { en: "Omar Nseir", ar: "عمر نصير" },
    phone: "+963 955 870 014",
    email: "omar.nseir@example.com",
    reliability: 0.54,
    completedBookings: 7,
    joinedAt: "2026-03-02",
    locked: false,
  },
  {
    id: "usr_04",
    name: { en: "Lina Barakat", ar: "لينا بركات" },
    phone: "+963 991 220 441",
    email: "lina.barakat@example.com",
    reliability: 0.88,
    completedBookings: 22,
    joinedAt: "2025-08-21",
    locked: false,
  },
  {
    id: "usr_05",
    name: { en: "Tarek Qudsi", ar: "طارق قدسي" },
    phone: "+963 988 334 119",
    email: "tarek.qudsi@example.com",
    reliability: 0.42,
    completedBookings: 4,
    joinedAt: "2026-05-09",
    locked: true,
  },
  {
    id: "usr_06",
    name: { en: "Hala Karam", ar: "هلا كرم" },
    phone: "+961 3 445 901",
    email: "hala.karam@example.com",
    reliability: 0.93,
    completedBookings: 9,
    joinedAt: "2026-02-14",
    locked: false,
  },
  {
    id: "usr_07",
    name: { en: "Sami Deeb", ar: "سامي ديب" },
    phone: "+963 922 667 880",
    email: "sami.deeb@example.com",
    reliability: 0.77,
    completedBookings: 13,
    joinedAt: "2025-12-11",
    locked: false,
  },
  {
    id: "usr_08",
    name: { en: "Nour Al-Hassan", ar: "نور الحسن" },
    phone: "+963 966 501 273",
    email: "nour.hassan@example.com",
    reliability: 0.85,
    completedBookings: 6,
    joinedAt: "2026-04-27",
    locked: false,
  },
  {
    id: "usr_09",
    name: { en: "Fadi Sharif", ar: "فادي شريف" },
    phone: "+971 50 882 1044",
    email: "fadi.sharif@example.com",
    reliability: 0.69,
    completedBookings: 5,
    joinedAt: "2026-06-03",
    locked: false,
  },
  {
    id: "usr_10",
    name: { en: "Yara Mansour", ar: "يارا منصور" },
    phone: "+963 911 778 652",
    email: "yara.mansour@example.com",
    reliability: 0.98,
    completedBookings: 31,
    joinedAt: "2025-06-30",
    locked: false,
  },
  {
    id: "usr_11",
    name: { en: "Bassel Atassi", ar: "باسل الأتاسي" },
    phone: "+963 947 219 008",
    email: "bassel.atassi@example.com",
    reliability: 0.33,
    completedBookings: 2,
    joinedAt: "2026-07-19",
    locked: true,
  },
  {
    id: "usr_12",
    name: { en: "Reem Jabri", ar: "ريم الجابري" },
    phone: "+962 79 554 2210",
    email: "reem.jabri@example.com",
    reliability: 0.9,
    completedBookings: 8,
    joinedAt: "2026-03-28",
    locked: false,
  },
  {
    id: "usr_13",
    name: { en: "Dina Shahin", ar: "دينا شاهين" },
    phone: "+963 934 661 902",
    email: "dina.shahin@example.com",
    reliability: 0.81,
    completedBookings: 10,
    joinedAt: "2026-04-11",
    locked: false,
  },
  {
    id: "usr_14",
    name: { en: "Majd Harmoush", ar: "مجد حرموش" },
    phone: "+963 958 440 173",
    email: "majd.harmoush@example.com",
    reliability: 0.73,
    completedBookings: 6,
    joinedAt: "2026-05-22",
    locked: false,
  },
  {
    id: "usr_15",
    name: { en: "Salma Qassar", ar: "سلمى قصّار" },
    phone: "+963 912 808 441",
    email: "salma.qassar@example.com",
    reliability: 0.94,
    completedBookings: 15,
    joinedAt: "2025-10-08",
    locked: false,
  },
  {
    id: "usr_16",
    name: { en: "Nabil Khouri", ar: "نبيل خوري" },
    phone: "+961 70 221 884",
    email: "nabil.khouri@example.com",
    reliability: 0.61,
    completedBookings: 3,
    joinedAt: "2026-07-02",
    locked: false,
  },
  {
    id: "usr_17",
    name: { en: "Hiba Zayat", ar: "هبة الزيات" },
    phone: "+963 993 115 770",
    email: "hiba.zayat@example.com",
    reliability: 0.87,
    completedBookings: 12,
    joinedAt: "2026-01-29",
    locked: false,
  },
  {
    id: "usr_18",
    name: { en: "Karim Tello", ar: "كريم تلّو" },
    phone: "+963 967 330 215",
    email: "karim.tello@example.com",
    reliability: 0.48,
    completedBookings: 4,
    joinedAt: "2026-08-05",
    locked: false,
  },
  {
    id: "usr_19",
    name: { en: "Farah Nahas", ar: "فرح نحاس" },
    phone: "+963 945 672 001",
    email: "farah.nahas@example.com",
    reliability: 0.92,
    completedBookings: 19,
    joinedAt: "2025-09-14",
    locked: false,
  },
  {
    id: "usr_20",
    name: { en: "Waleed Homsi", ar: "وليد حمصي" },
    phone: "+963 921 449 338",
    email: "waleed.homsi@example.com",
    reliability: 0.79,
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

export function reliabilityBand(
  score: number,
  atRiskBelow = DEFAULT_AT_RISK_BELOW,
  watchBelow = DEFAULT_WATCH_BELOW,
): ReliabilityBand {
  if (score < atRiskBelow) {
    return "atRisk";
  }
  if (score < watchBelow) {
    return "watch";
  }
  return "strong";
}

export function reliabilityBandClass(band: ReliabilityBand): string {
  if (band === "atRisk") {
    return "text-destructive";
  }
  if (band === "watch") {
    return "text-prose-muted";
  }
  return "text-prose";
}

/** No-shows implied by completed stays ÷ reliability (the list score). */
export function reliabilityNoShowCount(user: AdminUser): number {
  if (user.reliability <= 0) {
    return Math.max(user.completedBookings, 1);
  }
  const total = user.completedBookings / user.reliability;
  return Math.max(0, Math.round(total - user.completedBookings));
}
