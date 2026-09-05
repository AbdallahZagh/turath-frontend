import type { LocalizedName } from "@/lib/i18n/localized";
import type { LandingPillarId } from "@/lib/mock/landing";

export const DISPUTE_STATUSES = ["open", "resolvedGuest", "resolvedProvider"] as const;

export type DisputeStatus = (typeof DISPUTE_STATUSES)[number];

export type AdminDispute = {
  id: string;
  bookingCode: string;
  guest: LocalizedName;
  provider: LocalizedName;
  category: LandingPillarId;
  openedAt: string;
  amountSyp: number;
  providerClaim: LocalizedName;
  touristClaim: LocalizedName;
  notes: LocalizedName;
  status: DisputeStatus;
};

const DISPUTE_RESOLUTIONS = ["resolvedGuest", "resolvedProvider"] as const;

export type DisputeResolution = (typeof DISPUTE_RESOLUTIONS)[number];

const DISPUTE_SEED: AdminDispute[] = [
  {
    id: "dsp_01",
    bookingCode: "Q8D3ZA",
    guest: { en: "Tarek Qudsi", ar: "طارق قدسي" },
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    openedAt: "2026-08-21",
    amountSyp: 640_000,
    providerClaim: {
      en: "Guest never arrived at the meeting point.",
      ar: "الضيف لم يصل إلى نقطة اللقاء.",
    },
    touristClaim: {
      en: "Guide was not at the pin; I waited 40 minutes.",
      ar: "الدليل لم يكن عند النقطة؛ انتظرت 40 دقيقة.",
    },
    notes: { en: "", ar: "" },
    status: "open",
  },
  {
    id: "dsp_02",
    bookingCode: "F3K8UY",
    guest: { en: "Fadi Sharif", ar: "فادي شريف" },
    provider: { en: "Krak Night Concert", ar: "حفل ليل الحصن" },
    category: "events",
    openedAt: "2026-08-28",
    amountSyp: 150_000,
    providerClaim: {
      en: "Seat unused; door scan never fired.",
      ar: "المقعد لم يُستخدم؛ لم يُسجَّل دخول.",
    },
    touristClaim: {
      en: "Queue was closed before my backup code was accepted.",
      ar: "أُغلق الطابور قبل قبول رمز النسخة الاحتياطية.",
    },
    notes: { en: "", ar: "" },
    status: "open",
  },
  {
    id: "dsp_03",
    bookingCode: "L4Q7IW",
    guest: { en: "Waleed Homsi", ar: "وليد حمصي" },
    provider: { en: "Palmyra Dawn Walks", ar: "مشاوير فجر تدمر" },
    category: "trips",
    openedAt: "2026-08-27",
    amountSyp: 610_000,
    providerClaim: {
      en: "No-show after two reminder calls.",
      ar: "تغيّب بعد مكالمتي تذكير.",
    },
    touristClaim: {
      en: "Pickup van never came to Homs.",
      ar: "سيارة الاستقبال لم تأتِ إلى حمص.",
    },
    notes: { en: "Awaiting van GPS log from the operator.", ar: "بانتظار سجل GPS للسيارة من المشغّل." },
    status: "open",
  },
  {
    id: "dsp_04",
    bookingCode: "C3H7XK",
    guest: { en: "Salma Qassar", ar: "سلمى قصّار" },
    provider: { en: "Harbor Tables Tartus", ar: "طاولات الميناء — طرطوس" },
    category: "dining",
    openedAt: "2026-08-13",
    amountSyp: 195_000,
    providerClaim: {
      en: "Party of four never sat; table held 45 minutes.",
      ar: "لم يجلس الوفد الرباعي؛ أُبقي الطاولة 45 دقيقة.",
    },
    touristClaim: {
      en: "Host seated another group in our reserved zone.",
      ar: "المضيف أجلَس مجموعة أخرى في منطقتنا المحجوزة.",
    },
    notes: { en: "Resolved for the guest; table photo confirmed double-book.", ar: "حُسم لصالح الضيف؛ صورة الطاولة تؤكد حجزاً مزدوجاً." },
    status: "resolvedGuest",
  },
  {
    id: "dsp_05",
    bookingCode: "W9G6PE",
    guest: { en: "Nour Al-Hassan", ar: "نور الحسن" },
    provider: { en: "Coastline Guides", ar: "أدلاء الساحل" },
    category: "guides",
    openedAt: "2026-08-23",
    amountSyp: 380_000,
    providerClaim: {
      en: "Guest cancelled by WhatsApp after the free window.",
      ar: "ألغى الضيف عبر واتساب بعد نافذة الإلغاء المجانية.",
    },
    touristClaim: {
      en: "Storm warning; I asked to move the date.",
      ar: "تحذير عاصفة؛ طلبت تأجيل الموعد.",
    },
    notes: { en: "Provider kept commission; weather was advisory not a ban.", ar: "احتفظ المزوّد بالعمولة؛ الطقس كان تحذيراً لا حظراً." },
    status: "resolvedProvider",
  },
  {
    id: "dsp_06",
    bookingCode: "A2L5RD",
    guest: { en: "Yara Mansour", ar: "يارا منصور" },
    provider: { en: "Orontes Garden Inn", ar: "نزل حديقة العاصي" },
    category: "hotels",
    openedAt: "2026-08-19",
    amountSyp: 720_000,
    providerClaim: {
      en: "Room ready; guest checked out no-show on night two.",
      ar: "الغرفة جاهزة؛ سجّل الضيف تغيّباً في الليلة الثانية.",
    },
    touristClaim: {
      en: "Generator failed after midnight; we left for safety.",
      ar: "تعطّل المولّد بعد منتصف الليل؛ غادرنا للسلامة.",
    },
    notes: { en: "", ar: "" },
    status: "open",
  },
  {
    id: "dsp_07",
    bookingCode: "H2R9CT",
    guest: { en: "Omar Nseir", ar: "عمر نصير" },
    provider: { en: "Citadel Walks", ar: "مشاوير القلعة" },
    category: "guides",
    openedAt: "2026-08-16",
    amountSyp: 420_000,
    providerClaim: {
      en: "Language mismatch; guest refused the Arabic briefing.",
      ar: "اختلاف اللغة؛ رفض الضيف الإحاطة بالعربية.",
    },
    touristClaim: {
      en: "I booked English; the guide spoke Arabic only.",
      ar: "حجزت بالإنجليزية؛ الدليل تحدّث العربية فقط.",
    },
    notes: { en: "Listing languages did not include English. Guest credit.", ar: "لغات العرض لا تشمل الإنجليزية. رصيد للضيف." },
    status: "resolvedGuest",
  },
  {
    id: "dsp_08",
    bookingCode: "E8N2OC",
    guest: { en: "Dina Shahin", ar: "دينا شاهين" },
    provider: { en: "Bosra Theatre Nights", ar: "ليالي مسرح بصرى" },
    category: "events",
    openedAt: "2026-08-16",
    amountSyp: 110_000,
    providerClaim: {
      en: "Ticket scanned then guest left at interval.",
      ar: "المسح تم ثم غادر الضيف في الاستراحة.",
    },
    touristClaim: {
      en: "Show started 70 minutes late with no update.",
      ar: "بدأ العرض متأخراً 70 دقيقة دون إشعار.",
    },
    notes: { en: "", ar: "" },
    status: "open",
  },
];

