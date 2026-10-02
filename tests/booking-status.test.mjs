import assert from "node:assert/strict";
import test from "node:test";

import { createTranslator } from "next-intl";

import { toBookingStatus } from "../components/admin/bookingStatus.ts";
import { BOOKING_STATUS_STYLES } from "../components/bookings/BookingStatusBadge.tsx";
import { BOOKING_STATUSES } from "../lib/mock/adminBookings.ts";
import { TOURIST_BOOKING_STATUSES, VISITED_BOOKING_STATUS } from "../lib/mock/bookings.ts";
import { verifyProviderDeskCode } from "../lib/mock/providerCheckIn.ts";
import ar from "../messages/ar.json" with { type: "json" };
import en from "../messages/en.json" with { type: "json" };

const LOCALES = { en, ar };

function translator(locale, namespace) {
  return createTranslator({ locale, messages: LOCALES[locale], namespace });
}

test("the booking status list includes the SRS additions COMPLETED and DISPUTED", () => {
  assert.deepEqual(TOURIST_BOOKING_STATUSES, [
    "PENDING_CONFIRMATION",
    "CONFIRMED",
    "CHECKED_IN",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
    "DISPUTED",
  ]);
});

test("every booking status has a label in both locales, in the user and business portals", () => {
  for (const locale of ["en", "ar"]) {
    for (const namespace of ["bookings.voucher.status"]) {
      const t = translator(locale, namespace);
      for (const status of TOURIST_BOOKING_STATUSES) {
        const label = t(status);
        assert.ok(label && label !== `${namespace}.${status}`, `${locale} ${namespace}.${status}`);
      }
    }
    const tAdmin = translator(locale, "admin.bookings.status");
    for (const status of BOOKING_STATUSES) {
      assert.ok(tAdmin(status) !== `admin.bookings.status.${status}`, `${locale} admin ${status}`);
    }
  }
  assert.equal(translator("en", "bookings.voucher.status")("COMPLETED"), "Completed");
  assert.equal(translator("en", "bookings.voucher.status")("DISPUTED"), "Disputed");
  assert.equal(translator("ar", "bookings.voucher.status")("COMPLETED"), "مكتمل");
  assert.equal(translator("ar", "bookings.voucher.status")("DISPUTED"), "متنازع عليه");
});

test("every status has one badge style, shared by admin rows; Pending and Confirmed differ", () => {
  for (const status of TOURIST_BOOKING_STATUSES) {
    assert.ok(BOOKING_STATUS_STYLES[status]?.variant, status);
    assert.equal(typeof VISITED_BOOKING_STATUS[status], "boolean", status);
  }
  assert.notDeepEqual(BOOKING_STATUS_STYLES.PENDING_CONFIRMATION, BOOKING_STATUS_STYLES.CONFIRMED);
  assert.notEqual(
    BOOKING_STATUS_STYLES.PENDING_CONFIRMATION.variant,
    BOOKING_STATUS_STYLES.CONFIRMED.variant,
  );
  assert.equal(BOOKING_STATUS_STYLES.DISPUTED.variant, "warning");
  for (const status of BOOKING_STATUSES) {
    assert.ok(TOURIST_BOOKING_STATUSES.includes(toBookingStatus(status)), status);
  }
  assert.equal(new Set(BOOKING_STATUSES.map(toBookingStatus)).size, BOOKING_STATUSES.length);
});

test("completed bookings count as visits; disputed ones do not", () => {
  assert.equal(VISITED_BOOKING_STATUS.COMPLETED, true);
  assert.equal(VISITED_BOOKING_STATUS.CHECKED_IN, true);
  assert.equal(VISITED_BOOKING_STATUS.DISPUTED, false);
});

test("the desk never checks in a completed or disputed pass, and never changes its status", () => {
  const completed = verifyProviderDeskCode("CMP512", "Hala Karam", "hotels");
  assert.equal(completed.kind, "alreadyUsed");
  assert.equal(verifyProviderDeskCode("DSP377", "Hala Karam", "hotels").kind, "invalid");
  assert.equal(verifyProviderDeskCode("CMP512", "Hala Karam", "hotels").kind, "alreadyUsed");
});

test("English hotel bookings say Check-in / Check-out; other businesses keep their wording", () => {
  const t = translator("en", "provider.bookings");
  assert.equal(t("columns.arrival", { stay: "hotel" }), "Check-in");
  assert.equal(t("detail.arrival", { stay: "hotel" }), "Check-in");
  assert.equal(t("detail.departure", { stay: "hotel" }), "Check-out");
  assert.equal(t("columns.arrival", { stay: "other" }), "Schedule");
  assert.equal(t("detail.arrival", { stay: "other" }), "Starts");
  assert.equal(t("detail.departure", { stay: "other" }), "Ends");
});

test("the profile facilities section says نزلاء for hotels and ضيوف otherwise", () => {
  const t = translator("ar", "provider.profile");
  assert.equal(t("amenities.title", { stay: "hotel" }), "مرافق النزلاء");
  assert.equal(t("amenities.title", { stay: "other" }), "مرافق الضيوف");
  assert.match(t("amenities.description", { stay: "hotel" }), /نزلاء/);
  assert.match(t("amenities.description", { stay: "other" }), /ضيوف/);
});

test("every stay message in the business namespaces formats for both stays in both locales", () => {
  const namespaces = [
    "provider.bookings",
    "provider.checkIn",
    "provider.dashboard",
    "provider.profile",
    "provider.reviews",
  ];
  for (const locale of ["en", "ar"]) {
    for (const namespace of namespaces) {
      const node = namespace.split(".").reduce((value, key) => value[key], LOCALES[locale]);
      const t = translator(locale, namespace);
      const walk = (value, path) => {
        if (typeof value === "string") {
          if (!value.includes("{stay,")) return;
          for (const stay of ["hotel", "other"]) {
            const out = t(path, { stay, count: 2, code: "X", staff: "S" });
            assert.ok(!out.includes("{stay"), `${locale} ${namespace}.${path}`);
          }
          return;
        }
        for (const [key, child] of Object.entries(value))
          walk(child, path ? `${path}.${key}` : key);
      };
      walk(node, "");
    }
  }
});

test("business reviews say النزلاء for hotels only", () => {
  const t = translator("ar", "provider.reviews");
  assert.equal(t("list.title", { stay: "hotel" }), "آراء النزلاء");
  assert.equal(t("list.title", { stay: "other" }), "آراء الضيوف");
  assert.match(t("summary.count", { stay: "hotel", count: 3 }), /النزلاء/);
  assert.doesNotMatch(t("summary.count", { stay: "other", count: 3 }), /نزل/);
});

test("hotel arrivals count نزلاء with Arabic singular, dual and plural", () => {
  const t = translator("ar", "provider.dashboard");
  assert.equal(t("arrivals.party", { stay: "hotel", count: 1 }), "نزيل واحد");
  assert.equal(t("arrivals.party", { stay: "hotel", count: 2 }), "نزيلان");
  assert.equal(t("arrivals.party", { stay: "hotel", count: 3 }), "3 نزلاء");
  assert.equal(t("arrivals.party", { stay: "other", count: 2 }), "ضيفان");
  assert.match(t("arrivals.description", { stay: "hotel" }), /^النزلاء/);
});
