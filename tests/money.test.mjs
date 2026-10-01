import assert from "node:assert/strict";
import test from "node:test";

import { formatSyp, formatSypParts, formatUsdLabel, sypToUsdCents } from "../lib/format/money.ts";

const LRI = "\u2066";
const PDI = "\u2069";
const NBSP = "\u00a0";

test("USD is rounded to the nearest cent, not truncated", () => {
  assert.equal(sypToUsdCents(5_000_000, 14_285.71), 35_000);
  assert.equal(sypToUsdCents(15_000_000, 14_285.71), 105_000);
  // 5,000,000 / 14,286 = 349.993… → 349.99 (nearest cent).
  assert.equal(sypToUsdCents(5_000_000, 14_286), 34_999);
  assert.equal(sypToUsdCents(240_000, 14_286), 1_680);
  // Exact half cents round up; float noise does not drop a cent.
  assert.equal(sypToUsdCents(1, 200), 1);
  assert.equal(sypToUsdCents(100_499_999.99999999, 100_000), 100_500);
  assert.equal(sypToUsdCents(1_000, 0), 0);
});

test("Arabic USD part keeps the tilde at its start inside one LTR isolate", () => {
  assert.equal(formatUsdLabel(5_000_000, "ar", true, 14_285.71), `${LRI}~US$ ٣٥٠٫٠٠${PDI}`);
  assert.equal(formatUsdLabel(15_000_000, "ar", true, 14_285.71), `${LRI}~US$ ١٬٠٥٠٫٠٠${PDI}`);
  assert.equal(formatUsdLabel(5_000_000, "ar", false, 14_285.71), `${LRI}US$ ٣٥٠٫٠٠${PDI}`);
  assert.equal(formatUsdLabel(15_000_000, "en", true, 14_285.71), "~$1,050.00");
});

test("formatSyp puts SYP first and the approximate USD part in parentheses", () => {
  const ar = formatSyp(240_000, "ar");
  assert.ok(ar.includes(`(\u2068${LRI}~US$${NBSP}١٦٫٨٠${PDI}\u2069)`), ar);
  assert.ok(ar.startsWith(`\u2068٢٤٠٬٠٠٠${NBSP}ل.س\u2069`), ar);
  assert.equal(formatSyp(240_000, "en"), `\u2068240,000${NBSP}SYP\u2069 (\u2068~$16.80\u2069)`);
});

test("each half of a price stays on one line; it can only wrap between SYP and USD", () => {
  for (const locale of ["ar", "en"]) {
    for (const currency of ["SYP", "USD"]) {
      const { primary, secondary } = formatSypParts(4_100_000, locale, currency);
      assert.ok(!/ /.test(primary), primary);
      assert.ok(!/ /.test(secondary), secondary);
      assert.equal(formatSyp(4_100_000, locale, currency), `${primary} ${secondary}`);
    }
  }
});
