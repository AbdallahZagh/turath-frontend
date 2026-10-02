import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { listSeparator, partSeparator } from "../lib/format/separators.ts";

test("Arabic never uses the middle dot as a separator", () => {
  assert.equal(partSeparator("en"), " · ");
  assert.equal(partSeparator("ar"), "\u2003");
  assert.equal(listSeparator("en"), " · ");
  assert.equal(listSeparator("ar"), "، ");
});

test("Arabic copy has no middle dot", () => {
  const ar = readFileSync(new URL("../messages/ar.json", import.meta.url), "utf8");
  assert.equal(ar.includes("·"), false);
});

test("dates wrap only before the year", async () => {
  const { wrapAtLastSpaceOnly } = await import("../lib/format/separators.ts");
  assert.equal(wrapAtLastSpaceOnly("١٤ تشرين الأول ٢٠٢٦"), "١٤\u00A0تشرين\u00A0الأول ٢٠٢٦");
  assert.equal(wrapAtLastSpaceOnly("20:00"), "20:00");
});
