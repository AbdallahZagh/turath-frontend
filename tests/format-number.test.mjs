import assert from "node:assert/strict";
import test from "node:test";

import { formatCount, parseTypedDigits } from "../lib/format/number.ts";

test("typed credit limits keep digits only, Arabic digits included", () => {
  assert.equal(parseTypedDigits("1,500,000"), "1500000");
  assert.equal(parseTypedDigits("١٬٥٠٠٬٠٠٠"), "1500000");
  assert.equal(parseTypedDigits(formatCount(15000000, "ar")), "15000000");
  assert.equal(parseTypedDigits(" 25 000 SYP"), "25000");
  assert.equal(parseTypedDigits(""), "");
});
