import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { StackedMoney } from "../components/ui/StackedMoney.tsx";

test("KPI amounts stack SYP above a USD part that never wraps", () => {
  const html = renderToStaticMarkup(
    createElement(StackedMoney, { amountSyp: 12_480_000, locale: "ar", variant: "kpi" }),
  );
  const parts = [...html.matchAll(/<bdi([^>]*)>([^<]*)<\/bdi>/g)];
  assert.equal(parts.length, 2);
  assert.ok(parts[0][2].includes("ل.س"));
  assert.ok(parts[1][2].includes("US$"));
  assert.ok(parts[1][1].includes("whitespace-nowrap"));
  // Pure CSS size (clamp, 17px to 24px); no inline style from JavaScript fitting.
  assert.ok(parts[0][1].includes("text-[length:clamp(17px,13cqi,24px)]"));
  assert.ok(!html.includes("style="));
});
