import assert from "node:assert/strict";
import test from "node:test";

import { parseCreditCeilingInput } from "../lib/validation/creditCeiling.ts";

test("blank credit ceiling means the tier default (no override)", () => {
  assert.deepEqual(parseCreditCeilingInput(""), { kind: "default" });
  assert.deepEqual(parseCreditCeilingInput("   "), { kind: "default" });
});

test("a positive amount in Latin or Arabic digits is saved as Latin", () => {
  assert.deepEqual(parseCreditCeilingInput("2500000"), { kind: "amount", amountSyp: 2_500_000 });
  assert.deepEqual(parseCreditCeilingInput("٢٬٥٠٠٬٠٠٠"), { kind: "amount", amountSyp: 2_500_000 });
  assert.deepEqual(parseCreditCeilingInput("1,500,000"), { kind: "amount", amountSyp: 1_500_000 });
});

test("zero, negative and junk stay errors", () => {
  for (const raw of ["0", "٠", "-5", "−5", "abc", "12abc", "1.5", "--3"]) {
    assert.deepEqual(parseCreditCeilingInput(raw), { kind: "invalid" }, raw);
  }
});
