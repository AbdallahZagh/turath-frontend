import assert from "node:assert/strict";
import test from "node:test";

import { nextStatementDate } from "../lib/mock/providerLedger.ts";

test("on the day a statement cycle closes, the next statement is the following close", () => {
  assert.equal(nextStatementDate("2026-09-28"), "2026-10-12");
  assert.equal(nextStatementDate("2026-10-12"), "2026-10-26");
});

test("on a normal day, the next statement is the coming close", () => {
  assert.equal(nextStatementDate("2026-10-03"), "2026-10-12");
  assert.equal(nextStatementDate("2026-10-11"), "2026-10-12");
  assert.equal(nextStatementDate("2026-10-13"), "2026-10-26");
});

test("before the first cycle closes, the next statement is that close", () => {
  assert.equal(nextStatementDate("2026-09-20"), "2026-09-28");
});