function cloneDispute(dispute: AdminDispute): AdminDispute {
  return {
    ...dispute,
    guest: { ...dispute.guest },
    provider: { ...dispute.provider },
    providerClaim: { ...dispute.providerClaim },
    touristClaim: { ...dispute.touristClaim },
    notes: { ...dispute.notes },
  };
}

const disputes: AdminDispute[] = DISPUTE_SEED.map(cloneDispute);

export function listAdminDisputes(): AdminDispute[] {
  return disputes.map(cloneDispute);
}

export function getAdminDispute(id: string): AdminDispute | undefined {
  const found = disputes.find((dispute) => dispute.id === id);
  return found ? cloneDispute(found) : undefined;
}

export function resolveAdminDispute(
  id: string,
  status: DisputeResolution,
  notes: LocalizedName,
): AdminDispute {
  const index = disputes.findIndex((dispute) => dispute.id === id);
  const current = index === -1 ? undefined : disputes[index];
  if (current === undefined) {
    throw new Error(`Unknown admin dispute: ${id}`);
  }
  if (current.status !== "open") {
    return cloneDispute(current);
  }

  const next = cloneDispute(current);
  next.status = status;
  next.notes = { en: notes.en.trim(), ar: notes.ar.trim() };
  disputes[index] = next;
  return cloneDispute(next);
}
