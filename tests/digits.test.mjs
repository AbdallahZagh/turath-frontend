import assert from "node:assert/strict";
import test from "node:test";

import {
  digitsOnly,
  latinIsolate,
  normalizePhoneInput,
  numberFieldValue,
  parseNumberInput,
  toDisplayDigits,
  toLatinDigits,
} from "../lib/format/digits.ts";
import { formatCount } from "../lib/format/number.ts";
import { sanitizeBookingSearch } from "../lib/search/bookingSearch.ts";

test("Arabic, Persian and Latin typed amounts save the same number", () => {
  assert.equal(parseNumberInput("١٥٠٠٠٠٠"), 1500000);
  assert.equal(parseNumberInput("1500000"), 1500000);
  assert.equal(parseNumberInput("۱۵۰۰۰۰۰"), 1500000);
  assert.equal(parseNumberInput("١٬٥٠٠٬٠٠٠"), 1500000);
  assert.equal(parseNumberInput("1,500,000"), 1500000);
  assert.equal(parseNumberInput(" 1 500 000 "), 1500000);
  assert.equal(parseNumberInput(formatCount(15000000, "ar")), 15000000);
});

test("junk and blank are errors, never a silent 0", () => {
  assert.equal(parseNumberInput("١٢abc"), undefined);
  assert.equal(parseNumberInput(""), undefined);
  assert.equal(parseNumberInput("   "), undefined);
  assert.equal(parseNumberInput("--3", { negative: true }), undefined);
  assert.ok(Number.isNaN(numberFieldValue("١٢abc")));
  assert.ok(Number.isNaN(numberFieldValue("")));
  assert.equal(numberFieldValue("٢٥٠"), 250);
});

test("decimals only where allowed; ٫ and . are both the decimal point", () => {
  assert.equal(parseNumberInput("12.5"), undefined);
  assert.equal(parseNumberInput("12.5", { decimal: true }), 12.5);
  assert.equal(parseNumberInput("١٢٫٥", { decimal: true }), 12.5);
  assert.equal(parseNumberInput("-٣٣٫٥١", { decimal: true, negative: true }), -33.51);
  assert.equal(parseNumberInput("-5"), undefined);
});

test("display digits: Arabic-Indic in Arabic, Latin in English, isolates kept Latin", () => {
  assert.equal(toDisplayDigits("150,000 – 4.5", "ar"), "١٥٠٬٠٠٠ – ٤٫٥");
  assert.equal(toDisplayDigits("150,000", "en"), "150,000");
  assert.equal(
    toDisplayDigits(`code ${latinIsolate("Y4D9")} 6`, "ar"),
    `code ${latinIsolate("Y4D9")} ٦`,
  );
  assert.equal(toLatinDigits("٢٠٢٦-١٠-٠٤"), "2026-10-04");
});

test("OTP and phone are always Latin; pasted Arabic OTP works", () => {
  assert.equal(digitsOnly("١٢٣٤٥٦"), "123456");
  assert.equal(digitsOnly("۱۲۳ ۴۵۶"), "123456");
  assert.equal(normalizePhoneInput("+٩٦٣ ٩٤٤ ١٢٣ ٤٥٦"), "+963944123456");
  assert.equal(normalizePhoneInput("944 123 456"), "944123456");
  assert.equal(normalizePhoneInput("9+44"), "944");
});

test("Arabic digits in URL dates and people are read as Latin", () => {
  const search = sanitizeBookingSearch(
    { checkIn: "٢٠٢٦-١٠-٠٢", checkOut: "٢٠٢٦-١٠-٠٥", guests: "٣", partySize: "۴" },
    "2026-09-26",
  );
  assert.equal(search.checkIn, "2026-10-02");
  assert.equal(search.checkOut, "2026-10-05");
  assert.equal(search.guests, 3);
  assert.equal(search.partySize, 4);
});
