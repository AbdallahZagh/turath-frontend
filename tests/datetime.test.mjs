import assert from "node:assert/strict";
import test from "node:test";

import {
  DATE_TIME_PREFS,
  formatDateAndPickerTime,
  formatDateTime,
  formatDisplayDate,
  formatLongDate,
  formatMediumDate,
  formatPickerTime,
  formatTime,
  LEVANTINE_MONTHS,
  todayInSyria,
} from "../lib/format/datetime.ts";

test("Arabic dates use Levantine month names and Arabic-Indic digits", () => {
  assert.equal(formatMediumDate("2026-08-18", "ar"), "١٨ آب ٢٠٢٦");
  assert.equal(formatMediumDate("2026-01-05", "ar"), "٥ كانون الثاني ٢٠٢٦");
  assert.equal(formatLongDate("2026-09-20", "ar"), "٢٠ أيلول ٢٠٢٦");
});

test("every Arabic month, formatting and standalone, comes from the Levantine list", () => {
  LEVANTINE_MONTHS.forEach((name, month) => {
    const date = new Date(2026, month, 15);
    assert.equal(formatDisplayDate(date, "MMMM", "ar"), name);
    assert.equal(formatDisplayDate(date, "LLLL yyyy", "ar"), `${name} ٢٠٢٦`);
    assert.equal(formatDisplayDate(date, "LLL", "ar"), name);
  });
});

test("English medium and long dates", () => {
  assert.equal(formatMediumDate("2026-08-18", "en"), "18 Aug 2026");
  assert.equal(formatLongDate("2026-09-20", "en"), "September 20, 2026");
});

test("one date and time config: 24-hour clock and d MMM yyyy by default", () => {
  assert.deepEqual(DATE_TIME_PREFS, { hourCycle: "24", mediumDatePattern: "d MMM yyyy" });
  assert.equal(formatMediumDate("2026-10-03", "en"), "3 Oct 2026");
  assert.equal(formatPickerTime("20:30", "en"), "20:30");
  assert.equal(formatPickerTime("08:05", "ar"), "٠٨:٠٥");
  assert.equal(formatTime("2026-10-03T20:30:00", "en"), "20:30");
});

test("Arabic medium dates and date-times use Levantine months on every path, never أكتوبر", () => {
  for (let month = 0; month < 12; month += 1) {
    const iso = `2026-${String(month + 1).padStart(2, "0")}-15`;
    assert.equal(formatMediumDate(iso, "ar"), `١٥ ${LEVANTINE_MONTHS[month]} ٢٠٢٦`);
    assert.ok(
      formatDateTime(`${iso}T09:00:00`, "ar").startsWith(`١٥ ${LEVANTINE_MONTHS[month]} ٢٠٢٦`),
    );
  }
  const egyptian = /يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر/;
  assert.doesNotMatch(formatMediumDate("2026-10-03", "ar"), egyptian);
  assert.doesNotMatch(formatDateTime("2026-10-03T20:30:00", "ar"), egyptian);
});

test("date and time join with a comma, Arabic with ،", () => {
  assert.equal(formatDateTime("2026-10-03T20:30:00", "en"), "3 Oct 2026, 20:30");
  assert.equal(formatDateTime("2026-10-03T20:30:00", "ar"), "٣ تشرين الأول ٢٠٢٦، ٢٠:٣٠");
  assert.equal(formatDateAndPickerTime("2026-10-03", "20:30", "ar"), "٣ تشرين الأول ٢٠٢٦، ٢٠:٣٠");
});

test("todayInSyria is the date in Damascus, not the host's", () => {
  // 22:30 UTC is already 01:30 the next day in Damascus (UTC+3).
  assert.equal(todayInSyria(new Date("2026-10-02T22:30:00Z")), "2026-10-03");
  assert.equal(todayInSyria(new Date("2026-10-02T20:59:00Z")), "2026-10-02");
  assert.equal(todayInSyria(new Date("2026-12-31T21:00:00Z")), "2027-01-01");
});
