import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDisplayDate,
  formatLongDate,
  formatMediumDate,
  formatPickerDate,
  formatShortDate,
  LEVANTINE_MONTHS,
} from "../lib/format/datetime.ts";

test("Arabic dates use Levantine month names and Arabic-Indic digits", () => {
  assert.equal(formatShortDate("2026-08-18", "ar"), "١٨ آب ٢٠٢٦");
  assert.equal(formatMediumDate("2026-01-05", "ar"), "٥ كانون الثاني ٢٠٢٦");
  assert.equal(formatPickerDate("2026-10-10", "ar"), "١٠ تشرين الأول ٢٠٢٦");
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

test("English dates are unchanged", () => {
  assert.equal(formatShortDate("2026-08-18", "en"), "18 Aug 2026");
  assert.equal(formatMediumDate("2026-08-18", "en"), "Aug 18, 2026");
  assert.equal(formatLongDate("2026-09-20", "en"), "September 20, 2026");
});
