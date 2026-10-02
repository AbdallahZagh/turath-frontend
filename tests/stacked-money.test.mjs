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
  assert.ok(parts[0][1].includes("font-size:min(1em"));
});
