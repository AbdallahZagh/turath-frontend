import assert from "node:assert/strict";
import test from "node:test";

import { Check, CheckCircle2, ChevronRight } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Icon, RTL_MIRROR_CLASS } from "../components/ui/Icon.tsx";

function renderRtl(icon) {
  return renderToStaticMarkup(
    createElement("div", { dir: "rtl" }, createElement(Icon, { icon, className: "size-4" })),
  );
}

test("in RTL, direction icons mirror and the check never does", () => {
  assert.ok(renderRtl(ChevronRight).includes(RTL_MIRROR_CLASS));
  assert.ok(!renderRtl(Check).includes(RTL_MIRROR_CLASS));
  assert.ok(!renderRtl(CheckCircle2).includes(RTL_MIRROR_CLASS));
  assert.ok(renderRtl(Check).includes("size-4"));
});

test("the checkbox tick uses physical sides", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync(new URL("../components/ui/Checkbox.tsx", import.meta.url), "utf8");
  assert.ok(source.includes("after:border-r-2"));
  assert.ok(!/after:border-[es]-2/.test(source));
});
