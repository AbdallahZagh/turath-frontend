export const AUDIT_MODULES = [
  "bookings",
  "guests",
  "businesses",
  "reviews",
  "promotions",
  "taxonomy",
  "settings",
] as const;

export type AuditModule = (typeof AUDIT_MODULES)[number];

export type AdminAuditLog = {
  id: string;
  timestamp: string;
  actor: string;
  module: AuditModule;
  action: string;
  target: string;
  details: string;
};

const AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: "log_01",
    timestamp: "2026-09-05T09:42:15Z",
    actor: "SuperAdmin (Youssef)",
    module: "bookings",
    action: "STATUS_OVERRIDE",
    target: "Booking #K7M2QX",
    details: "Manually marked check-in after guest arrival at Beit Al-Wali.",
  },
  {
    id: "log_02",
    timestamp: "2026-09-05T08:14:00Z",
    actor: "SuperAdmin (Youssef)",
    module: "promotions",
    action: "PROMOTION_CREATED",
    target: "Courtyard stays, late summer",
    details: "Created home page featured item targeting Dar Al-Qamar.",
  },
  {
    id: "log_03",
    timestamp: "2026-09-04T18:30:22Z",
    actor: "System Audit",
    module: "businesses",
    action: "CREDIT_WARNING",
    target: "Umayyad Courtyard Kitchen",
    details: "Credit utilization crossed 75% watch band (3,240,000 / 4,000,000 SYP).",
  },
  {
    id: "log_04",
    timestamp: "2026-09-04T14:10:45Z",
    actor: "SuperAdmin (Youssef)",
    module: "guests",
    action: "RELIABILITY_LOCK",
    target: "Tariq Murad (+963 933 771 902)",
    details: "Account locked following 3 consecutive missed arrivals.",
  },
  {
    id: "log_05",
    timestamp: "2026-09-03T16:22:11Z",
    actor: "SuperAdmin (Youssef)",
    module: "reviews",
    action: "MODERATE_HIDE",
    target: "Review #rev_p07",
    details: "Hidden due to prohibited language violation.",
  },
  {
    id: "log_06",
    timestamp: "2026-09-03T11:05:00Z",
    actor: "SuperAdmin (Youssef)",
    module: "taxonomy",
    action: "TERM_CREATED",
    target: "Amenities / 24/7 Generator",
    details: "Added slug generator to platform amenities dictionary.",
  },
  {
    id: "log_07",
    timestamp: "2026-09-02T19:40:18Z",
    actor: "SuperAdmin (Youssef)",
    module: "settings",
    action: "CREDIT_LIMIT_UPDATED",
    target: "Standard Tier",
    details: "Standard credit ceiling adjusted to 15,000,000 SYP.",
  },
  {
    id: "log_08",
    timestamp: "2026-09-01T10:15:33Z",
    actor: "SuperAdmin (Youssef)",
    module: "bookings",
    action: "NO_SHOW_RESOLVED",
    target: "Dispute #dsp_01",
    details: "Resolved in favor of guest after proof of venue closure.",
  },
];

export function listAdminAuditLogs(): AdminAuditLog[] {
  return [...AUDIT_LOGS];
}
